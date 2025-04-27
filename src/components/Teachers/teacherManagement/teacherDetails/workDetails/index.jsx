import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const JobDetailsCard = () => {
    return (
        <Box sx={{ padding: 0, maxWidth: "100%", margin: 'auto' }}>
            <Paper elevation={3} sx={{
                borderRadius: 2,
                border: '1px solid #308A9F',
                overflow: 'hidden'
            }}>
                {/* العنوان */}
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#308A9F',
                    padding: 1.5,
                    textAlign: 'center'
                }}>
                    تفاصيل العمل
                </Typography>

                {/* التفاصيل */}
                <Grid container spacing={2} px={2} py={3} textAlign="center">
                    {/* نوع العقد */}
                    <Grid item xs={12} md={4}>
                        <Typography color="gray">نوع العقد</Typography>
                        <Typography fontWeight="bold" color="#308A9F">دائم</Typography>
                    </Grid>

                    {/* أوقات الدوام */}
                    <Grid item xs={12} md={4}>
                        <Typography color="gray">أوقات الدوام</Typography>
                        <Typography fontWeight="bold" color="#308A9F">صباحاً</Typography>
                    </Grid>

                    {/* المرحلة الدراسية */}
                    <Grid item xs={12} md={4}>
                        <Typography color="gray">المرحلة الدراسية</Typography>
                        <Typography fontWeight="bold" color="#308A9F">الإعدادية</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default JobDetailsCard;
