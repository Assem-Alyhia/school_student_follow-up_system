import React from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import RouteIcon from '@mui/icons-material/Route';

const Section1 = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{
                padding: 6,
                marginBottom: 3,
                background: 'linear-gradient(135deg, #35AFBC, rgb(0, 99, 122))',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                height: '20rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
            }}>
                <Box position="relative" zIndex={1} sx={{ textAlign: 'right', maxWidth: '50%', paddingLeft: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                        راقب و تابع، وأدر كل تفاصيل النقل المدرسي بسهولة
                    </Typography>
                    <Typography variant="caption" sx={{
                        fontSize: '1.1rem',
                        lineHeight: '2.5rem',
                    }}>
                        نظام نقل مدرسي متكامل يوفر لك إمكانية تتبع الحافلات في الوقت الفعلي، ومراقبة المسارات بدقة، مع أدوات مرنة لإدارة جميع التفاصيل المتعلقة بالرحلات، الطالب، والسائقين.
                    </Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{
                        padding: 2,
                        textAlign: 'left', 
                        background: 'linear-gradient(135deg, #35AFBC, #308A9F)',
                        color: '#fff',
                        position: 'relative',
                        height: '150px'
                    }}>
                        <Box sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RouteIcon sx={{ fontSize: 30, color: '#fff' }} />
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                            <Typography variant="body1">عدد المسارات</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>10</Typography>
                            <Typography variant="body2">مسارات</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{
                        padding: 2,
                        textAlign: 'left',
                        background: 'linear-gradient(135deg, #35AFBC, #308A9F)',
                        color: '#fff',
                        position: 'relative',
                        height: '150px'
                    }}>
                        <Box sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DirectionsBusIcon sx={{ fontSize: 30, color: '#fff' }} />
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                            <Typography variant="body1">عدد العربات</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>10</Typography>
                            <Typography variant="body2">حافلات</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{
                        padding: 2,
                        textAlign: 'left',
                        background: 'linear-gradient(135deg, #35AFBC, #308A9F)',
                        color: '#fff',
                        position: 'relative',
                        height: '150px'
                    }}>
                        <Box sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PeopleIcon sx={{ fontSize: 30, color: '#fff' }} />
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                            <Typography variant="body1">عدد الركاب</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>20</Typography>
                            <Typography variant="body2">راكب</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{
                        padding: 2,
                        textAlign: 'left',
                        background: 'linear-gradient(135deg, #35AFBC, #308A9F)',
                        color: '#fff',
                        position: 'relative',
                        height: '150px'
                    }}>
                        <Box sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10rem', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SupervisorAccountIcon sx={{ fontSize: 30, color: '#fff' }} />
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                            <Typography variant="body1">عدد المشرفين</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>10</Typography>
                            <Typography variant="body2">مشرف</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Section1;