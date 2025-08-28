// src/components/ParentRole/Schedule/NavigationMonthlySchedule.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl, InputLabel,
    useMediaQuery, useTheme, Popover, CircularProgress, Alert
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getParentStudents } from '../../../../../api/Parent/Students/getParentStudents';
import { getParentSchedulesByClassroom } from '../../../../../api/Parent/Schedule/getParentSchedulesByClassroom';

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

export default function NavigationMonthlySchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // التاريخ المختار
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());

    // طلاب وليّ الأمر
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [studentsErr, setStudentsErr] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // الصف المختار بناءً على الطالب
    const selectedClassroomId = useMemo(() => {
        const s = students.find(st => st.id === selectedStudentId);
        return s?.classroom?.id ?? null;
    }, [students, selectedStudentId]);

    // الأحداث
    const [events, setEvents] = useState([]);
    const [schedLoading, setSchedLoading] = useState(false);
    const [schedErr, setSchedErr] = useState('');

    // Popover التفاصيل
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // 1) جلب قائمة الطلاب
    useEffect(() => {
        (async () => {
            try {
                setStudentsLoading(true);
                const res = await getParentStudents(1, 100);
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setStudents(list);
                // اختر أول طالب تلقائيًا
                if (list.length) setSelectedStudentId(list[0].id);
            } catch (e) {
                setStudentsErr(e?.message || 'تعذر جلب الطلاب');
                setStudents([]);
            } finally {
                setStudentsLoading(false);
            }
        })();
    }, []);

    // 2) جلب جداول الصف عند تغيّر classroomId
    useEffect(() => {
        if (!selectedClassroomId) { setEvents([]); return; }
        (async () => {
            try {
                setSchedLoading(true);
                setSchedErr('');
                // مرن: يمكن تمرير بارامترات إضافية لو API يدعم (مثلاً range)
                const res = await getParentSchedulesByClassroom(selectedClassroomId);
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
            } catch (e) {
                setSchedErr(e?.message || 'تعذر جلب جدول الصف');
                setEvents([]);
            } finally {
                setSchedLoading(false);
            }
        })();
    }, [selectedClassroomId]);

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

    const monthEvents = useMemo(
        () => events.filter(e => e.month === selectedMonth && e.year === selectedYearValue),
        [events, selectedMonth, selectedYearValue]
    );

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: '#fff', direction: 'rtl' }}>

                {/* صف أعلى: اختيار الطالب + تنقل الشهر + وسيلة الإيضاح + اليوم */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="student-select-label">اختر الطالب</InputLabel>
                            <Select
                                labelId="student-select-label"
                                value={selectedStudentId || ''}
                                label="اختر الطالب"
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                disabled={studentsLoading}
                                sx={{ bgcolor: '#fff', borderRadius: 1 }}
                            >
                                {students.map(s => (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.name} • {s.classroom?.name || '—'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevMonth}><ChevronRight /></IconButton>
                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((m, idx) => (
                                    <MenuItem key={idx} value={idx}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography sx={{ mx: 1, fontWeight: 700, color: '#22385F' }}>
                            {selectedYearValue}
                        </Typography>
                        <IconButton onClick={handleNextMonth}><ChevronLeft /></IconButton>
                    </Grid>

                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
                        {LEGEND.map((it) => (
                            <Box key={it.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: it.color, boxShadow: '0 0 0 2px rgba(0,0,0,0.05)' }} />
                                <Typography variant="caption" sx={{ color: '#6b7a90', fontWeight: 700 }}>{it.label}</Typography>
                            </Box>
                        ))}
                        <IconButton onClick={handleToday}><Today /></IconButton>
                    </Grid>
                </Grid>

                {studentsErr && <Alert severity="error" sx={{ mb: 1.5 }}>{studentsErr}</Alert>}
                {schedErr && <Alert severity="warning" sx={{ mb: 1.5 }}>{schedErr}</Alert>}

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
                    {schedLoading ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        generateCalendarWeeks().map((week, wi) => (
                            <Grid container spacing={1} key={wi}>
                                {week.map((day, di) => {
                                    const dayEvents = day
                                        ? monthEvents.filter(e => e.date === day)
                                        : [];
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
                                                                        px: 1, py: 0.2, borderRadius: 2, fontSize: 12, fontWeight: 700,
                                                                        backgroundColor: '#308A9F', color: '#fff', lineHeight: 1.6,
                                                                    }}
                                                                >
                                                                    {count}
                                                                </Box>
                                                            )}
                                                            <Typography fontWeight="bold" color="#22385F">{day}</Typography>
                                                        </Box>

                                                        {/* أحداث اليوم */}
                                                        <Box sx={{ mt: 1, maxHeight: '9vh', overflowY: 'auto' }}>
                                                            {dayEvents.map((event, idx) => (
                                                                <Box
                                                                    key={event.id ?? idx}
                                                                    sx={{
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                        bgcolor: event.color, p: 0.5, mb: 0.5, borderRadius: 1, cursor: 'pointer'
                                                                    }}
                                                                    onDoubleClick={() =>
                                                                        navigate(`/parentDashboard/calendarSchedule?y=${selectedYearValue}&m=${selectedMonth + 1}&d=${day}`)
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
                        ))
                    )}
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
}
