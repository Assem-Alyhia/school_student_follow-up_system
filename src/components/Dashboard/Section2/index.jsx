// src/components/Admin/Dashboard/DashboardWidgets.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Grid, Paper, Typography, Avatar, Select, MenuItem, CircularProgress, Button
} from '@mui/material';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

import { useQuery } from '@tanstack/react-query';

import { getAdminDashboard } from '../../../api/Admin/Dashboard/getDashboard';
import { getAllLevels } from '../../../api/Admin/Levels/getAllLevels';
import { getTopStudentsByLevel } from '../../../api/Admin/Students/getTopStudentsInClassroom';

const cardStyle = { p: 0, borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' };
const cardHeaderStyle = { backgroundColor: '#F1F7FA', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const COLORS = ['#4BA3C3', '#EF476F', '#FFD166'];
const topStudentBg = ['#B2DFDB', '#BBDEFB', '#E0E0E0'];

const DashboardWidgets = () => {
    const [levelId, setLevelId] = useState('');

    // ===== Query: dashboard =====
    const dashQ = useQuery({
        queryKey: ['admin:dashboard'],
        queryFn: getAdminDashboard,
        staleTime: 60 * 1000,
        retry: 1,
    });

    // ===== Query: levels =====
    const levelsQ = useQuery({
        queryKey: ['levels:all'],
        queryFn: getAllLevels,
        staleTime: 5 * 60 * 1000,
    });

    const levels = useMemo(() => {
        const raw = levelsQ.data;
        if (Array.isArray(raw)) return raw;
        return raw?.data || [];
    }, [levelsQ.data]);

    useEffect(() => {
        if (!levelId && Array.isArray(levels) && levels.length) {
            setLevelId(levels[0]?.id ?? '');
        }
    }, [levels, levelId]);

    // ===== Query: top students (depends on levelId) =====
    const topQ = useQuery({
        queryKey: ['top-students', String(levelId || '')],
        queryFn: () => getTopStudentsByLevel(levelId),
        enabled: !!levelId,
        staleTime: 60 * 1000,
    });

    const topStudents = useMemo(() => {
        const list = Array.isArray(topQ.data) ? topQ.data : [];
        return list.map((it) => {
            const s = it?.student ?? {};
            return {
                id: s.id,
                name: s.name ?? '—',
                prefix: s.prefix ?? '',
                avg: it?.averageScore ?? 0,
            };
        }).slice(0, 3);
    }, [topQ.data]);

    const adminData = dashQ.data;
    const feesData = useMemo(() => {
        const obj = adminData?.feesChartData || {};
        return Object.entries(obj)
            .map(([year, total]) => ({ year, total: Number(total) }))
            .sort((a, b) => a.year.localeCompare(b.year));
    }, [adminData]);

    const male = adminData?.studentGenderDistribution?.maleStudents ?? 0;
    const female = adminData?.studentGenderDistribution?.femaleStudents ?? 0;
    const totalStudents = (male || 0) + (female || 0);


    return (
        <Grid
            container spacing={3}
            sx={{
                padding: '2rem', borderRadius: 3, direction: 'rtl', mt: 2,
                width: '95%', margin: '2rem auto', boxShadow: '0 0 10px rgb(179, 179, 179)'
            }}
        >
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب</Typography>
                        <Box sx={{ fontSize: 12, color: '#8F929C' }}>إجمالي: {dashQ.isLoading ? '…' : (totalStudents || 0)}</Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        {dashQ.isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : dashQ.isError ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography color="error" sx={{ mb: 1.5 }}>
                                    {dashQ.error?.message || 'تعذر تحميل بيانات الطلاب'}
                                </Typography>
                                <Button variant="outlined" onClick={() => dashQ.refetch()}>إعادة المحاولة</Button>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    <ManIcon sx={{ fontSize: 32, color: '#00B4D8' }} />
                                    <WomanIcon sx={{ fontSize: 32, color: '#F76C6C', ml: 1 }} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                        <svg width="120" height="120">
                                            <circle cx="60" cy="60" r="50" fill="none" stroke="#D9D9D9" strokeWidth="10" />
                                            <circle
                                                cx="60" cy="60" r="50" fill="none" stroke="#00B4D8" strokeWidth="10"
                                                strokeDasharray="314"
                                                strokeDashoffset={314 * (1 - (male / (totalStudents || 1)))}
                                                transform="rotate(-90 60 60)"
                                            />
                                            <circle
                                                cx="60" cy="60" r="40" fill="none" stroke="#F76C6C" strokeWidth="10"
                                                strokeDasharray="251"
                                                strokeDashoffset={251 * (1 - (female / (totalStudents || 1)))}
                                                transform="rotate(-90 60 60)"
                                            />
                                        </svg>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', color: '#00B4D8', textAlign: 'center' }}>{male}</Typography>
                                        <Typography fontSize="12px" color="textSecondary">طالب</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', color: '#F76C6C', textAlign: 'center' }}>{female}</Typography>
                                        <Typography fontSize="12px" color="textSecondary">طالبة</Typography>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* ===== الرسوم ===== */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الرسوم</Typography>
                        <Typography sx={{ fontSize: 12, color: '#8F929C' }}>
                            {dashQ.isLoading ? '…' : (adminData?.meta?.currentAcademicYear || '')}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {dashQ.isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress />
                            </Box>
                        ) : dashQ.isError ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography color="error" sx={{ mb: 1.5 }}>
                                    {dashQ.error?.message || 'تعذر تحميل بيانات الرسوم'}
                                </Typography>
                                <Button variant="outlined" onClick={() => dashQ.refetch()}>إعادة المحاولة</Button>
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={feesData}>
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="total" stroke="#3A86FF" strokeWidth={3} name="إجمالي الرسوم" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* ===== الطلاب الأوائل ===== */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب الأوائل</Typography>
                        <Select
                            size="small"
                            value={levelId || ''}
                            onChange={(e) => setLevelId(e.target.value)}
                            displayEmpty
                            renderValue={(v) => {
                                if (!v) return 'اختر المستوى';
                                const lv = levels.find((l) => String(l.id) === String(v));
                                return lv?.name || `مستوى #${v}`;
                            }}
                            sx={{ minWidth: 200 }}
                        >
                            {levels.length === 0
                                ? <MenuItem disabled>لا توجد مستويات…</MenuItem>
                                : levels.map((l) => (
                                    <MenuItem key={l.id} value={l.id}>{l.name || l.title || `مستوى #${l.id}`}</MenuItem>
                                ))}
                        </Select>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        {levelsQ.isLoading || (topQ.isLoading && !!levelId) ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (levelsQ.isError || topQ.isError) ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography color="error" sx={{ mb: 1.5 }}>
                                    {(levelsQ.error?.message || topQ.error?.message) || 'تعذر تحميل أوائل الطلاب'}
                                </Typography>
                                <Button variant="outlined" onClick={() => { levelsQ.refetch(); topQ.refetch(); }}>
                                    إعادة المحاولة
                                </Button>
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {(topStudents.length ? topStudents : Array.from({ length: 3 })).map((st, idx) => {
                                    const name = st?.name ?? '—';
                                    const initial = name && name !== '—' ? name[0] : '#';
                                    const avg = st?.avg ?? 0;

                                    return (
                                        <Grid item xs={12} sm={4} key={st?.id || idx}>
                                            <Paper
                                                elevation={1}
                                                sx={{ borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: topStudentBg[idx % topStudentBg.length] }}
                                            >
                                                <Typography fontWeight="bold" color="#308A9F" sx={{ mb: 1 }}>{idx + 1}#</Typography>
                                                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}>{initial}</Avatar>
                                                <Typography fontWeight="bold" color="#22385F">{name}</Typography>
                                                <Typography fontSize="13px" color="#8F929C">متوسط: {Number(avg).toFixed(2)}</Typography>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* ===== الحضور (ثابت تجريبي) ===== */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الحضور</Typography>
                        <span />
                    </Box>
                    <Box sx={{ p: 2, position: 'relative', height: 180 }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={[{ name: 'الحضور', value: 45 }, { name: 'الغياب', value: 35 }, { name: 'التأخر', value: 20 }]}
                                    dataKey="value" outerRadius={60} innerRadius={40} paddingAngle={2}>
                                    {[0, 1, 2].map((i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ position: 'absolute', top: '20%', right: '10%', backgroundColor: '#4BA3C3', borderRadius: '12px', px: 2, py: 0.5 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>45%</Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', top: '40%', right: '10%', backgroundColor: '#EF476F', borderRadius: '12px', px: 2, py: 0.5 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>35%</Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', top: '60%', right: '10%', backgroundColor: '#FFD166', borderRadius: '12px', px: 2, py: 0.5 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>20%</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-around' }}>
                        <Typography fontSize="1rem" color="#0096C7">الحضور</Typography>
                        <Typography fontSize="1rem" color="#EF233C">الغياب</Typography>
                        <Typography fontSize="1rem" color="#F4A261">التأخر</Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DashboardWidgets;
