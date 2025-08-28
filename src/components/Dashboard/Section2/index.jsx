// src/components/Admin/Dashboard/DashboardWidgets.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Grid, Paper, Typography, Avatar, Select, MenuItem
} from '@mui/material';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

import { getAdminDashboard } from '../../../api/Admin/Dashboard/getDashboard';
import { getAllLevels } from '../../../api/Admin/Levels/getAllLevels';
import { getTopStudentsByLevel } from '../../../api/Admin/Students/getTopStudentsInClassroom';

const cardStyle = { p: 0, borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' };
const cardHeaderStyle = { backgroundColor: '#F1F7FA', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const COLORS = ['#4BA3C3', '#EF476F', '#FFD166'];
const topStudentBg = ['#B2DFDB', '#BBDEFB', '#E0E0E0'];

const DashboardWidgets = () => {
    const [adminData, setAdminData] = useState(null);
    const [levels, setLevels] = useState([]);
    const [levelId, setLevelId] = useState('');
    const [topStudents, setTopStudents] = useState([]);

    // بيانات حضور تجريبية ثابتة (كما كانت)
    const pieData = [
        { name: 'الحضور', value: 45 },
        { name: 'الغياب', value: 35 },
        { name: 'التأخر', value: 20 },
    ];

    // جلب لوحة الأدمن + كل المستويات مرة واحدة
    useEffect(() => {
        (async () => {
            try {
                const [dash, lvls] = await Promise.all([
                    getAdminDashboard(),
                    getAllLevels(),
                ]);
                setAdminData(dash);
                setLevels(Array.isArray(lvls) ? lvls : []);
                // اختيار أول مستوى تلقائيًا
                if (Array.isArray(lvls) && lvls.length) setLevelId(lvls[0]?.id ?? '');
            } catch (e) {
                console.error('خطأ في الجلب:', e);
            }
        })();
    }, []);

    // جلب الأوائل عند تغيّر levelId فقط
    useEffect(() => {
        if (!levelId) return;
        (async () => {
            try {
                const list = await getTopStudentsByLevel(levelId);
                // تطبيع سريع
                const normalized = (Array.isArray(list) ? list : []).map((it) => {
                    const s = it?.student ?? {};
                    return {
                        id: s.id, name: s.name ?? '—', prefix: s.prefix ?? '',
                        avg: it?.averageScore ?? 0,
                    };
                }).slice(0, 3);
                setTopStudents(normalized);
            } catch (e) {
                console.error('خطأ في جلب أوائل الطلاب:', e);
                setTopStudents([]);
            }
        })();
    }, [levelId]);

    // تحويل الرسوم لخط الرسم
    const feesData = useMemo(() => {
        const obj = adminData?.feesChartData || {};
        return Object.entries(obj)
            .map(([year, total]) => ({ year, total: Number(total) }))
            .sort((a, b) => a.year.localeCompare(b.year));
    }, [adminData]);

    // أرقام الطلاب (ذكور/إناث)
    const male = adminData?.studentGenderDistribution?.maleStudents ?? 0;
    const female = adminData?.studentGenderDistribution?.femaleStudents ?? 0;
    const totalStudents = (male || 0) + (female || 0);

    return (
        <Grid
            container spacing={3}
            sx={{ padding: '2rem', borderRadius: 3, direction: 'rtl', mt: 2, width: '95%', margin: '2rem auto', boxShadow: '0 0 10px rgb(179, 179, 179)' }}
        >
            {/* الطلاب (ذكور/إناث) */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب</Typography>
                        <Box sx={{ fontSize: 12, color: '#8F929C' }}>إجمالي: {totalStudents || '…'}</Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <ManIcon sx={{ fontSize: 32, color: '#00B4D8' }} />
                            <WomanIcon sx={{ fontSize: 32, color: '#F76C6C', ml: 1 }} />
                        </Box>

                        {/* رسم دائري بسيط كمؤشر */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                <svg width="120" height="120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#D9D9D9" strokeWidth="10" />
                                    {/* ذكور */}
                                    <circle
                                        cx="60" cy="60" r="50" fill="none" stroke="#00B4D8" strokeWidth="10"
                                        strokeDasharray="314"
                                        strokeDashoffset={314 * (1 - (male / (totalStudents || 1)))}
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* إناث */}
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
                                <Typography sx={{ fontWeight: 'bold', color: '#00B4D8', textAlign: 'center' }}>{male ?? '…'}</Typography>
                                <Typography fontSize="12px" color="textSecondary">طالب</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', color: '#F76C6C', textAlign: 'center' }}>{female ?? '…'}</Typography>
                                <Typography fontSize="12px" color="textSecondary">طالبة</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Grid>

            {/* الرسوم */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الرسوم</Typography>
                        <Typography sx={{ fontSize: 12, color: '#8F929C' }}>
                            {adminData?.meta?.currentAcademicYear || ''}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={feesData}>
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#3A86FF" strokeWidth={3} name="إجمالي الرسوم" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب الأوائل</Typography>
                        <Select
                            size="small"
                            value={levelId || ''}
                            onChange={(e) => setLevelId(e.target.value)}
                            displayEmpty
                            renderValue={(v) => (v ? (levels.find((l) => String(l.id) === String(v))?.name || `مستوى #${v}`) : 'اختر المستوى')}
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
                    </Box>
                </Paper>
            </Grid>

            {/* الحضور (ثابت تجريبي) */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الحضور</Typography>
                        <span />
                    </Box>
                    <Box sx={{ p: 2, position: 'relative', height: 180 }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" outerRadius={60} innerRadius={40} paddingAngle={2}>
                                    {pieData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
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
