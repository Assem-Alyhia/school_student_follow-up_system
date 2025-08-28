// src/components/Students/StudentEditForm.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SuccessAlert from "../../../layout/SuccessAlert";

import { updateStudent } from "../../../api/Admin/Students/updateStudent";
import { getStudentById } from "../../../api/Admin/Students/getStudentById";
import { getAllParentsNoPaginate } from "../../../api/Admin/Parents/getAllParentsNoPaginate";
import { getAllClassroomsNoPaginate } from "../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSupervisorsNoPaginate } from "../../../api/Admin/Supervisors/getAllSupervisorsNoPaginate";
import { getAllSchoolFeesNoPaginate } from "../../../api/Admin/SchoolFees/getAllSchoolFeesNoPaginate";

export default function StudentEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --------- Form State ----------
    const [formData, setFormData] = useState({
        image: null,
        name: "",
        email: "",
        password: null,
        password_confirmation: null,
        parent_id: "",
        classroom_id: "",
        supervisor_id: "",
        gender: "male",
        phone: "",
        enrollment_date: "",
        address: "",
        dob: "",
        student_status: "in_school",
        medical_info: "",
        school_fee_id: "1",
        amount: "",
        discount: "",
        discount_status: "none",
        payment_status: "",
        paid_at: "",
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [alert, setAlert] = useState(null);

    // --------- Queries ----------
    // الطالب
    const {
        data: studentData,
        isLoading: studentLoading,
        isError: studentErr,
        error: studentError,
    } = useQuery({
        queryKey: ["student", id],
        queryFn: () => getStudentById(id),
    });

    // القوائم (NOPAGINATE)
    const {
        data: parentsData,
        isLoading: parentsLoading,
        isError: parentsErr,
        error: parentsError,
    } = useQuery({
        queryKey: ["parents:nopaginate"],
        queryFn: getAllParentsNoPaginate,
        staleTime: 5 * 60 * 1000,
    });

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
        data: supervisorsData,
        isLoading: supervisorsLoading,
        isError: supervisorsErr,
        error: supervisorsError,
    } = useQuery({
        queryKey: ["supervisors:nopaginate"],
        queryFn: getAllSupervisorsNoPaginate,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: schoolFeesData,
        isLoading: feesLoading,
        isError: feesErr,
        error: feesError,
    } = useQuery({
        queryKey: ["schoolFees:nopaginate"],
        queryFn: getAllSchoolFeesNoPaginate,
        staleTime: 5 * 60 * 1000,
    });

    const parents = Array.isArray(parentsData) ? parentsData : parentsData?.data || [];
    const classrooms = Array.isArray(classroomsData) ? classroomsData : classroomsData?.data || [];
    const supervisors = Array.isArray(supervisorsData) ? supervisorsData : supervisorsData?.data || [];
    const _schoolFees = Array.isArray(schoolFeesData) ? schoolFeesData : schoolFeesData?.data || [];

    useEffect(() => {
        if (!studentData) return;

        const { user, parent, classroom, supervisor, school_fee, payments = [], ...student } = studentData;

        setFormData((prev) => ({
            ...prev,
            name: student?.name || "",
            email: user?.email || "",
            gender: student?.gender || "male",
            phone: student?.phone || "",
            enrollment_date: student?.enrollment_date ? student.enrollment_date.split("T")[0] : "",
            address: student?.address || "",
            dob: student?.dob ? student.dob.split("T")[0] : "",
            student_status: student?.status || "in_school",
            medical_info: student?.medical_info || "",
            parent_id: parent?.id || "",
            classroom_id: classroom?.id || "",
            supervisor_id: supervisor?.id || "",
            school_fee_id: school_fee?.id || "1",
            ...(payments.length > 0
                ? {
                    amount: payments[0]?.amount ?? "",
                    discount: payments[0]?.discount ?? "",
                    discount_status: payments[0]?.discount_status ?? "none",
                    payment_status: payments[0]?.status ?? "",
                    paid_at: payments[0]?.paid_at ? payments[0].paid_at.split("T")[0] : "",
                }
                : {}),
        }));

        if (user?.image) setPreviewImage(user.image);
    }, [studentData]);

    // --------- Mutation (update) ----------
    const updateMut = useMutation({
        mutationFn: (payload) => updateStudent(id, payload),
        onSuccess: () => {
            // حدّث كاش الطالب والقوائم ذات الصلة
            queryClient.invalidateQueries({ queryKey: ["student", id] });
            queryClient.invalidateQueries({ queryKey: ["students"] });
            setAlert({
                title: "تم تحديث بيانات الطالب بنجاح!",
                message: "تم حفظ التغييرات على بيانات الطالب.",
                severity: "success",
            });
            setTimeout(() => navigate("/dashboard/students"), 800);
        },
        onError: (err) => {
            const serverMsg =
                err?.response?.data?.message ||
                err?.message ||
                "فشل في تحديث بيانات الطالب";
            const fieldErrors = err?.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(" • ")
                : "";
            setAlert({
                title: "فشل في تحديث بيانات الطالب!",
                message: fieldErrors ? `${serverMsg}: ${fieldErrors}` : serverMsg,
                severity: "error",
            });
        },
    });

    // --------- Handlers ----------
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
        // تحقق بسيط
        if (!formData.name?.trim()) {
            setAlert({
                title: "حقول مطلوبة",
                message: "الاسم الكامل مطلوب.",
                severity: "error",
            });
            return;
        }
        updateMut.mutate(formData);
    };

    // --------- Loading/Error States ----------
    const anyLoading =
        studentLoading ||
        parentsLoading ||
        classroomsLoading ||
        supervisorsLoading ||
        feesLoading;

    const anyError =
        studentErr || parentsErr || classroomsErr || supervisorsErr || feesErr;

    const firstErrorMsg =
        studentError?.message ||
        parentsError?.message ||
        classroomsError?.message ||
        supervisorsError?.message ||
        feesError?.message;

    if (anyLoading) {
        return (
            <Container maxWidth="lg" dir="rtl">
                <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                    جاري تحميل بيانات الطالب والقوائم...
                </Typography>
            </Container>
        );
    }

    if (anyError) {
        return (
            <Container maxWidth="lg" dir="rtl">
                <Box sx={{ p: 2, color: "error.main" }}>
                    حدث خطأ أثناء جلب البيانات: {firstErrorMsg}
                </Box>
            </Container>
        );
    }

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
                                            alt="صورة المعاينة"
                                            style={{ width: 100, height: 100, borderRadius: 8 }}
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
                                    type="date"
                                    name="enrollment_date"
                                    label="تاريخ الانضمام"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.enrollment_date}
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
                        <Typography variant="h6">المعرفات</Typography>

                        <Autocomplete
                            options={parents}
                            getOptionLabel={(option) => option?.name || ""}
                            value={parents.find((p) => p.id === formData.parent_id) || null}
                            onChange={(_, value) => handleAutocompleteChange("parent_id", value?.id || "")}
                            renderInput={(params) => <TextField {...params} label="ولي الأمر" margin="dense" />}
                            loading={parentsLoading}
                        />

                        <Autocomplete
                            options={classrooms}
                            getOptionLabel={(option) => option?.name || ""}
                            value={classrooms.find((c) => c.id === formData.classroom_id) || null}
                            onChange={(_, value) => handleAutocompleteChange("classroom_id", value?.id || "")}
                            renderInput={(params) => <TextField {...params} label="الصف" margin="dense" />}
                            loading={classroomsLoading}
                        />

                        <Autocomplete
                            options={supervisors}
                            getOptionLabel={(option) => option?.name || ""}
                            value={supervisors.find((s) => s.id === formData.supervisor_id) || null}
                            onChange={(_, value) => handleAutocompleteChange("supervisor_id", value?.id || "")}
                            renderInput={(params) => <TextField {...params} label="المشرف" margin="dense" />}
                            loading={supervisorsLoading}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات إضافية</Typography>

                        <Autocomplete
                            options={[
                                { label: "داخل المدرسة", value: "in_school" },
                                { label: "في الطريق", value: "on_way" },
                                { label: "في المنزل", value: "at_home" },
                            ]}
                            getOptionLabel={(option) => option.label}
                            value={{
                                label:
                                    formData.student_status === "in_school"
                                        ? "داخل المدرسة"
                                        : formData.student_status === "on_way"
                                            ? "في الطريق"
                                            : "في المنزل",
                                value: formData.student_status,
                            }}
                            onChange={(_, newValue) =>
                                handleAutocompleteChange("student_status", newValue?.value || "")
                            }
                            renderInput={(params) => <TextField {...params} label="حالة الطالب" margin="dense" />}
                        />

                        <TextField
                            fullWidth
                            name="medical_info"
                            label="معلومات صحية"
                            value={formData.medical_info}
                            onChange={handleChange}
                            margin="dense"
                        />
                    </Paper>

                    <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={updateMut.isPending}
                        >
                            {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
