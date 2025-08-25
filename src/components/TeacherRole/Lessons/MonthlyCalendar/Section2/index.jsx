// src/components/TeacherRole/Schedules/MonthlyCalendar/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';

import { getAllTeacherClassrooms } from '../../../../../api/Teacher/Classrooms/getAllTeacherClassrooms';
import { getTeacherSchedulesByClassroom } from '../../../../../api/Teacher/Schedules/getTeacherSchedulesByClassroom';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const TYPE_COLORS = {
    daily: '#90CAF9',  
    event: '#A5D6A7', 
    exam: '#F48FB1',  
    default: '#CE93D8',
};

const formatTime = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? 'ص' : 'م'}`;
};

const pickDateParts = (val) => {
    const d = new Date(val);
    if (isNaN(d)) return { date: null, month: null, dayIndex: null };
    return { date: d.getDate(), month: d.getMonth(), dayIndex: d.getDay() };
};

export default function DailySchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');

    const [rawEvents, setRawEvents] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);

    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // 1) جلب صفوف المعلم
    useEffect(() => {
        (async () => {
            try {
                const cls = await getAllTeacherClassrooms();
                setClassrooms(cls || []);
                if (cls && cls.length) setSelectedClassroom(cls[0].id);
            } catch (e) {
                console.error('فشل في جلب صفوف المعلّم:', e?.message || e);
            }
        })();
    }, []);

    // 2) جلب كل أنواع الأحداث لهذا الصف
    useEffect(() => {
        (async () => {
            if (!selectedClassroom) return;
            try {
                const res = await getTeacherSchedulesByClassroom(selectedClassroom);

                // ✅ تطبيع الاستجابة إلى مصفوفة دائمًا
                // ممكن تكون: [] | {...} | { data: [] } | { data: {...} }
                const arr =
                    Array.isArray(res) ? res
                        : Array.isArray(res?.data) ? res.data
                            : res?.data ? [res.data]
                                : res ? [res]
                                    : [];

                setRawEvents(arr);
            } catch (e) {
                console.error('فشل في جلب الجداول/التقارير:', e?.message || e);
                setRawEvents([]);
            }
        })();
    }, [selectedClassroom]);

    // 3) تهيئة الأحداث للعرض + لون بحسب النوع
    const parsedEvents = useMemo(() => {
        return (rawEvents || []).map((item) => {
            const startISO =
                item.start_time ?? item.start ?? item.date_start ?? item.date; // تغطية كل الأسماء المحتملة
            const endISO =
                item.end_time ?? item.end ?? item.date_end ?? item.date;

            const { date, month, dayIndex } = pickDateParts(startISO);

            const type = String(item.type || item.kind || item.category || 'daily').toLowerCase();
            const color = TYPE_COLORS[type] || TYPE_COLORS.default;

            return {
                id: item.id,
                title: item.title || item.name || '—',
                classroomName: item.classroom?.name || item.classroom_name || '—',
                startTime: startISO,
                endTime: endISO,
                date, month, dayIndex,
                type, color,
            };
        });
    }, [rawEvents]);

    // أدوات التقويم
    const selectedYearValue = today.getFullYear(); // لا يوجد فلترة سنة في الواجهة
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
            if (week.length === 7) { weeks.push(week); week = []; }
        }
        if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
        while (weeks.length < 5) weeks.push(Array(7).fill(null));
        return weeks;
    };

    const handlePrevMonth = () => setSelectedMonth(m => (m === 0 ? 11 : m - 1));
    const handleNextMonth = () => setSelectedMonth(m => (m === 11 ? 0 : m + 1));
    const handleToday = () => setSelectedMonth(today.getMonth());

    const calendarWeeks = generateCalendarWeeks();

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                {/* اختيار الصف */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 220 }}>
                        <Typography variant="caption" color="gray">اختر الصف</Typography>
                        <Select
                            size="small"
                            value={selectedClassroom || ''}
                            onChange={(e) => setSelectedClassroom(e.target.value)}
                        >
                            {classrooms.map(cls => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* شريط الشهر */}
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

                {/* رؤوس الأيام */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {arabicDays.map(day => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography fontWeight="bold" color="#308A9F">{day}</Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* التقويم */}
                <Box>
                    {calendarWeeks.map((week, i) => (
                        <Grid container spacing={1} key={i}>
                            {week.map((day, j) => {
                                const dayEvents = parsedEvents.filter(
                                    e => e.date === day && e.month === selectedMonth
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
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                                    {event.title}
                                                                </Typography>
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

            {/* Popover (عرض فقط) */}
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
                            {selectedEvent.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: .5 }}>
                            نوع الحدث: {selectedEvent.type === 'daily' ? 'درس يومي' : selectedEvent.type === 'event' ? 'فعالية' : selectedEvent.type === 'exam' ? 'اختبار' : '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            يوم {arabicDays[selectedEvent.dayIndex ?? 0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                        </Typography>
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
