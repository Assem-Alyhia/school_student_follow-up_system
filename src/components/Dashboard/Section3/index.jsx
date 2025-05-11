import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ar from 'date-fns/locale/ar';
registerLocale('ar', ar);

const QuickAccessSection = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([
        { title: 'اجتماع مع أولياء الأمور', date: '04/04/2025', time: '04:00 مساءً', icon: <EventIcon /> },
        { title: 'توزيع الوجبات', date: '04/04/2025', time: '04:00 مساءً', icon: <EventIcon /> },
    ]);

    const handleAddEvent = () => {
        if (eventTitle && eventDate) {
            const formattedDate = new Intl.DateTimeFormat('ar-EG').format(eventDate);
            setUpcomingEvents([...upcomingEvents, {
                title: eventTitle,
                date: formattedDate,
                time: '04:00 مساءً',
                icon: <EventIcon />
            }]);
            setEventTitle('');
            setEventDate(null);
            setOpenDialog(false);
        }
    };

    return (
        <Grid container spacing={3} sx={{ direction: 'rtl', width: '95%', margin: '2rem auto' }}>
            {/* التقويم والأحداث */}
            <Grid item xs={12} md={8}>
                <Paper sx={{ borderRadius: 3 }}>
                    <Box sx={{ background: 'linear-gradient(to left, #308A9F, #35AFBC)', p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography fontWeight="bold" fontSize="1.3rem" color="white">أضف حدث جديد</Typography>
                            <Typography fontSize=".8rem" color="#C7C7C7">قم بإنشاء حدث جديد</Typography>
                        </Box>
                        <IconButton onClick={() => setOpenDialog(true)} sx={{ color: 'white' }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{
                            mt: 2,
                            width: '100%',
                            '& .react-datepicker': { width: '100%' },
                            '& .react-datepicker__month-container': { width: '100%' },
                            '& .react-datepicker__week': {
                                display: 'flex',
                                justifyContent: 'space-between'
                            },
                            '& .react-datepicker__day-name, & .react-datepicker__day': {
                                flex: 1,
                                textAlign: 'center',
                                margin: '0 4px',
                                p: 2,
                                fontSize: '1rem'

                            },
                            '& .react-datepicker__day-name': {
                                color: '#B3B3B3'
                            },
                            '& .react-datepicker__day-names': {
                                display: 'flex',
                                justifyContent: 'space-between',

                            },
                            '& h2.react-datepicker__current-month': {
                                padding: ".5rem 0",
                                fontSize: '1.1rem'
                            },
                            '& .react-datepicker__navigation--next': {
                                top: "1rem",
                                right: "1rem"

                            },
                            '& .react-datepicker__navigation--previous': {
                                top: "1rem",
                                left: "1rem",
                            }
                        }}>
                            <DatePicker
                                selected={eventDate}
                                onChange={(date) => setEventDate(date)}
                                locale="ar"
                                dateFormat="dd/MM/yyyy"
                                inline
                                calendarClassName="custom-calendar"
                            />
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ backgroundColor: '#F2F2F2', p: 2, borderRadius: 2 }}>
                                <Typography fontWeight="bold" fontSize="16px" color="#308A9F">الأحداث القادمة</Typography>
                            </Box>
                            {upcomingEvents.map((event, i) => (
                                <Paper key={i} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    backgroundColor: '#F3F7FA'
                                }}>
                                    <Box sx={{ mr: 2, color: '#308A9F' }}>{event.icon}</Box>
                                    <Box>
                                        <Typography fontWeight="bold" fontSize="14px" color="#22385F">{event.title}</Typography>
                                        <Typography fontSize="12px" color="#8F929C">{event.date} - {event.time}</Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </Grid>

            {/* الإشعارات والروابط السريعة */}
            <Grid item xs={12} md={4}>
                <Paper sx={{ borderRadius: 3 }}>
                    <Box sx={{ backgroundColor: '#F2F2F2', p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography fontWeight="bold" fontSize="18px" color="#308A9F">الإشعارات</Typography>
                        <Button size="small" sx={{ color: '#308A9F', border: '1px solid #B4D4DD', borderRadius: 2, px: 2, py: 0.5 }}>عرض الكل</Button>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {[{ title: 'إشعار سلوكي (للطلاب)', desc: 'تم تسجيل سلوك غير مرغوب من أحد الطلاب.', color: '#EF5350' },
                        { title: 'إشعار دفع الرسوم', desc: 'يرجى تسديد رسوم بقيمة 500 ريال.', color: '#BA68C8' },
                        { title: 'إشعار الجدول', desc: 'تم تحديث جدول الحصص الدراسي.', color: '#7986CB' },
                        { title: 'إشعار النقل المدرسي', desc: 'يرجى مراجعة بيانات النقل المدرسي.', color: '#4DB6AC' },
                        { title: 'إشعار الحضور', desc: 'تم تسجيل حضور جديد للطالب.', color: '#FFD54F' }].map((note, i) => (
                            <Paper key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1.5, borderRadius: 2 }}>
                                <NotificationsIcon sx={{ color: note.color, mr: 1 }} />
                                <Box>
                                    <Typography fontWeight="bold" fontSize="14px" color="#22385F">{note.title}</Typography>
                                    <Typography fontSize="13px" color="text.secondary">{note.desc}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Paper>

                <Paper sx={{ borderRadius: 3, mt: 2 }}>
                    <Box sx={{ backgroundColor: '#F2F2F2', p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                        <Typography fontWeight="bold" fontSize="18px" color="#308A9F">الروابط السريعة</Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {[{ title: 'الجداول', icon: <CalendarTodayIcon />, desc: 'استعراض وتعديل جدول الحصص اليومية' },
                        { title: 'الحضور', icon: <Avatar sx={{ bgcolor: '#FFD54F', width: 24, height: 24 }}>ح</Avatar>, desc: 'استعراض وتحليل سجلات الحضور اليومية للطلاب' },
                        { title: 'النتائج', icon: <Avatar sx={{ bgcolor: '#FFB74D', width: 24, height: 24 }}>ن</Avatar>, desc: 'استعراض نتائج الطلاب الفصلية' },
                        { title: 'النقل المدرسي', icon: <Avatar sx={{ bgcolor: '#81C784', width: 24, height: 24 }}>ن</Avatar>, desc: 'إدارة وتتبع النقل المدرسي' },
                        { title: 'إدارة المستخدم', icon: <Avatar sx={{ bgcolor: '#9575CD', width: 24, height: 24 }}>م</Avatar>, desc: 'إدارة المستخدمين وصلاحياتهم بالكامل' }].map((link, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ mr: 1 }}>{link.icon}</Box>
                                <Box>
                                    <Typography fontSize="14px" color="#22385F" fontWeight="bold">{link.title}</Typography>
                                    <Typography fontSize="12px" color="#8F929C">{link.desc}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Grid>

            {/* Dialog لإضافة الحدث */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>إضافة حدث جديد</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="عنوان الحدث"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
                    <Button onClick={handleAddEvent} variant="contained">إضافة</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default QuickAccessSection;