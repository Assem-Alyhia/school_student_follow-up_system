// src/components/Admin/Supervisors/SupervisorCreateModal.jsx
import React from "react";
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Avatar,
    TextField,
    InputAdornment,
    Grid,
    Button,
    MenuItem,
} from "@mui/material";
import {
    Close as CloseIcon,
    Visibility,
    VisibilityOff,
    PhotoCamera as UploadIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupervisor } from "../../../api/Admin/Supervisors/createSupervisor";

// const asISO = (d) => (d ? new Date(d).toISOString() : "");

export default function SupervisorCreateModal({ open, onClose, onSuccess }) {
    const qc = useQueryClient();

    const [form, setForm] = React.useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        dob: "",
        hiring_date: "",
        password: "",
        password_confirmation: "",
    });
    const [imageFile, setImageFile] = React.useState(null);
    const [preview, setPreview] = React.useState("");
    const [showPwd, setShowPwd] = React.useState(false);
    const [showPwd2, setShowPwd2] = React.useState(false);
    const [localError, setLocalError] = React.useState("");

    React.useEffect(() => {
        if (!open) {
            // إعادة ضبط عند الإغلاق
            setForm({
                name: "",
                email: "",
                phone: "",
                gender: "",
                address: "",
                dob: "",
                hiring_date: "",
                password: "",
                password_confirmation: "",
            });
            setImageFile(null);
            setPreview("");
            setLocalError("");
            setShowPwd(false);
            setShowPwd2(false);
        }
    }, [open]);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const mutation = useMutation({
        mutationFn: (payload) => createSupervisor(payload),
        onSuccess: (res) => {
            qc.invalidateQueries(["supervisors"]);
            onSuccess?.(res);
            onClose?.();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError("");

        if (!form.email || !form.password || !form.password_confirmation || !form.name || !form.gender) {
            setLocalError("الحقول الأساسية مطلوبة: الاسم، البريد، الجنس، كلمة المرور وتأكيدها.");
            return;
        }
        if (form.password !== form.password_confirmation) {
            setLocalError("كلمتا المرور غير متطابقتين.");
            return;
        }

        // أرسل كائن عادي (وليس FormData)
        const payload = {
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
            name: form.name,
            gender: form.gender,
            address: form.address || "",
            dob: form.dob ? new Date(form.dob).toISOString() : "",
            phone: form.phone || "",
            hiring_date: form.hiring_date ? new Date(form.hiring_date).toISOString() : "",
            image: imageFile || undefined, // File مباشرة
        };

        mutation.mutate(payload);
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
        >
            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={3}
                sx={{
                    width: 760,
                    maxWidth: "95%",
                    p: "32px 28px 26px",
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    direction: "rtl",
                }}
            >
                {/* إغلاق */}
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 12, left: 14, color: "#308A9F" }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: 900, mb: 2 }}>
                    إنشاء مشرف جديد
                </Typography>

                {/* الصورة + رفع */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                        src={preview || undefined}
                        alt=""
                        variant="rounded"
                        sx={{ width: 84, height: 84, border: "2px solid #308A9F", bgcolor: "#E6EEF5" }}
                    >
                        {!preview && <PersonIcon sx={{ color: "#9aa6b2", fontSize: 40 }} />}
                    </Avatar>

                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        component="label"
                        sx={{ borderColor: "#308A9F", color: "#308A9F", "&:hover": { borderColor: "#22385F", color: "#22385F" } }}
                    >
                        اختر صورة
                        <input type="file" hidden accept="image/*" onChange={onPickImage} />
                    </Button>
                </Box>

                {/* الحقول */}
                <Grid container spacing={2.2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="الاسم"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="البريد الإلكتروني"
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            fullWidth
                            required
                            inputProps={{ inputMode: "email", dir: "ltr" }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="الهاتف"
                            value={form.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                            fullWidth
                            inputProps={{ inputMode: "tel", dir: "ltr" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField select label="الجنس" value={form.gender} onChange={(e) => setField("gender", e.target.value)} fullWidth required>
                            <MenuItem value="male">ذكر</MenuItem>
                            <MenuItem value="female">أنثى</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="تاريخ الميلاد"
                            type="date"
                            value={form.dob}
                            onChange={(e) => setField("dob", e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="تاريخ التوظيف"
                            type="date"
                            value={form.hiring_date}
                            onChange={(e) => setField("hiring_date", e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="العنوان"
                            value={form.address}
                            onChange={(e) => setField("address", e.target.value)}
                            fullWidth
                            multiline
                            minRows={2}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="كلمة المرور"
                            type={showPwd ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => setField("password", e.target.value)}
                            fullWidth
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPwd((s) => !s)} edge="end" size="small">
                                            {showPwd ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="تأكيد كلمة المرور"
                            type={showPwd2 ? "text" : "password"}
                            value={form.password_confirmation}
                            onChange={(e) => setField("password_confirmation", e.target.value)}
                            fullWidth
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPwd2((s) => !s)} edge="end" size="small">
                                            {showPwd2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                {/* أخطاء محلية/شبكة */}
                {!!localError && (
                    <Typography sx={{ mt: 1.5, color: "error.main" }}>{localError}</Typography>
                )}
                {mutation.isError && (
                    <Typography sx={{ mt: 1.5, color: "error.main" }}>
                        {mutation.error?.message || "فشل في إنشاء المشرف"}
                    </Typography>
                )}

                {/* الأزرار */}
                <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-start", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={mutation.isLoading}
                        sx={{
                            background: "linear-gradient(90deg,#308A9F,#22385F)",
                            "&:hover": { background: "linear-gradient(90deg,#2a8192,#1c2f4f)" },
                        }}
                    >
                        {mutation.isLoading ? "جارِ الإنشاء..." : "إنشاء المشرف"}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>إلغاء</Button>
                </Box>
            </Paper>
        </Modal>
    );
}
