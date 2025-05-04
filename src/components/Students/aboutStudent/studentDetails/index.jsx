import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Button,
    Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const studentData = {
    id: 'AD9892433',
    name: 'Joann Michael',
    classInfo: 'الصف الخامس، الشعبة الأولى',
    registrationNumber: '#12345',
    gender: 'ذكر',
    releaseDate: '10/05/2025',
    email: 'Pateiprince9595@gmail.com',
    avatar: '/Students/1.jpg',
    address: {
        city: 'إعزاز',
        full: 'حي القلعة، شارع المخفر، قرب المركز الثقافي'
    },
    father: {
        name: 'Joann Michael',
        phone: '+123 456 789 123',
        email: 'Pateiprince9595@gmail.com',
        avatar: '/Students/father.png'
    },
    mother: {
        name: 'Joann Michael',
        phone: '+123 456 789 123',
        email: 'Pateiprince9595@gmail.com',
        avatar: '/Students/mother.png'
    },
    siblings: [
        { name: 'Julie Michael', grade: 'الصف الثالث الشخصية الأولى', avatar: '/Students/sibling1.png' },
        { name: 'Richard Michael', grade: 'الصف الرابع الشخصية الأولى', avatar: '/Students/sibling2.png' },
    ],
    supervisor: { name: 'Julie Michael', avatar: '/Students/supervisor.png' },
    driver: { name: 'Richard Michael', avatar: '/Students/driver.png' },
    previousSchool: {
        name: 'مدرسة الأوائل',
        address: 'شارع القصور، حي القصور، حلب، سوريا'
    },
    medical: {
        condition: 'الربو',
        prescription: 'بخاخ الربو (Ventolin) مرتين يومياً'
    },
    transport: {
        departure: '7:15 صباحاً',
        return: '2:45 ظهراً',
        notes: [
            'يجب على الطلاب الحضور إلى نقطة التجمع قبل 7:10 صباحاً',
            'في حال تغييرات طارئة يتم التواصل مع المشرفة مباشرة'
        ]
    },
    documents: [
        { name: 'BirthCertificate.pdf', icon: <PictureAsPdfIcon sx={{ color: '#f44336', fontSize: '2rem' }} />, link: '#' }
    ]
};

const StudentDetails = () => {
    const gradientColor = 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)';

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{ padding: 2, direction: 'rtl', backgroundColor: '#f5f6fa' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    {/* Sidebar */}
                    <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', border: '1px solid #308A9F', borderRadius: 2 }}>
                        <Box sx={{ position: 'relative', width: 100, height: 100, margin: 'auto', mb: 3 }}>
                            <Avatar src={studentData.avatar} sx={{ width: '100%', height: '100%', borderRadius: 2 }} />
                            <Box sx={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #F5F5F5' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#308A9F', mb: 1 }}>{studentData.name}</Typography>
                        <Typography sx={{ color: '#586E75', mb: 2 }}>{studentData.classInfo}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
                            <Typography sx={{ color: '#308A9F' }}>رقم التسجيل:<br /><span style={{ color: '#586E75' }}>{studentData.registrationNumber}</span></Typography>
                            <Typography sx={{ color: '#308A9F' }}>الجنس:<br /><span style={{ color: '#586E75' }}>{studentData.gender}</span></Typography>
                            <Typography sx={{ color: '#308A9F' }}>تاريخ الانضمام:<br /><span style={{ color: '#586E75' }}>{studentData.releaseDate}</span></Typography>
                        </Box>
                        <Box sx={{ background: gradientColor, borderRadius: 1, p: 1, mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '14px' }}>{studentData.email}</Typography>
                        </Box>
                        <Button fullWidth variant="outlined" sx={{ color: '#308A9F', borderColor: '#308A9F', mt: 1, mb: 2 }}>أضف الرسوم</Button>
                    </Paper>

                    {/* Address */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>العنوان</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>المدينة</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{studentData.address.city}</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>العنوان</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{studentData.address.full}</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Siblings */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>معلومات الأخوة</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            {studentData.siblings.map((sibling, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={sibling.avatar} sx={{ width: 50, height: 50, ml: 1 }} />
                                    <Box>
                                        <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{sibling.name}</Typography>
                                        <Typography sx={{ color: '#586E75' }}>{sibling.grade}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* Transport Info Below Siblings */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>معلومات النقل</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>رقم الحافلة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>R1234567</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>المسار</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>54588</Typography></Grid>
                                <Grid item xs={12}><Typography sx={{ color: '#586E75' }}>نقطة التجمع</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>مقابل ساحة القلعة، حي القلعة، حلب</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Supervision */}
                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 1.5 }}><Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>الإشراف والنقل</Typography></Box>
                        <Box sx={{ p: 2 }}>
                            {[{ label: 'المشرفة', ...studentData.supervisor }, { label: 'السائق', ...studentData.driver }].map((person, i) => (
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

                <Grid item xs={12} md={8}>
                    {/* Parents Info */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 ,padding:'0 0 3rem'}}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل أولياء الأمور</Typography></Box>
                        <Box sx={{ padding:' 1rem 2rem' }}>
                            {[studentData.father, studentData.mother].map((parent, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar src={parent.avatar} sx={{ width: 80, height: 80, borderRadius: 2 }} />
                                    <Box sx={{ margin:'1rem 0' }}>
                                        <Typography sx={{ color: '#586E75' }}><strong style={{ color: '#308A9F' }}>رقم الهاتف:</strong> {parent.phone}</Typography>
                                        <Typography sx={{ color: '#586E75' }}><strong style={{ color: '#308A9F' }}>البريد الإلكتروني:</strong> {parent.email}</Typography>
                                        <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>{parent.name}</Typography>
                                        <Typography sx={{ color: '#586E75' }}>{i === 0 ? 'الأب' : 'الأم'}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* Documents */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>المستندات</Typography></Box>
                        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button variant="contained" sx={{ background: gradientColor, color: '#fff' }} onClick={handlePrint}>تنزيل</Button>
                            <Typography sx={{ fontWeight: 'bold', color: '#308A9F' }}>{studentData.documents[0].name}</Typography>
                            {studentData.documents[0].icon}
                        </Box>
                    </Paper>

                    {/* Previous School */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل المدرسة السابقة</Typography></Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>اسم المدرسة السابقة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.previousSchool.name}</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>عنوان المدرسة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.previousSchool.address}</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Medical */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>السجل الطبي</Typography></Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>الأمراض المزمنة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.medical.condition}</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>الوصفة الطبية</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.medical.prescription}</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Transport */}
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}><Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>تفاصيل النقل</Typography></Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>موعد الانطلاق</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.transport.departure}</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>موعد العودة</Typography><Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>{studentData.transport.return}</Typography></Grid>
                                <Grid item xs={12}><Typography sx={{ color: '#586E75' }}>الملاحظات</Typography>
                                    {studentData.transport.notes.map((note, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20, mr: 1 ,ml:1 }} />
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