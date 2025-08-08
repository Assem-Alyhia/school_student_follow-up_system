import React, { useState } from 'react';
import {
    Box,
    Modal,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Avatar,
    Grid
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';

const AddUserModal = ({ open, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        permission: '',
        role: '',
        image: null
    });

    const roles = [
        { value: 'admin', label: 'مدير' },
        { value: 'editor', label: 'محرر' },
        { value: 'viewer', label: 'مشاهد' }
    ];

    const permissions = [
        { value: 'full', label: 'كامل' },
        { value: 'partial', label: 'جزئي' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const removeImage = () => {
        setUserData((prev) => ({ ...prev, image: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                direction: 'rtl'
            }}
        >
            <Paper sx={{ borderRadius: '14px', width: '700px', p: 3 }}>
                {/* العنوان */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1E8796' }}>
                        أضف مستخدم
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    {/* الصف الأول: اسم + ايميل + صورة */}
                    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
                        <Grid item xs={8}>
                            {/* اسم المستخدم */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ fontSize: '14px', mb: 0.5 }}>اسم المستخدم</Typography>
                                <TextField
                                    size="small"
                                    placeholder="أدخل اسم المستخدم"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        sx: { fontSize: '13px' }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <Typography sx={{ fontSize: '14px', mb: 0.5 }}>البريد الإلكتروني</Typography>
                                <TextField
                                    size="small"
                                    placeholder="أدخل البريد الإلكتروني للمستخدم"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        sx: { fontSize: '13px' }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>صورة المستخدم</Typography>
                            {userData.image ? (
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar
                                        src={userData.image}
                                        sx={{ width: 100, height: 100, borderRadius: '8px' }}
                                    />
                                    <IconButton
                                        onClick={removeImage}
                                        sx={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            backgroundColor: '#fff',
                                            boxShadow: 1
                                        }}
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Button
                                    component="label"
                                    variant="outlined"
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '8px',
                                        borderColor: '#ccc',
                                        fontSize: '12px'
                                    }}
                                >
                                    اختر صورة
                                    <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                                </Button>
                            )}
                            <Typography sx={{ fontSize: '12px', color: 'gray', mt: 1 }}>
                                150x150px JPEG, PNG
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 3, mt: 3 }}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>كلمة المرور</Typography>
                            <TextField
                                size="small"
                                placeholder="أدخل كلمة المرور"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    sx: { fontSize: '13px' },
                                    endAdornment: (
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>تأكيد كلمة المرور</Typography>
                            <TextField
                                size="small"
                                placeholder="أدخل كلمة المرور مرة أخرى"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    sx: { fontSize: '13px' },
                                    endAdornment: (
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 3, mt: 3 }}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>صلاحية المستخدم</Typography>
                            <TextField
                                size="small"
                                select
                                value={userData.permission}
                                onChange={handleChange}
                                name="permission"
                                fullWidth
                                displayEmpty
                                InputProps={{
                                    sx: { fontSize: '13px' }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    اختر صلاحية المستخدم
                                </MenuItem>
                                {permissions.map((p) => (
                                    <MenuItem key={p.value} value={p.value}>
                                        {p.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>دور المستخدم</Typography>
                            <TextField
                                InputProps={{
                                    sx: { fontSize: '13px' }
                                }}
                                size="small"
                                select
                                value={userData.role}
                                onChange={handleChange}
                                name="role"
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    اختر دور المستخدم
                                </MenuItem>
                                {roles.map((r) => (
                                    <MenuItem key={r.value} value={r.value}>
                                        {r.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* الأزرار */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 7 }}>
                        <Button
                            type="submit"
                            fullWidth
                            sx={{
                                maxWidth: '30%',
                                background: 'linear-gradient(to right, #00C6FF, #002952)',
                                color: '#fff',
                                '&:hover': { opacity: 0.9 }
                            }}
                        >
                            أضف مستخدم جديد
                        </Button>
                        <Button
                            fullWidth
                            sx={{
                                maxWidth: '30%',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                            onClick={onClose}
                        >
                            إلغاء
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddUserModal;
