// src/pages/Admin/Teachers/TeacherForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography, Grid, Divider } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate, useParams } from "react-router-dom";
import SuccessAlert from "../../../layout/SuccessAlert";
import { updateTeacher } from "../../../api/Admin/Teachers/updateTeacher";
import { getTeacherById } from "../../../api/Admin/Teachers/getTeacherById";
import { getAllClassroomsNoPaginate } from "../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSubjectsNoPaginate } from "../../../api/Admin/Subjects/getAllSubjectsNoPaginate";

export default function TeacherFormUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();

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
    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: "", message: "", severity: "success" });

    const toISOIfDate = (d) => (d ? new Date(d).toISOString() : "");
    const isoToInput = (iso) => {
        if (!iso) return "";
        const dt = new Date(iso);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    useEffect(() => {
        (async () => {
            try {
                const [cls, subs] = await Promise.all([getAllClassroomsNoPaginate(), getAllSubjectsNoPaginate()]);
                setClassrooms(cls || []);
                setSubjects(subs || []);
            } catch { console.log() }
        })();
    }, []);

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

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await getTeacherById(id);
                const t = res?.data?.data ?? res?.data ?? res;
                const subjectIds = (t?.subjects || []).map((s) => s.id ?? s);
                const classroomIds = (t?.classrooms || []).map((c) => c.id ?? c);
                setFormData((prev) => ({
                    ...prev,
                    name: t?.name || t?.user?.name || "",
                    email: t?.user?.email || "",
                    gender: t?.gender || "male",
                    dob: isoToInput(t?.dob),
                    phone: t?.phone || "",
                    address: t?.address || "",
                    specialization: t?.specialization || "",
                    hiring_date: isoToInput(t?.hiring_date),
                    subject_ids: subjectIds,
                    classroom_ids: classroomIds,
                    image: null,
                }));
                setExistingImageUrl(t?.user?.image || "");
            } catch (err) {
                setAlertConfig({
                    title: "فشل في جلب بيانات المعلم",
                    message: err?.response?.data?.message || err.message,
                    severity: "error",
                });
                setShowSuccess(true);
            }
        })();
    }, [id]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleAutocompleteChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
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
                ...formData,
                subject_ids: (formData.subject_ids || []).map((s) => s.id ?? s),
                classroom_ids: (formData.classroom_ids || []).map((c) => c.id ?? c),
                dob: toISOIfDate(formData.dob),
                hiring_date: toISOIfDate(formData.hiring_date),
            };
            Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
            await updateTeacher(id, payload);
            setAlertConfig({ title: "تم تعديل بيانات المعلم!", message: "تم حفظ التغييرات بنجاح.", severity: "success" });
            setShowSuccess(true);
            setTimeout(() => navigate("/dashboard/teachers"), 900);
        } catch (err) {
            setAlertConfig({
                title: "فشل في تعديل المعلم!",
                message: err?.response?.data?.message || err.message,
                severity: "error",
            });
            setShowSuccess(true);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f6f9fb", py: 4 }} dir="rtl">
            <Container maxWidth="xl">
                {showSuccess && (
                    <SuccessAlert
                        title={alertConfig.title}
                        message={alertConfig.message}
                        severity={alertConfig.severity}
                        onClose={() => setShowSuccess(false)}
                    />
                )}

                <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                    <Box
                        sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            background: "linear-gradient(90deg, rgba(48,138,159,0.15), rgba(34,56,95,0.08))",
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
                                        <TextField fullWidth label="الاسم الكامل" name="name" value={formData.name} onChange={handleChange} />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={[
                                                { label: "ذكر", value: "male" },
                                                { label: "أنثى", value: "female" },
                                            ]}
                                            getOptionLabel={(o) => o.label}
                                            value={{ label: formData.gender === "female" ? "أنثى" : "ذكر", value: formData.gender }}
                                            onChange={(_e, v) => handleAutocompleteChange("gender", v?.value || "male")}
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
                                        <TextField fullWidth name="phone" label="رقم الهاتف" value={formData.phone} onChange={handleChange} />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth name="email" label="البريد الإلكتروني" value={formData.email} onChange={handleChange} />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth name="address" label="العنوان" value={formData.address} onChange={handleChange} />
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
                                    getOptionLabel={(o) => o.name}
                                    value={selectedSubjects}
                                    onChange={(_e, value) => handleAutocompleteChange("subject_ids", value)}
                                    renderInput={(params) => <TextField {...params} label="المواد" />}
                                />

                                <Autocomplete
                                    multiple
                                    options={classrooms}
                                    getOptionLabel={(o) => o.name}
                                    value={selectedClassrooms}
                                    onChange={(_e, value) => handleAutocompleteChange("classroom_ids", value)}
                                    renderInput={(params) => <TextField {...params} label="الفصول" sx={{ mt: 2 }} />}
                                />
                            </Paper>

                            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        background: "linear-gradient(90deg, #35AFBC, #308A9F)",
                                        "&:hover": { background: "linear-gradient(90deg, #308A9F, #22385F)" },
                                    }}
                                >
                                    حفظ التغييرات
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} lg={3}>
                            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: "#e6eef3", height: "100%" }}>
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
                                            style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
                                        />
                                    ) : existingImageUrl ? (
                                        <img
                                            src={existingImageUrl}
                                            alt="الصورة الحالية"
                                            style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
                                        />
                                    ) : (
                                        <>
                                            <UploadFileIcon sx={{ fontSize: 46, color: "#308A9F" }} />
                                            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>اختر صورة</Typography>
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
