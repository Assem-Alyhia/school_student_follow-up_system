// src/pages/Admin/Teachers/TeacherForm.jsx
import React, { useState } from "react";
import {
    Box, Button, Container, Paper, TextField, Typography, Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SuccessAlert from "../../../layout/SuccessAlert";

import { createTeacher } from "../../../api/Admin/Teachers/createTeacher";
import { getAllClassroomsNoPaginate } from "../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSubjectsNoPaginate } from "../../../api/Admin/Subjects/getAllSubjectsNoPaginate";

export default function TeacherForAdd() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        image: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        gender: "male",
        dob: "",
        phone: "",
        address: "",
        specialization: "",
        hiring_date: "",
        subject_ids: [],
        classroom_ids: [],
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [alert, setAlert] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ---------- Queries ----------
    const {
        data: classroomsData,
        isLoading: classroomsLoading,
        isError: classroomsErr,
        error: classroomsError,
    } = useQuery({
        queryKey: ["classrooms:nopaginate"],
        queryFn: getAllClassroomsNoPaginate,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: subjectsData,
        isLoading: subjectsLoading,
        isError: subjectsErr,
        error: subjectsError,
    } = useQuery({
        queryKey: ["subjects:nopaginate"],
        queryFn: getAllSubjectsNoPaginate,
        staleTime: 5 * 60 * 1000,
    });

    const classrooms = Array.isArray(classroomsData) ? classroomsData : classroomsData?.data || [];
    const subjects = Array.isArray(subjectsData) ? subjectsData : subjectsData?.data || [];

    const anyLoading = classroomsLoading || subjectsLoading;
    const anyError = classroomsErr || subjectsErr;
    const firstErrorMsg = classroomsError?.message || subjectsError?.message;

    // ---------- Mutation ----------
    const toISOIfDate = (d) => (d ? new Date(d).toISOString() : "");
    const createMut = useMutation({
        mutationFn: createTeacher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            setAlert({
                title: "تم إنشاء المعلم بنجاح!",
                message: "تمت إضافة المعلم إلى النظام.",
                severity: "success",
            });
            setTimeout(() => navigate("/dashboard/teachers"), 800);
        },
        onError: (err) => {
            const serverMsg = err?.response?.data?.message || err?.message || "فشل في إنشاء المعلم";
            const fieldErrors = err?.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(" • ")
                : "";
            setAlert({
                title: "فشل في إنشاء المعلم!",
                message: fieldErrors ? `${serverMsg}: ${fieldErrors}` : serverMsg,
                severity: "error",
            });
        },
    });

    // ---------- Handlers ----------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAutocompleteChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        // تطبيع الحمولة قبل الإرسال
        const payload = {
            ...formData,
            subject_ids: (formData.subject_ids || []).map((s) => s.id ?? s),
            classroom_ids: (formData.classroom_ids || []).map((c) => c.id ?? c),
            dob: toISOIfDate(formData.dob),
            hiring_date: toISOIfDate(formData.hiring_date),
        };
        createMut.mutate(payload);
    };

    return (
        <Container maxWidth="lg" dir="rtl">
            {alert && (
                <SuccessAlert
                    title={alert.title}
                    message={alert.message}
                    severity={alert.severity}
                    onClose={() => setAlert(null)}
                />
            )}

            {anyLoading && (
                <Box sx={{ p: 2, color: "text.secondary" }}>جاري تحميل القوائم...</Box>
            )}
            {anyError && (
                <Box sx={{ p: 2, color: "error.main" }}>
                    حدث خطأ أثناء جلب البيانات: {firstErrorMsg}
                </Box>
            )}

            <Grid container spacing={3} sx={{ padding: "2rem" }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            المعلومات الأساسية
                        </Typography>
                        <TextField
                            fullWidth
                            label="الاسم الكامل"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="dense"
                        />

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} md={4}>
                                <Box
                                    component="label"
                                    htmlFor="upload-photo"
                                    sx={{
                                        border: "2px dashed #ccc",
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="معاينة الصورة"
                                            style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }}
                                        />
                                    ) : (
                                        <>
                                            <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography sx={{ fontSize: 14 }}>اختر صورة</Typography>
                                        </>
                                    )}
                                    <Button component="span" variant="outlined" size="small" sx={{ mt: 1 }}>
                                        تحميل صورة
                                    </Button>
                                    <input type="file" id="upload-photo" hidden onChange={handleFileChange} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Autocomplete
                                    options={[
                                        { label: "ذكر", value: "male" },
                                        { label: "أنثى", value: "female" },
                                    ]}
                                    getOptionLabel={(option) => option.label}
                                    value={{
                                        label: formData.gender === "male" ? "ذكر" : "أنثى",
                                        value: formData.gender,
                                    }}
                                    onChange={(_, newValue) =>
                                        handleAutocompleteChange("gender", newValue?.value || "")
                                    }
                                    renderInput={(params) => <TextField {...params} label="الجنس" margin="dense" />}
                                />

                                <TextField
                                    fullWidth
                                    type="date"
                                    name="dob"
                                    label="تاريخ الميلاد"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.dob}
                                    onChange={handleChange}
                                    margin="dense"
                                />

                                <TextField
                                    fullWidth
                                    name="address"
                                    label="العنوان"
                                    value={formData.address}
                                    onChange={handleChange}
                                    margin="dense"
                                />

                                <TextField
                                    fullWidth
                                    name="specialization"
                                    label="التخصص"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    margin="dense"
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات التواصل</Typography>
                        <TextField
                            fullWidth
                            name="phone"
                            label="رقم الهاتف"
                            value={formData.phone}
                            onChange={handleChange}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            name="email"
                            label="البريد الإلكتروني"
                            value={formData.email}
                            onChange={handleChange}
                            margin="dense"
                        />
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">الارتباطات</Typography>

                        <Autocomplete
                            multiple
                            options={subjects}
                            loading={subjectsLoading}
                            getOptionLabel={(option) =>
                                option?.level?.name ? `${option.name} (${option.level.name})` : option?.name || ""
                            }
                            value={formData.subject_ids}
                            onChange={(_, value) => handleAutocompleteChange("subject_ids", value)}
                            renderInput={(params) => (
                                <TextField {...params} label="المواد" margin="dense" />
                            )}
                        />

                        <Autocomplete
                            multiple
                            options={classrooms}
                            loading={classroomsLoading}
                            getOptionLabel={(option) => option?.name || ""}
                            value={formData.classroom_ids}
                            onChange={(_, value) => handleAutocompleteChange("classroom_ids", value)}
                            renderInput={(params) => <TextField {...params} label="الفصول" margin="dense" />}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">معلومات الوظيفة</Typography>
                        <TextField
                            fullWidth
                            type="date"
                            name="hiring_date"
                            label="تاريخ التوظيف"
                            InputLabelProps={{ shrink: true }}
                            value={formData.hiring_date}
                            onChange={handleChange}
                            margin="dense"
                        />
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات الحساب</Typography>

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="كلمة المرور"
                            value={formData.password}
                            onChange={handleChange}
                            margin="dense"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="start">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            label="تأكيد كلمة المرور"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            margin="dense"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="start">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Paper>

                    <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={createMut.isPending}
                        >
                            {createMut.isPending ? "جارٍ الحفظ..." : "حفظ المعلم"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
