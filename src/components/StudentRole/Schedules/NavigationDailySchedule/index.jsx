// src/components/TeacherRole/Schedules/DailyCalendar/NavigationDailySchedule.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid, IconButton,
    useMediaQuery, useTheme, Select, MenuItem, FormControl,
    Popover, Chip, CircularProgress, Alert, Menu, Stack
} from '@mui/material';
import {
    Today, ChevronLeft, ChevronRight, SettingsRounded,
    ChevronRight as RTLPrev, MoreVert
} from '@mui/icons-material';

import { getStudentSchedules } from '../../../../api/Student/Schedules/getStudentSchedules';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const TYPE_COLORS = {
    daily: '#90CAF9',
    event: '#A5D6A7',
    exam: '#F48FB1',
    default: '#CE93D8',
};
const typeLabel = (t) =>
    t === 'daily' ? 'درس يومي' : t === 'event' ? 'فعالية' : t === 'exam' ? 'اختبار' : '—';

const formatTime = (iso) => {
    if (!iso) return '—';
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

export default function NavigationDailySchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

    // الأحداث الخام (جدول الطالب مباشرة)
    const [rawEvents, setRawEvents] = useState([]);
    const [schedLoading, setSchedLoading] = useState(false);
    const [schedErr, setSchedErr] = useState('');

    // Popover للتفاصيل
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // ▼▼ إضافة قائمة الثلاث نقاط (فلترة النوع) ▼▼
    const [anchorMenu, setAnchorMenu] = useState(null);
    const [selectedType, setSelectedType] = useState('all'); // all | daily | event | exam
    const openMenu = (e) => setAnchorMenu(e.currentTarget);
    const closeMenu = () => setAnchorMenu(null);
    const handleSelectType = (type) => { setSelectedType(type); closeMenu(); };
    // ▲▲ إضافة قائمة الثلاث نقاط (فلترة النوع) ▲▲

    // جلب الجدول
    useEffect(() => {
        (async () => {
            try {
                setSchedLoading(true);
                setSchedErr('');
                const res = await getStudentSchedules();
                const list =
                    Array.isArray(res?.data) ? res.data :
                        Array.isArray(res) ? res :
                            res?.data ? [res.data] : [];
                setRawEvents(list);
            } catch (e) {
                setSchedErr(e?.message || 'تعذّر جلب جدول الطالب');
                setRawEvents([]);
            } finally {
                setSchedLoading(false);
            }
        })();
    }, []);

    // توحيد البيانات + الألوان
    const events = useMemo(() => {
        return (rawEvents || []).map((item) => {
            const startISO = item.start_time ?? item.start ?? item.date_start ?? item.date;
            const endISO = item.end_time ?? item.end ?? item.date_end ?? item.date;
            const start = new Date(startISO);
            const type = String(item.type || item.kind || item.category || 'daily').toLowerCase();
            const color = TYPE_COLORS[type] || TYPE_COLORS.default;

            return {
                id: item.id,
                title: item.title || item.name || item.subject?.name || 'حدث',
                startTime: startISO,
                endTime: endISO,
                dateObj: start,
                y: isNaN(start) ? null : start.getFullYear(),
                m: isNaN(start) ? null : start.getMonth(),
                d: isNaN(start) ? null : start.getDate(),
                type, color,
            };
        });
    }, [rawEvents]);

    // أحداث اليوم + فلترة النوع
    const dayEvents = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const d = currentDate.getDate();
        return events.filter(ev => {
            const matchDate = ev.y === y && ev.m === m && ev.d === d;
            const matchType = selectedType === 'all' || ev.type === selectedType;
            return matchDate && matchType;
        });
    }, [events, currentDate, selectedType]);

    // تنقّل اليوم
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

    // تغيير الشهر/اليوم
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

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthDays = daysInMonth(currentYear, currentMonth);

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>

                {/* فلاتر التاريخ (شهر/يوم) */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md="auto">
                        <FormControl sx={{ minWidth: 140 }}>
                            <Typography variant="caption" color="gray">الشهر</Typography>
                            <Select size="small" value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
                                {arabicMonths.map((m, idx) => (
                                    <MenuItem key={idx} value={idx}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md="auto">
                        <FormControl sx={{ minWidth: 120 }}>
                            <Typography variant="caption" color="gray">اليوم</Typography>
                            <Select size="small" value={currentDate.getDate()} onChange={(e) => handleDayChange(e.target.value)}>
                                {Array.from({ length: monthDays }, (_, i) => i + 1).map(d => (
                                    <MenuItem key={d} value={d}>{d}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {schedErr && <Alert severity="warning" sx={{ mb: 1.5 }}>{schedErr}</Alert>}

                {/* شريط التنقّل لليوم الحالي + عدّاد + زر الثلاث نقاط */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevDay}><RTLPrev /></IconButton>
                        <Typography variant="h6" fontWeight="bold" color="#22385F">
                            {arabicDays[currentDate.getDay()]} - {currentDate.getDate()} {arabicMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Typography>
                        <IconButton onClick={handleNextDay}><ChevronLeft /></IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Stack direction="row" spacing={3} sx={{ mb: 2, color: '#6b7a90', fontWeight: 700 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, bgcolor: TYPE_COLORS.daily, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,0.06)' }} />
                                درس يومي
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{margin:'0  2rem 0 0' , width: 10, height: 10, bgcolor: TYPE_COLORS.event, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,0.06)' }} />
                                فعالية
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{margin:'0  1rem 0 0' , width: 10, height: 10, bgcolor: TYPE_COLORS.exam, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,0.06)' }} />
                                اختبار
                            </Box>
                        </Stack>


                        <Chip size="small"  label={`${dayEvents.length} حدث`} color="info" sx={{ bgcolor: '#308A9F', color: '#fff' }} />
                        <IconButton onClick={handleToday}><Today /></IconButton>

                        {/* زر الثلاث نقاط + القائمة */}
                        <IconButton onClick={openMenu}><MoreVert /></IconButton>
                        <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={closeMenu}>
                            <MenuItem onClick={() => handleSelectType('all')}>الكل</MenuItem>
                            <MenuItem onClick={() => handleSelectType('daily')}>الدروس اليومية</MenuItem>
                            <MenuItem onClick={() => handleSelectType('event')}>الفعاليات</MenuItem>
                            <MenuItem onClick={() => handleSelectType('exam')}>الاختبارات</MenuItem>
                        </Menu>
                    </Box>
                </Box>



                {/* شريط أسبوعي علوي للإشارة السريعة لليوم الحالي */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {useMemo(() => {
                        const start = startOfWeekSunday(currentDate);
                        return Array.from({ length: 7 }, (_, i) => {
                            const day = new Date(start); day.setDate(day.getDate() + i); return day;
                        });
                    }, [currentDate]).map((date, i) => {
                        const isActive =
                            date.getDate() === currentDate.getDate() &&
                            date.getMonth() === currentDate.getMonth() &&
                            date.getFullYear() === currentDate.getFullYear();
                        return (
                            <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                                <Typography fontWeight={isActive ? 'bold' : 'normal'} color={isActive ? '#308A9F' : 'inherit'}>
                                    {arabicDays[date.getDay()]} {date.getDate()}
                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* مساحة اليوم: قائمة الأحداث */}
                <Box sx={{ border: '1px solid #ddd', minHeight: '50vh', bgcolor: '#fff', p: 2, borderRadius: 1 }}>
                    {schedLoading ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>
                    ) : dayEvents.length === 0 ? (
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

            {/* Popover التفاصيل */}
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
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: .5 }}>
                            نوع الحدث: {typeLabel(selectedEvent.type)}
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
