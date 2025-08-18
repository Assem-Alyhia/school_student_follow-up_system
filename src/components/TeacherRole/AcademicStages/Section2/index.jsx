import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { getTeacherLevels } from '../../../../api/Teacher/Levels/getTeacherLevels';

const Section2 = () => {
    const [levelsData, setLevelsData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const raw = await getTeacherLevels();
                const d = raw?.data ?? raw ?? {};
                setLevelsData({
                    high_school: d.high_school ?? { classrooms: '...', students: '...' },
                    middle_school: d.middle_school ?? { classrooms: '...', students: '...' },
                    elementary_school: d.elementary_school ?? { classrooms: '...', students: '...' },
                });
            } catch (error) {
                console.error('خطأ في جلب بيانات المراحل:', error);
                setLevelsData({
                    high_school: { classrooms: '...', students: '...' },
                    middle_school: { classrooms: '...', students: '...' },
                    elementary_school: { classrooms: '...', students: '...' },
                });
            }
        })();
    }, []);

    // أسماء المراحل + الفئة العمرية + عدد المواد ثابت
    const stages = [
        {
            key: 'high_school',
            title: 'المرحلة الثانوية',
            image: '/AcademicStages/1.png',
            ageRange: '15-18 سنة',
            subjectsCount: 10,
            grades: 'العاشر، الحادي عشر، الثاني عشر',
        },
        {
            key: 'middle_school',
            title: 'المرحلة الإعدادية',
            image: '/AcademicStages/2.png',
            ageRange: '12-15 سنة',
            subjectsCount: 9,
            grades: 'السابع، الثامن، التاسع',
        },
        {
            key: 'elementary_school',
            title: 'المرحلة الابتدائية',
            image: '/AcademicStages/3.png',
            ageRange: '6-12 سنة',
            subjectsCount: 8,
            grades: 'الأول، الثاني، الثالث',
        },
    ];

    const handleDetails = (stageKey) => {
        // عدّل هذا المسار حسب الراوتر لديك
        navigate(`/teacherDashboard/levels/${stageKey}`);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {stages.map((stage) => {
                    const level = levelsData?.[stage.key] || { classrooms: '...', students: '...' };

                    return (
                        <Grid item xs={12} sm={6} md={4} key={stage.key}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 2,
                                    textAlign: 'center',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #308A9F',
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={stage.image}
                                    alt={stage.title}
                                    sx={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        mb: 2,
                                    }}
                                />

                                <Box
                                    sx={{
                                        backgroundColor: '#E0E0E0',
                                        border: '1px solid #BDBDBD',
                                        borderRadius: '4px',
                                        padding: '8px',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: '#308A9F' }}>
                                        {stage.title}
                                    </Typography>
                                </Box>

                                {/* الصف العلوي: عدد الصفوف + الفئة العمرية */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <SchoolIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                        <Typography variant="body2" sx={{ color: '#22385F' }}>
                                            عدد الصفوف
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {level.classrooms} صفوف
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <PeopleIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                        <Typography variant="body2" sx={{ color: '#22385F' }}>
                                            الفئة العمرية
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {stage.ageRange}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* الصف السفلي: عدد الطلاب + عدد المواد (ثابت) */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <PeopleIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                        <Typography variant="body2" sx={{ color: '#22385F' }}>
                                            عدد الطلاب
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {level.students} طالب
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <MenuBookIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                        <Typography variant="body2" sx={{ color: '#22385F' }}>
                                            عدد المواد
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {stage.subjectsCount} مادة
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* زر عرض التفاصيل فقط */}
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleDetails(stage.key)}
                                    sx={{
                                        borderColor: '#308A9F',
                                        color: '#308A9F',
                                        '&:hover': { borderColor: '#22385F' },
                                        mt: 1,
                                    }}
                                >
                                    عرض التفاصيل
                                </Button>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Section2;
