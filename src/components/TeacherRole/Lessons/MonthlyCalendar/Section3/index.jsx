import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

const BreakAndHolidays = () => {
    return (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Grid container spacing={2} justifyContent="center">
                {/* الاستراحة الأولى */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#F5F5F5', textAlign: 'center', border: '1px solid #308A9F' }}>
                        <CardContent>
                            <Typography sx={{ fontWeight: 'bold', color: '#fff', background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                                الاستراحة الأولى
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#308A9F' }}>
                                10:15 - 10:30 صباحًا
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* الاستراحة الثانية */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#F5F5F5', textAlign: 'center', border: '1px solid #308A9F' }}>
                        <CardContent>
                            <Typography sx={{ fontWeight: 'bold', color: '#fff', background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                                الاستراحة الثانية
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#308A9F' }}>
                                12:30 - 12:45 مساءً
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* أيام العطلة */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: '#F5F5F5', textAlign: 'center', border: '1px solid #308A9F' }}>
                        <CardContent>
                            <Typography sx={{ fontWeight: 'bold', color: '#fff', background: 'linear-gradient(90deg, #35AFBC, #308A9F, #22385F)', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                                أيام العطلة
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#308A9F' }}>
                                الجمعة - السبت
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BreakAndHolidays;
