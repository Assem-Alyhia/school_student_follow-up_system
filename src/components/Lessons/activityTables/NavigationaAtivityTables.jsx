import  { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import EventScheduleTable from './MonthlyCalendar/Section2';
import UpcomingEvents from './MonthlyCalendar/Section3';
import WeeklyEventsCalendar from './WeeklyCalendar/Section1';
import DailyEventsCalendar from './DailyCalendar/Section1';



const NavigationActivityTables = () => {
    const [activeButton, setActiveButton] = useState('التقويم الشهري' );

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

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('اضافة حدث')}
                        sx={{
                            backgroundColor: activeButton === 'اضافة حدث' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '6px 12px',
                            flexGrow: 1,
                        }}
                    >
                        اضافة حدث
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'التقويم الشهري' && (
                        <Typography variant="body1">
                            <EventScheduleTable/>
                            <UpcomingEvents/>
                        </Typography>
                    )}
                    {activeButton === 'التقويم الاسبوعي' && (
                        <Typography variant="body1">
                            <WeeklyEventsCalendar/>
                        </Typography>
                    )}
                    {activeButton === 'التقويم اليومي' && (
                        <Typography variant="body1">
                            <DailyEventsCalendar/>
                        </Typography>
                    )}
                    {activeButton === 'اضافة حدث' && (
                        <Typography variant="body1">

                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NavigationActivityTables;