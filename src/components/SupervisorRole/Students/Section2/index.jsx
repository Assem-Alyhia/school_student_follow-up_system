// src/components/SupervisorRole/Students/Section2.jsx
import React from 'react';
import {
    Box, Paper, Typography, Grid, IconButton, Button, Avatar
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Chat as ChatIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GRADIENT = 'linear-gradient(90deg,#35AFBC,#308A9F,#22385F)';

export default function Section2({ students = [] }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            <Grid container spacing={3}>
                {students.map((s) => {
                    const name = s?.name || s?.user?.name || '—';
                    const image = s?.user?.image || '/images/avatars/default.png';
                    const email = s?.user?.email || s?.email || '—';
                    const reg = s?.prefix || s?.user?.prefix || '—';
                    const genderLabel =
                        s?.gender === 'male' ? 'ذكر' : s?.gender === 'female' ? 'أنثى' : '—';
                    const joinedISO = s?.enrollment_date || s?.created_at || s?.user?.created_at;
                    const joined = joinedISO ? new Date(joinedISO).toLocaleDateString('ar-EG') : '—';
                    const classroom =
                        s?.classroom?.name ||
                        (Array.isArray(s?.classrooms) && s.classrooms[0]?.name) ||
                        '—';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={s?.id ?? name}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3, // ↑ زيادة الحشوة
                                    borderRadius: 2.5,
                                    border: '1px solid rgba(53,175,188,0.35)',
                                    boxShadow: '0 10px 24px rgba(34,56,95,0.10)',
                                    bgcolor: '#fff',
                                    position: 'relative',
                                    minHeight: { xs: 380, sm: 400 }, // ↑ الكارد أطول
                                }}
                            >
                                {/* أعلى البطاقة: ID يسار + شارة يمين */}
                                <Typography
                                    variant="caption"
                                    sx={{ position: 'absolute', top: 12, left: 14, color: '#A0A8B0' }}
                                >
                                    {reg}
                                </Typography>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 12,
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        display: 'grid',
                                        placeItems: 'center',
                                        background: '#fff',
                                        border: '1px solid rgba(53,175,188,0.25)',
                                        boxShadow: '0 2px 8px rgba(34,56,95,0.14)',
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 17, color: '#308A9F' }} />
                                </Box>

                                {/* صورة الطالب */}
                                <Box sx={{ display: 'grid', placeItems: 'center', mt: 3, mb: 1 }}>
                                    <Avatar
                                        src={image}
                                        alt={name}
                                        variant="rounded"
                                        sx={{
                                            width: 104,  // ↑ أكبر
                                            height: 104,
                                            borderRadius: 2,
                                            bgcolor: '#fff',
                                            boxShadow: '0 14px 28px rgba(34,56,95,.14)',
                                        }}
                                    />
                                </Box>

                                {/* الاسم + الصف */}
                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: 900,
                                        fontSize: 18,
                                        color: '#308A9F',
                                        textAlign: 'center',
                                        letterSpacing: '.2px',
                                    }}
                                >
                                    {name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#7A8899', textAlign: 'center', mb: 2.5 }}
                                >
                                    {classroom}
                                </Typography>

                                {/* 3 خانات: رقم التسجيل / الجنس / تاريخ الانضمام */}
                                <Box sx={{ mx: 'auto', maxWidth: 360, mb: 2.5 }}>
                                    <Grid container rowSpacing={1.2}>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ color: '#308A9F', fontWeight: 900, mb: 0.5 }}>
                                                رقم التسجيل:
                                            </Typography>
                                            <Typography sx={{ color: '#586E75' }}>{reg}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ color: '#308A9F', fontWeight: 900, mb: 0.5 }}>
                                                الجنس:
                                            </Typography>
                                            <Typography sx={{ color: '#586E75' }}>{genderLabel}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ color: '#308A9F', fontWeight: 900, mb: 0.5 }}>
                                                تاريخ الانضمام:
                                            </Typography>
                                            <Typography sx={{ color: '#586E75' }}>{joined}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* شريط الإيميل المتدرّج */}
                                <Box
                                    sx={{
                                        background: GRADIENT,
                                        px: 2,
                                        py: 1.1,           // ↑ ارتفاع أكبر
                                        borderRadius: 1.8, // ↑ زوايا أوضح
                                        width: '92%',
                                        mx: 'auto',
                                        my: 2.2,
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.28)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1.2,
                                        }}
                                    >
                                        <EmailIcon sx={{ color: '#fff', fontSize: 17 }} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#fff', fontSize: 14, direction: 'ltr' }}
                                        >
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* الشريط السفلي: أيقونات يسار + زر عرض التفاصيل يمين */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,       // ↑ تباعد سفلي
                                        direction: 'ltr',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 1.2 }}>
                                        {[<PhoneIcon />, <ChatIcon />, <EmailIcon />, <PersonIcon />].map(
                                            (Icon, i) => (
                                                <IconButton
                                                    key={i}
                                                    size="small"
                                                    sx={{
                                                        width: 34,   // ↑ أكبر
                                                        height: 34,
                                                        bgcolor: '#F4F7F9',
                                                        border: '1px solid #E3ECEF',
                                                        boxShadow: '0 3px 8px rgba(34,56,95,0.10)',
                                                    }}
                                                >
                                                    {React.cloneElement(Icon, { sx: { color: '#8FA0AE', fontSize: 17 } })}
                                                </IconButton>
                                            )
                                        )}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        onClick={() => navigate(`/supervisorDashboard/supervisorStudent/studentDetails/${s?.id}`)}
                                        sx={{
                                            borderRadius: 2,
                                            px: 2.6,
                                            py: 0.6,
                                            borderColor: '#D0DCE0',
                                            color: '#5E7285',
                                            fontWeight: 800,
                                            '&:hover': { borderColor: '#308A9F', color: '#308A9F' },
                                        }}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
