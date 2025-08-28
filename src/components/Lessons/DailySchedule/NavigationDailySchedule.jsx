import { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import DailySchedule from './MonthlyCalendar/Section2';
import BreakAndHolidays from './MonthlyCalendar/Section3';
import WeeklyCalendar from './WeeklyCalendar/Section1';
import DailyCalendar from './DailyCalendar/Section1';


const NavigationDailySchedule = () => {
    const [activeButton, setActiveButton] = useState('التقويم الشهري');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#F5F5F5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم الشهري')}
                        sx={{
                            backgroundColor: activeButton === 'التقويم الشهري' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        التقويم الشهري
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم الاسبوعي')}
                        sx={{
                            backgroundColor: activeButton === 'التقويم الاسبوعي' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        التقويم الاسبوعي
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('التقويم اليومي')}
                        sx={{
                            backgroundColor: activeButton === 'التقويم اليومي' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        التقويم اليومي
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'التقويم الشهري' && (
                        <Typography variant="body1">
                            <DailySchedule />
                            <BreakAndHolidays />
                        </Typography>
                    )}
                    {activeButton === 'التقويم الاسبوعي' && (
                        <Typography variant="body1">
                            <WeeklyCalendar/>
                        </Typography>
                    )}
                    {activeButton === 'التقويم اليومي' && (
                        <Typography variant="body1">
                            <DailyCalendar/>
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationDailySchedule;