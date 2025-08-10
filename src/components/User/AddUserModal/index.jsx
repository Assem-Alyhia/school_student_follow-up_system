import React, { useState, useEffect } from 'react';
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
    Grid,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { createUser } from '../../../api/Admin/Users/createUser';
import { getAllRoles } from '../../../api/Admin/Roles/getAllRoles';

const AddUserModal = ({ open, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [error, setError] = useState('');
    const [roles, setRoles] = useState([]);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: '',
        image: null
    });

    useEffect(() => {
        if (open) {
            fetchRoles();
        }
    }, [open]);

    const fetchRoles = async () => {
        try {
            setRolesLoading(true);
            const rolesData = await getAllRoles();
            setRoles(rolesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setRolesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData((prev) => ({ ...prev, image: file }));
        }
    };

    const removeImage = () => {
        setUserData((prev) => ({ ...prev, image: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // تحقق من تطابق كلمة المرور
        if (userData.password !== userData.password_confirmation) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }

        try {
            setLoading(true);

            // تجهيز البيانات بالشكل المطلوب للـ backend
            const payload = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                password_confirmation: userData.password_confirmation,
                roles: [userData.roles], // إرسال كمصفوفة
                image: userData.image
            };

            await createUser(payload);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1E8796' }}>
                        أضف مستخدم
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {error && (
                    <Typography sx={{ color: 'red', mb: 2, fontSize: '14px' }}>{error}</Typography>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
                        <Grid item xs={8}>
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
                                        src={URL.createObjectURL(userData.image)}
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
                                name="password_confirmation"
                                value={userData.password_confirmation}
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
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '14px', mb: 0.5 }}>دور المستخدم</Typography>
                            <TextField
                                size="small"
                                select
                                value={userData.roles}
                                onChange={handleChange}
                                name="roles"
                                fullWidth
                                displayEmpty
                                InputProps={{
                                    sx: { fontSize: '13px' }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    {rolesLoading ? 'جاري التحميل...' : 'اختر دور المستخدم'}
                                </MenuItem>
                                {roles.map((r) => (
                                    <MenuItem key={r.id} value={r.id}>
                                        {r.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 7 }}>
                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                maxWidth: '30%',
                                background: 'linear-gradient(to right, #00C6FF, #002952)',
                                color: '#fff',
                                '&:hover': { opacity: 0.9 }
                            }}
                        >
                            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'أضف مستخدم جديد'}
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
