import React from 'react';
import { Box, Paper, Typography, Button, Grid, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings'; // أيقونة الإعدادات
import AddIcon from '@mui/icons-material/Add';

const Section2 = () => {
    const roles = [
        {
            title: 'مشرف نقل',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '8 أشخاص',
        },
        {
            title: 'سائق',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '10 أشخاص',
        },
        {
            title: 'مدير المدرسة',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '1 شخص',
        },
        {
            title: 'طلب',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '30 شخص',
        },
        {
            title: 'ثاني المدير',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '1 شخص',
        },
        {
            title: 'مدير النظام',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '1 شخص',
        },
        {
            title: 'معلم',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '25 شخص',
        },
        {
            title: 'عامل',
            description: 'المسؤول الرئيسي عن إدارة النظام بشكل شامل، بما يشمل إعداداته ضمان استقراره، والتحكم الكامل في الصلاحيات',
            users: '2 أشخاص',
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {roles.map((role, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SettingsIcon sx={{ color: '#35AFBC', marginRight: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {role.title}
                                    </Typography>
                                </Box>
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                            <Typography variant="body2" sx={{ marginBottom: 5, color: 'text.secondary', opacity: 0.7 }}>
                                {role.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ color: 'text.secondary', marginRight: 1 }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {role.users}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
                {/* الكارد الأخير لإضافة دور جديد */}
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        component={Paper}
                        elevation={0}
                        sx={{
                            padding: 2,
                            height: '100%',
                            border: '2px dashed #ccc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(53, 175, 188, 0.1)', 
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <AddIcon sx={{ color: '#35AFBC', fontSize: '40px', marginBottom: 1 }} />
                            <Typography variant="body1" sx={{ color: '#35AFBC', fontWeight: 'bold' }}>
                                أضف دور جديد
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                أضف دورًا جديدًا للنظام وحدد صلاحياته
                            </Typography>
                        </Box>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Section2;