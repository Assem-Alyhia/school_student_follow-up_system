import React from 'react';
import { Box, Paper, Grid, Typography, keyframes } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import RouteIcon from '@mui/icons-material/Route';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';


const Section1 = ({ buses = [] }) => {
    const busCount = buses.length;
    const passengerCount = buses.reduce((total, bus) => total + (bus.capacity || 0), 0);
    const supervisorCount = new Set(
        buses.map(bus => bus.supervisor?.id).filter(Boolean)
    ).size;
    const pathCount = new Set(
        buses.map(bus => bus.path).filter(Boolean)
    ).size;
    const moveBus = keyframes`
  0% {
    transform: translateX(-100%) rotateY(0deg);
  }
  49% {
    transform: translateX(40%) rotateY(0deg);
  }
  50% {
    transform: translateX(40%) rotateY(180deg);
  }
  99% {
    transform: translateX(-100%) rotateY(180deg);
  }
  100% {
    transform: translateX(-100%) rotateY(0deg);
  }
`;
    return (
        <Box sx={{ padding: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    padding: 6,
                    marginBottom: 3,
                    background: 'linear-gradient(135deg, #237C91, #075865)',
                    color: '#fff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '22rem',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* 🌟 عناصر ديكورية إضافية */}
                <Box sx={{ position: 'absolute', top: 20, left: 40, opacity: 0.1 }}>
                    <MapIcon sx={{ fontSize: 80 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 130, left: 40, opacity: 0.1 }}>
                    <LocationOnIcon sx={{ fontSize: 70 }} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 30, left: 80, opacity: 0.1 }}>
                    <PersonIcon sx={{ fontSize: 60 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 100, right: 80, opacity: 0.08 }}>
                    <RouteIcon sx={{ fontSize: 100 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 40, right: 40, opacity: 0.1 }}>
                    <AccessTimeIcon sx={{ fontSize: 70 }} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 40, right: 120, opacity: 0.1 }}>
                    <LocationOnIcon sx={{ fontSize: 70 }} />
                </Box>

                {/* 🌀 أشكال دائرية شفافة لزينة إضافية */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 120,
                        height: 120,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        top: 80,
                        left: 160,
                        filter: 'blur(20px)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        width: 200,
                        height: 200,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '50%',
                        bottom: -40,
                        right: -60,
                        filter: 'blur(30px)',
                    }}
                />

                {/* 🚌 الأيقونة المتحركة */}
                <Box
                    sx={{
                        animation: `${moveBus} 8s ease-in-out infinite`,
                        fontSize: '14rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40%',
                        opacity: 0.4,
                        filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))',
                    }}
                >
                    <AirportShuttleIcon sx={{ fontSize: '10rem', color: '#fff' }} />
                </Box>

                {/* 📄 النص */}
                <Box sx={{ textAlign: 'right', width: '60%' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                        راقب و تابع، وأدر كل تفاصيل النقل المدرسي بسهولة
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: '2.5rem' }}>
                        نظام نقل مدرسي متكامل يوفر لك إمكانية تتبع الحافلات في الوقت الفعلي،
                        ومراقبة المسارات بدقة، مع أدوات مرنة لإدارة جميع التفاصيل المتعلقة بالرحلات،
                        الطالب، والسائقين.
                    </Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<RouteIcon />} title="عدد المسارات" value={pathCount} unit="مسار" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<DirectionsBusIcon />} title="عدد العربات" value={busCount} unit="حافلة" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<PeopleIcon />} title="عدد الركاب" value={passengerCount} unit="راكب" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<SupervisorAccountIcon />} title="عدد المشرفين" value={supervisorCount} unit="مشرف" />
                </Grid>
            </Grid>
        </Box>
    );
};

// 🧩 مكون فرعي لإعادة استخدام كروت الإحصائيات
const StatCard = ({ icon, title, value, unit }) => (
    <Paper elevation={3} sx={{
        padding: 2,
        textAlign: 'left',
        background: 'linear-gradient(135deg, #35AFBC, #308A9F)',
        color: '#fff',
        position: 'relative',
        height: '150px'
    }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </Box>
        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            <Typography variant="body2">{unit}</Typography>
        </Box>
    </Paper>
);

export default Section1;
