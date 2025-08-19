import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover, Button
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';

import { getAllClassrooms } from '../../../../../api/Admin/Classrooms/getAllClassrooms';
import { getAllAcademicYears } from '../../../../../api/Admin/AcademicYears/getAllAcademicYears';
import { deleteSchedule } from '../../../../../api/Admin/Schedules/deleteSchedule';
import { getExamSchedule } from './../../../../../api/Admin/ExamSchedule/ExamSchedule';
import { getScheduleById } from '../../../../../api/Admin/Schedules/getScheduleById';
import UpdateScheduleModal from '../../../UpdateScheduleModal';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#FFD700', '#90CAF9', '#A5D6A7', '#FFCC80', '#F48FB1', '#CE93D8', '#B2DFDB'];

const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const am = h < 12 ? 'ص' : 'م';
    h = h % 12 || 12;
    return `${h}:${m} ${am}`;
};

const ExamMonthlyCalendar = () => {
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

    // Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // Edit modal
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editSchedule, setEditSchedule] = useState(null);

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
            const res = await getExamSchedule(selectedClassroom, selectedYearValue);
            const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            const parsed = list.map((item, i) => {
                const dt = new Date(item.start_time ?? item.date ?? today);
                return {
                    id: item.id,
                    title: item.title ?? item.name ?? 'امتحان',
                    start_time: item.start_time ?? null,
                    end_time: item.end_time ?? null,
                    date: dt.getDate(),
                    month: dt.getMonth(),
                    color: colors[i % colors.length],
                    classroomName: item.classroom_name || item.classroom || '',
                };
            });
            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب جدول الامتحانات:', err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSchedule(id);
            setEvents(prev => prev.filter(event => event.id !== id));
            closePopover();
        } catch (error) {
            console.error('فشل في حذف الحدث:', error.message);
        }
    };

    const handleEdit = async (ev) => {
        try {
            setEditLoading(true);
            const res = await getScheduleById(ev.id);
            const sch = res?.data ?? res ?? null;
            setEditSchedule(sch);
            setOpenEditModal(true);
        } catch (e) {
            console.error('فشل في جلب بيانات الامتحان:', e?.message);
        } finally {
            setEditLoading(false);
            closePopover();
        }
    };

    useEffect(() => { fetchClassroomsAndYears(); }, []);
    useEffect(() => { fetchSchedule(); }, [selectedClassroom, selectedYearValue]);

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
                {/* Filters */}
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

                {/* Month Navigation */}
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

                {/* Weekday Header */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {arabicDays.map(day => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography fontWeight="bold" color="#308A9F">{day}</Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar Grid */}
                <Box>
                    {calendarWeeks.map((week, i) => (
                        <Grid container spacing={1} key={i}>
                            {week.map((day, j) => {
                                const dayEvents = events.filter(e => e.date === day && e.month === selectedMonth);
                                const count = dayEvents.length;

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
                                                    <Typography fontWeight="bold" textAlign="end" color="#22385F">
                                                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: .75 ,justifyContent:'space-between'}}>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    fontSize: 11,
                                                                    px: .7,
                                                                    py: .1,
                                                                    borderRadius: 10,
                                                                    lineHeight: 1.6,
                                                                    color: count ? '#fff' : '#6B7280',
                                                                    background: count
                                                                        ? '#babfcaff'
                                                                        : '#E5E7EB',
                                                                    boxShadow: count ? '0 1px 4px rgba(34,56,95,.25)' : 'none',
                                                                }}
                                                                title={`عدد الامتحانات: ${count}`}
                                                            >
                                                                {count}
                                                            </Box>
                                                            <Box component="span">{day}</Box>
                                                        </Box>
                                                    </Typography>

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
                                                                    cursor: 'pointer',
                                                                    transition: '0.2s',
                                                                    '&:hover': { opacity: 0.9 }
                                                                }}
                                                                onClick={(e) => openPopover(e, event)}
                                                            >
                                                                <Typography variant="caption" sx={{ color: '#fff' }}>
                                                                    {event.title}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); openPopover(e, event); }}
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

            {/* Popover: تفاصيل + تعديل/حذف */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 240 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: 'rtl' }}>
                        <Typography sx={{ color: '#22385F', fontWeight: 600, mb: 1 }}>
                            {selectedEvent.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedEvent.classroomName || classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: 1 }}>
                            يوم {arabicDays[new Date(selectedYearValue, selectedMonth, selectedEvent.date).getDay()]} - {selectedEvent.date} {arabicMonths[selectedMonth]}
                        </Typography>
                        {(selectedEvent.start_time || selectedEvent.end_time) && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                            <Button
                                onClick={() => handleDelete(selectedEvent.id)}
                                variant="contained"
                                disableElevation
                                sx={{ flex: 1, bgcolor: '#E5E7EB', color: '#6B7280', '&:hover': { bgcolor: '#D1D5DB' }, borderRadius: 2 }}
                            >
                                حذف
                            </Button>
                            <Button
                                onClick={() => handleEdit(selectedEvent)}
                                variant="contained"
                                disableElevation
                                disabled={editLoading}
                                sx={{
                                    flex: 1,
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)',
                                    '&:hover': { background: 'linear-gradient(90deg, #23C6CD 0%, #193868 100%)' },
                                }}
                            >
                                {editLoading ? 'جارٍ التحميل...' : 'تعديل'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Popover>

            <UpdateScheduleModal
                open={openEditModal}
                onClose={() => { setOpenEditModal(false); setEditSchedule(null); }}
                schedule={editSchedule}
                name="تعديل الامتحان"
                onUpdated={() => { fetchSchedule(); }}  
            />
        </Box>
    );
};

export default ExamMonthlyCalendar;
