import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, useMediaQuery, useTheme,
    Select, MenuItem, FormControl
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getStudentById } from './../../../../../api/Admin/Students/getStudentById';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#B39DDB', '#81D4FA', '#AED581', '#FFAB91', '#F06292', '#BA68C8', '#4DD0E1'];

const WeeklySchedule1 = ({ studentId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [events, setEvents] = useState([]);

    function getFirstWeekOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    function getWeekDays(startDate) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    }

    function getWeekNumberInMonth(date) {
        const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const diffInDays = Math.floor((date - firstOfMonth) / (1000 * 60 * 60 * 24));
        return Math.floor(diffInDays / 7) + 1;
    }

    const fetchStudentSchedules = async () => {
        try {
            const student = await getStudentById(studentId);
            const schedules = student.classroom?.schedules || [];

            const parsed = schedules.map((item, i) => {
                const date = new Date(item.start_time);
                return {
                    id: item.id,
                    title: item.title,
                    date: date,
                    color: colors[i % colors.length],
                };
            });

            setEvents(parsed);
        } catch (error) {
            console.error('فشل في جلب الجدول:', error.message);
        }
    };

    useEffect(() => {
        fetchStudentSchedules();
    }, [studentId]);

    useEffect(() => {
        const firstWeek = getFirstWeekOfMonth(selectedYear, selectedMonth);
        setCurrentWeekStart(firstWeek);
    }, [selectedMonth, selectedYear]);

    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);

        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
        if (prev < firstDayOfMonth) return;

        setCurrentWeekStart(prev);
    };

    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);

        const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        if (next > lastDayOfMonth) return;

        setCurrentWeekStart(next);
    };

    const handleToday = () => {
        const now = new Date();
        setSelectedMonth(now.getMonth());
        setSelectedYear(now.getFullYear());
        setCurrentWeekStart(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const weekDays = getWeekDays(currentWeekStart);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography fontWeight="bold" color="#22385F">
                        الأسبوع رقم {getWeekNumberInMonth(currentWeekStart)} من {arabicMonths[selectedMonth]}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevWeek}><ChevronRight /></IconButton>

                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleNextWeek}><ChevronLeft /></IconButton>
                    </Box>

                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                <Grid container spacing={1}>
                    {weekDays.map((date, i) => {
                        if (date.getMonth() !== selectedMonth) return null;

                        const dayEvents = events.filter(
                            e =>
                                e.date.getDate() === date.getDate() &&
                                e.date.getMonth() === date.getMonth() &&
                                e.date.getFullYear() === date.getFullYear()
                        );

                        return (
                            <Grid item xs={12} sm={6} md={3} lg={1.71} key={i}>
                                <Box sx={{
                                    border: '1px solid #ddd',
                                    minHeight: '18vh',
                                    bgcolor: '#fff',
                                    p: 1,
                                    borderRadius: 1
                                }}>
                                    <Typography fontWeight="bold" textAlign="end" color="#22385F">
                                        {arabicDays[date.getDay()]} - {date.getDate()}
                                    </Typography>
                                    <Box sx={{ mt: 1, maxHeight: '12vh', overflowY: 'auto' }}>
                                        {dayEvents.map((event, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    bgcolor: event.color,
                                                    p: 0.5,
                                                    mb: 0.5,
                                                    borderRadius: 1,
                                                    cursor: 'pointer',
                                                    transition: '0.2s',
                                                    '&:hover': { opacity: 0.9 }
                                                }}
                                                onClick={() =>
                                                    navigate(`/dashboard/student-schedule-details/${studentId}/${event.date.getFullYear()}/${event.date.getMonth() + 1}/${event.date.getDate()}`)
                                                }
                                            >
                                                <Typography variant="caption" sx={{ color: '#fff' }}>
                                                    {event.title}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>
        </Box>
    );
};

export default WeeklySchedule1;
