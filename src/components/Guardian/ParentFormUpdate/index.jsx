// src/pages/Admin/Parents/ParentForm.jsx  (Edit-only, no password)
import React, { useEffect, useState } from "react";
import {
    Box, Button, Container, Paper, TextField, Typography, Grid, Divider
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate, useParams } from "react-router-dom";

import SuccessAlert from "../../../layout/SuccessAlert";
import { updateParent } from "../../../api/Admin/Parents/updateParent";
import { getParentById } from "../../../api/Admin/Parents/getParentById";

export default function ParentFormUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        image: null,
        name: "",
        email: "",
        phone: "",
        dob: "",
    });

    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showSuccess, setShowSuccess] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        severity: "success",
    });

    const inputDateToISO = (d) => (d ? new Date(d).toISOString() : "");
    const isoToInputDate = (iso) => {
        if (!iso) return "";
        const dt = new Date(iso);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
            dt.getDate()
        ).padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!id) {
            setAlertConfig({
                title: "معرّف غير صالح",
                message: "لم يتم تمرير معرّف وليّ الأمر.",
                severity: "error",
            });
            setShowSuccess(true);
            setLoading(false);
            return;
        }
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getParentById(id);
                const p = res?.data?.data ?? res?.data ?? res;

                if (mounted && p) {
                    setFormData({
                        image: null,
                        name: p?.name || p?.user?.name || "",
                        email: p?.user?.email || "",
                        phone: p?.phone || "",
                        dob: isoToInputDate(p?.dob),
                    });
                    setExistingImageUrl(p?.user?.image || "");
                }
            } catch (err) {
                setAlertConfig({
                    title: "فشل في جلب بيانات وليّ الأمر",
                    message: err?.response?.data?.message || err.message,
                    severity: "error",
                });
                setShowSuccess(true);
            } finally {
                mounted && setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob ? inputDateToISO(formData.dob) : "",
                image: formData.image, // فقط إن اختار صورة جديدة
            };

            await updateParent(id, payload);

            setAlertConfig({
                title: "تم تعديل وليّ الأمر بنجاح!",
                message: "تم حفظ التغييرات.",
                severity: "success",
            });
            setShowSuccess(true);
            setTimeout(() => navigate("/dashboard/guardian"), 900);
        } catch (err) {
            setAlertConfig({
                title: "فشل في تعديل وليّ الأمر!",
                message: err?.response?.data?.message || err.message,
                severity: "error",
            });
            setShowSuccess(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f6f9fb",
                py: 4,
            }}
            dir="rtl"
        >
            <Container maxWidth="xl">
                {showSuccess && (
                    <SuccessAlert
                        title={alertConfig.title}
                        message={alertConfig.message}
                        severity={alertConfig.severity}
                        onClose={() => setShowSuccess(false)}
                    />
                )}

                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            background:
                                "linear-gradient(90deg, rgba(48,138,159,0.15), rgba(34,56,95,0.08))",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#22385F" }}>
                            تعديل وليّ الأمر
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            حدّث بيانات وليّ الأمر ثم اضغط حفظ التغييرات.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* العمود الأيسر: الحقول */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper
                                variant="outlined"
                                sx={{ p: 2.5, borderRadius: 2, borderColor: "#e6eef3" }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                    بيانات وليّ الأمر
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="الاسم الكامل"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            name="dob"
                                            label="تاريخ الميلاد"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            disabled={loading}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="phone"
                                            label="رقم الهاتف"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{ p: 2.5, mt: 3, borderRadius: 2, borderColor: "#e6eef3" }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                    معلومات التواصل
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="البريد الإلكتروني"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Paper>

                            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        background:
                                            "linear-gradient(90deg, #35AFBC, #308A9F)",
                                        "&:hover": { background: "linear-gradient(90deg, #308A9F, #22385F)" },
                                    }}
                                >
                                    حفظ التغييرات
                                </Button>
                            </Box>
                        </Grid>

                        {/* العمود الأيمن: الصورة */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    height: "100%",
                                    borderColor: "#e6eef3",
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                    الصورة الشخصية
                                </Typography>

                                <Box
                                    component="label"
                                    htmlFor="upload-photo"
                                    sx={{
                                        border: "2px dashed #cfd9df",
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1.5,
                                        bgcolor: "#fbfdff",
                                    }}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="معاينة الصورة"
                                            style={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: 12,
                                                objectFit: "cover",
                                                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                    ) : existingImageUrl ? (
                                        <img
                                            src={existingImageUrl}
                                            alt="الصورة الحالية"
                                            style={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: 12,
                                                objectFit: "cover",
                                                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <UploadFileIcon sx={{ fontSize: 46, color: "#308A9F" }} />
                                            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                                                اختر صورة
                                            </Typography>
                                        </>
                                    )}

                                    <Button component="span" variant="outlined" size="small" disabled={loading} sx={{ mt: 1 }}>
                                        تحميل صورة
                                    </Button>
                                    <input type="file" id="upload-photo" hidden onChange={handleFileChange} />
                                </Box>

                                <Divider sx={{ my: 2.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    الصيغ المدعومة: JPG, PNG — حد أقصى 2MB.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}
