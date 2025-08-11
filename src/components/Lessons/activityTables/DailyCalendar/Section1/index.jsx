import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid,
    IconButton, useMediaQuery, useTheme,
    Select, MenuItem, FormControl
} from '@mui/material';
import { Today, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getAllClassrooms } from '../../../../../api/Admin/Classrooms/getAllClassrooms';
import { getAllAcademicYears } from '../../../../../api/Admin/AcademicYears/getAllAcademicYears';
import { getEventsSchedule } from '../../../../../api/Admin/EventSchedule/getEventsSchedule';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#FFD700', '#90CAF9', '#A5D6A7', '#FFCC80', '#F48FB1', '#CE93D8', '#B2DFDB'];

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
            const data = Array.isArray(res.data) ? res.data : [];
            const parsed = data.map((item, i) => ({
                id: item.id,
                title: item.title,
                start_time: new Date(item.start_time),
                end_time: new Date(item.end_time),
                color: colors[i % colors.length],
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

    useEffect(() => {
        fetchClassroomsAndYears();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [selectedClassroom, selectedYearValue]);

    useEffect(() => {
        setSelectedMonth(currentDate.getMonth());
    }, [currentDate]);

    const weekDays = getWeekDays(currentDate);
    const dayEvents = events.filter(
        e => e.start_time.toDateString() === currentDate.toDateString()
    );

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
                        <Typography variant="h6" fontWeight="bold" color="#22385F">
                            {arabicDays[currentDate.getDay()]} - {currentDate.getDate()} {arabicMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Typography>
                        <IconButton onClick={handleNextDay}><ChevronLeft /></IconButton>
                    </Box>
                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* Weekly Calendar Header */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {weekDays.map((date, i) => (
                        <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                            <Typography
                                fontWeight={date.toDateString() === currentDate.toDateString() ? 'bold' : 'normal'}
                                color={date.toDateString() === currentDate.toDateString() ? '#308A9F' : 'inherit'}
                            >
                                {arabicDays[date.getDay()]} {date.getDate()}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Day Events */}
                <Box sx={{
                    border: '1px solid #ddd',
                    minHeight: '50vh',
                    bgcolor: '#fff',
                    p: 2,
                    borderRadius: 1
                }}>
                    {dayEvents.length === 0 ? (
                        <Typography color="gray" textAlign="center">
                            لا توجد فعاليات في هذا اليوم
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {dayEvents.map((event, i) => (
                                <Grid item xs={12} key={i}>
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
                                        onClick={() => navigate(`/dashboard/event-details/${selectedClassroom}/${event.start_time.getFullYear()}/${event.start_time.getMonth() + 1}/${event.start_time.getDate()}`)}
                                    >
                                        <Typography fontWeight="bold">{event.title}</Typography>
                                        <Typography fontSize="0.9rem">
                                            {event.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default DailyEventsCalendar;
