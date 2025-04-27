import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import TeacherProfile from './teacherDetails/index';
import TeacherDailySchedule from './teacherDailySchedule';

const NavigationSectionTeachers = () => {
    const [activeButton, setActiveButton] = useState('تفاصيل المعلم');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <Box sx={{ padding: "0 1rem" }}>
            <Paper elevation={0} sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('تفاصيل المعلم')}
                        sx={{
                            backgroundColor: activeButton === 'تفاصيل المعلم' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        تفاصيل المعلم
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('الجدول اليومي')}
                        sx={{
                            backgroundColor: activeButton === 'الجدول اليومي' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        الجدول اليومي
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('الدضور والإجازات')}
                        sx={{
                            backgroundColor: activeButton === 'الدضور والإجازات' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        الدضور والإجازات
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'تفاصيل المعلم' && (
                        <Typography variant="body1">
                            <TeacherProfile/>
                        </Typography>
                    )}
                    {activeButton === 'الجدول اليومي' && (
                        <Typography variant="body1">
                            <TeacherDailySchedule/>
                        </Typography>
                    )}
                    {activeButton === 'الدضور والإجازات' && (
                        <Typography variant="body1">
                            <BreakAndHolidays />
                            
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationSectionTeachers;