import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const ProfileDetailsCard = () => {
    return (
        <Box sx={{ padding: 0, maxWidth: "100%", margin: 'auto' }}>
            <Paper elevation={3} sx={{
                padding: 0,
                borderRadius: 2,
                border: '1px solid #308A9F'
            }}>
                {/* العنوان */}
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    marginBottom: 3,
                    color: '#fff',
                    backgroundColor: '#308A9F',
                    padding: 1.5,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    textAlign: 'center'
                }}>
                    تفاصيل الملف الشخصي
                </Typography>

                {/* المعلومات */}
                <Grid container spacing={3} px={10} pb={2} >
                    {/* الصف الأول */}
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">اسم الأب</Typography>
                        <Typography color="#308A9F" fontWeight="bold">Francis Saviour</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">اسم الأم</Typography>
                        <Typography color="#308A9F" fontWeight="bold">Stella Bruce</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">تاريخ الميلاد</Typography>
                        <Typography color="#308A9F" fontWeight="bold">25/02/2025</Typography>
                    </Grid>

                    {/* الصف الثاني */}
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">الحالة الاجتماعية</Typography>
                        <Typography color="#308A9F" fontWeight="bold">عازب</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">المؤهلات</Typography>
                        <Typography color="#308A9F" fontWeight="bold">MBA</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography color="gray" fontWeight="medium">الخبرة</Typography>
                        <Typography color="#308A9F" fontWeight="bold">3 سنوات</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ProfileDetailsCard;
