    import React, { useEffect, useState } from 'react';
    import {
        Box, Typography, Paper, Grid,
        IconButton, Select, MenuItem, FormControl,
        useMediaQuery, useTheme
    } from '@mui/material';
    import { ChevronLeft, ChevronRight, Today, Delete } from '@mui/icons-material';
    import { useNavigate } from 'react-router-dom';

    import { getExamSchedule } from '../../../../../api/Admin/ExamSchedule/ExamSchedule';
    import { getAllClassrooms } from '../../../../../api/Admin/Classrooms/getAllClassrooms';
    import { getAllAcademicYears } from '../../../../../api/Admin/AcademicYears/getAllAcademicYears';
    import { deleteSchedule } from '../../../../../api/Admin/Schedules/deleteSchedule';

    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const colors = ['#FF8A80', '#FFD180', '#80D8FF', '#A7FFEB', '#CCFF90', '#FFFF8D', '#CFD8DC'];

    const WeeklyExamSchedule = () => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
        const navigate = useNavigate();

        const today = new Date();

        const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
        const [selectedYearId, setSelectedYearId] = useState(null);
        const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
        const [currentWeekStart, setCurrentWeekStart] = useState(() => {
            const d = new Date(today);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? 0 : 0);
            return new Date(d.setDate(diff));
        });

        const [events, setEvents] = useState([]);
        const [classrooms, setClassrooms] = useState([]);
        const [academicYears, setAcademicYears] = useState([]);
        const [selectedClassroom, setSelectedClassroom] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

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
            setCurrentWeekStart(() => {
                const d = new Date(now);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? 0 : 0);
                return new Date(d.setDate(diff));
            });
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
                setError('فشل في جلب البيانات');
            }
        };

        const fetchExams = async () => {
            if (!selectedClassroom || !selectedYearValue) return;

            setLoading(true);
            setError(null);

            try {
                const response = await getExamSchedule(selectedClassroom, selectedYearValue);

                if (!response) {
                    throw new Error('لا توجد بيانات متاحة');
                }

                const data = Array.isArray(response) ? response : response.data || [];

                const parsed = data.map((item, i) => ({
                    id: item.id,
                    title: item.title || item.name || 'امتحان بدون اسم',
                    date: new Date(item.start_time || item.date || today),
                    color: colors[i % colors.length],
                }));

                setEvents(parsed);
            } catch (err) {
                console.error('فشل في جلب الامتحانات:', err.message);
                setError('فشل في جلب جدول الامتحانات');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        const handleDelete = async (eventId) => {
            try {
                await deleteSchedule(eventId);
                setEvents((prev) => prev.filter((e) => e.id !== eventId));
            } catch (error) {
                console.error('فشل في حذف الحدث:', error.message);
                setError('فشل في حذف الامتحان');
            }
        };

        useEffect(() => {
            fetchClassroomsAndYears();
        }, []);

        useEffect(() => {
            fetchExams();
        }, [selectedClassroom, selectedYearValue]);

        useEffect(() => {
            setSelectedMonth(currentWeekStart.getMonth());
        }, [currentWeekStart]);

        const weekDays = getWeekDays(currentWeekStart);

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

                    {loading && (
                        <Typography textAlign="center" sx={{ py: 2 }}>جاري تحميل البيانات...</Typography>
                    )}

                    {error && (
                        <Typography color="error" textAlign="center" sx={{ py: 2 }}>{error}</Typography>
                    )}

                    {/* Weekly Exam Calendar */}
                    <Grid container spacing={1}>
                        {weekDays.map((date, i) => {
                            const dayExams = events.filter(e => {
                                const eventDate = e.date;
                                return (
                                    eventDate.getDate() === date.getDate() &&
                                    eventDate.getMonth() === date.getMonth() &&
                                    eventDate.getFullYear() === date.getFullYear()
                                );
                            });

                            return (
                                <Grid item xs={12} sm={6} md={3} lg={1.71} key={i}>
                                    <Box sx={{
                                        border: '1px solid #ddd',
                                        minHeight: '18vh',
                                        bgcolor: '#fff',
                                        p: 1,
                                        borderRadius: 1
                                    }}>
                                        <Typography fontWeight="bold" textAlign="end" color="#22385F">
                                            {dayExams.length > 0 && (
                                                <Typography component="span" sx={{
                                                    color: '#22385F',
                                                    fontSize: '.8rem',
                                                    fontWeight: 900,
                                                    ml: 1,
                                                    display: 'inline-block'
                                                }}>
                                                    ({dayExams.length})
                                                </Typography>
                                            )}
                                            {arabicDays[date.getDay()]} - {date.getDate()}
                                        </Typography>
                                        <Box sx={{ mt: 1, maxHeight: '12vh', overflowY: 'auto' }}>
                                            {dayExams.map((exam, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        bgcolor: exam.color,
                                                        p: 0.5,
                                                        mb: 0.5,
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        transition: '0.2s',
                                                        '&:hover': { opacity: 0.9 }
                                                    }}
                                                    onClick={() => navigate(`/dashboard/student-schedule-details/${selectedClassroom}/${exam.date.getFullYear()}/${exam.date.getMonth() + 1}/${exam.date.getDate()}`)}
                                                >
                                                    <Typography variant="caption" sx={{ color: '#fff' }}>
                                                        {exam.title}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(exam.id);
                                                        }}
                                                    >
                                                        <Delete fontSize="small" sx={{ color: '#fff' }} />
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
            </Box>
        );
    };

    export default WeeklyExamSchedule;