// src/pages/Admin/Teachers/TeacherForm.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, Container, Paper, TextField, Typography, Grid
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';

import SuccessAlert from '../../../layout/SuccessAlert';

import { createTeacher } from '../../../api/Admin/Teachers/createTeacher';
import { getAllClassroomsNoPaginate } from '../../../api/Admin/Classrooms/getAllClassroomsNoPaginate';
import { getAllSubjectsNoPaginate } from '../../../api/Admin/Subjects/getAllSubjectsNoPaginate';

export default function TeacherForAdd() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        image: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        gender: 'male',
        dob: '',
        phone: '',
        address: '',
        specialization: '',
        hiring_date: '',
        subject_ids: [],
        classroom_ids: [],
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '', message: '', severity: 'success'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const cls = await getAllClassroomsNoPaginate();
            const subs = await getAllSubjectsNoPaginate();
            setClassrooms(cls || []);
            setSubjects(subs || []);
        };
        fetchData();
    }, []);

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


    const toISOIfDate = (d) => (d ? new Date(d).toISOString() : "");

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                subject_ids: (formData.subject_ids || []).map((s) => s.id ?? s),
                classroom_ids: (formData.classroom_ids || []).map((c) => c.id ?? c),
                dob: toISOIfDate(formData.dob),
                hiring_date: toISOIfDate(formData.hiring_date),
            };

            await createTeacher(payload);

            setAlertConfig({
                title: "تم إنشاء المعلم بنجاح!",
                message: "تمت إضافة المعلم إلى النظام.",
                severity: "success",
            });
            setShowSuccess(true);
            setTimeout(() => navigate("/dashboard/teachers"), 1000);
        } catch (err) {
            setAlertConfig({
                title: "فشل في إنشاء المعلم!",
                message: err?.response?.data?.message || err.message,
                severity: "error",
            });
            setShowSuccess(true);
        }
    };


    return (
        <Container maxWidth="lg" dir="rtl">
            {showSuccess && (
                <SuccessAlert
                    title={alertConfig.title}
                    message={alertConfig.message}
                    severity={alertConfig.severity}
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <Grid container spacing={3} sx={{ padding: '2rem' }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>المعلومات الأساسية</Typography>
                        <TextField
                            fullWidth label="الاسم الكامل" name="name"
                            value={formData.name} onChange={handleChange} margin="dense"
                        />

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} md={4}>
                                <Box
                                    component="label" htmlFor="upload-photo"
                                    sx={{
                                        border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="معاينة الصورة"
                                            style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
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
                                        { label: 'ذكر', value: 'male' },
                                        { label: 'أنثى', value: 'female' },
                                    ]}
                                    getOptionLabel={(option) => option.label}
                                    value={{
                                        label: formData.gender === 'male' ? 'ذكر' : 'أنثى',
                                        value: formData.gender
                                    }}
                                    onChange={(e, newValue) =>
                                        handleAutocompleteChange('gender', newValue?.value || '')
                                    }
                                    renderInput={(params) => <TextField {...params} label="الجنس" margin="dense" />}
                                />

                                <TextField
                                    fullWidth type="date" name="dob" label="تاريخ الميلاد"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.dob} onChange={handleChange} margin="dense"
                                />

                                <TextField
                                    fullWidth name="address" label="العنوان"
                                    value={formData.address} onChange={handleChange} margin="dense"
                                />

                                <TextField
                                    fullWidth name="specialization" label="التخصص"
                                    value={formData.specialization} onChange={handleChange} margin="dense"
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات التواصل</Typography>
                        <TextField
                            fullWidth name="phone" label="رقم الهاتف"
                            value={formData.phone} onChange={handleChange} margin="dense"
                        />
                        <TextField
                            fullWidth name="email" label="البريد الإلكتروني"
                            value={formData.email} onChange={handleChange} margin="dense"
                        />
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">الارتباطات</Typography>

                        <Autocomplete
                            multiple
                            options={subjects}
                            getOptionLabel={(option) => option.name}
                            value={formData.subject_ids}
                            onChange={(e, value) => handleAutocompleteChange('subject_ids', value)}
                            renderInput={(params) => <TextField {...params} label="المواد" margin="dense" />}
                        />

                        <Autocomplete
                            multiple
                            options={classrooms}
                            getOptionLabel={(option) => option.name}
                            value={formData.classroom_ids}
                            onChange={(e, value) => handleAutocompleteChange('classroom_ids', value)}
                            renderInput={(params) => <TextField {...params} label="الفصول" margin="dense" />}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">معلومات الوظيفة</Typography>

                        <TextField
                            fullWidth type="date" name="hiring_date" label="تاريخ التوظيف"
                            InputLabelProps={{ shrink: true }}
                            value={formData.hiring_date} onChange={handleChange} margin="dense"
                        />
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات الحساب</Typography>

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="كلمة المرور"
                            value={formData.password}
                            onChange={handleChange}
                            margin="dense"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="start">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="تأكيد كلمة المرور"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            margin="dense"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="start"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            حفظ المعلم
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
