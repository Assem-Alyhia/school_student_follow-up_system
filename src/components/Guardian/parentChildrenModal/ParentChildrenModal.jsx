import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Avatar,
    Box,
    IconButton,
    Divider,
    Chip,
    Button,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ParentChildrenModal = ({ open, onClose, parent }) => {
    if (!parent) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
            <DialogTitle sx={{ backgroundColor: '#fff', borderBottom: '1px solid #E0E0E0', px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F' }}>عرض التفاصيل</Typography>
                        <Chip label="PR89423" sx={{ backgroundColor: '#308A9F', color: 'white', fontWeight: 'bold' }} />
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#22385F' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                        <Avatar src="/Students/1.jpg" sx={{ width: 80, height: 80 }} />
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>الاسم</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>Joann Michael</Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>تاريخ الإضافة</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: '#22385F' }}>20/02/2025</Typography>
                                <Typography sx={{ color: '#8F929C', fontSize: '0.75rem' }}>تحت الإضافة</Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>البريد الإلكتروني</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>Patelprince9595@gmail.com</Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>رقم الهاتف</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>+123 456 789 123</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F', mb: 2 }}>تفاصيل الأبناء</Typography>

                {[1, 2].map((_, index) => (
                    <Box key={index} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mb: 2, backgroundColor: '#F9F9F9' }}>
                        <Box sx={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 8, borderTopRightRadius: 8, px: 2, py: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Chip label="نشط" color="success" size="small" />
                        </Box>
                        <Grid container spacing={2} alignItems="center" sx={{ px: 2, py: 2 }}>
                            <Grid item xs={12} md={2}>
                                <Avatar src="/Students/1.jpg" sx={{ width: 60, height: 60 }} />
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="#8F929C">رقم التسجيل:</Typography>
                                        <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>#12345</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="#8F929C">الجنس:</Typography>
                                        <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>ذكر</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Typography variant="body2" color="#8F929C">تاريخ الانضمام:</Typography>
                                        <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>10/05/2025</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            sx={{ color: '#308A9F', borderColor: '#308A9F', fontWeight: 'bold', textTransform: 'none' }}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="#8F929C">الاسم:</Typography>
                                        <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>Joann Michael</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="#8F929C">الصف:</Typography>
                                        <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>الصف الخامس، الشعبة الأولى</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default ParentChildrenModal;