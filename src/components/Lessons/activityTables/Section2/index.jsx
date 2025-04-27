import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Grid,
    MenuItem,
    Select,
    FormControl,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Today
} from '@mui/icons-material';

const ArabicCalendar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // Arabic day names
    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    // Sample events data matching your image
    const events = {
        1: ['صدار الخريج'],
        3: ['الأديب الأول', 'المكان الرابع الثلاثي'],
        4: ['مقدمة إزالة التدريبية والكهربائية'],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        12: [],
        19: [],
        26: [],
        30: ['الأشقاء الأول، الفور'],
        15: ['الجماع الأول، العمر'],
        25: ['الأحمد أوليد، العمر']
    };

    // Generate years for dropdown
    const years = Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i);

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Generate calendar weeks (5 rows)
    const generateCalendarWeeks = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
        const weeks = [];
        let currentWeek = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            currentWeek.push(null);
        }

        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            currentWeek.push(i);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        // Fill the last week with empty cells if needed
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        // Ensure we have exactly 5 weeks (rows)
        while (weeks.length < 5) {
            weeks.push(Array(7).fill(null));
        }

        return weeks.slice(0, 5); // Return only 5 weeks
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const handleToday = () => {
        const today = new Date();
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth());
    };

    const calendarWeeks = generateCalendarWeeks();

    // Colors for different event types
    const eventColors = {
        'صدار الخريج': '#FFD700',
        'الأديب الأول': '#87CEEB',
        'المكان الرابع الثلاثي': '#98FB98',
        'مقدمة إزالة التدريبية والكهربائية': '#FFA07A',
        'الأشقاء الأول، الفور': '#DDA0DD',
        'الجماع الأول، العمر': '#FF6347',
        'الأحمد أوليد، العمر': '#20B2AA'
    };

    return (
        <Box sx={{
            width: '100%',
            height: '120vh',
            p: isMobile ? 1 : 3,
            bgcolor: '#f5f7fa',
            overflow: 'auto'
        }}>
            <Paper elevation={3} sx={{
                width: '100%',
                height: '100%',
                p: isMobile ? 1 : 3,
                direction: 'rtl',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Calendar Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevMonth} size="small" sx={{ color: '#308A9F' }}>
                            <ChevronRight />
                        </IconButton>

                        <FormControl variant="standard" size="small">
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                sx={{ minWidth: 120, color: '#22385F', fontWeight: 'bold' }}
                            >
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="standard" size="small">
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                sx={{ minWidth: 100, color: '#22385F', fontWeight: 'bold' }}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleNextMonth} size="small" sx={{ color: '#308A9F' }}>
                            <ChevronLeft />
                        </IconButton>
                    </Box>

                    <IconButton onClick={handleToday} size="small" sx={{ color: '#308A9F' }}>
                        <Today fontSize="small" />
                    </IconButton>
                </Box>

                {/* Day Names */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {arabicDays.map((day) => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" sx={{
                                color: '#308A9F',
                                fontSize: isMobile ? '0.8rem' : '1rem'
                            }}>
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar Weeks */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {calendarWeeks.map((week, weekIndex) => (
                        <Grid container key={weekIndex} spacing={1} sx={{ flexGrow: 1 }}>
                            {week.map((day, dayIndex) => (
                                <Grid item xs key={`${weekIndex}-${dayIndex}`} sx={{
                                    minHeight: isMobile ? '16vh' : '18vh',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: day ? '#ffffff' : 'transparent',
                                            border: day ? '1px solid #e0e0e0' : 'none',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {day && (
                                            <>
                                                <Typography variant="body1" fontWeight="bold" sx={{
                                                    color: '#22385F',
                                                    alignSelf: 'flex-end',
                                                    fontSize: isMobile ? '0.9rem' : '1.1rem'
                                                }}>
                                                    {day}
                                                </Typography>

                                                <Box sx={{
                                                    mt: 1,
                                                    flexGrow: 1,
                                                    overflow: 'auto',
                                                    '&::-webkit-scrollbar': { display: 'none' }
                                                }}>
                                                    {events[day]?.map((event, i) => (
                                                        <Box key={i} sx={{
                                                            bgcolor: eventColors[event] || '#f0f0f0',
                                                            p: 0.5,
                                                            mb: 0.5,
                                                            borderRadius: '4px',
                                                            fontSize: isMobile ? '0.65rem' : '0.75rem'
                                                        }}>
                                                            <Typography variant="caption" sx={{ color: '#000' }}>
                                                                {event}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default ArabicCalendar;