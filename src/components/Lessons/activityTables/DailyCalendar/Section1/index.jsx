import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, useMediaQuery, useTheme,
    Select, MenuItem, FormControl, Popover, Button
} from '@mui/material';
import { Today, ChevronLeft, ChevronRight, SettingsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getAllClassrooms } from '../../../../../api/Admin/Classrooms/getAllClassrooms';
import { getAllAcademicYears } from '../../../../../api/Admin/AcademicYears/getAllAcademicYears';
import { getEventsSchedule } from '../../../../../api/Admin/EventSchedule/getEventsSchedule';
import { deleteSchedule } from '../../../../../api/Admin/Schedules/deleteSchedule';
import { getScheduleById } from '../../../../../api/Admin/Schedules/getScheduleById';
import UpdateScheduleModal from '../../../UpdateScheduleModal';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#FFD700', '#90CAF9', '#A5D6A7', '#FFCC80', '#F48FB1', '#CE93D8', '#B2DFDB'];

const formatTime = (d) => {
    if (!(d instanceof Date)) return '—';
    const h24 = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const h12 = (h24 % 12) || 12;
    const am = h24 < 12 ? 'ص' : 'م';
    return `${h12}:${m} ${am}`;
};

const DailyEventsCalendar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [_selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [events, setEvents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [currentDate, setCurrentDate] = useState(today);

    // Popover state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // تعديل
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

    const fetchEvents = async () => {
        if (!selectedClassroom || !selectedYearValue) return;

        try {
            const res = await getEventsSchedule(selectedClassroom, selectedYearValue);
            const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            const parsed = data.map((item, i) => ({
                id: item.id,
                title: item.title,
                start_time: new Date(item.start_time),
                end_time: new Date(item.end_time),
                color: colors[i % colors.length],
                classroomName: item.classroom_name || item.classroom || '',
            }));
            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب الفعاليات:', err.message);
        }
    };

    const getWeekDays = (date) => {
        const days = [];
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    const handleToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedMonth(now.getMonth());
        setSelectedYearValue(now.getFullYear());
    };

    const handleYearChange = (id) => {
        const selected = academicYears.find(y => y.id === id);
        if (selected) {
            setSelectedYearId(id);
            const yearStart = new Date(selected.start_date).getFullYear();
            setSelectedYearValue(yearStart);
        }
    };

    useEffect(() => { fetchClassroomsAndYears(); }, []);
    useEffect(() => { fetchEvents(); }, [selectedClassroom, selectedYearValue]);
    useEffect(() => { setSelectedMonth(currentDate.getMonth()); }, [currentDate]);

    const weekDays = getWeekDays(currentDate);
    const dayEvents = events.filter(
        e => e.start_time.toDateString() === currentDate.toDateString()
    );
    const dayCount = dayEvents.length;

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    const handleDelete = async (id) => {
        try {
            await deleteSchedule(id);
            setEvents(prev => prev.filter(ev => ev.id !== id));
            closePopover();
        } catch (e) {
            console.error('فشل في حذف الفعالية:', e.message);
        }
    };

    const handleEdit = async (ev) => {
        try {
            setEditLoading(true);
            const res = await getScheduleById(ev.id);
            const sch = res?.data ?? res ?? null;
            setEditSchedule(sch);
            setOpenEditModal(true);
        } catch (err) {
            console.error('فشل في جلب بيانات الفعالية:', err?.message);
        } finally {
            setEditLoading(false);
            closePopover();
        }
    };

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 150 }}>
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

                    <FormControl sx={{ minWidth: 150 }}>
                        <Typography variant="caption" color="gray">اختر السنة</Typography>
                        <Select
                            size="small"
                            value={selectedYearId || ''}
                            onChange={(e) => handleYearChange(e.target.value)}
                        >
                            {academicYears.map((yr) => (
                                <MenuItem key={yr.id} value={yr.id}>{yr.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Month Selector */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <Typography variant="caption" color="gray">اختر الشهر</Typography>
                        <Select
                            size="small"
                            value={currentDate.getMonth()}
                            onChange={(e) => {
                                const newDate = new Date(currentDate);
                                newDate.setMonth(e.target.value);
                                setCurrentDate(newDate);
                            }}
                        >
                            {arabicMonths.map((m, idx) => (
                                <MenuItem key={idx} value={idx}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Week Selector */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <Typography variant="caption" color="gray">اختر الأسبوع</Typography>
                        <Select
                            size="small"
                            value={Math.floor((currentDate.getDate() - 1) / 7)}
                            onChange={(e) => {
                                const weekIndex = e.target.value;
                                const newDate = new Date(currentDate);
                                newDate.setDate(weekIndex * 7 + 1);
                                setCurrentDate(newDate);
                            }}
                        >
                            {[0, 1, 2, 3, 4].map((week) => (
                                <MenuItem key={week} value={week}>
                                    الأسبوع {week + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Day Selector */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <Typography variant="caption" color="gray">اختر اليوم</Typography>
                        <Select
                            size="small"
                            value={currentDate.getDate()}
                            onChange={(e) => {
                                const newDate = new Date(currentDate);
                                newDate.setDate(e.target.value);
                                setCurrentDate(newDate);
                            }}
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Day Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevDay}><ChevronRight /></IconButton>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="#22385F"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
                        >
                            {arabicDays[currentDate.getDay()]} - {currentDate.getDate()} {arabicMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                            {/* بادج عدد فعاليات اليوم */}
                            <Box
                                component="span"
                                sx={{
                                    fontSize: 11,
                                    px: .75,
                                    py: .15,
                                    borderRadius: 10,
                                    lineHeight: 1.6,
                                    color: dayCount ? '#ffffffff' : '#6B7280',
                                    background: dayCount ? '#babfcaff' : '#E5E7EB',
                                    boxShadow: dayCount ? '0 1px 4px rgba(34,56,95,.25)' : 'none',
                                }}
                                title={`عدد الفعاليات: ${dayCount}`}
                            >
                                - {dayCount} -
                            </Box>
                        </Typography>
                        <IconButton onClick={handleNextDay}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* Week Header */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {weekDays.map((date, i) => {
                        const count = events.filter(e => e.start_time.toDateString() === date.toDateString()).length;
                        const isToday = date.toDateString() === currentDate.toDateString();
                        return (
                            <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                                <Typography
                                    fontWeight={isToday ? 'bold' : 'normal'}
                                    color={isToday ? '#308A9F' : 'inherit'}
                                    sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    {arabicDays[date.getDay()]} {date.getDate()}

                                    <Box
                                        component="span"
                                        sx={{
                                            fontSize: 10,
                                            px: .6,
                                            py: .1,
                                            borderRadius: 10,
                                            lineHeight: 1.5,
                                            color: count ? '#ffffffff' : '#6B7280',
                                            background: count ? '#babfcaff' : '#E5E7EB',
                                        }}
                                        title={`عدد الفعاليات: ${count}`}
                                    >
                                        {count}
                                    </Box>

                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Day Events */}
                <Box sx={{ border: '1px solid #ddd', minHeight: '50vh', bgcolor: '#fff', p: 2, borderRadius: 1 }}>
                    {dayEvents.length === 0 ? (
                        <Typography color="gray" textAlign="center">
                            لا توجد فعاليات في هذا اليوم
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
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
                                        onClick={() =>
                                            navigate(`/dashboard/event-details/${selectedClassroom}/${event.start_time.getFullYear()}/${event.start_time.getMonth() + 1}/${event.start_time.getDate()}`)
                                        }
                                    >
                                        <Typography fontWeight="bold">{event.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography fontSize="0.9rem">
                                                {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                            </Typography>
                                            {/* أيقونة الضبط لفتح البوب أوفر */}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => { e.stopPropagation(); openPopover(e, event); }}
                                            >
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

            {/* Popover تفاصيل + تعديل/حذف */}
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
                        <Typography sx={{ color: '#22385F', fontWeight: 600, mb: 1 }}>
                            {selectedEvent.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedEvent.classroomName || classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: 1 }}>
                            يوم {arabicDays[selectedEvent.start_time.getDay()]} - {selectedEvent.start_time.getDate()} {arabicMonths[selectedEvent.start_time.getMonth()]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                        </Typography>

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

            {/* مودال التعديل */}
            <UpdateScheduleModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditSchedule(null);
                }}
                schedule={editSchedule}
                name="تعديل الفعالية"
                onUpdated={() => {
                    // بعد الحفظ نعيد جلب البيانات لتحديث اليوم
                    fetchEvents();
                }}
            />
        </Box>
    );
};

export default DailyEventsCalendar;
