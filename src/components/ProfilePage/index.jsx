import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Divider,
    Switch,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const UserProfile = () => {
    const [isAvailable, setIsAvailable] = useState(false);

    const user = {
        image: '/avatar.jpg',
        name: 'عاصم محمد اليحيى',
        status: 'نشط',
        birthDate: '01/07/2001',
        gender: 'أنثى',
        address: '',
        email: 'aasem@gmail.com',
        passwordChangedSince: 'شهرين',
        language: 'العربية - متحدث أصلي',
        rate: '$28',
        hoursPerWeek: '32 ساعة',
        specializations: ['إداري', 'وظائف'],
        bio: `We're open to partnerships, guest posts, and more. Join us to share your insights and grow your audience.`,
    };

    const mainColor = '#2ea394';

    const Row = ({ label, value }) => (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
                px={1}
            >
                <Box>
                    {label && (
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                            {label}
                        </Typography>
                    )}
                    <Typography variant="body2">{value}</Typography>
                </Box>
                <IconButton size="small" sx={{ color: mainColor }}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
        </>
    );

    return (
        <Box sx={{ p: 3, direction: 'rtl', bgcolor: '#f8f9fa' }}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    المعلومات الشخصية
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <Box
                        component="img"
                        src={user.image}
                        alt="Profile"
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            ml: 2,
                            border: `2px solid ${mainColor}`,
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        صورة 150x150px JPEG, PNG
                    </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />

                <Row label="الاسم" value={user.name} />
                <Row label="النشاط" value={<Chip label={user.status} color="success" size="small" />} />
                <Row label="تاريخ الميلاد" value={user.birthDate} />
                <Row label="الجنس" value={user.gender} />
                <Row label="العنوان" value={user.address || 'ليس لديك عنوان بعد'} />

                <Box mt={2}>
                    <Typography variant="body2" sx={{ color: mainColor, cursor: 'pointer' }}>
                        Add
                    </Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    معلومات تسجيل الدخول
                </Typography>
                <Row label="البريد الإلكتروني" value={user.email} />
                <Row label="كلمة المرور" value={`تم تغيير كلمة المرور آخر مرة منذ ${user.passwordChangedSince}`} />
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold" fontSize="1.1rem" color={mainColor}>
                        العمل
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={isAvailable}
                            onChange={() => setIsAvailable(!isAvailable)}
                            color="success"
                        />
                        <Typography fontSize="0.9rem" fontWeight="medium">
                            Available now
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />

                <Row label="اللغة" value={user.language} />
                <Row label="المعدل بالساعة" value={user.rate} />
                <Row label="ساعات العمل" value={user.hoursPerWeek} />
                <Row
                    label="الاختصاص"
                    value={
                        <Box>
                            {user.specializations.map((spec, idx) => (
                                <Chip
                                    key={idx}
                                    label={spec}
                                    size="small"
                                    sx={{ mx: 0.5, backgroundColor: '#e0f2f1', color: '#004d40' }}
                                />
                            ))}
                        </Box>
                    }
                />
                <Row label="" value={user.bio} />
            </Paper>
        </Box>
    );
};

export default UserProfile;
