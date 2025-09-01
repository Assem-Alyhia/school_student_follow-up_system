// components/financials/EditFinancialModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Modal,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Avatar,
    Grid,
    CircularProgress,
    Divider,
    Alert,
    Chip,
    Stack,
    Card,
    CardContent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFinancial } from "./../../../api/Admin/Financials/updateFinancial";

const GENDERS = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
];

const asDateInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
};

const EditFinancialModal = ({ open, onClose, initialData }) => {
    const qc = useQueryClient();

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        gender: "",
        dob: "",
        phone: "",
        hiring_date: "",
        password: "",
        password_confirmation: "",
        image: null, // File مع previewUrl
        imageUrl: "", // رابط السيرفر الحالي
    });

    // عند الفتح، عبّئ القيم
    useEffect(() => {
        if (!open) return;
        const u = initialData?.user ?? {};
        setForm({
            name: initialData?.name || u.name || "",
            email: u.email || "",
            gender: initialData?.gender || "",
            dob: asDateInput(initialData?.dob),
            phone: initialData?.phone || "",
            hiring_date: asDateInput(initialData?.hiring_date),
            password: "",
            password_confirmation: "",
            image: null,
            imageUrl: u.image || "",
        });
        setError("");
        setFieldErrors({});
        setSuccessMsg("");
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleImageChange = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            // ألغِ أي URL سابق
            if (form.image?.previewUrl) {
                try {
                    URL.revokeObjectURL(form.image.previewUrl);
                } catch { console.log() }
            }
            f.previewUrl = URL.createObjectURL(f);
            setForm((p) => ({ ...p, image: f, imageUrl: "" }));
        }
    };

    // تنظيف معاينات الصور عند الإغلاق/التبديل
    useEffect(() => {
        return () => {
            if (form.image?.previewUrl) {
                try {
                    URL.revokeObjectURL(form.image.previewUrl);
                } catch {  console.log() }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const canSubmit = useMemo(() => {
        return form.name && form.email && form.gender && form.dob && form.phone && form.hiring_date;
    }, [form]);

    const updateMut = useMutation({
        mutationFn: async () => {
            if ((form.password || form.password_confirmation) && form.password !== form.password_confirmation) {
                throw new Error("كلمتا المرور غير متطابقتين");
            }
            const payload = {
                // بعض الـ APIs تحتاج user_id لتحديث صورة المستخدم المرتبط
                user_id: initialData?.user?.id || "",
                name: form.name,
                email: form.email,
                gender: form.gender,
                // نرسل التاريخ بصيغته من input[type=date]
                dob: form.dob || "",
                phone: form.phone,
                hiring_date: form.hiring_date || "",
            };
            if (form.password) payload.password = form.password;
            if (form.password_confirmation) payload.password_confirmation = form.password_confirmation;
            if (form.image instanceof File) payload.image = form.image;

            return updateFinancial(initialData.id, payload);
        },
        onSuccess: async (res) => {
            setSuccessMsg("تم تحديث بيانات الموظف المالي بنجاح");

            // لو رجع السيرفر رابط الصورة الجديد، اعرضه مباشرة
            const updated = res?.data ?? res;
            const newImage =
                updated?.data?.user?.image || updated?.user?.image || updated?.image || "";
            if (newImage) {
                // نظّف المعاينة السابقة
                if (form.image?.previewUrl) {
                    try {
                        URL.revokeObjectURL(form.image.previewUrl);
                    } catch { console.log() }
                }
                setForm((p) => ({ ...p, image: null, imageUrl: newImage }));
            }

            await qc.invalidateQueries({ queryKey: ["financials"] });
            await qc.invalidateQueries({ queryKey: ["financials-all"] });

            setTimeout(() => onClose?.(), 900);
        },
        onError: (err) => {
            // نعرض رسالة السيرفر وأخطاء الحقول (لا نغلف Axios Error في دالة الـ API)
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
        updateMut.mutate();
    };

    // اعرض إما معاينة الصورة المرفوعة أو صورة السيرفر
    const currentAvatar = form.image?.previewUrl || form.imageUrl || "";

    return (
        <Modal
            open={open}
            onClose={onClose}
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
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>تعديل بيانات الموظف المالي</Typography>
                        <Chip
                            size="small"
                            label="نموذج"
                            sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#fff", fontWeight: "bold" }}
                        />
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: "#fff" }}>
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
                                    <Typography sx={{ fontWeight: 700, color: "#22385F", mb: 2 }}>الصورة</Typography>
                                    <Stack spacing={1.5} alignItems="center">
                                        <Avatar
                                            src={currentAvatar}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: 2,
                                                boxShadow: "0 8px 24px rgba(0,0,0,.08)",
                                            }}
                                        />
                                        <Button component="label" variant="outlined" sx={{ borderRadius: 2 }}>
                                            تغيير الصورة
                                            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
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
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            type="submit"
                            disabled={!canSubmit || updateMut.isPending}
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
                            {updateMut.isPending ? (
                                <CircularProgress size={20} sx={{ color: "#fff" }} />
                            ) : (
                                "حفظ التعديلات"
                            )}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{
                                width: "15rem",
                                margin: "0 2rem !important",
                                px: 5,
                                py: 1.2,
                                borderRadius: 2,
                                color: "#2a8a89",
                                borderColor: "#2a8a89",
                                "&:hover": { borderColor: "#1f6e6d", color: "#1f6e6d" }, // ✅ أصلحت الرمز
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

export default EditFinancialModal;
