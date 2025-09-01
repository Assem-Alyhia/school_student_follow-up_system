// pages/financials/AddPaymentModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, Grid, Divider,
    CircularProgress, Alert, Stack, Chip, IconButton, InputAdornment, MenuItem
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createFinancialPayment } from "./../../../../api/Financial/Payments/createFinancialPayment";
import { getAllFinancialParents } from "./../../../../api/Financial/Parents/getAllFinancialParents";
import { getAllFinancialStudents } from "./../../../../api/Financial/Students/getAllFinancialStudents";
import { getAllFinancialSchoolFees } from "./../../../../api/Financial/SchoolFees/getAllFinancialSchoolFees";

const STATUS_OPTS = [
    { value: "pending", label: "غير مدفوع" },
    { value: "completed", label: "مدفوع" },
    { value: "partial", label: "مدفوع جزئياً" },
];

const DISC_OPTS = [
    { value: "none", label: "بدون" },
    { value: "teacher", label: "أب/أم معلم" },
    { value: "orphans", label: "يتيم" },
];

const INIT = {
    amount: "", status: "pending", paid_at: "",
    discount: "", discount_status: "none",
};

function toDateTime(value) {
    // value from input: "2025-09-01T17:45"
    if (!value) return "";
    // Split date and time
    const [date, time] = value.split("T");
    // If time is missing, default to 00:00:00
    const formattedTime = time ? `${time}:00` : "00:00:00";
    return `${date} ${formattedTime}`;
}

export default function AddPaymentModal({ open, onClose }) {
    const qc = useQueryClient();

    const [form, setForm] = useState(INIT);
    const [errMsg, setErrMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [parentOpt, setParentOpt] = useState(null);
    const [studentOpt, setStudentOpt] = useState(null);
    const [feeOpt, setFeeOpt] = useState(null);

    // NEW: Store filtered fees based on student selection
    const [filteredFees, setFilteredFees] = useState([]);

    useEffect(() => {
        if (!open) return;
        setForm(INIT);
        setErrMsg("");
        setFieldErrors({});
        setParentOpt(null);
        setStudentOpt(null);
        setFeeOpt(null);
        setFilteredFees([]);
    }, [open]);

    const parentsQ = useQuery({
        queryKey: ["fin-all-parents"],
        queryFn: getAllFinancialParents,
        staleTime: 5 * 60 * 1000,
        enabled: open,
    });

    const studentsQ = useQuery({
        queryKey: ["fin-all-students"],
        queryFn: getAllFinancialStudents,
        staleTime: 5 * 60 * 1000,
        enabled: open,
    });

    const feesQ = useQuery({
        queryKey: ["fin-all-fees"],
        queryFn: getAllFinancialSchoolFees,
        staleTime: 5 * 60 * 1000,
        enabled: open,
    });

    const parentsRaw = parentsQ.data?.data ?? parentsQ.data ?? [];
    const studentsRaw = studentsQ.data?.data ?? studentsQ.data ?? [];
    const feesRaw = feesQ.data?.data ?? feesQ.data ?? [];

    // Prepare parents for select
    const parents = parentsRaw.map(p => ({
        id: p.id,
        prefix: p.prefix,
        name: p.name,
        label: `${p.prefix || "PA"} — ${p.name || ""}`.trim(),
    }));

    // Prepare students for select
    const studentsFiltered = useMemo(() => {
        const arr = studentsRaw.map(s => ({
            id: s.id,
            prefix: s.prefix,
            name: s.name,
            parent: s.parent, // parent object
            classroom: s.classroom,
            label: `${s.prefix || "ST"} — ${s.name || ""}`.trim(),
        }));
        return arr;
    }, [studentsRaw]);

    // Filter parents to only show the student's parent if a student is selected
    const filteredParents = useMemo(() => {
        if (studentOpt && studentOpt.parent && studentOpt.parent.id) {
            return parents.filter(p => Number(p.id) === Number(studentOpt.parent.id));
        }
        return parents;
    }, [parents, studentOpt]);

    // School fees now include level.id for filtering
    const fees = feesRaw.map(f => ({
        id: f.id, name: f.name, amount: f.amount, frequency: f.frequency,
        level: f.level, // should have id
        label: `${f.name || ""} — ${f.amount ?? ""} (${f.frequency ?? ""})`,
    }));

    // NEW: When student changes, auto-select parent and filter fees
    useEffect(() => {
        if (studentOpt) {
            // Auto-select parent
            const studentParentId = studentOpt.parent_id;
            if (studentParentId) {
                const foundParent = parents.find(p => Number(p.id) === Number(studentParentId));
                if (foundParent && (!parentOpt || parentOpt.id !== foundParent.id)) {
                    setParentOpt(foundParent);
                }
            }
            // Filter fees by student classroom.level.id
            const studentLevelId = studentOpt.classroom?.level?.id;
            if (studentLevelId) {
                const filtered = fees.filter(fee => fee.level?.id === studentLevelId);
                setFilteredFees(filtered);
                // If selected fee is not in filtered, reset fee selection
                if (feeOpt && !filtered.some(f => f.id === feeOpt.id)) {
                    setFeeOpt(null);
                }
            } else {
                setFilteredFees([]);
                setFeeOpt(null);
            }
        } else {
            setFilteredFees([]);
            setFeeOpt(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentOpt, parents, fees]);

    const m = useMutation({
        mutationFn: createFinancialPayment,
        onSuccess: async () => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["financial-payments"] }),
                qc.invalidateQueries({ queryKey: ["payments"] }),
            ]);
            onClose?.();
        },
        onError: (err) => {
            const apiErr = err?.response?.data;
            setErrMsg(apiErr?.message || err?.message || "حدث خطأ غير متوقع");
            setFieldErrors(apiErr?.errors || {});
        },
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const canSubmit = useMemo(
        () =>
            parentOpt?.id &&
            studentOpt?.id &&
            feeOpt?.id &&
            form.amount &&
            form.status &&
            form.paid_at,
        [parentOpt, studentOpt, feeOpt, form]
    );

    const submit = (e) => {
        e.preventDefault();
        setErrMsg("");
        setFieldErrors({});

        const payload = {
            parent_id: Number(parentOpt?.id),
            student_id: Number(studentOpt?.id),
            school_fee_id: Number(feeOpt?.id),
            amount: Number(form.amount),
            status: form.status,
            paid_at: toDateTime(form.paid_at),
            discount: form.discount ? Number(form.discount) : 0,
            discount_status: form.discount_status,
        };

        m.mutate(payload);
    };

    const fieldSX = {
        "& .MuiOutlinedInput-root": { borderRadius: 2, minHeight: 44 },
    };

    // عند تغيير الطالب، حدّد وليّ الأمر المطابق تلقائياً
    useEffect(() => {
        if (!studentOpt) return;
        const pid = studentOpt.parent_id ?? studentOpt._raw?.parent?.id ?? null;
        if (!pid) return;

        const match = parents.find((p) => Number(p.id) === Number(pid));
        if (match && match.id !== parentOpt?.id) {
            setParentOpt(match);
        }
        // عمداً لم نضع parentOpt كتبعيات لتفادي loop
    }, [studentOpt, parents]);

    // ✅ مستوى الطالب المختار
    const selectedLevelId = useMemo(() => {
        const s = studentOpt?._raw;
        return s?.classroom?.level?.id ?? s?.level?.id ?? null;
    }, [studentOpt]);

    // ✅ فلترة الأقساط حسب المستوى
    const feesFiltered = useMemo(() => {
        if (!selectedLevelId) return feesAll;
        const byLevel = feesAll.filter(
            (f) => String(f.levelId) === String(selectedLevelId)
        );
        return byLevel.length ? byLevel : feesAll;
    }, [feesAll, selectedLevelId]);

    // ✅ عند تغيّر الطالب/المستوى: اضبط القسط المناسب تلقائيًا
    useEffect(() => {
        if (!open) return;
        if (!feesFiltered.length) return;

        const levelId = selectedLevelId;
        const currentLevelId = feeOpt?.levelId ?? null;

        // إن لم يكن القسط المحدد من نفس المستوى، اختر أول قسط مطابق
        if (!levelId || String(currentLevelId) !== String(levelId)) {
            const best =
                feesFiltered.find((f) => String(f.levelId) === String(levelId)) ||
                feesFiltered[0];

            if (best && best.id !== feeOpt?.id) {
                setFeeOpt(best);
                const amountN = Number(best.amount ?? 0);
                if ((!form.amount || Number(form.amount) === 0) && amountN) {
                    setForm((p) => ({ ...p, amount: String(amountN) }));
                }
            }
        }
    }, [open, feesFiltered, selectedLevelId, feeOpt?.id, feeOpt?.levelId, form.amount]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}
        >
            <Paper sx={{ width: 860, maxWidth: "96vw", borderRadius: 3, overflow: "hidden", boxShadow: 8 }}>
                <Box
                    sx={{
                        p: 2.2,
                        px: 3,
                        color: "#fff",
                        background: "linear-gradient(90deg,#35AFBC,#308A9F)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>إضافة دفعة</Typography>
                        <Chip size="small" label="نموذج" sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#fff", fontWeight: "bold" }} />
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box component="form" onSubmit={submit} sx={{ p: 3.2 }}>
                    {errMsg && <Alert severity="error" sx={{ mb: 2 }}>{errMsg}</Alert>}
                    {/* You already show field errors next to each field using helperText and error props */}
                    {/* If you want to show all field errors at the top, add: */}
                    {Object.keys(fieldErrors).length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {Object.entries(fieldErrors).map(([field, errors]) =>
                                <div key={field}>{field}: {errors.join(", ")}</div>
                            )}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* الطالب — يعرض الاسم فقط */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={students}
                                loading={studentsQ.isLoading}
                                value={studentOpt}
                                onChange={(_, v) => {
                                    setStudentOpt(v);
                                    // Auto-select parent when student is chosen
                                    if (v && v.parent && v.parent.id) {
                                        const foundParent = parents.find(p => Number(p.id) === Number(v.parent.id));
                                        setParentOpt(foundParent || null);
                                    } else {
                                        setParentOpt(null);
                                    }
                                }}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={(o) => o?.label || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="الطالب"
                                        size="medium"
                                        sx={fieldSX}
                                        error={(fieldErrors?.student_id?.length ?? 0) > 0}
                                        helperText={fieldErrors?.student_id?.[0] ?? ""}
                                    />
                                )}
                            />
                        </Grid>

                        {/* وليّ الأمر — يعرض الاسم فقط */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={filteredParents}
                                loading={parentsQ.isLoading}
                                value={parentOpt}
                                onChange={(_, v) => setParentOpt(v)}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={(o) => o?.label || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="وليّ الأمر"
                                        size="medium"
                                        sx={fieldSX}
                                        error={(fieldErrors?.parent_id?.length ?? 0) > 0}
                                        helperText={fieldErrors?.parent_id?.[0] ?? ""}
                                    />
                                )}
                            />
                        </Grid>

                        {/* رسم المدرسة — ✅ مفلتر حسب مستوى الطالب */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={studentOpt ? filteredFees : fees}
                                loading={feesQ.isLoading}
                                value={feeOpt}
                                onChange={(_, v) => {
                                    setFeeOpt(v);
                                    const amountN = Number(v?.amount ?? 0);
                                    if ((!form.amount || Number(form.amount) === 0) && amountN) {
                                        setForm((p) => ({ ...p, amount: String(amountN) }));
                                    }
                                }}
                                isOptionEqualToValue={(o, v) => o?.id === v?.id}
                                getOptionLabel={(o) => o?.label || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="رسم المدرسة"
                                        size="medium"
                                        sx={fieldSX}
                                        error={(fieldErrors?.school_fee_id?.length ?? 0) > 0}
                                        helperText={fieldErrors?.school_fee_id?.[0] ?? ""}
                                    />
                                )}
                            />
                        </Grid>

                        {/* تاريخ الدفع */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                type="datetime-local" // changed from "date"
                                label="تاريخ الدفع"
                                name="paid_at"
                                value={form.paid_at}
                                onChange={onChange}
                                fullWidth
                                size="medium"
                                sx={fieldSX}
                                InputLabelProps={{ shrink: true }}
                                error={(fieldErrors?.paid_at?.length ?? 0) > 0}
                                helperText={fieldErrors?.paid_at?.[0] ?? ""}
                            />
                        </Grid>

                        {/* الحالة */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="الحالة"
                                name="status"
                                value={form.status}
                                onChange={onChange}
                                fullWidth
                                size="medium"
                                sx={fieldSX}
                                error={(fieldErrors?.status?.length ?? 0) > 0}
                                helperText={fieldErrors?.status?.[0] ?? ""}
                            >
                                {STATUS_OPTS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>
                                        {o.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* المبلغ */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="المبلغ المدفوع"
                                name="amount"
                                value={form.amount}
                                onChange={onChange}
                                fullWidth
                                size="medium"
                                sx={fieldSX}
                                InputProps={{ endAdornment: <InputAdornment position="end"></InputAdornment> }}
                                error={(fieldErrors?.amount?.length ?? 0) > 0}
                                helperText={fieldErrors?.amount?.[0] ?? ""}
                            />
                        </Grid>

                        {/* الخصم */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="الخصم"
                                name="discount"
                                value={form.discount}
                                onChange={onChange}
                                fullWidth
                                size="medium"
                                sx={fieldSX}
                                InputProps={{ endAdornment: <InputAdornment position="end"></InputAdornment> }}
                                error={(fieldErrors?.discount?.length ?? 0) > 0}
                                helperText={fieldErrors?.discount?.[0] ?? ""}
                            />
                        </Grid>

                        {/* نوع الخصم */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="نوع الخصم"
                                name="discount_status"
                                value={form.discount_status}
                                onChange={onChange}
                                fullWidth
                                size="medium"
                                sx={fieldSX}
                                error={(fieldErrors?.discount_status?.length ?? 0) > 0}
                                helperText={(fieldErrors?.discount_status?.length ?? 0) > 0 ? fieldErrors?.discount_status?.[0] : ""}
                            >
                                {DISC_OPTS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>
                                        {o.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3.5 }} />

                    <Stack direction="row" justifyContent="center" spacing={2.5}>
                        <Button
                            type="submit"
                            disabled={!canSubmit || m.isPending}
                            sx={{
                                width: "16rem",
                                color: "#fff",
                                fontWeight: 700,
                                borderRadius: 2.2,
                                background: "linear-gradient(90deg,#00C6FF,#002952)",
                            }}
                        >
                            {m.isPending ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "إضافة"}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{ width: "16rem", borderRadius: 2.2, color: "#2a8a89", borderColor: "#2a8a89" }}
                        >
                            إلغاء
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
}
