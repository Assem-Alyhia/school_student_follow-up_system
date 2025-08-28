import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Paper, Avatar, Button,
    Chip, InputBase, IconButton, Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { getTeacherStudentById } from '../../../../api/Teacher/Students/getTeacherStudentById';


const TStudentDetails = () => {
    const { id } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

        const [commentText, setCommentText] = useState('');
    const [notifications, setNotifications] = useState([]);

    const gradientColor = 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)';

    const fmtDate = (val) => {
        if (!val) return '—';
        const d = new Date(val);
        return isNaN(d) ? '—' : d.toLocaleDateString('ar-EG');
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!id) return;
                setLoading(true);
                const res = await getTeacherStudentById(id);
                if (mounted) {
                    const data = res?.data ?? null;
                    setStudentData(data);
                    const apiNotes = Array.isArray(data?.notifications)
                        ? data.notifications
                        : null;

                    setNotifications(
                        apiNotes ?? [
                            {
                                id: 1,
                                author: data?.user?.name || 'Joann Michael',
                                role: 'معلم',
                                tone: 'إيجابي',
                                avatar: data?.user?.image || '/Students/default.jpg',
                                text:
                                    'أثبت شرح الفرق بين الرؤية والرسالة. قد يكون من المفيد إضافة مثال محلي لشركات عربية معروفة لزيادة ارتباط القارئ.',
                                date: new Date().toISOString(),
                                likes: 24,
                                replies: 0,
                            },
                            {
                                id: 2,
                                author: 'إداري',
                                role: 'إداري',
                                tone: 'سلبي',
                                avatar: '/Students/default.jpg',
                                text:
                                    'المثال يحتاج تبسيطًا أكثر للطلاب الأصغر سنًا. يُفضّل استخدام صور توضيحية.',
                                date: new Date().toISOString(),
                                likes: 5,
                                replies: 2,
                            },
                        ]
                    );
                }
            } catch (e) {
                console.error(e?.message || e);
                if (mounted) setStudentData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const _handlePrint = () => window.print();

    const handleAddComment = () => {
        const text = commentText.trim();
        if (!text) return;
        const newItem = {
            id: Date.now(),
            author: studentData?.user?.name || 'معلم',
            role: 'معلم',
            tone: 'إيجابي',
            avatar: studentData?.user?.image || '/Students/default.jpg',
            text,
            date: new Date().toISOString(),
            likes: 0,
            replies: 0,
        };
        setNotifications((s) => [newItem, ...s]);
        setCommentText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    if (loading) return <Typography sx={{ p: 5 }}>جاري تحميل البيانات...</Typography>;
    if (!studentData) return <Typography sx={{ p: 5 }}>لا توجد بيانات متاحة.</Typography>;

    const u = studentData.user || {};
    const parent = studentData.parent || {};
    const classroom = studentData.classroom || {};
    const supervisor = studentData.supervisor || {};

    const avatarSrc = u.image && u.image !== '' ? u.image : '/Students/default.jpg';
    const displayGender = studentData.gender === 'male' ? 'ذكر' : (studentData.gender === 'female' ? 'أنثى' : '—');

    const addrLine1 = (studentData.address || '').split('\n')[0] || '---';
    const addrLine2 = (studentData.address || '').split('\n')[1] || '---';

    return (
        <Box sx={{ p: 2, direction: 'rtl', bgcolor: '#f5f6fa' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', border: '1px solid #308A9F', borderRadius: 2 }}>
                        <Box sx={{ position: 'relative', width: 100, height: 100, m: 'auto', mb: 3 }}>
                            <Avatar src={avatarSrc} sx={{ width: '100%', height: '100%', borderRadius: 2 }} />
                            <Box sx={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50', border: '2px solid #F5F5F5' }} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#308A9F', mb: 1 }}>
                            {studentData.name || u.name || '—'}
                        </Typography>
                        <Typography sx={{ color: '#586E75', mb: 2 }}>
                            {classroom.name || '---'}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
                            <Typography sx={{ color: '#308A9F' }}>
                                رقم التسجيل:<br />
                                <span style={{ color: '#586E75' }}>{studentData.prefix || '—'}</span>
                            </Typography>
                            <Typography sx={{ color: '#308A9F' }}>
                                الجنس:<br />
                                <span style={{ color: '#586E75' }}>{displayGender}</span>
                            </Typography>
                            <Typography sx={{ color: '#308A9F' }}>
                                تاريخ الانضمام:<br />
                                <span style={{ color: '#586E75' }}>{fmtDate(studentData.enrollment_date)}</span>
                            </Typography>
                        </Box>

                        <Box sx={{ background: gradientColor, borderRadius: 1, p: 1, mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '14px' }}>
                                {u.email || '---'}
                            </Typography>
                        </Box>

                        <Button fullWidth variant="outlined" sx={{ color: '#308A9F', borderColor: '#308A9F', mt: 1, mb: 2 }} onClick={_handlePrint}>
                            طباعة
                        </Button>
                    </Paper>

                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2 }}>
                        <Box sx={{ bgcolor: '#e0e0e0', p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>
                                العنوان
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>المدينة</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{addrLine2}</Typography></Grid>

                                <Grid item xs={6}><Typography sx={{ color: '#586E75' }}>العنوان</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{ color: '#308A9F' }}>{addrLine1}</Typography></Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ bgcolor: '#e0e0e0', p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>
                                تفاصيل ولي الأمر
                            </Typography>
                        </Box>

                        <Box sx={{ p: '1rem 2rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar src="/Students/father.png" sx={{ width: 80, height: 80, borderRadius: 2 }} />
                                <Box sx={{ my: 1 }}>
                                    <Typography sx={{ color: '#586E75' }}>
                                        <strong style={{ color: '#308A9F' }}>رقم الهاتف:</strong> {parent.phone || '---'}
                                    </Typography>
                                    <Typography sx={{ color: '#586E75' }}>
                                        <strong style={{ color: '#308A9F' }}>البريد الإلكتروني:</strong> {'—'}
                                    </Typography>
                                    <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>
                                        {parent.name || '---'}
                                    </Typography>
                                    <Typography sx={{ color: '#586E75' }}>ولي الأمر</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ border: '1px solid #308A9F', mt: 2, borderRadius: 2, mb: 2 }}>
                        <Box sx={{ bgcolor: '#e0e0e0', p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: '#308A9F', textAlign: 'center' }}>
                                الإشراف والنقل
                            </Typography>
                        </Box>

                        <Box sx={{ p: 2 }}>
                            {[
                                { label: 'المشرفة', name: supervisor.name || '---', avatar: '/Students/supervisor.png' },
                                { label: 'السائق', name: 'أبو محمد', avatar: '/Students/driver.png' },
                            ].map((person, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={person.avatar} sx={{ width: 50, height: 50, ml: 1 }} />
                                    <Box>
                                        <Typography sx={{ color: '#308A9F' }}>{person.label}</Typography>
                                        <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>{person.name}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ border: '1px solid #308A9F', borderRadius: 2, mb: 3 }}>
                        <Box sx={{ bgcolor: '#e0e0e0', p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: 'center', color: '#308A9F' }}>
                                تفاصيل النقل
                            </Typography>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: '#586E75' }}>موعد الانطلاق</Typography>
                                    <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>7:15 صباحاً</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: '#586E75' }}>موعد العودة</Typography>
                                    <Typography sx={{ color: '#308A9F', fontWeight: 'bold' }}>2:45 ظهراً</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: '#586E75' }}>الملاحظات</Typography>
                                    {[
                                        'يجب على الطلاب الحضور إلى نقطة التجمع قبل 7:10 صباحاً',
                                        'في حال تغييرات طارئة يتم التواصل مع المشرفة مباشرة',
                                    ].map((note, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20, mr: 1, ml: 1 }} />
                                            <Typography sx={{ color: '#308A9F' }}>{note}</Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#f0f2f5', borderRadius: 1 }}>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 1,
                                background: gradientColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1,
                                boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                            }}
                            onClick={handleAddComment}
                        >
                            <SendRoundedIcon sx={{ color: '#fff' }} />
                        </Box>
                        <InputBase
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="أضف تعليق"
                            sx={{
                                flex: 1,
                                pr: 2,
                                bgcolor: '#fff',
                                borderRadius: 1,
                                height: 46,
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: 'inset 0 0 0 1px #e5e7eb',
                                direction: 'rtl',
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                        {notifications.map((n) => (
                            <Paper key={n.id} elevation={0} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'flex-start', gap: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: .5 }}>
                                        <Chip size="small" label={n.tone} sx={{
                                            bgcolor: n.tone === 'إيجابي' ? '#e8f5e9' : n.tone === 'سلبي' ? '#ffebee' : '#eef2ff',
                                            color: n.tone === 'إيجابي' ? '#2e7d32' : n.tone === 'سلبي' ? '#c62828' : '#3730a3',
                                            borderRadius: 1
                                        }} />
                                        <Chip size="small" label={n.role} sx={{ bgcolor: '#e0f2f1', color: '#00695c', borderRadius: 1 }} />
                                    </Box>

                                    <Typography sx={{ color: '#308A9F', fontWeight: 700, mb: .5 }}>
                                        {n.author}
                                    </Typography>

                                    <Typography sx={{ color: '#374151', lineHeight: 1.9, mb: 1 }}>
                                        {n.text}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                                        <Typography variant="caption">{fmtDate(n.date)}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                                            <ThumbUpOffAltOutlinedIcon fontSize="small" /><Typography variant="caption">أعجبني</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                                            <ChatBubbleOutlineOutlinedIcon fontSize="small" /><Typography variant="caption">({n.likes}) رد</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                                            <ReplyOutlinedIcon fontSize="small" /><Typography variant="caption">رد</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Avatar src={n.avatar} sx={{ width: 54, height: 54, borderRadius: 2 }} />
                            </Paper>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TStudentDetails;
