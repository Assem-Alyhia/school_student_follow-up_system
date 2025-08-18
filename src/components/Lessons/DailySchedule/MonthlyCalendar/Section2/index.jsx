import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover, Button
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';

import { getDailySchedule } from '../../../../../api/Admin/DailySchedule/getDailySchedule';
import { getAllClassrooms } from '../../../../../api/Admin/Classrooms/getAllClassrooms';
import { getAllAcademicYears } from '../../../../../api/Admin/AcademicYears/getAllAcademicYears';
import { deleteSchedule } from '../../../../../api/Admin/Schedules/deleteSchedule';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#FFD700', '#90CAF9', '#A5D6A7', '#FFCC80', '#F48FB1', '#CE93D8', '#B2DFDB'];

// صياغة الوقت 12 ساعة مع ص/م
const formatTime = (iso) => {
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? 'ص' : 'م'}`;
};

const DailySchedule = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());

    const [classrooms, setClassrooms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');

    const [events, setEvents] = useState([]);

    // لحالة الـ Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);

    const handleOpenPopover = (ev, event) => {
        setAnchorEl(ev.currentTarget);
        setSelectedEvent(event);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    const fetchClassroomsAndYears = async () => {
        try {
            const [classroomRes, yearRes] = await Promise.all([
                getAllClassrooms(1, 100),
                getAllAcademicYears()
            ]);
            setClassrooms(classroomRes.data);
            setAcademicYears(yearRes);

            if (classroomRes.data.length) setSelectedClassroom(classroomRes.data[0].id);
            if (yearRes.length) {
                setSelectedYearId(yearRes[0].id);
                const yearStart = new Date(yearRes[0].start_date).getFullYear();
                setSelectedYearValue(yearStart);
            }
        } catch (err) {
            console.error('فشل في جلب البيانات:', err.message);
        }
    };

    const fetchSchedule = async () => {
        if (!selectedClassroom || !selectedYearValue) return;
        try {
            const data = await getDailySchedule(selectedClassroom, selectedYearValue);
            const parsed = data.map((item, i) => {
                const start = new Date(item.start_time);
                return {
                    id: item.id,
                    title: item.title,
                    classroomName: item.classroom_name || item.classroom || '—',
                    startTime: item.start_time,
                    endTime: item.end_time,
                    dayIndex: start.getDay(),
                    date: start.getDate(),
                    month: start.getMonth(),
                    color: colors[i % colors.length],
                };
            });
            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب الجدول:', err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSchedule(id);
            setEvents(prev => prev.filter(event => event.id !== id));
            handleClosePopover();
        } catch (error) {
            console.error('فشل في حذف الحدث:', error.message);
        }
    };

    // افتراضي: افتح مودال التعديل الخاص بك هنا
    const handleEdit = (event) => {
        // TODO: اربط بمودال التعديل لديك (تمرير event.id لفتح AddLessonModal في وضع تعديل)
        console.log('edit schedule', event?.id);
        handleClosePopover();
    };

    useEffect(() => {
        fetchClassroomsAndYears();
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [selectedClassroom, selectedYearValue]);

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
    const handleYearChange = (id) => {
        const selected = academicYears.find(y => y.id === id);
        if (selected) {
            setSelectedYearId(id);
            const yearStart = new Date(selected.start_date).getFullYear();
            setSelectedYearValue(yearStart);
        }
    };

    const calendarWeeks = generateCalendarWeeks();

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180 }}>
                        <Typography variant="caption" color="gray">اختر الصف</Typography>
                        <Select
                            size="small"
                            value={selectedClassroom}
                            onChange={(e) => setSelectedClassroom(e.target.value)}
                        >
                            {classrooms.map(cls => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

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
                        <FormControl variant="standard" size="small">
                            <Select value={selectedYearId || ''} onChange={(e) => handleYearChange(e.target.value)}>
                                {academicYears.map((yr) => (
                                    <MenuItem key={yr.id} value={yr.id}>{yr.name}</MenuItem>
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
                                const dayEvents = events.filter(e => e.date === day && e.month === selectedMonth);
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
                                                            <Box key={event.id} sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                bgcolor: event.color,
                                                                p: 0.5,
                                                                mb: 0.5,
                                                                borderRadius: 1
                                                            }}>
                                                                <Typography variant="caption" sx={{ color: '#fff' }}>
                                                                    {event.title}
                                                                </Typography>
                                                                {/* أيقونة الضبط بدل الحذف */}
                                                                <IconButton size="small" onClick={(e) => handleOpenPopover(e, event)}>
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

            {/* Popover تفاصيل الحدث + أزرار تعديل/حذف */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 220 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: 'rtl' }}>
                        <Typography sx={{ color: '#22385F', fontWeight: 600, mb: 1 }}>
                            {selectedEvent.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: 1 }}>
                            يوم {arabicDays[selectedEvent.dayIndex]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                            <Button
                                onClick={() => handleDelete(selectedEvent.id)}
                                variant="contained"
                                disableElevation
                                sx={{
                                    flex: 1,
                                    bgcolor: '#E5E7EB',
                                    color: '#6B7280',
                                    '&:hover': { bgcolor: '#D1D5DB' },
                                    borderRadius: 2,
                                }}
                            >
                                حذف
                            </Button>
                            <Button
                                onClick={() => handleEdit(selectedEvent)}
                                variant="contained"
                                disableElevation
                                sx={{
                                    flex: 1,
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)',
                                    '&:hover': { background: 'linear-gradient(90deg, #23C6CD 0%, #193868 100%)' },
                                }}
                            >
                                تعديل
                            </Button>
                        </Box>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default DailySchedule;
