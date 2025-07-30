import React, { useEffect, useState } from 'react';
import {
    Box, Button, Container, FormControl, InputLabel, Paper, TextField, Typography, Grid, Snackbar, Alert
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { updateStudent } from '../../../api/Admin/Students/updateStudent';
import { getStudentById } from '../../../api/Admin/Students/getStudentById';
import { getAllParentsNoPaginate } from '../../../api/Admin/Parents/getAllParentsNoPaginate';
import { getAllClassroomsNoPaginate } from '../../../api/Admin/Classrooms/getAllClassroomsNoPaginate';
import { getAllSupervisorsNoPaginate } from '../../../api/Admin/Supervisors/getAllSupervisorsNoPaginate';
import { getAllSchoolFeesNoPaginate } from '../../../api/Admin/SchoolFees/getAllSchoolFeesNoPaginate';
import { useNavigate, useParams } from 'react-router-dom';
import SuccessAlert from '../../../layout/SuccessAlert';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export default function StudentEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        image: null, name: '', email: '', password: '', password_confirmation: '',
        parent_id: '', classroom_id: '', supervisor_id: '', gender: 'male',
        phone: '', enrollment_date: '', address: '', dob: '', student_status: 'in_school',
        medical_info: '', school_fee_id: '1', amount: '', discount: '',
        discount_status: 'none', payment_status: 'pending', paid_at: '',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [parents, setParents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [_schoolFees, setSchoolFees] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        severity: 'success'
    });
    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch all the necessary data
                const [studentData, parentsData, classroomsData, supervisorsData, schoolFeesData] = await Promise.all([
                    getStudentById(id),
                    getAllParentsNoPaginate(),
                    getAllClassroomsNoPaginate(),
                    getAllSupervisorsNoPaginate(),
                    getAllSchoolFeesNoPaginate()
                ]);

                setParents(parentsData);
                setClassrooms(classroomsData);
                setSupervisors(supervisorsData);
                setSchoolFees(schoolFeesData);

                // Map the student data to our form structure
                const { user, parent, classroom, supervisor, school_fee, payments, ...student } = studentData;

                setFormData({
                    ...formData,
                    name: student.name,
                    email: user?.email || '',
                    gender: student.gender,
                    phone: student.phone,
                    enrollment_date: student.enrollment_date.split('T')[0],
                    address: student.address,
                    dob: student.dob.split('T')[0],
                    student_status: student.status,
                    medical_info: student.medical_info,
                    parent_id: parent?.id || '',
                    classroom_id: classroom?.id || '',
                    supervisor_id: supervisor?.id || '',
                    school_fee_id: school_fee?.id || '1',
                    // Add payment data if exists
                    ...(payments.length > 0 ? {
                        amount: payments[0].amount,
                        discount: payments[0].discount,
                        discount_status: payments[0].discount_status,
                        payment_status: payments[0].status,
                        paid_at: payments[0].paid_at?.split('T')[0] || ''
                    } : {})
                });

                // Set preview image if exists
                if (user?.image) {
                    setPreviewImage(user.image);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setAlertConfig({
                    title: 'خطأ في جلب البيانات',
                    message: error.message,
                    severity: 'error'
                });
                setShowSuccess(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAutocompleteChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            await updateStudent(id, formData);
            setAlertConfig({
                title: 'تم تحديث بيانات الطالب بنجاح!',
                message: 'تم حفظ التغييرات على بيانات الطالب.',
                severity: 'success',
            });
            setShowSuccess(true);
            setTimeout(() => navigate('/dashboard/students'), 1000);
        } catch (err) {
            setAlertConfig({
                title: 'فشل في تحديث بيانات الطالب!',
                message: err?.response?.data?.message || err.message,
                severity: 'error',
            });
            setShowSuccess(true);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" dir="rtl">
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>جاري تحميل بيانات الطالب...</Typography>
            </Container>
        );
    }

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
                        <TextField fullWidth label="الاسم الكامل" name="name" value={formData.name} onChange={handleChange} margin="dense" />

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} md={4}>
                                <Box component="label" htmlFor="upload-photo" sx={{
                                    border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="صورة المعاينة" style={{ width: 100, height: 100, borderRadius: 8 }} />
                                    ) : (
                                        <>
                                            <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography sx={{ fontSize: 14 }}>اختر صورة</Typography>
                                        </>
                                    )}
                                    <Button component="span" variant="outlined" size="small" sx={{ mt: 1 }}>تحميل صورة</Button>
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
                                    value={{ label: formData.gender === 'male' ? 'ذكر' : 'أنثى', value: formData.gender }}
                                    onChange={(e, newValue) => handleAutocompleteChange("gender", newValue?.value || '')}
                                    renderInput={(params) => <TextField {...params} label="الجنس" margin="dense" />}
                                />
                                <TextField fullWidth type="date" name="dob" label="تاريخ الميلاد" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} margin="dense" />
                                <TextField fullWidth type="date" name="enrollment_date" label="تاريخ الانضمام" InputLabelProps={{ shrink: true }} value={formData.enrollment_date} onChange={handleChange} margin="dense" />
                                <TextField fullWidth name="address" label="العنوان" value={formData.address} onChange={handleChange} margin="dense" />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات التواصل</Typography>
                        <TextField fullWidth name="phone" label="رقم الهاتف" value={formData.phone} onChange={handleChange} margin="dense" />
                        <TextField fullWidth name="email" label="البريد الإلكتروني" value={formData.email} onChange={handleChange} margin="dense" />
                    </Paper>

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">المعرفات</Typography>
                        <Autocomplete
                            options={parents}
                            getOptionLabel={(option) => option.name}
                            value={parents.find(p => p.id === formData.parent_id) || null}
                            onChange={(e, value) => handleAutocompleteChange("parent_id", value?.id || '')}
                            renderInput={(params) => <TextField {...params} label="ولي الأمر" margin="dense" />}
                        />
                        <Autocomplete
                            options={classrooms}
                            getOptionLabel={(option) => option.name}
                            value={classrooms.find(c => c.id === formData.classroom_id) || null}
                            onChange={(e, value) => handleAutocompleteChange("classroom_id", value?.id || '')}
                            renderInput={(params) => <TextField {...params} label="الصف" margin="dense" />}
                        />
                        <Autocomplete
                            options={supervisors}
                            getOptionLabel={(option) => option.name}
                            value={supervisors.find(s => s.id === formData.supervisor_id) || null}
                            onChange={(e, value) => handleAutocompleteChange("supervisor_id", value?.id || '')}
                            renderInput={(params) => <TextField {...params} label="المشرف" margin="dense" />}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">معلومات الحساب</Typography>

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="كلمة المرور الجديدة"
                            value={formData.password}
                            onChange={handleChange}
                            margin="dense"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                            label="تأكيد كلمة المرور الجديدة"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            margin="dense"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Paper> */}

                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">معلومات إضافية</Typography>
                        <Autocomplete
                            options={[
                                { label: 'داخل المدرسة', value: 'in_school' },
                                { label: 'في الطريق', value: 'on_way' },
                                { label: 'في المنزل', value: 'at_home' }
                            ]}
                            getOptionLabel={(option) => option.label}
                            value={{
                                label: formData.student_status === 'in_school' ? 'داخل المدرسة' :
                                    formData.student_status === 'on_way' ? 'في الطريق' : 'في المنزل',
                                value: formData.student_status
                            }}
                            onChange={(e, newValue) => handleAutocompleteChange("student_status", newValue?.value || '')}
                            renderInput={(params) => <TextField {...params} label="حالة الطالب" margin="dense" />}
                        />
                        <TextField fullWidth name="medical_info" label="معلومات صحية" value={formData.medical_info} onChange={handleChange} margin="dense" />
                    </Paper>

                    {/* <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">الرسوم والدفع</Typography>
                        <Autocomplete
                            options={schoolFees}
                            getOptionLabel={(option) => option.name}
                            value={schoolFees.find(f => f.id === formData.school_fee_id) || null}
                            onChange={(e, value) => handleAutocompleteChange("school_fee_id", value?.id || '')}
                            renderInput={(params) => <TextField {...params} label="الرسوم" margin="dense" />}
                        />
                        <TextField fullWidth name="amount" label="المبلغ المدفوع" type="number" value={formData.amount} onChange={handleChange} margin="dense" />
                        <TextField fullWidth name="discount" label="الخصم" type="number" value={formData.discount} onChange={handleChange} margin="dense" />

                        <Autocomplete
                            options={[
                                { label: 'بدون خصم', value: 'none' },
                                { label: 'إخوة', value: 'siblings' },
                                { label: 'متفوق', value: 'top' },
                                { label: 'يتيم', value: 'orphans' },
                                { label: 'ابن معلم', value: 'teacher' }
                            ]}
                            getOptionLabel={(option) => option.label}
                            value={formData.discount_status ?
                                {
                                    label: formData.discount_status === 'none' ? 'بدون خصم' :
                                        formData.discount_status === 'siblings' ? 'إخوة' :
                                            formData.discount_status === 'top' ? 'متفوق' :
                                                formData.discount_status === 'orphans' ? 'يتيم' : 'ابن معلم',
                                    value: formData.discount_status
                                } : null}
                            onChange={(e, newValue) => handleAutocompleteChange("discount_status", newValue?.value || '')}
                            renderInput={(params) => <TextField {...params} label="حالة الخصم" margin="dense" />}
                        />

                        <Autocomplete
                            options={[
                                { label: 'قيد المعالجة', value: 'pending' },
                                { label: 'تم الدفع', value: 'completed' },
                                { label: 'فشل الدفع', value: 'failed' }
                            ]}
                            getOptionLabel={(option) => option.label}
                            value={formData.payment_status ?
                                {
                                    label: formData.payment_status === 'pending' ? 'قيد المعالجة' :
                                        formData.payment_status === 'completed' ? 'تم الدفع' : 'فشل الدفع',
                                    value: formData.payment_status
                                } : null}
                            onChange={(e, newValue) => handleAutocompleteChange("payment_status", newValue?.value || '')}
                            renderInput={(params) => <TextField {...params} label="حالة الدفع" margin="dense" />}
                        />

                        <TextField fullWidth name="paid_at" label="تاريخ الدفع" type="date" InputLabelProps={{ shrink: true }} value={formData.paid_at} onChange={handleChange} margin="dense" />
                    </Paper> */}

                    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            حفظ التعديلات
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}