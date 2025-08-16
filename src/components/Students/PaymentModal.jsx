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

const PaymentModal = ({ open, handleClose, student: initialStudent }) => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [years, setYears] = useState([]);
    const [fees, setFees] = useState([]);

    const [loading, setLoading] = useState({ parents: false, students: false, years: false, fees: false });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

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

    // تهيئة من الطالب (اختياري)
    useEffect(() => {
        if (!initialStudent) return;
        setForm(f => ({
            ...f,
            student_id: initialStudent?.id ?? f.student_id,
            parent_id: initialStudent?.parent_id ?? initialStudent?.parent?.id ?? f.parent_id,
        }));
    }, [initialStudent]);

    // جلب القوائم عند الفتح
    useEffect(() => {
        if (!open) return;
        const fetcher = async (key, api, setter) => {
            try {
                setLoading(s => ({ ...s, [key]: true }));
                const data = await api();
                setter(Array.isArray(data) ? data : []);
            } finally {
                setLoading(s => ({ ...s, [key]: false }));
            }
        };
        fetcher("parents", getAllParentsNoPaginate, setParents);
        fetcher("students", getAllStudentsNoPaginate, setStudents);
        fetcher("years", getAllAcademicYears, setYears);
        fetcher("fees", getAllSchoolFeesNoPaginate, setFees);
    }, [open]);

    const statusColor = useMemo(() => (
        form.status === "completed" ? "rgba(76,175,80,.9)"
            : form.status === "pending" ? "rgba(255,152,0,.9)"
                : "rgba(244,67,54,.9)"
    ), [form.status]);


    const setField = (name, value) => {
        setForm(f => ({ ...f, [name]: value }));
        setErrors(e => ({ ...e, [name]: undefined }));
    };

    const onFeeChange = (id, feeObj) => {
        setField("school_fee_id", id);
        const feeAmount = feeObj?.amount ?? feeObj?.value;
        if (feeAmount != null && (form.amount === "" || Number(form.amount) === 0)) {
            setField("amount", String(feeAmount));
        }
    };

    const validate = () => {
        const e = {};
        if (!form.parent_id) e.parent_id = "مطلوب";
        if (!form.student_id) e.student_id = "مطلوب";
        if (!form.academic_year_id) e.academic_year_id = "مطلوب";
        if (!form.school_fee_id) e.school_fee_id = "مطلوب";
        if (form.amount === "" || Number(form.amount) <= 0) e.amount = "أدخل مبلغًا صالحًا";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const formatDateTime = (d) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const normalizedStatus =
            STATUS_NORMALIZE[form.status] ?? "pending";

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
            await createPayment(payload);
            setShowSuccess(true); 
            setForm({
                parent_id: null, student_id: null, academic_year_id: null, school_fee_id: null,
                amount: "", discount: "", discount_status: "none", paid_at: "", status: "pending",
            });
            setErrors({});
        } catch (err) {
            const apiErrors = err?.response?.data?.errors || {};
            setErrors(e => ({
                ...e,
                status: apiErrors?.status?.[0],
                discount_status: apiErrors?.discount_status?.[0],
                amount: apiErrors?.amount?.[0],
                parent_id: apiErrors?.parent_id?.[0],
                student_id: apiErrors?.student_id?.[0],
                academic_year_id: apiErrors?.academic_year_id?.[0],
                school_fee_id: apiErrors?.school_fee_id?.[0],
            }));
            alert(err?.response?.data?.message || err?.message || "فشل إنشاء عملية الدفع");
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
                            loading={loading.parents} getOptionLabel={(p) => p ? (p.name || p.full_name || p.email || `#${p.id}`) : ""}
                        />
                        {errors.parent_id && <Typography color="error" variant="caption">{errors.parent_id}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="الطالب" options={students}
                            valueId={form.student_id} onChange={(id) => setField("student_id", id)}
                            loading={loading.students} getOptionLabel={(s) => s ? (s.name || s.full_name || s.code || `#${s.id}`) : ""}
                        />
                        {errors.student_id && <Typography color="error" variant="caption">{errors.student_id}</Typography>}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="السنة الدراسية" options={years}
                            valueId={form.academic_year_id} onChange={(id) => setField("academic_year_id", id)}
                            loading={loading.years} getOptionLabel={(y) => y ? (y.name || y.title || `${y.start_year ?? ""}-${y.end_year ?? ""}`) : ""}
                        />
                        {errors.academic_year_id && <Typography color="error" variant="caption">{errors.academic_year_id}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="نوع الرسوم" options={fees}
                            valueId={form.school_fee_id} onChange={onFeeChange}
                            loading={loading.fees} getOptionLabel={(f) => f ? `${f.name || f.title || `رسوم #${f.id}`} — ${f.amount ?? f.value ?? ""}` : ""}
                        />
                        {errors.school_fee_id && <Typography color="error" variant="caption">{errors.school_fee_id}</Typography>}
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
                            error={!!errors.amount} helperText={errors.amount || ""}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select fullWidth label="حالة الخصم"
                            value={form.discount_status} onChange={(e) => setField("discount_status", e.target.value)}
                            error={!!errors.discount_status} helperText={errors.discount_status || ""}
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
                            error={!!errors.status} helperText={errors.status || ""}
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

                {/* ✅ تنبيه النجاح */}
                {showSuccess && (
                    <SuccessAlert
                        title="تمت إضافة الدفع بنجاح!"
                        message="تم تسجيل عملية الدفع وحفظها في النظام."
                        severity="success"
                        onClose={() => {
                            setShowSuccess(false);
                            handleClose(); // اغلاق الموديال بعد إخفاء التنبيه (اختياري)
                        }}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default PaymentModal;
