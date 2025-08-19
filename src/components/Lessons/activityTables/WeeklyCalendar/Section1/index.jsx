import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, useMediaQuery, useTheme,
    Select, MenuItem, FormControl, Popover, Button
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from '@mui/icons-material';
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

// وقت 12 ساعة مع ص/م
const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const am = h < 12 ? 'ص' : 'م';
    h = h % 12 || 12;
    return `${h}:${m} ${am}`;
};

const WeeklyEventsCalendar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();         // 0-6
        const diff = d.getDate() - day; // بداية الأسبوع على الأحد
        return new Date(d.setDate(diff));
    };

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(today));

    const [events, setEvents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');

    // popover للحركة
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, ev) => { setAnchorEl(e.currentTarget); setSelectedEvent(ev); };
    const closePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // تعديل
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editSchedule, setEditSchedule] = useState(null);

    const getWeekDays = (startDate) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
    };
    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
    };
    const handleToday = () => {
        const now = new Date();
        setSelectedMonth(now.getMonth());
        setSelectedYearValue(now.getFullYear());
        setCurrentWeekStart(getStartOfWeek(now));
    };

    const handleYearChange = (id) => {
        const selected = academicYears.find(y => y.id === id);
        if (selected) {
            setSelectedYearId(id);
            const yearStart = new Date(selected.start_date).getFullYear();
            setSelectedYearValue(yearStart);
        }
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

    const fetchEvents = async () => {
        if (!selectedClassroom || !selectedYearValue) return;

        try {
            const res = await getEventsSchedule(selectedClassroom, selectedYearValue);
            const data = res.data || [];

            const parsed = data.map((item, i) => ({
                id: item.id,
                title: item.title,
                date: new Date(item.start_time),
                start_time: item.start_time,
                end_time: item.end_time,
                color: colors[i % colors.length],
                classroomName: item.classroom_name || item.classroom || '',
            }));
            setEvents(parsed);
        } catch (err) {
            console.error('فشل في جلب جدول الفعاليات:', err.message);
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
            // جلب بيانات الحدث قبل فتح المودال
            const res = await getScheduleById(ev.id);
            const sch = res?.data ?? res ?? null;
            setEditSchedule(sch);
            setOpenEditModal(true);
        } catch (err) {
            console.error('فشل في جلب بيانات الحدث:', err?.message);
        } finally {
            setEditLoading(false);
            closePopover();
        }
    };

    useEffect(() => { fetchClassroomsAndYears(); }, []);
    useEffect(() => { fetchEvents(); }, [selectedClassroom, selectedYearValue]);
    useEffect(() => { setSelectedMonth(currentWeekStart.getMonth()); }, [currentWeekStart]);

    const weekDays = getWeekDays(currentWeekStart);

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
        // يُستخدم للعرض في البوب أوفر لو لم يأت الاسم مع الحدث
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

                    <FormControl sx={{ minWidth: 180 }}>
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
                </Box>

                {/* Week Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePrevWeek}><ChevronRight /></IconButton>

                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleNextWeek}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* Weekly Calendar */}
                <Grid container spacing={1}>
                    {weekDays.map((date, i) => {
                        const dayEvents = events.filter(
                            e =>
                                e.date.getDate() === date.getDate() &&
                                e.date.getMonth() === date.getMonth() &&
                                e.date.getFullYear() === date.getFullYear()
                        );
                        const count = dayEvents.length;

                        return (
                            <Grid item xs={12} sm={6} md={3} lg={1.71} key={i}>
                                <Box sx={{
                                    border: '1px solid #ddd',
                                    minHeight: '18vh',
                                    bgcolor: '#fff',
                                    p: 1,
                                    borderRadius: 1
                                }}>
                                    <Typography
                                        fontWeight="bold"
                                        textAlign="end"
                                        color="#22385F"
                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                fontSize: 11,
                                                px: .75,
                                                py: .15,
                                                borderRadius: 10,
                                                lineHeight: 1.6,
                                                color: count ? '#ffffffff' : '#6B7280',
                                                background: count
                                                    ? '#babfcaff'
                                                    : '#E5E7EB',
                                                boxShadow: count ? '0 1px 4px rgba(34,56,95,.25)' : 'none',
                                            }}
                                            title={`عدد الأحداث: ${count}`}
                                        >
                                            - {count} -
                                        </Box>
                                        <span>{arabicDays[date.getDay()]} - {date.getDate()}</span>


                                    </Typography>

                                    <Box sx={{ mt: 1, maxHeight: '12vh', overflowY: 'auto' }}>
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
                                                onClick={() =>
                                                    navigate(`/dashboard/event-details/${selectedClassroom}/${event.date.getFullYear()}/${event.date.getMonth() + 1}/${event.date.getDate()}`)
                                                }
                                            >
                                                <Typography variant="caption" sx={{ color: '#fff' }}>
                                                    {event.title}
                                                </Typography>
                                                {/* أيقونة الضبط تفتح Popover */}
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); openPopover(e, event); }}
                                                >
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

            {/* Popover تفاصيل + تعديل/حذف */}
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
                            يوم {arabicDays[selectedEvent.date.getDay()]} - {selectedEvent.date.getDate()} {arabicMonths[selectedEvent.date.getMonth()]}
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

            {/* مودال التعديل */}
            <UpdateScheduleModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditSchedule(null);
                }}
                schedule={editSchedule}
                name="تعديل الحدث"
                onUpdated={() => {
                    // بعد الحفظ نعيد جلب الأحداث
                    fetchEvents();
                }}
            />
        </Box>
    );
};

export default WeeklyEventsCalendar;
