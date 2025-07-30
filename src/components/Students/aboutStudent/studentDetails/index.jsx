import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getStudentById } from '../../../../api/Admin/Students/getStudentById';

const StudentDetails = () => {
    const { id } = useParams();
    const [studentData, setStudentData] = useState(null);
    const gradientColor = 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)';

    useEffect(() => {
        if (id) {
            getStudentById(id)
                .then((data) => setStudentData(data))
                .catch((error) => console.error(error.message));
        }
    }, [id]);

    const handlePrint = () => window.print();

    if (!studentData) return <Typography sx={{ padding: 5 }}>جاري تحميل البيانات...</Typography>;

    return (
        <Box sx={{ padding: 2, direction: 'rtl', backgroundColor: '#f5f6fa' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    {/* Sidebar */}
                    <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', border: '1px solid #308A9F', borderRadius: 2 }}>
                        <Box sx={{ position: 'relative', width: 100, height: 100, margin: 'auto', mb: 3 }}>
                            <Avatar src={studentData.user?.image || '/Students/default.jpg'} sx={{ width: '100%', height: '100%', borderRadius: 2 }} />
                            <Box sx={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #F5F5F5' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#308A9F', mb: 1 }}>{studentData.name}</Typography>
                        <Typography sx={{ color: '#586E75', mb: 2 }}>{studentData.classroom?.name || '---'}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
                            <Typography sx={{ color: '#308A9F' }}>رقم التسجيل:<br /><span style={{ color: '#586E75' }}>{studentData.prefix}</span></Typography>
                            <Typography sx={{ color: '#308A9F' }}>الجنس:<br /><span style={{ color: '#586E75' }}>{studentData.gender === 'male' ? 'ذكر' : 'أنثى'}</span></Typography>
                            <Typography sx={{ color: '#308A9F' }}>تاريخ الانضمام:<br /><span style={{ color: '#586E75' }}>{new Date(studentData.enrollment_date).toLocaleDateString('ar-EG')}</span></Typography>
                        </Box>
                        <Box sx={{ background: gradientColor, borderRadius: 1, p: 1, mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '14px' }}>{studentData.user?.email || '---'}</Typography>
                        </Box>
                        <Button fullWidth variant="outlined" sx={{ color: '#308A9F', borderColor: '#308A9F', mt: 1, mb: 2 }}>أضف الرسوم</Button>
                    </Paper>

                    {/* العنوان */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>العنوان</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>المدينة</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{studentData.address?.split('\n')[1] || '---'}</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>العنوان</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{studentData.address?.split('\n')[0] || '---'}</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* الأخوة */}
                    {studentData.siblings?.length > 0 && (
                        <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                            <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>معلومات الأخوة</Typography></Box>
                            <Box sx={{ p: 2 }}>
                                {studentData.siblings.map((sibling, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar src={`/Students/sibling${index + 1}.png`} sx={{ width: 50, height: 50, ml: 1 }} />
                                        <Box>
                                            <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{sibling.name}</Typography>
                                            <Typography sx={{ color: '#586E75' }}>{sibling.gender || '---'}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}

                    {/* الإشراف والنقل */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>الإشراف والنقل</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            {[{
                                label: 'المشرفة',
                                name: studentData.supervisor?.name || '---',
                                avatar: '/Students/supervisor.png'
                            }, {
                                label: 'السائق',
                                name: 'أبو محمد',
                                avatar: '/Students/driver.png'
                            }].map((person, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={person.avatar} sx={{ width: 50, height: 50, ml: 1 }} />
                                    <Box>
                                        <Typography sx={{ color: '#308A9F' }}>{person.label}</Typography>
                                        <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>{person.name}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* باقي القسم الرئيسي */}
                <Grid item xs={12} md={8}>
                    {/* أولياء الأمور */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2, padding: '0 0 3rem' }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل أولياء الأمور</Typography>
                        </Box>
                        <Box sx={{ padding: ' 1rem 2rem' }}>
                            {[{
                                name: studentData.parent.user?.name || '---',
                                phone: studentData.parent.user?.phone || '---',
                                email: studentData.parent.user?.email || '---',
                                avatar: '/Students/father.png',
                                role: 'الأب'
                            }, {
                                name: 'أم ' + studentData.parent.user?.name.split(' ')[0],
                                phone: studentData.parent.user?.phone || '---',
                                email: studentData.parent.user?.email || '---',
                                avatar: '/Students/mother.png',
                                role: 'الأم'
                            }].map((parent, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar src={parent.avatar} sx={{ width: 80, height: 80, borderRadius: 2 }} />
                                    <Box sx={{ margin: '1rem 0' }}>
                                        <Typography sx={{ color: '#586E75' }}>
                                            <strong style={{ color: '#308A9F' }}>رقم الهاتف:</strong> {parent.phone}
                                        </Typography>
                                        <Typography sx={{ color: '#586E75' }}>
                                            <strong style={{ color: '#308A9F' }}>البريد الإلكتروني:</strong> {parent.email}
                                        </Typography>
                                        <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>{parent.name}</Typography>
                                        <Typography sx={{ color: '#586E75' }}>{parent.role}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* المستندات */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>المستندات</Typography></Box>
                        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button variant="contained" sx={{ background: gradientColor, color: '#fff' }} onClick={handlePrint}>تنزيل</Button>
                            <Typography sx={{ fontWeight: 'bold', color: '#308A9F' }}>BirthCertificate.pdf</Typography>
                            <PictureAsPdfIcon sx={{ color: '#f44336', fontSize: '2rem' }} />
                        </Box>
                    </Paper>

                    {/* المدرسة السابقة */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل المدرسة السابقة</Typography></Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>اسم المدرسة السابقة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>مدرسة الأوائل</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>عنوان المدرسة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>شارع القصور، حي القصور، حلب، سوريا</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* السجل الطبي */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>السجل الطبي</Typography>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: '#586E75' }}>الأمراض المزمنة</Typography>
                                    <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.medical_info || '---'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: '#586E75' }}>الوصفة الطبية</Typography>
                                    <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>بخاخ الربو (Ventolin) مرتين يومياً</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* النقل */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل النقل</Typography>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>موعد الانطلاق</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>7:15 صباحاً</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>موعد العودة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>2:45 ظهراً</Typography></Grid>
                                <Grid item xs={12}><Typography sx={{ color: '#586E75' }}>الملاحظات</Typography>
                                    {['يجب على الطلاب الحضور إلى نقطة التجمع قبل 7:10 صباحاً', 'في حال تغييرات طارئة يتم التواصل مع المشرفة مباشرة'].map((note, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20, mr: 1, ml: 1 }} />
                                            <Typography sx={{ color: '#308A9F' }}>{note}</Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentDetails;