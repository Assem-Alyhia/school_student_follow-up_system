// src/components/TeacherRole/Schedules/DailyCalendar/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid, IconButton,
    useMediaQuery, useTheme, Select, MenuItem, FormControl, Popover
} from '@mui/material';
import { Today, ChevronLeft, ChevronRight, SettingsRounded } from '@mui/icons-material';

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

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const startOfWeekSunday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); 
    const diff = d.getDate() - day + 0;
    return new Date(d.setDate(diff));
};

export default function DailyCalendarTeacher() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');

    const [rawEvents, setRawEvents] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

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

    useEffect(() => {
        (async () => {
            if (!selectedClassroom) return;
            try {
                const res = await getTeacherSchedulesByClassroom(selectedClassroom);
                const arr =
                    Array.isArray(res) ? res
                        : Array.isArray(res?.data) ? res.data
                            : res?.data ? [res.data]
                                : res ? [res]
                                    : [];
                setRawEvents(arr);
            } catch (e) {
                console.error('فشل في جلب الأحداث:', e?.message || e);
                setRawEvents([]);
            }
        })();
    }, [selectedClassroom]);

    const events = useMemo(() => {
        return (rawEvents || []).map((item) => {
            const startISO = item.start_time ?? item.start ?? item.date_start ?? item.date;
            const endISO = item.end_time ?? item.end ?? item.date_end ?? item.date;

            const start = new Date(startISO);
            const type = String(item.type || item.kind || item.category || 'daily').toLowerCase();
            const color = TYPE_COLORS[type] || TYPE_COLORS.default;

            return {
                id: item.id,
                title: item.title || item.name || '—',
                classroomName: item.classroom?.name || item.classroom_name || '—',
                startTime: startISO,
                endTime: endISO,
                dateObj: start,
                y: isNaN(start) ? null : start.getFullYear(),
                m: isNaN(start) ? null : start.getMonth(),
                d: isNaN(start) ? null : start.getDate(),
                type,
                color,
            };
        });
    }, [rawEvents]);

    const dayEvents = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const d = currentDate.getDate();
        return events.filter(ev => ev.y === y && ev.m === m && ev.d === d);
    }, [events, currentDate]);

    const weekDays = useMemo(() => {
        const start = startOfWeekSunday(currentDate);
        const arr = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(day.getDate() + i);
            arr.push(day);
        }
        return arr;
    }, [currentDate]);

    // تنقل اليوم
    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
        setSelectedMonth(prev.getMonth());
    };
    const handleNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
        setSelectedMonth(next.getMonth());
    };
    const handleToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedMonth(now.getMonth());
    };

    const handleMonthChange = (m) => {
        const nd = new Date(currentDate);
        nd.setMonth(m);
        const dim = daysInMonth(nd.getFullYear(), m);
        if (nd.getDate() > dim) nd.setDate(dim);
        setCurrentDate(nd);
        setSelectedMonth(m);
    };
    const handleDayChange = (day) => {
        const nd = new Date(currentDate);
        nd.setDate(day);
        setCurrentDate(nd);
    };

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthDays = daysInMonth(currentYear, currentMonth);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180 }}>
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

                    <FormControl sx={{ minWidth: 140 }}>
                        <Typography variant="caption" color="gray">الشهر</Typography>
                        <Select
                            size="small"
                            value={selectedMonth}
                            onChange={(e) => handleMonthChange(e.target.value)}
                        >
                            {arabicMonths.map((m, idx) => (
                                <MenuItem key={idx} value={idx}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <Typography variant="caption" color="gray">اليوم</Typography>
                        <Select
                            size="small"
                            value={currentDate.getDate()}
                            onChange={(e) => handleDayChange(e.target.value)}
                        >
                            {Array.from({ length: monthDays }, (_, i) => i + 1).map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevDay}><ChevronRight /></IconButton>
                        <Typography variant="h6" fontWeight="bold" color="#22385F">
                            {arabicDays[currentDate.getDay()]} - {currentDate.getDate()} {arabicMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Typography>
                        <IconButton onClick={handleNextDay}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {weekDays.map((date, i) => (
                        <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                            <Typography
                                fontWeight={date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() ? 'bold' : 'normal'}
                                color={date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() ? '#308A9F' : 'inherit'}
                            >
                                {arabicDays[date.getDay()]} {date.getDate()}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ border: '1px solid #ddd', minHeight: '50vh', bgcolor: '#fff', p: 2, borderRadius: 1 }}>
                    {dayEvents.length === 0 ? (
                        <Typography color="gray" textAlign="center">لا توجد أحداث في هذا اليوم</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {dayEvents.map((ev) => (
                                <Grid item xs={12} key={ev.id}>
                                    <Box
                                        sx={{
                                            bgcolor: ev.color,
                                            p: 2,
                                            borderRadius: 2,
                                            color: '#fff',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <Typography fontWeight="bold">{ev.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography fontSize="0.9rem">
                                                {formatTime(ev.startTime)}{ev.endTime ? ` - ${formatTime(ev.endTime)}` : ''}
                                            </Typography>
                                            <IconButton size="small" onClick={(e) => openPopover(e, ev)}>
                                                <SettingsRounded fontSize="small" sx={{ color: '#fff' }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Paper>

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
                                {formatTime(selectedEvent.startTime)}{selectedEvent.endTime ? ` - ${formatTime(selectedEvent.endTime)}` : ''}
                            </Typography>
                        )}
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
