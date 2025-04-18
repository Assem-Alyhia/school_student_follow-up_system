import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

const Section2 = () => {
    const stages = [
        {
            title: 'المرحلة الثانوية',
            image: '/AcademicStages/1.png', 
            details: [
                { label: 'عدد الصفوف', value: '3 صفوف', icon: <SchoolIcon /> },
                { label: 'الفئة العمرية', value: '15-18 سنة', icon: <PeopleIcon /> },
                { label: 'عدد الطلاب', value: '200 طالب', icon: <PeopleIcon /> },
                { label: 'الصفوف', value: 'العاشر, الثاني عشر', icon: <SchoolIcon /> }, 
            ],
        },
        {
            title: 'المرحلة الإعدادية',
            image: '/AcademicStages/2.png',
            details: [
                { label: 'عدد الصفوف', value: '3 صفوف', icon: <SchoolIcon /> },
                { label: 'الفئة العمرية', value: '12-15 سنة', icon: <PeopleIcon /> },
                { label: 'عدد الطلاب', value: '200 طالب', icon: <PeopleIcon /> },
                { label: 'الصفوف', value: 'العاشر, الثاني عشر', icon: <SchoolIcon /> }, 
            ],
        },
        {
            title: 'المرحلة الابتدائية',
            image: '/AcademicStages/3.png', 
            details: [
                { label: 'عدد الصفوف', value: '6 صفوف', icon: <SchoolIcon /> },
                { label: 'الفئة العمرية', value: '6-12 سنة', icon: <PeopleIcon /> },
                { label: 'عدد الطلاب', value: '200 طالب', icon: <PeopleIcon /> },
                { label: 'الصفوف', value: 'الأول, الثاني, الثالث', icon: <SchoolIcon /> }, 
            ],
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {stages.map((stage, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{
                            padding: 2,
                            textAlign: 'center',
                            backgroundColor: '#F5F5F5',
                            border: '1px solid #308A9F',
                            borderRadius: 2,
                        }}>
                            <Box
                                component="img"
                                src={stage.image}
                                sx={{
                                    width: '100%',
                                    // height: '15rem',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    mb: 2,
                                }}
                            />

                            <Box sx={{
                                backgroundColor: '#E0E0E0',
                                border: '1px solid #BDBDBD',
                                borderRadius: '4px',
                                padding: '8px',
                                mb: 2,
                            }}>
                                <Typography variant="h6" sx={{ color: '#308A9F' }}>
                                    {stage.title}
                                </Typography>
                            </Box>

                            {/* عدد الصفوف والفئة العمرية مع الأيقونات */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                    <Typography variant="body2" sx={{ color: '#22385F' }}>
                                        عدد الصفوف
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {stage.details[0].value}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <PeopleIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                    <Typography variant="body2" sx={{ color: '#22385F' }}>
                                        الفئة العمرية
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {stage.details[1].value}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* عدد الطلاب والصفوف مع الأيقونات */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <PeopleIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                    <Typography variant="body2" sx={{ color: '#22385F' }}>
                                        عدد الطلاب
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {stage.details[2].value}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                    <Typography variant="body2" sx={{ color: '#22385F' }}>
                                        الصفوف
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {stage.details[3].value}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* زر إضافة صف وزر عرض التفاصيل */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: 'column' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    fullWidth
                                    sx={{
                                        background: 'linear-gradient(90deg, #308A9F,#22385F)',
                                        '&:hover': { backgroundColor: '#308A9F' },
                                        fontSize: '14px',
                                        padding: '6px 12px',
                                    }}
                                >
                                    إضافة صف
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<InfoIcon />}
                                    fullWidth
                                    sx={{
                                        borderColor: '#308A9F',
                                        color: '#308A9F',
                                        '&:hover': { borderColor: '#22385F' },
                                    }}
                                >
                                    عرض التفاصيل
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Section2;