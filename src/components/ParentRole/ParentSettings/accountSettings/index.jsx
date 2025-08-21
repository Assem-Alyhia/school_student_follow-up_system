import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    MenuItem,
    Divider,
    Checkbox,
    FormControlLabel,
} from '@mui/material';

const countries = [
    { label: 'سوريا', value: 'syria', flag: '🇸🇾' },
    { label: 'مصر', value: 'egypt', flag: '🇪🇬' },
    { label: 'السعودية', value: 'ksa', flag: '🇸🇦' },
];

const AccountSettings = () => {
    const [values, setValues] = useState({
        name: 'Aasem Al-Yhia',
        phone: '(+123) 456789000',
        email: 'Aasem@gmail.com',
        address: 'سوريا، حلب، صالح سعد الله',
        country: 'syria',
        city: 'حلب',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

    const handleChange = (field, value) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const mainColor = '#2ea394';

    return (
        <Box sx={{ p: 3, direction: 'rtl', bgcolor: '#f8f9fa' }}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    إعدادات الملف الشخصي
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src="/avatar.jpg" sx={{ width: 64, height: 64 }} />
                            <Typography variant="body2" color="text.secondary">
                                صورة 150x150px JPEG, PNG
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="الاسم"
                                    fullWidth
                                    size="small"
                                    value={values.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="رقم الهاتف"
                                    fullWidth
                                    size="small"
                                    value={values.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="البريد الإلكتروني"
                                    fullWidth
                                    size="small"
                                    value={values.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="العنوان"
                                    fullWidth
                                    size="small"
                                    value={values.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="الدولة"
                                    fullWidth
                                    size="small"
                                    value={values.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                >
                                    {countries.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label} <span style={{ marginRight: 8 }}>{option.flag}</span>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="المدينة"
                                    fullWidth
                                    size="small"
                                    value={values.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box mt={3} textAlign="left">
                    <Button variant="contained" sx={{ backgroundColor: mainColor }}>
                        حفظ التغييرات
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    كلمة المرور
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="password"
                            label="كلمة المرور الحالية الخاصة بك"
                            fullWidth
                            size="small"
                            value={passwords.current}
                            onChange={(e) => handlePasswordChange('current', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="password"
                            label="كلمة المرور الجديدة"
                            fullWidth
                            size="small"
                            value={passwords.new}
                            onChange={(e) => handlePasswordChange('new', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="password"
                            label="تأكيد كلمة المرور الجديدة"
                            fullWidth
                            size="small"
                            value={passwords.confirm}
                            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Box mt={3} textAlign="left">
                    <Button variant="contained" sx={{ backgroundColor: mainColor }}>
                        إعادة تعيين كلمة المرور
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={2} color="error" fontSize="1.1rem">
                    حذف الحساب
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    نأسف لرؤيتك تغادر. يرجى تأكيد أنك تريد حذف الحساب. سيتم حذف جميع بياناتك بشكل نهائي.
                </Typography>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={deleteConfirmed}
                            onChange={(e) => setDeleteConfirmed(e.target.checked)}
                            color="error"
                        />
                    }
                    label="تأكيد حذف الحساب"
                />

                <Box mt={2} display="flex" gap={2}>
                    <Button variant="contained" color="error" disabled={!deleteConfirmed}>
                        حذف الحساب
                    </Button>
                    <Button variant="outlined">تعطيل الحساب</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AccountSettings;
