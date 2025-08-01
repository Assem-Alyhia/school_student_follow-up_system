import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Switch,
    Button,
    Divider,
    Grid,
    FormControlLabel,
    RadioGroup,
    Radio,
    Avatar,
    IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // الأيقونة التعبيرية

const SecuritySettings = () => {
    const [shareOption, setShareOption] = useState('limited');
    const [autoDelete, setAutoDelete] = useState(false);
    const mainColor = '#2ea394';

    const switches = [
        { label: 'السماح باستخدام الموقع الجغرافي', desc: 'تفعيل الموقع الجغرافي واستخدامه لتجربة المستخدمين', value: 'location' },
        { label: 'الظهور في نتائج البحث داخل النظام', desc: 'تتحكم في إمكانية ظهور حسابك ضمن نتائج البحث الداخلية.', value: 'search' },
        { label: 'تفعيل خدمات تحديد الموقع الجغرافي', desc: 'تحكم بإرسال الموقع عند الطلب من الإدارة.', value: 'geoService' },
        { label: 'استقبال الأخبار والتحديثات عبر الإيميل', desc: 'قم بتفعيل استقبال التنبيهات والأخبار من المنصة.', value: 'emailUpdates' },
        { label: 'استقبال الأخبار والتحديثات عبر الواتساب', desc: 'قم بتفعيل استقبال التنبيهات والأخبار من المنصة عبر الواتساب.', value: 'whatsappUpdates' },
        { label: 'تفعيل التحقق بخطوتين', desc: 'قم بتفعيل التحقق بخطوتين لحماية حسابك', value: 'twoFactor' },
        { label: 'تسجيل الخروج من جميع الأجهزة', desc: 'تسجيل الخروج لجميع المستخدمين من جميع الأجهزة.', value: 'logoutAll' },
    ];

    const sessions = [
        { name: 'Tyler Hero', location: 'سوريا', time: 'الجلسة الحالية' },
        { name: 'Tyler Hero', location: 'سوريا', time: 'أسبوع ماضي' },
        { name: 'Tyler Hero', location: 'تركيا', time: 'اليوم، 9:53 am' },
        { name: 'Tyler Hero', location: 'سوريا', time: 'شهر سابق' },
    ];

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            <Grid container spacing={3} alignItems="stretch">
                {/* القسم الأيمن */}
                <Grid item xs={12} md={8} display="flex" flexDirection="column" gap={3}>
                    <Paper sx={{ p: 3, flexGrow: 1 }} elevation={1}>
                        <Typography fontWeight="bold" mb={3} color={mainColor}>الخصوصية والأمان</Typography>
                        {switches.map((item, idx) => (
                            <Box key={item.value} py={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #f0f0f0">
                                <Box>
                                    <Typography fontWeight="500">{item.label}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Box>
                                <Switch defaultChecked={idx % 2 === 0} />
                            </Box>
                        ))}
                        <Button variant="outlined" color="error" sx={{ mt: 3 }}>
                            تسجيل الخروج من جميع الأجهزة
                        </Button>
                    </Paper>

                    <Paper sx={{ p: 3, flexGrow: 1 }} elevation={1}>
                        <Typography fontWeight="bold" mb={3}>جلسات تسجيل الدخول</Typography>
                        {sessions.map((s, idx) => (
                            <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom="1px solid #f0f0f0">
                                <IconButton><MoreVertIcon /></IconButton>
                                <Typography sx={{ width: '25%' }} color="text.secondary">{s.time}</Typography>
                                <Typography sx={{ width: '25%' }}>{s.location}</Typography>
                                <Box display="flex" alignItems="center" gap={1} sx={{ width: '40%' }}>
                                    <Avatar alt={s.name} src="/avatar.jpg" sx={{ width: 32, height: 32 }} />
                                    <Typography>{s.name}</Typography>
                                </Box>
                            </Box>
                        ))}
                        <Box mt={2} textAlign="center">
                            <Button variant="text" sx={{ color: mainColor }}>عرض المزيد</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* القسم الأيسر */}
                <Grid item xs={12} md={4} display="flex" flexDirection="column" gap={3}>
                    <Paper sx={{ p: 3 }} elevation={1}>
                        <Typography fontWeight="bold" mb={2}>إدارة بياناتك</Typography>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ alignItems: 'flex-start', mb: 2 , borderBottom:"1px solid #f0f0f0" ,padding:'1rem 0' }}>
                            <Typography>تنزيل بياناتك</Typography>
                            <Button variant="outlined" size="small">تنزيل</Button>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ alignItems: 'flex-start', mb: 2 , borderBottom:"1px solid #f0f0f0" ,padding:'1rem 0' }}>
                            <Typography>حذف جميع بياناتك</Typography>
                            <Button variant="outlined" size="small" color="error">حذف</Button>
                        </Box>

                        <FormControlLabel
                            control={<Switch checked={autoDelete} onChange={(e) => setAutoDelete(e.target.checked)} />}
                            label={<Typography>الحذف التلقائي للبيانات القديمة
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                    يمكنك تفعيل الحذف التلقائي للبيانات بعد مدة زمنية محددة.
                                </Typography>
                            </Typography>}
                            sx={{ mb: 1 }}
                        />

                    </Paper>

                    <Paper sx={{ p: 3 }} elevation={1}>
                        <Typography fontWeight="bold" mb={2}>إعدادات مشاركة التقارير</Typography>
                        <RadioGroup value={shareOption} onChange={(e) => setShareOption(e.target.value)}>
                            <FormControlLabel
                                value="limited"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography fontWeight="bold">أشخاص محددون فقط</Typography>
                                        <Typography variant="caption" color="text.secondary">دعوة عبر البريد الإلكتروني</Typography>
                                    </Box>
                                }
                                sx={{ alignItems: 'flex-start', mb: 2 , borderBottom:"1px solid #f0f0f0" ,padding:'1rem 0'}}
                            />
                            <FormControlLabel
                                value="link"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography fontWeight="bold">أشخاص لديهم الرابط</Typography>
                                        <Typography variant="caption" color="text.secondary">(رابط عام للتقرير)</Typography>
                                    </Box>
                                }
                                sx={{ alignItems: 'flex-start', mb: 2 , borderBottom:"1px solid #f0f0f0" ,padding:'1rem 0' }}
                            />
                            <FormControlLabel
                                value="private"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography fontWeight="bold">لا أحد</Typography>
                                        <Typography variant="caption" color="text.secondary">(خصوصي)</Typography>
                                    </Box>
                                }
                                sx={{ alignItems: 'flex-start', mb: 2 , padding:'1rem 0' }}
                            />
                        </RadioGroup>

                    </Paper>

                    <Paper sx={{ p: 3, flexGrow: 1 }} elevation={1} display="flex" flexDirection="column" justifyContent="space-between">
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <SupportAgentIcon color="primary" sx={{ fontSize: 40 }} />
                                <Typography fontWeight="bold">الدعم الفني</Typography>
                            </Box>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Box
                                    component="img"
                                    src="/SettingUser/1.png"
                                    alt="Support"
                                    sx={{ width: '50%', objectFit: 'contain' }}
                                />
                            </Box>
                            <Typography variant="body2" mb={2}>
                                هل تحتاج إلى مساعدة؟ تواصل مع فريق الدعم للحصول على المساعدة والإجابة على استفساراتك.
                            </Typography>
                        </Box>
                        <Button variant="contained" fullWidth sx={{ backgroundColor: mainColor, mt: 2 }}>
                            الاتصال بالدعم
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SecuritySettings;
