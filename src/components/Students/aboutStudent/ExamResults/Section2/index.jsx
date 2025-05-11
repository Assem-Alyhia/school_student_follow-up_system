import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';

const StudentStats = () => {
    return (
        <Box sx={{ padding: 2, direction: 'rtl', backgroundColor: '#f5f6fa' }}>
            <Grid container spacing={2} justifyContent="center">

                {/* Student Performance */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ borderRadius: 3, textAlign: 'center', p: 2, border: '1px solid #308A9F', height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ backgroundColor: '#e0e0e0', py: 1, mb: 2, borderRadius: 1 }}>أداء الطالب</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70%' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress variant="determinate" value={95} size={80} thickness={4} sx={{ color: '#308A9F' }} />
                                <Box sx={{ position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ color: '#22385F' }}>95%</Typography>
                                </Box>
                            </Box>
                            <Typography sx={{ color: '#308A9F', fontWeight: 'bold', mt: 2 }}>التقدير: ممتاز</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Exams Count */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ borderRadius: 3, textAlign: 'center', p: 2, border: '1px solid #308A9F', height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ backgroundColor: '#e0e0e0', py: 1, mb: 2, borderRadius: 1 }}>عدد الامتحانات</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70%' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress variant="determinate" value={(6 / 7) * 100} size={80} thickness={4} sx={{ color: '#35AFBC' }} />
                                <Box sx={{ position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ color: '#22385F' }}>6/7</Typography>
                                </Box>
                            </Box>
                            <Typography sx={{ color: '#308A9F', fontWeight: 'bold', mt: 2 }}>تم تقديم 6 امتحانات هذا الفصل</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Student Rank */}
                <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                    <Paper elevation={3} sx={{ borderRadius: 3, textAlign: 'center', p: 2, border: '1px solid #308A9F', height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ backgroundColor: '#e0e0e0', py: 1, mb: 2, borderRadius: 1 }}>ترتيب الطالب</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img src="/Students/rank.png" alt="Student Rank" style={{ width: '7rem', borderRadius: '50px' }} />
                            </Box>
                            <Typography sx={{ color: '#308A9F', fontWeight: 'bold', mt: 2 }}>الترتيب: الثالث</Typography>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default StudentStats;