import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { getLevelsStats } from '../../../api/Admin/AcademicStages/getLevelsStats';
import AddClassroomModal from './../../Classes/AddClassroomModal/index';

const Section2 = () => {
    const [levelsData, setLevelsData] = useState(null);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLevelsStats();
                setLevelsData(data);
            } catch (error) {
                console.error("خطأ في جلب بيانات المراحل:", error);
            }
        };
        fetchData();
    }, []);

    const stages = [
        {
            key: 'high_school',
            title: 'المرحلة الثانوية',
            image: '/AcademicStages/1.png',
            ageRange: '15-18 سنة',
            grades: 'العاشر, الحادي عشر, الثاني عشر',
        },
        {
            key: 'middle_school',
            title: 'المرحلة الإعدادية',
            image: '/AcademicStages/2.png',
            ageRange: '12-15 سنة',
            grades: 'السابع, الثامن, التاسع',
        },
        {
            key: 'elementary_school',
            title: 'المرحلة الابتدائية',
            image: '/AcademicStages/3.png',
            ageRange: '6-12 سنة',
            grades: 'الأول, الثاني, الثالث',
        },
    ];

    const handleOpenAdd = (stage) => {
        setSelectedStage(stage);
        setOpenAddModal(true);
    };

    const handleCloseAdd = () => {
        setOpenAddModal(false);
        setSelectedStage(null);
    };

    const handleCreated = () => {
        handleCloseAdd();
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
                                        <SchoolIcon sx={{ fontSize: '40px', color: '#308A9F' }} />
                                        <Typography variant="body2" sx={{ color: '#22385F' }}>
                                            الصفوف
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {stage.grades}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: 'column' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        fullWidth
                                        onClick={() => handleOpenAdd(stage)}
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
                    );
                })}
            </Grid>

            <AddClassroomModal
                open={openAddModal}
                onClose={handleCloseAdd}
                onCreated={handleCreated}              
                stageKey={selectedStage?.key}          
                stageTitle={selectedStage?.title}       
            />
        </Box>
    );
};

export default Section2;
