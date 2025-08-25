import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';
import { getStudentById } from './../../../../../api/Admin/Students/getStudentById';
import { useNavigate } from 'react-router-dom';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#B39DDB', '#81D4FA', '#AED581', '#FFAB91', '#F06292', '#BA68C8', '#4DD0E1'];

const formatTime = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? 'ص' : 'م'}`;
};

const DailyScheduleAbout = ({ studentId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
    const [events, setEvents] = useState([]);

    // Popover state for event details
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);

    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    const fetchStudentSchedules = async () => {
        try {
            const student = await getStudentById(studentId);
            const schedules = student.classroom?.schedules || [];

            const parsed = schedules.map((item, i) => {
                const start = new Date(item.start_time);
                const _end = new Date(item.end_time || item.start_time);
                return {
                    id: item.id,
                    title: item.title,
                    date: start.getDate(),
                    month: start.getMonth(),
                    year: start.getFullYear(),
                    startTime: item.start_time,
                    endTime: item.end_time || item.start_time,
                    color: colors[i % colors.length],
                    dayIndex: start.getDay(),
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

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const generateCalendarWeeks = () => {
        const daysInMonth = getDaysInMonth(selectedYearValue, selectedMonth);
        const firstDay = getFirstDayOfMonth(selectedYearValue, selectedMonth);
        const weeks = [];
        let week = [];

        for (let i = 0; i < firstDay; i++) week.push(null);
        for (let day = 1; day <= daysInMonth; day++) {
            week.push(day);
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }
        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            weeks.push(week);
        }

        while (weeks.length < 5) weeks.push(Array(7).fill(null));
        return weeks;
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYearValue(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYearValue(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
    };

    const handleToday = () => {
        const now = new Date();
        setSelectedYearValue(now.getFullYear());
        setSelectedMonth(now.getMonth());
    };

    const calendarWeeks = generateCalendarWeeks();

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevMonth}><ChevronRight /></IconButton>
                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton onClick={handleNextMonth}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {arabicDays.map(day => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography fontWeight="bold" color="#308A9F">{day}</Typography>
                        </Grid>
                    ))}
                </Grid>

                <Box>
                    {calendarWeeks.map((week, i) => (
                        <Grid container spacing={1} key={i}>
                            {week.map((day, j) => {
                                const dayEvents = events.filter(
                                    e => e.date === day && e.month === selectedMonth && e.year === selectedYearValue
                                );
                                return (
                                    <Grid item xs key={j}>
                                        <Box sx={{
                                            border: day ? '1px solid #ddd' : 'none',
                                            minHeight: isMobile ? '14vh' : '16vh',
                                            bgcolor: '#fff',
                                            p: 1,
                                            borderRadius: 1
                                        }}>
                                            {day && (
                                                <>
                                                    <Typography fontWeight="bold" textAlign="end" color="#22385F">{day}</Typography>
                                                    <Box sx={{ mt: 1, maxHeight: '9vh', overflowY: 'auto' }}>
                                                        {dayEvents.map((event) => (
                                                            <Box
                                                                key={event.id}
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    bgcolor: event.color,
                                                                    p: 0.5,
                                                                    mb: 0.5,
                                                                    borderRadius: 1,
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => navigate(`/dashboard/student-schedule-details/${studentId}/${selectedYearValue}/${selectedMonth + 1}/${day}`)}
                                                            >
                                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                                    {event.title}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); handleOpenPopover(e, event); }}
                                                                >
                                                                    <SettingsRounded fontSize="small" sx={{ color: '#fff' }} />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ))}
                </Box>
            </Paper>

            {/* Popover لعرض تفاصيل الحدث */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 260 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: 'rtl' }}>
                        <Typography sx={{ color: '#22385F', fontWeight: 700, mb: .5 }}>
                            {selectedEvent.title || '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            التاريخ: {selectedYearValue}/{String(selectedMonth + 1).padStart(2, '0')}/{String(selectedEvent.date).padStart(2, '0')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            اليوم: {arabicDays[selectedEvent.dayIndex ?? 0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            الوقت: {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                        </Typography>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default DailyScheduleAbout;
