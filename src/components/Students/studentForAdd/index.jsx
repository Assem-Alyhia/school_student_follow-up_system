import React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function StudentForm() {
    return (
        <Container maxWidth="100%" dir="rtl">
            <Grid container spacing={3} sx={{ padding: '2rem' }}>
                {/* Right Column */}
                <Grid item xs={12} md={6}>
                    {/* Basic Information */}
                    <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0f6671' }}>المعلومات الأساسية</Typography>

                        {/* الاسم الكامل */}
                        <TextField
                            fullWidth
                            margin="dense"
                            label="الاسم الكامل"
                            size="small"
                            InputProps={{ sx: { fontSize: 14, height: 40 } }}
                            InputLabelProps={{ sx: { fontSize: 14 } }}
                        />

                        {/* باقي الحقول داخل Grid */}
                        <Grid container spacing={2} alignItems="flex-start" mt={1}>
                            {/* رفع ملف */}
                            <Grid item xs={12} md={4}>
                                <Box
                                    component="label"
                                    htmlFor="upload-photo"
                                    sx={{
                                        border: '2px dashed #ccc',
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <UploadFileIcon sx={{ fontSize: 40, mb: 1, color: '#7e57c2' }} />
                                    <Typography sx={{ fontSize: 14 }}>قم بسحب الملف وإفلاته هنا</Typography>
                                    <Button component="span" variant="outlined" size="small" sx={{ mt: 1 }}>
                                        اختر ملف
                                    </Button>
                                    <input type="file" id="upload-photo" hidden />
                                </Box>
                            </Grid>

                            {/* الجنس، تاريخ الميلاد، الصف، الشعبة */}
                            <Grid item xs={12} md={8}>
                                {/* الجنس */}
                                <FormControl component="fieldset" margin="dense">
                                    <FormLabel component="legend" sx={{ fontSize: 14 }}>الجنس</FormLabel>
                                    <RadioGroup row defaultValue="أنثى" name="gender">
                                        <FormControlLabel value="ذكر" control={<Radio />} label="ذكر" />
                                        <FormControlLabel value="أنثى" control={<Radio />} label="أنثى" />
                                    </RadioGroup>
                                </FormControl>

                                {/* تاريخ الميلاد */}
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="date"
                                    label="تاريخ الميلاد"
                                    InputLabelProps={{ shrink: true, sx: { fontSize: 14 } }}
                                    size="small"
                                    sx={{ mt: 1 }}
                                    InputProps={{ sx: { fontSize: 14, height: 40 } }}
                                />

                                {/* الصف والشعبة */}
                                <Grid container spacing={2} mt={0.5}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>الصف</InputLabel>
                                            <Select defaultValue="">
                                                <MenuItem value=""><em>اختر</em></MenuItem>
                                                <MenuItem value={1}>الأول</MenuItem>
                                                <MenuItem value={2}>الثاني</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>الشعبة</InputLabel>
                                            <Select defaultValue="">
                                                <MenuItem value=""><em>اختر</em></MenuItem>
                                                <MenuItem value="أ">أ</MenuItem>
                                                <MenuItem value="ب">ب</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Contact Information */}
                    <Paper sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">معلومات التواصل</Typography>
                        <TextField fullWidth margin="dense" size="small" label="الاسم الكامل" />
                        <TextField fullWidth margin="dense" size="small" label="البريد الإلكتروني" type="email" />
                        <TextField fullWidth margin="dense" size="small" label="رقم الهاتف" />
                        <TextField fullWidth margin="dense" size="small" label="العنوان" />
                    </Paper>
                </Grid>

                {/* Left Column */}
                <Grid item xs={12} md={6}>
                    {/* Account Information */}
                    <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">معلومات الحساب</Typography>
                        <TextField fullWidth margin="dense" size="small" label="اسم المستخدم" />
                        <TextField fullWidth margin="dense" size="small" type="password" label="كلمة المرور" />
                        <TextField fullWidth margin="dense" size="small" type="password" label="تأكيد كلمة المرور" />
                    </Paper>

                    {/* Additional Information */}
                    <Paper sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">معلومات إضافية</Typography>
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">الحالة الصحية</FormLabel>
                            <RadioGroup row defaultValue="يحتاج متابعة صحية" name="needs">
                                <FormControlLabel value="يحتاج متابعة صحية" control={<Radio />} label="يحتاج متابعة صحية" />
                                <FormControlLabel value="لا يحتاج متابعة صحية" control={<Radio />} label="لا يحتاج متابعة صحية" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">النقل المدرسي</FormLabel>
                            <RadioGroup row defaultValue="بدون نقل مدرسي" name="transfer">
                                <FormControlLabel value="نقل مدرسي" control={<Radio />} label="نقل مدرسي" />
                                <FormControlLabel value="بدون نقل مدرسي" control={<Radio />} label="بدون نقل مدرسي" />
                            </RadioGroup>
                        </FormControl>
                    </Paper>

                    {/* Guardian Information */}
                    <Paper sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">تفاصيل ولي الأمر</Typography>
                        <TextField fullWidth margin="dense" size="small" label="اسم الأب" />
                        <TextField fullWidth margin="dense" size="small" label="البريد الإلكتروني" type="email" />
                        <TextField fullWidth margin="dense" size="small" label="اسم الأم" />
                        <TextField fullWidth margin="dense" size="small" label="البريد الإلكتروني" type="email" />
                        <TextField fullWidth margin="dense" size="small" label="التحصيل العلمي" />
                        <TextField fullWidth margin="dense" size="small" label="رقم الهاتف" />
                    </Paper>

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                minWidth: 160,
                                color: '#888',
                                borderColor: '#888',
                                '&:hover': {
                                    borderColor: '#666',
                                    color: '#666',
                                },
                            }}
                        >
                            إلغاء
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                minWidth: 160,
                                color: '#888',
                                borderColor: '#888',
                                '&:hover': {
                                    borderColor: '#666',
                                    color: '#666',
                                },
                            }}
                        >
                            إعادة تعيين
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                minWidth: 160, 
                                background: 'linear-gradient(to right, #35AFBC, #308A9F, #22385F)',
                                color: '#fff',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #308A9F, #22385F, #1a2c4d)',
                                },
                            }}
                        >
                            حفظ
                        </Button>

                    </Box>

                </Grid>
            </Grid>
        </Container>
    );
}
