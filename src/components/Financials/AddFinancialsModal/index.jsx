// components/financials/AddFinancialModal.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, MenuItem,
    IconButton, Avatar, Grid, CircularProgress, InputAdornment,
    Divider, Alert, Chip, Stack, Card, CardContent
} from "@mui/material";
import { Close as CloseIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFinancial } from "./../../../api/Admin/Financials/createFinancial";

const GENDERS = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
];

const INITIAL_FORM = {
    name: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
    hiring_date: "",
    password: "",
    password_confirmation: "",
    image: null,
    imageUrl: "",
};

const AddFinancialModal = ({ open, onClose }) => {
    const qc = useQueryClient();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false);
    const [showConfirmIcon, setShowConfirmIcon] = useState(false);

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState(INITIAL_FORM);

    const fileInputRef = useRef(null);

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setError("");
        setFieldErrors({});
        setSuccessMsg("");
        setShowPassword(false);
        setShowConfirm(false);
        setShowPasswordIcon(false);
        setShowConfirmIcon(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        if (open) resetForm();
    }, [open]);

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleImageChange = (e) => {
        const f = e.target.files?.[0];
        if (f) setForm((p) => ({ ...p, image: f, imageUrl: "" }));
    };

    const canSubmit = useMemo(() => {
        const req = form.name && form.email && form.gender && form.dob && form.phone && form.hiring_date;
        return req && form.password && form.password_confirmation;
    }, [form]);

    const createMut = useMutation({
        mutationFn: async () => {
            if (form.password !== form.password_confirmation) {
                throw new Error("كلمتا المرور غير متطابقتين");
            }
            const payload = {
                ...form,
                dob: form.dob ? new Date(form.dob).toISOString() : "",
                hiring_date: form.hiring_date ? new Date(form.hiring_date).toISOString() : "",
            };
            return createFinancial(payload);
        },
        onSuccess: async () => {
            setSuccessMsg("تم إنشاء الموظف المالي بنجاح");
            await qc.invalidateQueries({ queryKey: ["financials"] });
            await qc.invalidateQueries({ queryKey: ["financials-all"] });
            resetForm();
            setTimeout(() => onClose?.(), 300);
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || err?.message || "حدث خطأ غير متوقع";
            setError(msg);
            setFieldErrors(err?.response?.data?.errors || {});
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setSuccessMsg("");
        createMut.mutate();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}
        >
            <Paper
                sx={{
                    width: 900,
                    maxWidth: "95vw",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                }}
            >
                <Box
                    sx={{
                        p: 2.5,
                        px: 3,
                        background: "linear-gradient(90deg, #35AFBC, #308A9F)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                            إضافة موظف مالي
                        </Typography>
                        <Chip size="small" label="نموذج" sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#fff", fontWeight: "bold" }} />
                    </Stack>
                    <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ px: 3, pt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
                    {successMsg && <Alert severity="success" sx={{ mb: 1.5 }}>{successMsg}</Alert>}
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, pt: 1.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: 3, height: "100%" }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: "#22385F", mb: 2 }}>
                                        الصورة
                                    </Typography>
                                    <Stack spacing={1.5} alignItems="center">
                                        <Avatar
                                            src={form.image ? URL.createObjectURL(form.image) : form.imageUrl}
                                            sx={{ width: 120, height: 120, borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}
                                        />
                                        <Button component="label" variant="outlined" sx={{ borderRadius: 2 }}>
                                            اختر صورة
                                            <input
                                                ref={fileInputRef}
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </Button>
                                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                            PNG أو JPG • يُفضَّل 150×150
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Card sx={{ borderRadius: 3, mb: 3 }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: "#22385F", mb: 2 }}>
                                        المعلومات الأساسية
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                label="الاسم"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.name}
                                                helperText={fieldErrors?.name?.[0] || ""}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                label="البريد الإلكتروني"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.email}
                                                helperText={fieldErrors?.email?.[0] || ""}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                select
                                                label="الجنس"
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.gender}
                                                helperText={fieldErrors?.gender?.[0] || ""}
                                            >
                                                {GENDERS.map((g) => (
                                                    <MenuItem key={g.value} value={g.value}>
                                                        {g.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                label="الهاتف"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.phone}
                                                helperText={fieldErrors?.phone?.[0] || ""}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: "#22385F", mb: 2 }}>
                                        التواريخ وكلمات المرور
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                type="date"
                                                label="تاريخ الميلاد"
                                                InputLabelProps={{ shrink: true }}
                                                name="dob"
                                                value={form.dob}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.dob}
                                                helperText={fieldErrors?.dob?.[0] || ""}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                type="date"
                                                label="تاريخ التعيين"
                                                InputLabelProps={{ shrink: true }}
                                                name="hiring_date"
                                                value={form.hiring_date}
                                                onChange={handleChange}
                                                fullWidth
                                                error={!!fieldErrors?.hiring_date}
                                                helperText={fieldErrors?.hiring_date?.[0] || ""}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                label="كلمة المرور"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                onFocus={() => setShowPasswordIcon(true)}
                                                onBlur={() => setShowPasswordIcon(false)}
                                                fullWidth
                                                error={!!fieldErrors?.password}
                                                helperText={fieldErrors?.password?.[0] || ""}
                                                InputProps={{
                                                    endAdornment:
                                                        (showPasswordIcon || !!form.password) && (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                    onClick={() => setShowPassword((s) => !s)}
                                                                    edge="end"
                                                                    size="small"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                label="تأكيد كلمة المرور"
                                                type={showConfirm ? "text" : "password"}
                                                name="password_confirmation"
                                                value={form.password_confirmation}
                                                onChange={handleChange}
                                                onFocus={() => setShowConfirmIcon(true)}
                                                onBlur={() => setShowConfirmIcon(false)}
                                                fullWidth
                                                error={!!fieldErrors?.password_confirmation}
                                                helperText={fieldErrors?.password_confirmation?.[0] || ""}
                                                InputProps={{
                                                    endAdornment:
                                                        (showConfirmIcon || !!form.password_confirmation) && (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                    onClick={() => setShowConfirm((s) => !s)}
                                                                    edge="end"
                                                                    size="small"
                                                                >
                                                                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            type="submit"
                            disabled={!canSubmit || createMut.isPending}
                            sx={{
                                width: "15rem",
                                px: 5,
                                py: 1.2,
                                color: "#fff",
                                fontWeight: 700,
                                borderRadius: 2,
                                background: "linear-gradient(90deg, #00C6FF, #002952)",
                                "&:hover": { opacity: 0.95 },
                            }}
                        >
                            {createMut.isPending ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "إضافة"}
                        </Button>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            sx={{
                                width: "15rem",
                                margin: '0 2rem !important',
                                px: 5,
                                py: 1.2,
                                borderRadius: 2,
                                color: "#2a8a89",
                                borderColor: "#2a8a89",
                                "&:hover": { borderColor: "#1f6e6d", color: "#1f6e6d" },
                            }}
                        >
                            إلغاء
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddFinancialModal;
