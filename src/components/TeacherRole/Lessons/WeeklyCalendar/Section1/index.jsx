// src/components/TeacherRole/Schedules/WeeklyCalendar/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid, IconButton,
    useMediaQuery, useTheme, Select, MenuItem, FormControl, Popover
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';

import { getAllTeacherClassrooms } from '../../../../../api/Teacher/Classrooms/getAllTeacherClassrooms';
import { getTeacherSchedulesByClassroom } from '../../../../../api/Teacher/Schedules/getTeacherSchedulesByClassroom';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const TYPE_COLORS = {
    daily: '#90CAF9',  // درس يومي
    event: '#A5D6A7',  // فعالية
    exam: '#F48FB1',  // اختبار
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

const startOfWeekSunday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0..6 (0=الأحد إذا كانت بيئة المتصفح عربية)
    const diff = d.getDate() - day + 0; // بداية الأسبوع الأحد
    return new Date(d.setDate(diff));
};

const pickDateParts = (val) => {
    const d = new Date(val);
    if (isNaN(d)) return { y: null, m: null, d: null, wd: null };
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), wd: d.getDay(), _date: d };
};

export default function WeeklyCalendarTeacher() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const today = new Date();
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeekSunday(today));
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');

    const [rawEvents, setRawEvents] = useState([]);

    // Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // اجلب صفوف المعلم
    useEffect(() => {
        (async () => {
            try {
                const cls = await getAllTeacherClassrooms();
                setClassrooms(cls || []);
                if (cls && cls.length) setSelectedClassroom(cls[0].id);
            } catch (e) {
                console.error('فشل في جلب صفوف المعلم:', e?.message || e);
            }
        })();
    }, []);

    // اجلب كل الأحداث (daily/event/exam) للصف المحدد
    useEffect(() => {
        (async () => {
            if (!selectedClassroom) return;
            try {
                const res = await getTeacherSchedulesByClassroom(selectedClassroom);
                // طبع الاستجابة إلى مصفوفة دائمًا
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

    // حوِّل الأحداث إلى شكل موحّد + ألوان
    const events = useMemo(() => {
        return (rawEvents || []).map((item) => {
            const startISO = item.start_time ?? item.start ?? item.date_start ?? item.date;
            const endISO = item.end_time ?? item.end ?? item.date_end ?? item.date;

            const { y, m, d, wd, _date } = pickDateParts(startISO);
            const type = String(item.type || item.kind || item.category || 'daily').toLowerCase();
            const color = TYPE_COLORS[type] || TYPE_COLORS.default;

            return {
                id: item.id,
                title: item.title || item.name || '—',
                classroomName: item.classroom?.name || item.classroom_name || '—',
                y, m, d, wd, dateObj: _date,
                startTime: startISO,
                endTime: endISO,
                type, color,
            };
        });
    }, [rawEvents]);

    // أيام الأسبوع المعروض
    const weekDays = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            arr.push(day);
        }
        return arr;
    }, [currentWeekStart]);

    // تنقّلات الأسبوع
    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
        setSelectedMonth(prev.getMonth());
    };
    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
        setSelectedMonth(next.getMonth());
    };
    const handleToday = () => {
        const now = new Date();
        setCurrentWeekStart(startOfWeekSunday(now));
        setSelectedMonth(now.getMonth());
    };

    // عند تغيير الشهر من القائمة، انتقل لأول أسبوع من هذا الشهر
    const handleMonthChange = (m) => {
        const base = new Date(currentWeekStart);
        base.setMonth(m);
        base.setDate(1);
        setSelectedMonth(m);
        setCurrentWeekStart(startOfWeekSunday(base));
    };

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                {/* الفلاتر: الصف فقط */}
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

                {/* شريط التنقّل الأسبوعي + اختيار الشهر */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevWeek}><ChevronRight /></IconButton>
                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton onClick={handleNextWeek}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* شبكة الأسبوع */}
                <Grid container spacing={1}>
                    {weekDays.map((date, i) => {
                        const dayEvents = events.filter(
                            ev => ev.d === date.getDate() && ev.m === date.getMonth() && ev.y === date.getFullYear()
                        );

                        return (
                            <Grid item xs={12} sm={6} md={3} lg={1.71} key={i}>
                                <Box sx={{ border: '1px solid #ddd', minHeight: '18vh', bgcolor: '#fff', p: 1, borderRadius: 1 }}>
                                    <Typography fontWeight="bold" textAlign="end" color="#22385F">
                                        {arabicDays[date.getDay()]} - {date.getDate()}
                                    </Typography>
                                    <Box sx={{ mt: 1, maxHeight: '12vh', overflowY: 'auto' }}>
                                        {dayEvents.map((ev) => (
                                            <Box
                                                key={ev.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    bgcolor: ev.color,
                                                    p: .5, mb: .5, borderRadius: 1
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                    {ev.title}
                                                </Typography>
                                                <IconButton size="small" onClick={(e) => openPopover(e, ev)}>
                                                    <SettingsRounded fontSize="small" sx={{ color: '#fff' }} />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>

            {/* Popover معلومات الحدث فقط (بدون حذف/تعديل) */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
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
                            {selectedEvent.classroomName || classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: .5 }}>
                            نوع الحدث: {selectedEvent.type === 'daily' ? 'درس يومي' : selectedEvent.type === 'event' ? 'فعالية' : selectedEvent.type === 'exam' ? 'اختبار' : '—'}
                        </Typography>
                        {selectedEvent.dateObj && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                يوم {arabicDays[selectedEvent.dateObj.getDay()]} - {selectedEvent.dateObj.getDate()} {arabicMonths[selectedEvent.dateObj.getMonth()]}
                            </Typography>
                        )}
                        {(selectedEvent.startTime || selectedEvent.endTime) && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                                {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                            </Typography>
                        )}
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
