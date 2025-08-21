import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getParentSchedules } from '../../../../../api/Parent/Schedule/getParentSchedules';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/* ألوان بحسب النوع */
const TYPE_COLORS = {
    daily: '#90CAF9',   // درس يومي
    event: '#A5D6A7',   // فعالية
    exam: '#F48FB1',   // اختبار
    default: '#CE93D8', // افتراضي
};

const LEGEND = [
    { key: 'daily', label: 'درس يومي', color: TYPE_COLORS.daily },
    { key: 'event', label: 'فعالية', color: TYPE_COLORS.event },
    { key: 'exam', label: 'اختبار', color: TYPE_COLORS.exam },
];

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

const NavigationMonthlySchedule = ({ parentId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
    const [events, setEvents] = useState([]);

    // لحوار التفاصيل
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    const fetchParentSchedules = async () => {
        try {
            const res = await getParentSchedules({ parent_id: parentId });
            const list = res?.data || res || [];

            const parsed = list.map((item) => {
                const startISO = item.start_time || item.start || item.date_start || item.date;
                const endISO = item.end_time || item.end || item.date_end || null;
                const d = new Date(startISO);
                const type = String(item.type || item.kind || item.category || 'daily').toLowerCase();
                const color = TYPE_COLORS[type] || TYPE_COLORS.default;

                return {
                    id: item.id,
                    title: item.title || item.name || 'حدث',
                    start: startISO,
                    end: endISO,
                    dayIndex: d.getDay(),
                    date: d.getDate(),
                    month: d.getMonth(),
                    year: d.getFullYear(),
                    type,
                    color,
                };
            });

            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب تقويم وليّ الأمر:', err?.message);
            setEvents([]);
        }
    };

    useEffect(() => {
        fetchParentSchedules();
    }, [parentId]);

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

    const handlePrevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYearValue(prev => prev - 1);
        } else setSelectedMonth(prev => prev - 1);
    };

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYearValue(prev => prev + 1);
        } else setSelectedMonth(prev => prev + 1);
    };

    const handleToday = () => {
        const now = new Date();
        setSelectedYearValue(now.getFullYear());
        setSelectedMonth(now.getMonth());
    };

    const calendarWeeks = generateCalendarWeeks();

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: '#fff', direction: 'rtl' }}>
                {/* شريط التنقل + وسيلة الإيضاح (Legend) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevMonth}><ChevronRight /></IconButton>
                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((m, idx) => (
                                    <MenuItem key={idx} value={idx}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton onClick={handleNextMonth}><ChevronLeft /></IconButton>
                    </Box>

                    {/* وسيلة الإيضاح: نقاط ملوّنة مع التسمية */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {LEGEND.map((it) => (
                            <Box key={it.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: it.color,
                                        boxShadow: '0 0 0 2px rgba(0,0,0,0.05)',
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: '#6b7a90', fontWeight: 700 }}>
                                    {it.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* أسماء الأيام */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {arabicDays.map(day => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography fontWeight="bold" color="#308A9F">{day}</Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* التقويم */}
                <Box>
                    {calendarWeeks.map((week, wi) => (
                        <Grid container spacing={1} key={wi}>
                            {week.map((day, di) => {
                                const dayEvents = events.filter(
                                    e => e.date === day && e.month === selectedMonth && e.year === selectedYearValue
                                );
                                const count = dayEvents.length;

                                return (
                                    <Grid item xs key={di}>
                                        <Box
                                            sx={{
                                                border: day ? '1px solid #ddd' : 'none',
                                                minHeight: isMobile ? '14vh' : '16vh',
                                                bgcolor: '#fff',
                                                p: 1,
                                                borderRadius: 1
                                            }}
                                        >
                                            {day && (
                                                <>
                                                    {/* رقم اليوم + عدّاد الأحداث */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {count > 0 && (
                                                            <Box
                                                                sx={{
                                                                    px: 1,
                                                                    py: 0.2,
                                                                    borderRadius: 2,
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    backgroundColor: '#308A9F',
                                                                    color: '#fff',
                                                                    lineHeight: 1.6,
                                                                }}
                                                            >
                                                                {count}
                                                            </Box>
                                                        )}
                                                        <Typography fontWeight="bold" color="#22385F">{day}</Typography>
                                                    </Box>

                                                    {/* أحداث اليوم ملوّنة حسب النوع + زر الضبط */}
                                                    <Box sx={{ mt: 1, maxHeight: '9vh', overflowY: 'auto' }}>
                                                        {dayEvents.map((event, idx) => (
                                                            <Box
                                                                key={event.id ?? idx}
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
                                                                onDoubleClick={() =>
                                                                    navigate(
                                                                        `/dashboard/parent-schedule-details/${selectedYearValue}/${selectedMonth + 1}/${day}`
                                                                    )
                                                                }
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

            {/* Popover التفاصيل */}
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
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: .5 }}>
                            نوع الحدث: {typeLabel(selectedEvent.type)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            يوم {arabicDays[selectedEvent.dayIndex ?? 0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: .5 }}>
                            {formatTime(selectedEvent.start)}{selectedEvent.end ? ` - ${formatTime(selectedEvent.end)}` : ''}
                        </Typography>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default NavigationMonthlySchedule;
