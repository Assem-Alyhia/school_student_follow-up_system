// src/components/Admin/Dashboard/OverviewSection.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import GroupsIcon from '@mui/icons-material/Groups';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { getAdminDashboard } from '../../../api/Admin/Dashboard/getDashboard';

const OverviewSection = () => {
    const [dash, setDash] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const res = await getAdminDashboard();
                if (!alive) return;
                setDash(res);
            } catch (e) {
                if (!alive) return;
                setErr(e?.message || 'حدث خطأ أثناء جلب البيانات');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const g = dash?.generalOverview || {};
    const cardGradient = 'linear-gradient(to top right, #308A9F, #35AFBC)';

    const stats = [
        { label: 'العدد الإجمالي للطلاب', value: g.totalStudents ?? 0, suffix: 'طالب', icon: <PeopleAltIcon sx={{ fontSize: 35, color: '#fff' }} /> },
        { label: 'العدد الإجمالي للمعلمين', value: g.totalTeachers ?? 0, suffix: 'معلم', icon: <SchoolIcon sx={{ fontSize: 35, color: '#fff' }} /> },
        { label: 'العدد الإجمالي لأولياء الأمور', value: g.totalParents ?? 0, suffix: 'ولي أمر', icon: <SupervisorAccountIcon sx={{ fontSize: 35, color: '#fff' }} /> },
        { label: 'العدد الإجمالي للموظفين', value: g.totalEmployees ?? 0, suffix: 'موظف', icon: <GroupsIcon sx={{ fontSize: 35, color: '#fff' }} /> },
        { label: 'العدد الإجمالي للحافلات', value: g.totalBuses ?? 0, suffix: 'حافلة', icon: <DirectionsBusIcon sx={{ fontSize: 35, color: '#fff' }} /> },
    ];

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                p: 3,
                direction: 'rtl',
                width: '95%',
                margin: '2rem auto',
                boxShadow: '0 0 10px rgb(179, 179, 179)',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#308A9F' }}>
                نظرة عامة على الأداء
            </Typography>
            <Typography sx={{ color: '#8F929C', mb: 3 }}>
                إحصاءات دقيقة تمنحك رؤية واضحة وشاملة
            </Typography>

            {loading ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : err ? (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography color="error">{err}</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={2.4} key={index}>
                            <Box
                                sx={{
                                    background: cardGradient,
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: 'center',
                                    color: '#fff',
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                                <Typography sx={{ fontSize: '.9rem', mt: 1 }}>
                                    {stat.label}
                                </Typography>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {stat.value}
                                </Typography>
                                <Typography sx={{ fontSize: '.9rem' }}>{stat.suffix}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default OverviewSection;
