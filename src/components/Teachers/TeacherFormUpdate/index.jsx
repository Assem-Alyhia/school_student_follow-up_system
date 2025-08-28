// src/pages/Admin/Teachers/TeacherForm.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Button, Container, Paper, TextField, Typography, Grid, Divider,
    CircularProgress, Alert
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SuccessAlert from "../../../layout/SuccessAlert";
import { updateTeacher } from "../../../api/Admin/Teachers/updateTeacher";
import { getTeacherById } from "../../../api/Admin/Teachers/getTeacherById";
import { getAllClassroomsNoPaginate } from "../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSubjectsNoPaginate } from "../../../api/Admin/Subjects/getAllSubjectsNoPaginate";

export default function TeacherFormUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        image: null,
        name: "",
        email: "",
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
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [alert, setAlert] = useState(null);

    const toISOIfDate = (d) => (d ? new Date(d).toISOString() : "");
    const isoToInput = (iso) => {
        if (!iso) return "";
        const dt = new Date(iso);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    // ===== Queries =====
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

    const {
        data: teacherResp,
        isLoading: teacherLoading,
        isError: teacherErr,
        error: teacherError,
    } = useQuery({
        queryKey: ["teacher", String(id)],
        queryFn: () => getTeacherById(id),
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });

    // تطبيع البيانات
    const classrooms = Array.isArray(classroomsData) ? classroomsData : classroomsData?.data || [];
    const subjects = Array.isArray(subjectsData) ? subjectsData : subjectsData?.data || [];
    const teacher = teacherResp?.data?.data ?? teacherResp?.data ?? teacherResp ?? null;

    // عند وصول بيانات المعلم: عبّي الاستمارة
    useEffect(() => {
        if (!teacher) return;
        const subjectIds = (teacher?.subjects || []).map((s) => s.id ?? s);
        const classroomIds = (teacher?.classrooms || []).map((c) => c.id ?? c);

        setFormData((prev) => ({
            ...prev,
            name: teacher?.name || teacher?.user?.name || "",
            email: teacher?.user?.email || "",
            gender: teacher?.gender || "male",
            dob: isoToInput(teacher?.dob),
            phone: teacher?.phone || "",
            address: teacher?.address || "",
            specialization: teacher?.specialization || "",
            hiring_date: isoToInput(teacher?.hiring_date),
            subject_ids: subjectIds,
            classroom_ids: classroomIds,
            image: null,
        }));
        setExistingImageUrl(teacher?.user?.image || "");
        setPreviewImage(null);
    }, [teacher]);

    // مابات للوصول السريع بالـ id
    const subjectsById = useMemo(() => {
        const map = new Map();
        subjects.forEach((s) => map.set(s.id, s));
        return map;
    }, [subjects]);

    const classroomsById = useMemo(() => {
        const map = new Map();
        classrooms.forEach((c) => map.set(c.id, c));
        return map;
    }, [classrooms]);

    // قيم Autocomplete المختارة (مصفوفات كائنات)
    const selectedSubjects = useMemo(
        () =>
            (formData.subject_ids || []).map((v) =>
                typeof v === "object" ? v : subjectsById.get(v) || { id: v, name: String(v) }
            ),
        [formData.subject_ids, subjectsById]
    );

    const selectedClassrooms = useMemo(
        () =>
            (formData.classroom_ids || []).map((v) =>
                typeof v === "object" ? v : classroomsById.get(v) || { id: v, name: String(v) }
            ),
        [formData.classroom_ids, classroomsById]
    );

    // ===== Mutation (update) =====
    const updateMut = useMutation({
        mutationFn: ({ teacherId, payload }) => updateTeacher(teacherId, payload),
        onSuccess: () => {
            // حدّث الكاش
            queryClient.invalidateQueries({ queryKey: ["teacher", String(id)] });
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            setAlert({
                title: "تم تعديل بيانات المعلم!",
                message: "تم حفظ التغييرات بنجاح.",
                severity: "success",
            });
            setTimeout(() => navigate("/dashboard/teachers"), 900);
        },
        onError: (err) => {
            const serverMsg =
                err?.response?.data?.message || err?.message || "فشل في تعديل المعلم!";
            const fieldErrors = err?.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(" • ")
                : "";
            setAlert({
                title: "فشل في تعديل المعلم!",
                message: fieldErrors ? `${serverMsg}: ${fieldErrors}` : serverMsg,
                severity: "error",
            });
        },
    });

    // ===== Handlers =====
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
        const payload = {
            ...formData,
            subject_ids: (formData.subject_ids || []).map((s) => s.id ?? s),
            classroom_ids: (formData.classroom_ids || []).map((c) => c.id ?? c),
            dob: toISOIfDate(formData.dob),
            hiring_date: toISOIfDate(formData.hiring_date),
        };
        Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
        updateMut.mutate({ teacherId: id, payload });
    };

    const anyLoading = teacherLoading || classroomsLoading || subjectsLoading;
    const anyError = teacherErr || classroomsErr || subjectsErr;
    const firstErrorMsg =
        teacherError?.message || classroomsError?.message || subjectsError?.message;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f6f9fb", py: 4 }} dir="rtl">
            <Container maxWidth="xl">
                {alert && (
                    <SuccessAlert
                        title={alert.title}
                        message={alert.message}
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    />
                )}

                {anyLoading && (
                    <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} /> جاري تحميل البيانات...
                    </Box>
                )}
                {anyError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        تعذر جلب البيانات: {firstErrorMsg}
                    </Alert>
                )}

                <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
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
                            تعديل بيانات المعلم
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            حدّث بيانات المعلم ثم اضغط حفظ التغييرات.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: "#e6eef3" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                    المعلومات الأساسية
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="الاسم الكامل"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={[
                                                { label: "ذكر", value: "male" },
                                                { label: "أنثى", value: "female" },
                                            ]}
                                            getOptionLabel={(o) => o.label}
                                            value={{
                                                label: formData.gender === "female" ? "أنثى" : "ذكر",
                                                value: formData.gender,
                                            }}
                                            onChange={(_e, v) =>
                                                handleAutocompleteChange("gender", v?.value || "male")
                                            }
                                            renderInput={(params) => <TextField {...params} label="الجنس" />}
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
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            label="البريد الإلكتروني"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="address"
                                            label="العنوان"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="specialization"
                                            label="التخصص"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            name="hiring_date"
                                            label="تاريخ التوظيف"
                                            value={formData.hiring_date}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 2.5, mt: 3, borderRadius: 2, borderColor: "#e6eef3" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                    الارتباطات
                                </Typography>

                                <Autocomplete
                                    multiple
                                    options={subjects}
                                    getOptionLabel={(o) => o?.name || ""}
                                    value={selectedSubjects}
                                    onChange={(_e, value) => handleAutocompleteChange("subject_ids", value)}
                                    renderInput={(params) => <TextField {...params} label="المواد" />}
                                />

                                <Autocomplete
                                    multiple
                                    options={classrooms}
                                    getOptionLabel={(o) => o?.name || ""}
                                    value={selectedClassrooms}
                                    onChange={(_e, value) => handleAutocompleteChange("classroom_ids", value)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="الفصول" sx={{ mt: 2 }} />
                                    )}
                                />
                            </Paper>

                            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={updateMut.isPending}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        background: "linear-gradient(90deg, #35AFBC, #308A9F)",
                                        "&:hover": { background: "linear-gradient(90deg, #308A9F, #22385F)" },
                                    }}
                                >
                                    {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                variant="outlined"
                                sx={{ p: 2.5, borderRadius: 2, borderColor: "#e6eef3", height: "100%" }}
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
                                    <Button component="span" variant="outlined" size="small" sx={{ mt: 1 }}>
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
