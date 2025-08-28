// src/components/Payments/PaymentModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Modal, Typography, Grid, TextField, MenuItem,
    Button, CircularProgress
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";
const nowYear = new Date().getFullYear();

function findParentForStudent(student, parents) {
    if (!student || !Array.isArray(parents) || parents.length === 0) return null;

    const candidateIds = [
        student?.parent_id,
        student?.parent?.id,
        student?.guardian_id,
    ].filter(Boolean);

    for (const cid of candidateIds) {
        const hit = parents.find(p => String(p?.id) === String(cid));
        if (hit) return hit.id;
    }

    const parentUserId = student?.parent?.user?.id || student?.parent_user_id;
    if (parentUserId) {
        const hit = parents.find(p => String(p?.user?.id) === String(parentUserId));
        if (hit) return hit.id;
    }

    const parentName = student?.parent?.name;
    if (parentName) {
        const hit = parents.find(p => String(p?.name || "").trim() === String(parentName).trim());
        if (hit) return hit.id;
    }

    return null;
}

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
    const queryClient = useQueryClient();

    const [alert, setAlert] = useState(null);
    const [saving, setSaving] = useState(false);

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

    const setField = (name, value) => setForm(f => ({ ...f, [name]: value }));

    // ========== Queries (fetch on open) ==========
    const {
        data: parentsData,
        isLoading: parentsLoading,
        isError: parentsErr,
        error: parentsError,
    } = useQuery({
        queryKey: ["parents:nopaginate"],
        queryFn: getAllParentsNoPaginate,
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: studentsData,
        isLoading: studentsLoading,
        isError: studentsErr,
        error: studentsError,
    } = useQuery({
        queryKey: ["students:nopaginate"],
        queryFn: getAllStudentsNoPaginate,
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: yearsData,
        isLoading: yearsLoading,
        isError: yearsErr,
        error: yearsError,
    } = useQuery({
        queryKey: ["academicYears"],
        queryFn: getAllAcademicYears,
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: feesData,
        isLoading: feesLoading,
        isError: feesErr,
        error: feesError,
    } = useQuery({
        queryKey: ["schoolFees:nopaginate"],
        queryFn: getAllSchoolFeesNoPaginate,
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    const parents = Array.isArray(parentsData) ? parentsData : parentsData?.data || [];
    const students = Array.isArray(studentsData) ? studentsData : studentsData?.data || [];
    const years = Array.isArray(yearsData) ? yearsData : yearsData?.data || [];
    const fees = Array.isArray(feesData) ? feesData : feesData?.data || [];

    const anyLoading = parentsLoading || studentsLoading || yearsLoading || feesLoading;
    const anyError = parentsErr || studentsErr || yearsErr || feesErr;
    const firstErrorMsg =
        parentsError?.message ||
        studentsError?.message ||
        yearsError?.message ||
        feesError?.message;

    // ========= Prefill on initial open/data ready =========
    useEffect(() => {
        if (!open) return;
        // تعيين الطالب والولي مباشرة إن وُجدا من props
        setForm(prev => ({
            ...prev,
            student_id: initialStudent?.id ?? prev.student_id,
            parent_id: initialStudent?.parent?.id ?? prev.parent_id,
        }));
    }, [open, initialStudent]);

    // عندما تكون القوائم جاهزة، اختر سنة دراسية ورسم مناسبين واضبط المبلغ
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

    // تزامن ولي الأمر تلقائياً عند تغيير الطالب أو وصول القوائم
    useEffect(() => {
        if (!open || !form.student_id) return;
        const stu = students.find(s => String(s?.id) === String(form.student_id));
        if (!stu) return;
        const pid = findParentForStudent(stu, parents);
        if (pid && String(form.parent_id) !== String(pid)) {
            setForm(f => ({ ...f, parent_id: pid }));
        }
    }, [open, form.student_id, students, parents]);

    // ========== Mutation (create payment) ==========
    const createMut = useMutation({
        mutationFn: createPayment,
        onSuccess: (created) => {
            // تحديث القوائم ذات الصلة
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            if (form.student_id) {
                queryClient.invalidateQueries({ queryKey: ["student", String(form.student_id)] });
                queryClient.invalidateQueries({ queryKey: ["student:payments", String(form.student_id)] });
            }

            setAlert({
                type: "success",
                title: "تمت العملية",
                message: "تم تسجيل عملية الدفع وحفظها في النظام.",
            });

            onCreated && onCreated(created);

            // إعادة ضبط جزئي
            setForm(f => ({
                ...f,
                amount: "",
                discount: "",
                discount_status: "none",
                paid_at: "",
                status: "pending",
            }));
        },
        onError: (err) => {
            const apiMsg = err?.response?.data?.message || "فشل إنشاء عملية الدفع";
            const apiErrors = err?.response?.data?.errors || {};
            const fieldMsgs = Object.values(apiErrors).flat().join(" • ");
            const finalMsg = fieldMsgs ? `${apiMsg}: ${fieldMsgs}` : apiMsg;

            setAlert({ type: "error", title: "فشل العملية", message: finalMsg });
        },
        onSettled: () => setSaving(false),
    });

    // ========== Helpers ==========
    const statusColor = useMemo(() => (
        form.status === "completed" ? "rgba(76,175,80,.9)"
            : form.status === "pending" ? "rgba(255,152,0,.9)"
                : "rgba(244,67,54,.9)"
    ), [form.status]);

    const formatDateTime = (d) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const validate = () => {
        if (!form.parent_id) return "يجب اختيار ولي الأمر.";
        if (!form.student_id) return "يجب اختيار الطالب.";
        if (!form.academic_year_id) return "يجب اختيار السنة الدراسية.";
        if (!form.school_fee_id) return "يجب اختيار نوع الرسوم.";
        if (form.amount === "" || Number(form.amount) <= 0) return "أدخل مبلغًا صالحًا.";
        return null;
    };

    const onFeeChange = (id, feeObj) => {
        setField("school_fee_id", id);
        const feeAmount = feeObj?.amount ?? feeObj?.value;
        if (feeAmount && (!form.amount || Number(form.amount) === 0)) {
            setField("amount", String(feeAmount));
        }
    };

    // ========== Submit ==========
    const handleSubmit = () => {
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

        setSaving(true);
        createMut.mutate(payload);
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

                {anyLoading && <Box sx={{ p: 1, mb: 2 }}><CircularProgress size={22} /> جاري تحميل القوائم...</Box>}
                {anyError && <Box sx={{ p: 1, mb: 2, color: "error.main" }}>حدث خطأ أثناء جلب البيانات: {firstErrorMsg}</Box>}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="ولي الأمر" options={parents}
                            valueId={form.parent_id} onChange={(id) => setField("parent_id", id)}
                            loading={anyLoading} getOptionLabel={(p) => p?.name || ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="الطالب" options={students}
                            valueId={form.student_id}
                            onChange={(id, opt) => {
                                setField("student_id", id);
                                const pid = findParentForStudent(opt, parents);
                                if (pid) setField("parent_id", pid);
                            }}
                            loading={anyLoading} getOptionLabel={(s) => s?.name || ""}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="السنة الدراسية" options={years}
                            valueId={form.academic_year_id} onChange={(id) => setField("academic_year_id", id)}
                            loading={anyLoading} getOptionLabel={(y) => y?.name || ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectAuto
                            label="نوع الرسوم" options={fees}
                            valueId={form.school_fee_id} onChange={onFeeChange}
                            loading={anyLoading} getOptionLabel={(f) => f ? `${f.name} - ${f.amount ?? ""}` : ""}
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
                        disabled={saving || anyLoading || createMut.isPending}
                        startIcon={(saving || createMut.isPending) ? <CircularProgress size={18} /> : null}
                        sx={{ background: "linear-gradient(90deg,#308A9F,#22385F)" }}
                    >
                        {(saving || createMut.isPending) ? "جارٍ الحفظ..." : "دفع الرسوم"}
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
