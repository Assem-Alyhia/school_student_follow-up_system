import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import NavigationStudentDetails from './NavigationStudentDetails';
import NavigationDailySchedule from './NavigationDailySchedule';
import NavigationMonthlySchedule from './NavigationMonthlySchedule';
import NavigationWeeklySchedule from './NavigationWeeklySchedule';


const NavigationSectionStudent = () => {
    const [activeButton, setActiveButton] = useState('تفاصيل الطالب');

    const handleButtonClick = (buttonName) => setActiveButton(buttonName);
    const isActive = (name) => activeButton === name;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('تفاصيل الطالب')}
                        sx={{
                            bgcolor: isActive('تفاصيل الطالب') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        تفاصيل الطالب
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم الشهري')}
                        sx={{
                            bgcolor: isActive('التقويم الشهري') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        التقويم الشهري
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم الاسبوعي')}
                        sx={{
                            bgcolor: isActive('التقويم الاسبوعي') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        التقويم الاسبوعي
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم اليومي')}
                        sx={{
                            bgcolor: isActive('التقويم اليومي') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        التقويم اليومي
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('الرسوم')}
                        sx={{
                            bgcolor: isActive('الرسوم') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        الرسوم
                    </Button>

                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'تفاصيل الطالب' &&
                        <NavigationStudentDetails />
                    }
                    {activeButton === 'التقويم الشهري' &&
                        <NavigationMonthlySchedule />
                    }
                    {activeButton === 'التقويم الاسبوعي' &&
                        <NavigationWeeklySchedule />
                    }
                    {activeButton === 'التقويم اليومي' &&
                        <NavigationDailySchedule />
                    }

                    {/* {activeButton === 'الرسوم' &&
                        <NavigationFees />

                    } */}

                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationSectionStudent;
