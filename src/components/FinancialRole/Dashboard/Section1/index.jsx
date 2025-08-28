import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import GroupsIcon from '@mui/icons-material/Groups';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const stats = [
    { label: 'العدد الإجمالي للطلاب', value: 652, suffix: 'طالب', icon: <PeopleAltIcon /> },
    { label: 'العدد الإجمالي لأولياء الأمور', value: 76, suffix: 'ولي أمر', icon: <SupervisorAccountIcon /> },
    { label: 'العدد الإجمالي للصفوف', value: 5, suffix: 'صفوف', icon: <GroupsIcon /> },
    { label: 'العدد الإجمالي للساعات', value: 152, suffix: 'ساعة', icon: <DirectionsBusIcon /> },
];

const OverviewSection = () => {
    const gradient = 'linear-gradient(135deg, #35AFBC 0%, #22385F 100%)';

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                p: 3,
                direction: 'rtl',
                width: '95%',
                m: '2rem auto',
                boxShadow: '0 0 10px rgb(179 179 179 / 60%)',
                bgcolor: '#fff',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#308A9F' }}>
                نظرة عامة على الأداء
            </Typography>
            <Typography sx={{ color: '#8F929C', mb: 3 }}>
                إحصاءات دقيقة تمنحك رؤية واضحة وشاملة
            </Typography>

            <Grid container spacing={2}>
                {stats.map((stat, i) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} key={i}>
                        <Box
                            sx={{
                                position: 'relative',
                                background: gradient,
                                color: '#fff',
                                borderRadius: 3,
                                height: 100,
                                px: 2.2,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 8px 18px rgba(34, 56, 95, .18)',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    '&:before, &:after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: 180,
                                        height: 180,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.08)',
                                    },
                                    '&:before': { left: -60, bottom: -80 },
                                    '&:after': { right: -70, top: -90 },
                                }}
                            />

                            <Box
                                sx={{
                                    position: 'relative',
                                    ml: 1.5,
                                    width: 54,
                                    height: 54,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(1px)',
                                    flexShrink: 0,
                                }}
                            >
                                {React.cloneElement(stat.icon, { sx: { fontSize: 30, color: '#fff' } })}
                            </Box>

                            <Box sx={{ textAlign: 'right', mr: 1, flex: 1 }}>
                                <Typography
                                    sx={{ fontSize: '.86rem', opacity: 0.9, mb: 0.5, whiteSpace: 'nowrap' }}
                                >
                                    {stat.label}
                                </Typography>
                                <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography sx={{ fontSize: '.9rem', opacity: 0.95, mt: 0.2 }}>
                                    {stat.suffix}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default OverviewSection;
