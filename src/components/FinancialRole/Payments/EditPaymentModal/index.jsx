// pages/financials/modals/EditPaymentModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, Grid, Divider,
    CircularProgress, Alert, Stack, Chip, IconButton, InputAdornment, MenuItem
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFinancialPayment } from "../../../../api/Financial/Payments/updateFinancialPayment";

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

const two = (n) => String(n).padStart(2, "0");

function toInputDateTime(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = two(d.getMonth() + 1);
    const day = two(d.getDate());
    const hh = two(d.getHours());
    const mm = two(d.getMinutes());
    return `${y}-${m}-${day}T${hh}:${mm}`;
}

function toServerDateTime(inputValue) {
    if (!inputValue) return ""; 
    const [datePart, timePart] = String(inputValue).split("T");
    return `${datePart} ${timePart ? `${timePart}:00` : "00:00:00"}`;
}

export default function EditPaymentModal({ open, onClose, initialData }) {
    const qc = useQueryClient();
    const [form, setForm] = useState({
        amount: "", discount: "", discount_status: "none", status: "pending", paid_at: ""
    });
    const [errMsg, setErrMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const parentId = initialData?.parent?.id ?? initialData?.parent_id ?? null;
    const studentId = initialData?.student?.id ?? initialData?.student_id ?? null;
    const schoolFeeId = initialData?.schoolFee?.id ?? initialData?.school_fee_id ?? null;

    useEffect(() => {
        if (!open) return;
        setErrMsg(""); setFieldErrors({});
        const p = initialData ?? {};
        setForm({
            amount: p.amount ?? "",
            discount: p.discount ?? "",
            discount_status: p.discount_status ?? "none",
            status: p.status ?? "pending",
            paid_at: toInputDateTime(p.paid_at) || "",
        });
    }, [open, initialData]);

    const m = useMutation({
        mutationFn: (payload) => updateFinancialPayment(initialData?.id, payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["financial-payments"] });
            onClose?.();
        },
        onError: (err) => {
            const apiErr = err?.response?.data;
            setErrMsg(apiErr?.message || err?.message || "حدث خطأ غير متوقع");
            setFieldErrors(apiErr?.errors || {});
        }
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const canSubmit = useMemo(() => (form.amount && form.status && form.paid_at), [form]);

    const submit = (e) => {
        e.preventDefault();
        setErrMsg(""); setFieldErrors({});

        const payload = {
            parent_id: parentId,
            student_id: studentId,
            school_fee_id: schoolFeeId,
            amount: Number(form.amount),
            discount: form.discount ? Number(form.discount) : 0,
            discount_status: form.discount_status,
            status: form.status,
            paid_at: toServerDateTime(form.paid_at),
        };

        m.mutate(payload);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}
        >
            <Paper sx={{ width: 720, maxWidth: "96vw", borderRadius: 3, overflow: "hidden" }}>
                <Box
                    sx={{
                        p: 2.2, px: 3, color: "#fff", background: "linear-gradient(90deg,#35AFBC,#308A9F)",
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: 800 }}>تعديل دفعة</Typography>
                        <Chip
                            size="small"
                            label={initialData?.payment_number || `PAY-${initialData?.id ?? ""}`}
                            sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#fff" }}
                        />
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: "#fff" }}><CloseIcon /></IconButton>
                </Box>

                <Box component="form" onSubmit={submit} sx={{ p: 3 }}>
                    {errMsg && <Alert severity="error" sx={{ mb: 2 }}>{errMsg}</Alert>}

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="المبلغ المدفوع"
                                name="amount"
                                value={form.amount}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end"></InputAdornment> }}
                                error={!!fieldErrors?.amount}
                                helperText={fieldErrors?.amount?.[0] || ""}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="الحالة"
                                name="status"
                                value={form.status}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                error={!!fieldErrors?.status}
                                helperText={fieldErrors?.status?.[0] || ""}
                            >
                                {STATUS_OPTS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                type="datetime-local"
                                label="تاريخ الدفع"
                                name="paid_at"
                                value={form.paid_at}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                error={!!fieldErrors?.paid_at}
                                helperText={fieldErrors?.paid_at?.[0] || "صيغة مطلوبة: YYYY-MM-DD HH:mm:ss"}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="الخصم"
                                name="discount"
                                value={form.discount}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end"></InputAdornment> }}
                                error={!!fieldErrors?.discount}
                                helperText={fieldErrors?.discount?.[0] || ""}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="نوع الخصم"
                                name="discount_status"
                                value={form.discount_status}
                                onChange={onChange}
                                fullWidth
                                size="small"
                                error={!!fieldErrors?.discount_status}
                                helperText={fieldErrors?.discount_status?.[0] || ""}
                            >
                                {DISC_OPTS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Stack direction="row" justifyContent="center" spacing={2}>
                        <Button
                            type="submit"
                            disabled={!canSubmit || m.isPending}
                            sx={{
                                width: "14rem", color: "#fff", fontWeight: 700, borderRadius: 2,
                                background: "linear-gradient(90deg,#00C6FF,#002952)"
                            }}
                        >
                            {m.isPending ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "حفظ التعديلات"}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{ width: "14rem", borderRadius: 2, color: "#2a8a89", borderColor: "#2a8a89" }}
                        >
                            إلغاء
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
}
