import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import Section1 from './DailySchedule/Section1';
import DailyScheduleSection1 from './DailySchedule/Section2';
import BreakAndHolidays from './DailySchedule/Section3';
import ExamScheduleSection1 from './ExamSchedule/Section1/index';
import ExamScheduleTable from './ExamSchedule/Section2';
import PaginationSection from './../../layout/PaginationSection';
import ArabicCalendar from './activityTables/Section2';
import UpcomingEvents from './activityTables/Section3';

const NavigationSectionLessone = () => {
    const [activeButton, setActiveButton] = useState('الجدول اليومي'); 

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName); 
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#F5F5F5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                        onClick={() => handleButtonClick('جدول الامتحانات')}
                        sx={{
                            backgroundColor: activeButton === 'جدول الامتحانات' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        جدول الامتحانات
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('النشاط')}
                        sx={{
                            backgroundColor: activeButton === 'النشاط' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        النشاط
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'الجدول اليومي' && (
                        <Typography variant="body1">
                            <Section1 />
                            <DailyScheduleSection1/>
                            <BreakAndHolidays/>
                        </Typography>
                    )}
                    {activeButton === 'جدول الامتحانات' && (
                        <Typography variant="body1">
                            <ExamScheduleSection1 />
                            <ExamScheduleTable/>
                            <PaginationSection/>
                        </Typography>
                    )}
                    {activeButton === 'النشاط' && (
                        <Typography variant="body1">
                            <Section1 />
                            <ArabicCalendar/>
                            <UpcomingEvents/>
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationSectionLessone;