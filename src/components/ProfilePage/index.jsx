import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Divider,
    Switch,
    Avatar,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from './../../api/Admin/Users/getUserById';

const UserProfile = () => {
    const { id } = useParams();
    const [isAvailable, setIsAvailable] = useState(false);
    const mainColor = '#2ea394';

    const userQ = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });

    const apiUser = userQ.data?.data ?? userQ.data ?? null;

    const profileData = {
        image: apiUser?.image || '/avatar.jpg',
        name: apiUser?.name || '---',
        status: 'نشط',
        birthDate: '01/07/2001',
        gender: 'أنثى',
        address: '',
        email: apiUser?.email || '---@gmail.com',
        passwordChangedSince: 'شهرين',
        language: 'العربية - متحدث أصلي',
        rate: '$28',
        hoursPerWeek: '32 ساعة',
        specializations: ['إداري', 'وظائف'],
        bio: `We're open to partnerships, guest posts, and more. Join us to share your insights and grow your audience.`,
    };

    const Row = ({ label, value }) => (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" py={1.5} px={1}>
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
                    <Avatar
                        alt={profileData.name}
                        src={profileData.image && profileData.image !== '' ? profileData.image : undefined}
                        sx={{
                            width: 60,
                            height: 60,
                            ml: 2,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            bgcolor: '#ccc',
                        }}
                    >
                        {(!profileData.image || profileData.image === '') && profileData.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" color="text.secondary" display="block">
                            {userQ.isLoading ? '...' : profileData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="block">
                            {userQ.isLoading ? '...' : profileData.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />

                <Row label="الاسم" value={userQ.isLoading ? '...' : profileData.name} />
                <Row
                    label="النشاط"
                    value={
                        <Chip
                            label={profileData.status}
                            color="success"
                            size="small"
                        />
                    }
                />
                <Row label="تاريخ الميلاد" value={profileData.birthDate} />
                <Row label="الجنس" value={profileData.gender} />
                <Row label="العنوان" value={profileData.address || 'ليس لديك عنوان بعد'} />

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
                <Row label="البريد الإلكتروني" value={userQ.isLoading ? '...' : profileData.email} />
                <Row
                    label="كلمة المرور"
                    value={`تم تغيير كلمة المرور آخر مرة منذ ${profileData.passwordChangedSince}`}
                />
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

                <Row label="اللغة" value={profileData.language} />
                <Row label="المعدل بالساعة" value={profileData.rate} />
                <Row label="ساعات العمل" value={profileData.hoursPerWeek} />
                <Row
                    label="الاختصاص"
                    value={
                        <Box>
                            {profileData.specializations.map((spec, idx) => (
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
                <Row label="" value={profileData.bio} />
            </Paper>
        </Box>
    );
};

export default UserProfile;
