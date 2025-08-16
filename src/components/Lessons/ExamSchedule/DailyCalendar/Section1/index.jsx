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
import { getExamSchedule } from '../../../../../api/Admin/ExamSchedule/ExamSchedule';
import { deleteSchedule } from '../../../../../api/Admin/Schedules/deleteSchedule';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const colors = ['#FFD700', '#90CAF9', '#A5D6A7', '#FFCC80', '#F48FB1', '#CE93D8', '#B2DFDB'];

const formatTime = (d) => {
    if (!(d instanceof Date)) return '—';
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const am = h < 12 ? 'ص' : 'م';
    h = h % 12 || 12;
    return `${h}:${m} ${am}`;
};

const DailyExamsCalendar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const today = new Date();
    const [_selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedYearValue, setSelectedYearValue] = useState(today.getFullYear());
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [exams, setExams] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [currentDate, setCurrentDate] = useState(today);

    // Popover للتحكم بالامتحان
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const openPopover = (e, exam) => { setAnchorEl(e.currentTarget); setSelectedExam(exam); };
    const closePopover = () => { setAnchorEl(null); setSelectedExam(null); };

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

    const fetchExams = async () => {
        if (!selectedClassroom || !selectedYearValue) return;

        try {
            const res = await getExamSchedule(selectedClassroom, selectedYearValue);
            const examsArray = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            const parsed = examsArray.map((item, i) => ({
                id: item.id,
                title: item.title,
                start_time: new Date(item.start_time),
                end_time: new Date(item.end_time),
                color: colors[i % colors.length],
                classroomName: item.classroom_name || item.classroom || '',
            }));
            setExams(parsed);
        } catch (err) {
            console.error('فشل في جلب جدول الامتحانات:', err.message);
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
    useEffect(() => { fetchExams(); }, [selectedClassroom, selectedYearValue]);
    useEffect(() => { setSelectedMonth(currentDate.getMonth()); }, [currentDate]);

    const weekDays = getWeekDays(currentDate);
    const dayExams = exams.filter(
        e => e.start_time.getDate() === currentDate.getDate() &&
            e.start_time.getMonth() === currentDate.getMonth() &&
            e.start_time.getFullYear() === currentDate.getFullYear()
    );

    const classroomName = useMemo(() => {
        const f = classrooms.find(c => c.id === selectedClassroom);
        return f?.name || '—';
    }, [classrooms, selectedClassroom]);

    const handleDelete = async (id) => {
        try {
            await deleteSchedule(id);
            setExams(prev => prev.filter(e => e.id !== id));
            closePopover();
        } catch (e) {
            console.error('فشل في حذف الامتحان:', e.message);
        }
    };

    const handleEdit = (exam) => {
        // اربطه بمودال التعديل لديك (AddLessonModal بوضع تعديل) وتمرير بيانات exam
        console.log('edit exam', exam?.id);
        closePopover();
    };

    return (
        <Box sx={{ width: '100%', p: isMobile ? 1 : 3, bgcolor: '#f5f7fa' }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: 'white', direction: 'rtl' }}>
                {/* الفلاتر */}
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

                {/* أزرار التنقل */}
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

                {/* عناوين أيام الأسبوع */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {weekDays.map((date, i) => (
                        <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                            <Typography
                                fontWeight={date.getDate() === currentDate.getDate() ? 'bold' : 'normal'}
                                color={date.getDate() === currentDate.getDate() ? '#308A9F' : 'inherit'}
                            >
                                {arabicDays[date.getDay()]} {date.getDate()}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* عرض الامتحانات */}
                <Box sx={{ border: '1px solid #ddd', minHeight: '50vh', bgcolor: '#fff', p: 2, borderRadius: 1 }}>
                    {dayExams.length === 0 ? (
                        <Typography color="gray" textAlign="center">
                            لا توجد امتحانات في هذا اليوم
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {dayExams.map((exam) => (
                                <Grid item xs={12} key={exam.id}>
                                    <Box
                                        sx={{
                                            bgcolor: exam.color,
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
                                        onClick={() => navigate(`/dashboard/exam-details/${exam.id}`)}
                                    >
                                        <Typography fontWeight="bold">{exam.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography fontSize="0.9rem">
                                                {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                                            </Typography>
                                            {/* أيقونة الضبط تفتح Popover */}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => { e.stopPropagation(); openPopover(e, exam); }}
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
                {selectedExam && (
                    <Box sx={{ direction: 'rtl' }}>
                        <Typography sx={{ color: '#22385F', fontWeight: 600, mb: 1 }}>
                            {selectedExam.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedExam.classroomName || classroomName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', my: 1 }}>
                            يوم {arabicDays[selectedExam.start_time.getDay()]} - {selectedExam.start_time.getDate()} {arabicMonths[selectedExam.start_time.getMonth()]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                            <Button
                                onClick={() => handleDelete(selectedExam.id)}
                                variant="contained"
                                disableElevation
                                sx={{ flex: 1, bgcolor: '#E5E7EB', color: '#6B7280', '&:hover': { bgcolor: '#D1D5DB' }, borderRadius: 2 }}
                            >
                                حذف
                            </Button>
                            <Button
                                onClick={() => handleEdit(selectedExam)}
                                variant="contained"
                                disableElevation
                                sx={{
                                    flex: 1,
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)',
                                    '&:hover': { background: 'linear-gradient(90deg, #23C6CD 0%, #193868 100%)' },
                                }}
                            >
                                تعديل
                            </Button>
                        </Box>
                    </Box>
                )}
            </Popover>
        </Box>
    );
};

export default DailyExamsCalendar;
