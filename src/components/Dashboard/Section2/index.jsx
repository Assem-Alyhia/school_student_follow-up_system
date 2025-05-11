import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Avatar,
    Select,
    MenuItem
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

const DashboardWidgets = () => {
    const pieData = [
        { name: 'الحضور', value: 45 },
        { name: 'الغياب', value: 35 },
        { name: 'التأخر', value: 20 },
    ];

    const COLORS = ['#4BA3C3', '#EF476F', '#FFD166'];

    const feesData = [
        { year: '2021', paid: 80, used: 90 },
        { year: '2022', paid: 120, used: 110 },
        { year: '2023', paid: 100, used: 130 },
        { year: '2024', paid: 150, used: 140 },
        { year: '2025', paid: 110, used: 100 },
    ];

    const cardStyle = {
        p: 0,
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    };

    const cardHeaderStyle = {
        backgroundColor: '#F1F7FA',
        px: 2,
        py: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const topStudentBg = ['#B2DFDB', '#BBDEFB', '#E0E0E0'];

    return (
        <Grid container spacing={3} sx={{ padding: '2rem', borderRadius: 3, direction: 'rtl', mt: 2, width: '95%', margin: '2rem auto', boxShadow: "0 0 10px rgb(179, 179, 179)" }}>

            {/* الطلاب */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب</Typography>
                        <Select size="small" defaultValue="weekly">
                            <MenuItem value="weekly">أسبوعياً</MenuItem>
                            <MenuItem value="monthly">شهرياً</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <ManIcon sx={{ fontSize: 32, color: '#00B4D8' }} />
                            <WomanIcon sx={{ fontSize: 32, color: '#F76C6C', ml: 1 }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                <svg width="120" height="120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#D9D9D9" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#00B4D8" strokeWidth="10" strokeDasharray="240" strokeDashoffset="60" />
                                    <circle cx="60" cy="60" r="40" fill="none" stroke="#F76C6C" strokeWidth="10" strokeDasharray="200" strokeDashoffset="80" />
                                </svg>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', color: '#00B4D8', textAlign: 'center' }}>325</Typography>
                                <Typography fontSize="12px" color="textSecondary">طالب</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', color: '#F76C6C', textAlign: 'center' }}>300</Typography>
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
                        <Select size="small" defaultValue="yearly">
                            <MenuItem value="yearly">سنويًا</MenuItem>
                            <MenuItem value="monthly">شهريًا</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={feesData}>
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="used" stroke="#F76C6C" strokeWidth={3} />
                                <Line type="monotone" dataKey="paid" stroke="#3A86FF" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* الطلاب الأوائل */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الطلاب الأوائل</Typography>
                        <Select size="small" defaultValue="2025">
                            <MenuItem value="2025">2025</MenuItem>
                            <MenuItem value="2024">2024</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            {[1, 2, 3].map((_, idx) => (
                                <Grid item xs={12} sm={4} key={idx}>
                                    <Paper elevation={1} sx={{ borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: topStudentBg[idx] }}>
                                        <Typography fontWeight="bold" color="#308A9F" sx={{ mb: 1 }}>{idx + 1}#</Typography>
                                        <Avatar src="/Students/1.jpg" sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} />
                                        <Typography fontWeight="bold" color="#22385F">عاصم اليحيى</Typography>
                                        <Typography fontSize="14px" color="#8F929C">الصف الخامس</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* الحضور */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={cardStyle}>
                    <Box sx={cardHeaderStyle}>
                        <Typography fontWeight="bold" color="#308A9F">الحضور</Typography>
                        <Select size="small" defaultValue="weekly" >
                            <MenuItem value="weekly" >أسبوعياً</MenuItem>
                            <MenuItem value="monthly">شهرياً</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ p: 2, position: 'relative', height: 180 }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    outerRadius={60}
                                    innerRadius={40}
                                    paddingAngle={2}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
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