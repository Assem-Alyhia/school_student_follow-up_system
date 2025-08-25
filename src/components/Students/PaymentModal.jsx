import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Modal, Typography, Grid, TextField, MenuItem,
    Button, CircularProgress
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import SuccessAlert from "../../layout/SuccessAlert";
import { getAllParentsNoPaginate } from "./../../api/Admin/Parents/getAllParentsNoPaginate";
import { getAllStudentsNoPaginate } from "./../../api/Admin/Students/getAllStudentsNoPaginate";
import { getAllAcademicYears } from "./../../api/Admin/AcademicYears/getAllAcademicYears";
import { getAllSchoolFeesNoPaginate } from "./../../api/Admin/SchoolFees/getAllSchoolFeesNoPaginate";
import { createPayment } from "./../../api/Admin/Payments/createPayment";

const STATUS_OPTIONS = [
    { value: "pending", label: "قيد الانتظار" },
    { value: "completed", label: "مكتمل" },
    { value: "failed", label: "فشل" },
];

const STATUS_NORMALIZE = {
    pending: "pending",
    completed: "completed",
    failed: "failed",
    "قيد الانتظار": "pending",
    "مكتمل": "completed",
    "فشل": "failed",
};

const DISCOUNT_STATUS_OPTIONS = [
    { value: "none", label: "بدون خصم" },
    { value: "orphans", label: "الأيتام" },
    { value: "siblings", label: "أشقاء" },
    { value: "staff", label: "موظفون" },
];

function SelectAuto({ label, options, valueId, onChange, loading, getOptionLabel }) {
    const value = options.find(o => String(o?.id) === String(valueId)) || null;
    return (
        <Autocomplete
            options={options}
            loading={loading}
            value={value}
            onChange={(_, opt) => onChange(opt?.id ?? null, opt)}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={16} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

// ---------- Helpers ----------
const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";
const nowYear = new Date().getFullYear();

function pickCurrentAcademicYear(years) {
    if (!Array.isArray(years) || years.length === 0) return null;

    const flagged = years.find(y => isTruthy(y?.is_current) || isTruthy(y?.current) || isTruthy(y?.active));
    if (flagged) return flagged;

    const inRange = years.find(y => {
        const s = Number(y?.start_year) || Number(String(y?.name || "").match(/\d{4}/)?.[0]);
        const e = Number(y?.end_year) || Number(String(y?.name || "").match(/(\d{4})(?!.*\d)/)?.[0]);
        if (!s || !e) return false;
        return nowYear >= s && nowYear <= e;
    });
    if (inRange) return inRange;

    const sorted = [...years].sort((a, b) => {
        const ae = Number(a?.end_year) || 0, be = Number(b?.end_year) || 0;
        if (be !== ae) return be - ae;
        const as = Number(a?.start_year) || 0, bs = Number(b?.start_year) || 0;
        return bs - as;
    });
    return sorted[0] || years[0];
}

function pickFeeForStudent(fees, initialStudent) {
    if (!Array.isArray(fees) || fees.length === 0) return null;
    const levelId = initialStudent?.classroom?.level?.id;
    const gradeLevel = initialStudent?.classroom?.level?.grade_level;

    const byLevelId = fees.find(f =>
        String(f?.level_id) === String(levelId) ||
        String(f?.class_level_id) === String(levelId)
    );
    if (byLevelId) return byLevelId;

    const byGrade = fees.find(f =>
        Number(f?.grade_level) === Number(gradeLevel) ||
        (/صف|grade|level|مرحلة/i.test(String(f?.name || f?.title || "")) &&
            String(f?.name || f?.title || "").includes(String(gradeLevel)))
    );
    if (byGrade) return byGrade;

    const flagged = fees.find(f => isTruthy(f?.is_default) || isTruthy(f?.active));
    if (flagged) return flagged;

    return fees[0];
}

const PaymentModal = ({ open, handleClose, student: initialStudent, onCreated }) => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [years, setYears] = useState([]);
    const [fees, setFees] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // alert = { type: 'success' | 'error', message: string, title?: string }
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        parent_id: null,
        student_id: null,
        academic_year_id: null,
        school_fee_id: null,
        amount: "",
        discount: "",
        discount_status: "none",
        paid_at: "",
        status: "pending",
    });

    // جلب القوائم + تعيين الطالب ووليه مباشرة
    useEffect(() => {
        if (!open) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                const [p, s, y, f] = await Promise.all([
                    getAllParentsNoPaginate(),
                    getAllStudentsNoPaginate(),
                    getAllAcademicYears(),
                    getAllSchoolFeesNoPaginate(),
                ]);

                setParents(Array.isArray(p) ? p : (p?.data ?? []));
                setStudents(Array.isArray(s) ? s : (s?.data ?? []));
                setYears(Array.isArray(y) ? y : (y?.data ?? []));
                setFees(Array.isArray(f) ? f : (f?.data ?? []));

                // تعيين الطالب/ولي الأمر من initialStudent فورًا
                setForm(prev => ({
                    ...prev,
                    student_id: initialStudent?.id ?? prev.student_id,
                    parent_id: initialStudent?.parent?.id ?? prev.parent_id,
                }));
            } catch (e) {
                setAlert({ type: "error", title: "خطأ في الجلب", message: e?.message || "تعذر جلب البيانات." });
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [open, initialStudent]);

    // بعد توفّر القوائم اختَر سنة دراسية ورسوم بشكل تلقائي
    useEffect(() => {
        if (!open) return;
        if (!years.length && !fees.length) return;

        setForm(prev => {
            const next = { ...prev };

            if (!next.academic_year_id && years.length) {
                const y = pickCurrentAcademicYear(years);
                if (y?.id) next.academic_year_id = y.id;
            }

            if (!next.school_fee_id && fees.length) {
                const fee = pickFeeForStudent(fees, initialStudent);
                if (fee?.id) {
                    next.school_fee_id = fee.id;
                    const feeAmount = fee?.amount ?? fee?.value;
                    if ((next.amount === "" || Number(next.amount) === 0) && feeAmount != null) {
                        next.amount = String(feeAmount);
                    }
                }
            }

            return next;
        });
    }, [open, years, fees, initialStudent]);

    const statusColor = useMemo(() => (
        form.status === "completed" ? "rgba(76,175,80,.9)"
            : form.status === "pending" ? "rgba(255,152,0,.9)"
                : "rgba(244,67,54,.9)"
    ), [form.status]);

    const setField = (name, value) => setForm(f => ({ ...f, [name]: value }));

    const onFeeChange = (id, feeObj) => {
        setField("school_fee_id", id);
        const feeAmount = feeObj?.amount ?? feeObj?.value;
        if (feeAmount && (!form.amount || Number(form.amount) === 0)) {
            setField("amount", String(feeAmount));
        }
    };

    const validate = () => {
        if (!form.parent_id) return "يجب اختيار ولي الأمر.";
        if (!form.student_id) return "يجب اختيار الطالب.";
        if (!form.academic_year_id) return "يجب اختيار السنة الدراسية.";
        if (!form.school_fee_id) return "يجب اختيار نوع الرسوم.";
        if (form.amount === "" || Number(form.amount) <= 0) return "أدخل مبلغًا صالحًا.";
        return null;
    };

    const formatDateTime = (d) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const handleSubmit = async () => {
        const localErr = validate();
        if (localErr) {
            setAlert({ type: "error", title: "حقول مطلوبة", message: localErr });
            return;
        }

        const normalizedStatus = STATUS_NORMALIZE[form.status] ?? "pending";

        let paidAtFormatted = null;
        if (form.paid_at) {
            const d = new Date(form.paid_at);
            if (!isNaN(d)) paidAtFormatted = formatDateTime(d);
        }
        if (normalizedStatus === "completed" && !paidAtFormatted) {
            paidAtFormatted = formatDateTime(new Date());
        }

        const payload = {
            parent_id: form.parent_id,
            student_id: form.student_id,
            academic_year_id: form.academic_year_id,
            school_fee_id: form.school_fee_id,
            amount: Number(form.amount) || 0,
            discount: form.discount === "" ? 0 : Number(form.discount),
            paid_at: paidAtFormatted ?? (normalizedStatus === "completed" ? formatDateTime(new Date()) : null),
            status: normalizedStatus,
            ...(form.discount_status !== "none" ? { discount_status: form.discount_status } : {}),
        };

        try {
            setSaving(true);
            const created = await createPayment(payload);

            // نعرض نجاح + نحدّث الجدول فوريًا عبر onCreated (إن تم تمريره)
            setAlert({ type: "success", title: "تمت العملية", message: "تم تسجيل عملية الدفع وحفظها في النظام." });
            onCreated && onCreated(created || payload);

            // إعادة ضبط الحقول الأساسية (إبقاء ولي الأمر/الطالب كما هما)
            setForm(f => ({
                ...f,
                academic_year_id: f.academic_year_id,
                school_fee_id: f.school_fee_id,
                amount: "",
                discount: "",
                discount_status: "none",
                paid_at: "",
                status: "pending",
            }));
        } catch (err) {
            // رسالة عامة + محاولة تجميع أخطاء الحقول من السيرفر
            const apiMsg = err?.response?.data?.message || "فشل إنشاء عملية الدفع";
            const apiErrors = err?.response?.data?.errors || {};
            const fieldMsgs = Object.values(apiErrors).flat().join(" • ");
            const finalMsg = fieldMsgs ? `${apiMsg}: ${fieldMsgs}` : apiMsg;

            setAlert({ type: "error", title: "فشل العملية", message: finalMsg });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: "92%", maxWidth: 900, bgcolor: "background.paper", borderRadius: 3,
                boxShadow: 10, p: 3, direction: "rtl"
            }}>
                <Typography align="center" sx={{ fontWeight: 700, mb: 3, color: "#2a8a89" }}>
                    إضافة رسوم للطالب
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="ولي الأمر" options={parents}
                            valueId={form.parent_id} onChange={(id) => setField("parent_id", id)}
                            loading={loading} getOptionLabel={(p) => p?.name || ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="الطالب" options={students}
                            valueId={form.student_id} onChange={(id) => setField("student_id", id)}
                            loading={loading} getOptionLabel={(s) => s?.name || ""}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="السنة الدراسية" options={years}
                            valueId={form.academic_year_id} onChange={(id) => setField("academic_year_id", id)}
                            loading={loading} getOptionLabel={(y) => y?.name || ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="نوع الرسوم" options={fees}
                            valueId={form.school_fee_id} onChange={onFeeChange}
                            loading={loading} getOptionLabel={(f) => f ? `${f.name} - ${f.amount ?? ""}` : ""}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="الخصم" fullWidth type="number"
                            value={form.discount} onChange={(e) => setField("discount", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="المبلغ" fullWidth type="number"
                            value={form.amount} onChange={(e) => setField("amount", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select fullWidth label="حالة الخصم"
                            value={form.discount_status} onChange={(e) => setField("discount_status", e.target.value)}
                        >
                            {DISCOUNT_STATUS_OPTIONS.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth type="datetime-local" label="تاريخ الدفع"
                            InputLabelProps={{ shrink: true }}
                            value={form.paid_at} onChange={(e) => setField("paid_at", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select fullWidth label="حالة الدفع"
                            value={form.status} onChange={(e) => setField("status", e.target.value)}
                            sx={{ "& .MuiInputBase-root": { color: "#fff", backgroundColor: statusColor } }}
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button fullWidth variant="outlined" onClick={handleClose}>إلغاء</Button>
                    <Button
                        fullWidth variant="contained" onClick={handleSubmit}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={18} /> : null}
                        sx={{ background: "linear-gradient(90deg,#308A9F,#22385F)" }}
                    >
                        {saving ? "جارٍ الحفظ..." : "دفع الرسوم"}
                    </Button>
                </Box>

                {alert && (
                    <SuccessAlert
                        title={alert.title || (alert.type === "success" ? "نجاح" : "خطأ")}
                        message={alert.message}
                        severity={alert.type}
                        onClose={() => {
                            setAlert(null);
                            if (alert.type === "success") handleClose();
                        }}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default PaymentModal;
