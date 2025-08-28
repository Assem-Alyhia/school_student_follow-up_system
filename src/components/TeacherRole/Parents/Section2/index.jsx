// components/Teacher/Parents/Section2.jsx
import React from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton, Avatar
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Section2 = ({ parents = [] }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {parents.map((parent) => {
                    const p = parent || {};
                    const name = p.name || '—';
                    const prefix = p.prefix || '—';
                    const phone = p.phone || '—';
                    const dob = p.dob ? new Date(p.dob).toLocaleDateString('ar-EG') : '—';
                    
                    const initials = name && name !== '—'
                        ? name.trim().split(' ').slice(0, 2).map(w => w[0]).join('')
                        : '—';


                    return (
                        <Grid item xs={12} sm={6} md={4} key={p.id}>
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

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Avatar
                                        alt={name}
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 1,
                                            bgcolor: '#E0E0E0',
                                            color: '#22385F',
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {initials}
                                    </Avatar>
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        m: '1rem 0 1.25rem',
                                        color: '#308A9F',
                                        textShadow: '0 1px 5px rgb(155, 155, 155)',
                                    }}
                                >
                                    {name}
                                </Typography>

                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)',
                                        p: '.6rem 1rem',
                                        borderRadius: 1,
                                        m: '0.75rem auto',
                                        width: '85%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <PhoneIcon sx={{ color: '#fff', fontSize: 16 }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: 14 }}>
                                            {phone}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)',
                                        p: '.6rem 1rem',
                                        borderRadius: 1,
                                        m: '0.75rem auto 1.25rem',
                                        width: '85%',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 14 }}>
                                        تاريخ الميلاد: {dob}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ borderColor: '#D1D5DB', color: '#6B7280', fontSize: '14px', px: 2 }}
                                        onClick={() => navigate(`/teacherDashboard/parents/tParentDetails/${p.id}`)}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                    <Box>
                                        <IconButton disabled><PhoneIcon sx={{ color: '#22385F', fontSize: 20 }} /></IconButton>
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
