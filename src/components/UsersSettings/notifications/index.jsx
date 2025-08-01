import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Switch,
    Button,
    Divider,
    IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PaymentIcon from '@mui/icons-material/Payment';
import UpdateIcon from '@mui/icons-material/Update';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReplayIcon from '@mui/icons-material/Replay';

const NotificationSettings = () => {
    const _mainColor = '#2ea394';

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            <Grid container spacing={3}>
                {/* عمود الإعدادات (البداية) */}
                <Grid item xs={12} md={8}>
                    {/* قنوات الإشعارات */}
                    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                        <Typography fontWeight="bold" mb={2}>قنوات الإشعارات</Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box>
                                <Typography fontWeight="500">البريد الإلكتروني</Typography>
                                <Typography variant="body2" color="text.secondary">wessalal101@gmail.com</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Switch checked />
                                <IconButton><EmailIcon /></IconButton>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography fontWeight="500">الجوال</Typography>
                                <Typography variant="body2" color="text.secondary">+(123) 456789000</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Switch />
                                <IconButton><SmartphoneIcon /></IconButton>
                            </Box>
                        </Box>
                    </Paper>

                    {/* الإشعارات الأخرى */}
                    <Paper sx={{ p: 3 }} elevation={1}>
                        <Typography fontWeight="bold" mb={2}>الإشعارات الأخرى</Typography>

                        {[
                            {
                                title: 'تنبيهات الحضور والانصراف',
                                desc: 'إشعارات فورية عند تسجيل حضور أو انصراف الطالب من المدرسة',
                                icon: <WarningAmberIcon />,
                            },
                            {
                                title: 'تنبيهات الدفع',
                                desc: 'تنبيه جديد بالأقساط الغير مدفوعة',
                                icon: <PaymentIcon />,
                                button: 'عرض الأقساط',
                            },
                            {
                                title: 'تنبيه التغذية الراجعة',
                                desc: 'عند إرسال تعليق على واجبات الطالب أو عبر الواتساب',
                                icon: <ReplayIcon />,
                            },
                            {
                                title: 'تنبيهات الأداء الأكاديمي',
                                desc: 'تنبيه يصلك عند صدور تقارير الاختبارات، أو إضافة تقييمات من المعلمين بخصوص الأداء الأكاديمي للطالب',
                                icon: <SchoolIcon />,
                            },
                            {
                                title: 'تذكير بالأنشطة والاجتماعات',
                                desc: 'تنبيه بالأنشطة المدرسية مثل الاختبارات، أو اللقاءات، أو الاجتماعات المخصصة للطلاب',
                                icon: <EventNoteIcon />,
                                button: 'عرض المناسبات والاجتماعات',
                            },
                            {
                                title: 'تغيير الحالة',
                                desc: 'إشعار يرسل تلقائياً عند تغيير حالة الطالب في النظام، كالحذف أو إضافة جديدة.',
                                icon: <UpdateIcon />,
                            },
                        ].map((item, idx) => (
                            <Box key={idx} py={2} borderBottom="1px solid #f0f0f0" display="flex" justifyContent="space-between" alignItems="center">
                                <Switch defaultChecked />
                                <Box flexGrow={1} pr={2}>
                                    <Typography fontWeight="500">{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                    {item.button && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        >
                                            {item.button}
                                        </Button>
                                    )}
                                </Box>
                                <IconButton>{item.icon}</IconButton>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* عمود عدم الإزعاج (النهاية) */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }} elevation={1}>
                        <Typography fontWeight="bold" mb={2}>عدم الإزعاج</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            تفعيل وضع "عدم الإزعاج" لإيقاف جميع الإشعارات وتمكين التركيز دون انقطاعات خلال ساعات أو مهام محددة.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<NotificationsOffIcon />}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            توقيف الإشعارات
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotificationSettings;
