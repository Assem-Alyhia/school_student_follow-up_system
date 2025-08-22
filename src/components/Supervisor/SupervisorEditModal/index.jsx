// src/components/Admin/Supervisors/SupervisorEditModal.jsx
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
    CircularProgress,
} from "@mui/material";
import {
    Close as CloseIcon,
    Visibility,
    VisibilityOff,
    PhotoCamera as UploadIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupervisorById } from "../../../api/Admin/Supervisors/getSupervisorById";
import { updateSupervisor } from "../../../api/Admin/Supervisors/updateSupervisor";

const asISO = (d) => (d ? new Date(d).toISOString() : "");
const asDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const asArGender = (g) => (g === "male" ? "male" : g === "female" ? "female" : "");

export default function SupervisorEditModal({ open, onClose, id, onSuccess }) {
    const qc = useQueryClient();

    // ⬇️ جلب بيانات المشرف
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisor-by-id", id],
        queryFn: () => getSupervisorById(id),
        enabled: open && !!id,
    });

    // ⬇️ حالـة النموذج
    const [form, setForm] = React.useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        dob: "",
        hiring_date: "",

    });
    const [imageFile, setImageFile] = React.useState(null);
    const [preview, setPreview] = React.useState("");

    // ⬇️ ملء النموذج عند الجلب
    React.useEffect(() => {
        if (!data) return;
        const sup = data || {};
        const user = sup.user || {};
        setForm({
            name: sup.name || user.name || "",
            email: user.email || "",
            phone: sup.phone || "",
            gender: asArGender(sup.gender),
            address: sup.address || "",
            dob: asDateInput(sup.dob),
            hiring_date: asDateInput(sup.hiring_date || user.created_at),

        });
        setPreview(user.image || "");
        setImageFile(null);
    }, [data, open]);

    // ⬇️ تحديث الحقول
    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    // ⬇️ رفع صورة
    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // ⬇️ إرسال التعديل
    const mutation = useMutation({
        mutationFn: (payload) => updateSupervisor(id, payload),
        onSuccess: (res) => {
            qc.invalidateQueries(["supervisor-by-id", id]);
            qc.invalidateQueries(["supervisors"]);
            onSuccess?.(res);
            onClose?.();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const fd = new FormData();
        if (imageFile) fd.append("image", imageFile);
        fd.append("email", form.email || "");
        fd.append("name", form.name || "");
        fd.append("gender", form.gender || "");
        fd.append("phone", form.phone || "");
        fd.append("address", form.address || "");
        fd.append("dob", form.dob ? asISO(form.dob) : "");
        fd.append("hiring_date", form.hiring_date ? asISO(form.hiring_date) : "");

        // كلمة المرور اختيارية — نرسلها فقط إذا أدخلها المستخدم
        if (form.password) {
            fd.append("password", form.password);
            fd.append("password_confirmation", form.password_confirmation || "");
        }

        mutation.mutate(fd);
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
                {/* Close */}
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 12, left: 14, color: "#308A9F" }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: 900, mb: 2 }}>
                    تعديل بيانات المشرف
                </Typography>

                {/* حالة تحميل / خطأ */}
                {isLoading && (
                    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                        <CircularProgress size={26} />
                        <Typography sx={{ mt: 1.5, color: "#7A8899" }}>جاري تحميل البيانات…</Typography>
                    </Box>
                )}

                {isError && !isLoading && (
                    <Box sx={{ py: 3, color: "error.main", textAlign: "center" }}>
                        فشل الجلب: {error?.message || "حدث خطأ غير متوقع"}
                    </Box>
                )}

                {!isLoading && !isError && (
                    <>
                        {/* الصورة + زر رفع */}
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
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="البريد الإلكتروني"
                                    value={form.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    fullWidth
                                    inputProps={{ inputMode: "email" }}
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
                                <TextField
                                    select
                                    label="الجنس"
                                    value={form.gender}
                                    onChange={(e) => setField("gender", e.target.value)}
                                    fullWidth
                                >
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
                        </Grid>

                        {/* أزرار */}
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
                                {mutation.isLoading ? "جارِ الحفظ..." : "حفظ التغييرات"}
                            </Button>
                            <Button variant="outlined" onClick={onClose}>
                                إلغاء
                            </Button>
                        </Box>

                        {/* خطأ التحديث */}
                        {mutation.isError && (
                            <Typography sx={{ mt: 1.5, color: "error.main" }}>
                                {mutation.error?.message || "فشل في تحديث بيانات المشرف"}
                            </Typography>
                        )}
                    </>
                )}
            </Paper>
        </Modal>
    );
}
