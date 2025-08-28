import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, Typography, Avatar, Box,
    IconButton, Divider, Chip, Button, Grid, Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const ParentChildrenModal = ({ open, onClose, parent, loading = false }) => {
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-EG');
    };

    const handleViewDetails = (studentId) => {
        onClose?.();
        navigate(`/dashboard/student/studentManagement/${studentId}`);
    };

    const students = parent?.students ?? [];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
            <DialogTitle sx={{ backgroundColor: '#fff', borderBottom: '1px solid #E0E0E0', px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                            تفاصيل ولي الأمر
                        </Typography>
                        <Chip
                            label={`ID: ${parent?.id ?? '—'}`}
                            sx={{ backgroundColor: '#308A9F', color: 'white', fontWeight: 'bold' }}
                        />
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#22385F' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                        {loading ? (
                            <Skeleton variant="circular" width={80} height={80} />
                        ) : (
                            <Avatar
                                src={parent?.user?.image || "/default-avatar.png"}
                                sx={{ width: 80, height: 80 }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>الاسم</Typography>
                                {loading ? (
                                    <Skeleton width={120} />
                                ) : (
                                    <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{parent?.name || '—'}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>تاريخ الإضافة</Typography>
                                {loading ? (
                                    <>
                                        <Skeleton width={100} />
                                        <Skeleton width={80} />
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ fontSize: '0.875rem', color: '#22385F' }}>
                                            {formatDate(parent?.addedDate)}
                                        </Typography>
                                        <Typography sx={{ color: '#8F929C', fontSize: '0.75rem' }}>مُضاف حديثاً</Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>البريد الإلكتروني</Typography>
                                {loading ? (
                                    <Skeleton width={160} />
                                ) : (
                                    <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{parent?.user?.email || '—'}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C' }}>رقم الهاتف</Typography>
                                {loading ? (
                                    <Skeleton width={120} />
                                ) : (
                                    <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{parent?.phone || '—'}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F', mb: 2 }}>تفاصيل الأبناء</Typography>

                {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <Box key={i} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mb: 2, backgroundColor: '#F9F9F9' }}>
                            <Box sx={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 8, borderTopRightRadius: 8, px: 2, py: 1 }}>
                                <Skeleton width={60} height={28} />
                            </Box>
                            <Grid container spacing={2} alignItems="center" sx={{ px: 2, py: 2 }}>
                                <Grid item xs={12} md={2}>
                                    <Skeleton variant="circular" width={60} height={60} />
                                </Grid>
                                <Grid item xs={12} md={10}>
                                    <Grid container spacing={2}>
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <Grid item xs={6} md={j < 3 ? 3 : 6} key={j}>
                                                <Skeleton width={140} />
                                                <Skeleton width={100} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    ))
                ) : students.length > 0 ? (
                    students.map((student) => (
                        <Box key={student.id} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mb: 2, backgroundColor: '#F9F9F9' }}>
                            <Box
                                sx={{
                                    backgroundColor: '#F0F0F0',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    px: 2, py: 1,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Chip
                                    label={student.status === 'active' ? 'نشط' : 'غير نشط'}
                                    color={student.status === 'active' ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                            <Grid container spacing={2} alignItems="center" sx={{ px: 2, py: 2 }}>
                                <Grid item xs={12} md={2}>
                                    <Avatar src={"/Students/1.jpg"} sx={{ width: 60, height: 60 }} />
                                </Grid>
                                <Grid item xs={12} md={10}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="body2" color="#8F929C">رقم التسجيل:</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{student?.prefix || '—'}</Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="body2" color="#8F929C">الجنس:</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                                {student?.gender === 'male' ? 'ذكر' : student?.gender === 'female' ? 'أنثى' : '—'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="body2" color="#8F929C">تاريخ الانضمام:</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                                {formatDate(student?.enrollment_date)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ color: '#308A9F', borderColor: '#308A9F', fontWeight: 'bold', textTransform: 'none' }}
                                                onClick={() => handleViewDetails(student.id)}
                                            >
                                                عرض التفاصيل
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="#8F929C">الاسم:</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{student?.name || '—'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="#8F929C">العنوان:</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: '#22385F' }}>{student?.address || '—'}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ color: '#999' }}>لا يوجد طلاب مرتبطون بهذا الحساب.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ParentChildrenModal;
