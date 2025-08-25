import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, FormControl, MenuItem, Select,
    useTheme, useMediaQuery, Popover, IconButton
} from '@mui/material';
import { SettingsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getStudentById } from '../../../../api/Admin/Students/getStudentById';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#B39DDB', '#81D4FA', '#AED581', '#FFAB91', '#F06292', '#BA68C8', '#4DD0E1'];

const formatTime = (d) => {
    if (!(d instanceof Date) || isNaN(d)) return '—';
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? 'ص' : 'م'}`;
};

const StudentDayTimeline = ({ studentId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(today.getDay());
    const [events, setEvents] = useState([]);

    // Popover state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);

    const fetchStudentSchedules = async () => {
        try {
            const res = await getStudentById(studentId);
            const schedules = res.classroom?.schedules || [];

            const parsed = schedules.map((item, i) => ({
                id: item.id,
                title: item.title,
                start_time: new Date(item.start_time),
                end_time: new Date(item.end_time || item.start_time),
                color: colors[i % colors.length],
            }));

            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب الجدول:', err.message);
        }
    };

    useEffect(() => {
        fetchStudentSchedules();
    }, [studentId]);

    const getDateByWeekAndDay = (year, month, weekNumber, dayOfWeek) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const firstWeekDay = firstDayOfMonth.getDay();
        const offsetToWeekStart = (7 - firstWeekDay) % 7;
        const startOfFirstWeek = new Date(year, month, 1 + offsetToWeekStart);
        const targetDate = new Date(startOfFirstWeek);
        targetDate.setDate(startOfFirstWeek.getDate() + (weekNumber - 1) * 7 + dayOfWeek);
        return targetDate;
    };

    const selectedDate = getDateByWeekAndDay(today.getFullYear(), selectedMonth, selectedWeek, selectedDay);

    const dayEvents = events.filter(
        (e) =>
            e.start_time.getDate() === selectedDate.getDate() &&
            e.start_time.getMonth() === selectedDate.getMonth() &&
            e.start_time.getFullYear() === selectedDate.getFullYear()
    );

    const handleEventClick = () => {
        navigate(`/dashboard/student-schedule-details/${studentId}/${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`);
    };

    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            <Paper sx={{ p: isMobile ? 1 : 3, direction: 'rtl' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <FormControl size="small" variant="outlined">
                        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            {arabicMonths.map((month, index) => (
                                <MenuItem key={index} value={index}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" variant="outlined">
                        <Select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
                            {[1, 2, 3, 4, 5].map((week) => (
                                <MenuItem key={week} value={week}>الأسبوع {week}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" variant="outlined">
                        <Select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                            {arabicDays.map((day, index) => (
                                <MenuItem key={index} value={index}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="h6" fontWeight="bold" color="#22385F" mb={2}>
                    {arabicDays[selectedDate.getDay()]} - {selectedDate.getDate()} {arabicMonths[selectedMonth]}
                </Typography>

                <Grid container spacing={2}>
                    {dayEvents.length === 0 && (
                        <Typography color="gray" textAlign="center" width="100%">
                            لا توجد حصص أو اختبارات في هذا اليوم
                        </Typography>
                    )}
                    {dayEvents.map((event) => (
                        <Grid item xs={12} key={event.id}>
                            <Box
                                sx={{
                                    bgcolor: event.color,
                                    p: 2,
                                    borderRadius: 2,
                                    color: '#fff',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    '&:hover': { opacity: 0.9 }
                                }}
                                onClick={handleEventClick}
                            >
                                <Typography fontWeight="bold">{event.title}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography fontSize="0.9rem">
                                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); handleOpenPopover(e, event); }}
                                    >
                                        <SettingsRounded fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 280 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: 'rtl' }}>
                        <Typography sx={{ color: '#22385F', fontWeight: 700, mb: .5 }}>
                            {selectedEvent.title || '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            التاريخ: {selectedDate.getFullYear()}/{String(selectedDate.getMonth() + 1).padStart(2, '0')}/{String(selectedDate.getDate()).padStart(2, '0')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            اليوم: {arabicDays[selectedDate.getDay()]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            الوقت: {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                        </Typography>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default StudentDayTimeline;
