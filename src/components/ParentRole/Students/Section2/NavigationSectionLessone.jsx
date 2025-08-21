import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import NavigationStudentDetails from './NavigationStudentDetails';
import NavigationDailySchedule from './NavigationDailySchedule';

// import NavigationStudentDetails from './StudentDetails/NavigationStudentDetails';
// import NavigationDailySchedule from './DailySchedule/NavigationDailySchedule';
// import NavigationFees from './Fees/NavigationFees';
// import NavigationExamResults from './ExamResults/NavigationExamResults';

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
                        onClick={() => handleButtonClick('الجدول اليومي')}
                        sx={{
                            bgcolor: isActive('الجدول اليومي') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        الجدول اليومي
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

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('نتائج الامتحانات')}
                        sx={{
                            bgcolor: isActive('نتائج الامتحانات') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        نتائج الامتحانات
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'تفاصيل الطالب' &&
                        <NavigationStudentDetails />
                    }
                    {activeButton === 'الجدول اليومي' &&
                        <NavigationDailySchedule />
                    }

                    {/* {activeButton === 'الرسوم' &&
                        <NavigationFees />

                    }
                    {activeButton === 'نتائج الامتحانات' &&
                        <NavigationExamResults />
                    } */}
                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationSectionStudent;
