import React from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton, Avatar
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Chat as ChatIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Section2 = ({ students }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {(students || []).map((student) => {
                    const s = student || {};
                    const u = s.user || {};

                    const img = u.image || ''; 
                    const name = s.name || u.name || '—';
                    const email = u.email || '—';
                    const prefix = s.prefix || '—';
                    const gender = s.gender === 'male' ? 'ذكر' : (s.gender === 'female' ? 'أنثى' : '—');
                    const joinedAt = s.created_at || u.created_at;
                    const joinedText = joinedAt ? new Date(joinedAt).toLocaleDateString('ar-EG') : '—';

                    const hasImg = Boolean(img && String(img).trim() !== '');
                    const initials = name && name !== '—'
                        ? name.split(' ').slice(0, 1).map(w => w[0]).join('')
                        : '—';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={s.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #308A9F',
                                    maxWidth: '90%',
                                    m: 'auto',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                        {prefix}
                                    </Typography>
                                    <IconButton disabled>
                                        <PersonIcon sx={{ color: '#22385F' }} />
                                    </IconButton>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Avatar
                                        src={hasImg ? img : undefined}
                                        alt={name}
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 1,
                                            bgcolor: hasImg ? 'transparent' : '#E0E0E0',
                                            color: '#22385F',
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {!hasImg && initials}
                                    </Avatar>
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        m: '1rem 0 2rem',
                                        color: '#308A9F',
                                        textShadow: '0 1px 5px rgb(155, 155, 155)',
                                    }}
                                >
                                    {name}
                                </Typography>

                                <Box sx={{ my: '2.5rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}>
                                        <Typography sx={{ color: '#308A9F' }}><strong>رقم التسجيل:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>الجنس:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>تاريخ الانضمام:</strong></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{prefix}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{gender}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{joinedText}</Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)',
                                        p: '.6rem 1rem',
                                        borderRadius: 1,
                                        m: '2.5rem auto',
                                        width: '80%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: '#fff', mr: 1, fontSize: 16 }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: 14 }}>
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ borderColor: '#D1D5DB', color: '#6B7280', fontSize: '14px', px: 2 }}
                                        onClick={() => navigate(`/teacherDashboard/students/tStudentDetails/${s.id}`)}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                    <Box>
                                        <IconButton disabled><PhoneIcon sx={{ color: '#22385F', fontSize: 20 }} /></IconButton>
                                        <IconButton disabled><ChatIcon sx={{ color: '#22385F', fontSize: 20 }} /></IconButton>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Section2;
