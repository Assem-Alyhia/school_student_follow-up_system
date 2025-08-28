import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Button
} from '@mui/material';
import { getStudentById } from '../../../../api/Admin/Students/getStudentById';

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const StudentScheduleDetails = () => {
    const { studentId, year, month, day } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ للرجوع

    const selectedDate = new Date(`${year}-${month}-${day}`);
    const formattedDate = `${selectedDate.getDate()} ${arabicMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    const dayName = arabicDays[selectedDate.getDay()];

    const fetchSchedule = async () => {
        try {
            const student = await getStudentById(studentId);
            const allSchedules = student?.classroom?.schedules || [];

            const filtered = allSchedules.filter((item) => {
                const itemDate = new Date(item.start_time);
                return (
                    itemDate.getFullYear() === +year &&
                    itemDate.getMonth() + 1 === +month &&
                    itemDate.getDate() === +day
                );
            });

            setSchedules(filtered);
        } catch (err) {
            console.error('فشل في جلب تفاصيل الجدول:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [studentId, year, month, day]);

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* زر الرجوع */}
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                    رجوع
                </Button>

                <Typography variant="h5" fontWeight="bold">
                    تفاصيل الجدول ليوم {dayName} - {formattedDate}
                </Typography>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : schedules.length === 0 ? (
                <Typography color="text.secondary">
                    لا توجد أي أحداث مجدولة لهذا اليوم.
                </Typography>
            ) : (
                schedules.map((event) => (
                    <Card key={event.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                {event.title}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>النوع:</strong> {event.type === 'daily' ? 'حصّة يومية' : 'اختبار'}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>من:</strong>{' '}
                                {new Date(event.start_time).toLocaleTimeString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>إلى:</strong>{' '}
                                {new Date(event.end_time).toLocaleTimeString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>

                            {event.description && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {event.description}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default StudentScheduleDetails;
