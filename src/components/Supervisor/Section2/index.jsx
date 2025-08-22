// src/components/Admin/Supervisors/Section2.jsx
import React, { useState } from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton, Menu, MenuItem, Avatar
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Chat as ChatIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmDeleteModal from './../../../layout/ConfirmDeleteModal';
import SuccessAlert from './../../../layout/SuccessAlert';
import { deleteSupervisor } from './../../../api/Admin/Supervisors/deleteSupervisor';

// عدّل المسار حسب مكان الملف لديك إن لزم
import SupervisorDetailsModal from '../SupervisorDetailsModal';
import SupervisorEditModal from '../SupervisorEditModal';

const asArGender = (g) => (g === 'male' ? 'ذكر' : g === 'female' ? 'أنثى' : '—');
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('ar-EG') : '—');

const Section2 = ({ supervisors = [] }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // تنبيه نجاح عام (للتحديث/الحذف)
    const [success, setSuccess] = useState({
        show: false,
        title: '',
        message: '',
        severity: 'success',
    });

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);

    // موديل التفاصيل
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(null);

    // موديل التعديل
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteSupervisor,
        onSuccess: () => {
            queryClient.invalidateQueries(['supervisors']);
            setSuccess({
                show: true,
                title: 'تم حذف المشرف بنجاح!',
                message: 'تمت إزالة بيانات المشرف من النظام.',
                severity: 'success',
            });
            setTimeout(() => setSuccess((s) => ({ ...s, show: false })), 2500);
        },
    });

    const handleMenuClick = (event, id) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRowId(id);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRowId(null);
    };

    const handleDelete = (id) => {
        setSelectedId(id);
        setOpenDeleteModal(true);
    };
    const confirmDelete = () => {
        deleteMutation.mutate(selectedId);
        setOpenDeleteModal(false);
    };

    // تفاصيل
    const openDetailsModal = (id) => {
        setDetailsId(id);
        setOpenDetails(true);
    };
    const closeDetailsModal = () => {
        setOpenDetails(false);
        setDetailsId(null);
    };

    // تعديل
    const openEditModal = (id) => {
        setEditId(id);
        setOpenEdit(true);
    };
    const closeEditModal = () => {
        setOpenEdit(false);
        setEditId(null);
    };

    return (
        <Box sx={{ padding: 3, direction: 'rtl' }}>
            <Grid container spacing={3}>
                {supervisors.map((sup) => {
                    const user = sup?.user || {};
                    const name = sup?.name || user?.name || '—';
                    const email = user?.email || '—';
                    const phone = sup?.phone || '—';
                    const imageRaw = user?.image || '';
                    const hasImage = Boolean(imageRaw && String(imageRaw).trim());
                    const prefix = sup?.prefix || '—';
                    const gender = asArGender(sup?.gender);
                    const hiring = fmtDate(sup?.hiring_date || user?.created_at);

                    return (
                        <Grid item xs={12} sm={6} md={4} key={sup.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #308A9F',
                                    maxWidth: '90%',
                                    m: 'auto',
                                    borderRadius: 2,
                                }}
                            >
                                {/* العنوان العلوي */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton disableRipple>
                                            <PersonIcon sx={{ color: '#22385F' }} />
                                        </IconButton>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                            {prefix}
                                        </Typography>
                                    </Box>

                                    <IconButton onClick={(e) => handleMenuClick(e, sup.id)}>
                                        <MoreVertIcon />
                                    </IconButton>

                                    <Menu
                                        anchorEl={menuAnchorEl}
                                        open={Boolean(menuAnchorEl) && menuRowId === sup.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                openDetailsModal(sup.id);
                                                handleMenuClose();
                                            }}
                                        >
                                            <VisibilityIcon fontSize="small" sx={{ color: 'primary.main', ml: 1 }} />
                                            <Typography sx={{ color: 'primary.main' }}>عرض التفاصيل</Typography>
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                openEditModal(sup.id);  // ← فتح موديول التعديل
                                                handleMenuClose();
                                            }}
                                        >
                                            <EditIcon fontSize="small" sx={{ color: '#FB8C00', ml: 1 }} />
                                            <Typography sx={{ color: '#FB8C00' }}>تعديل</Typography>
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                handleDelete(sup.id);
                                                handleMenuClose();
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" sx={{ color: 'error.main', ml: 1 }} />
                                            <Typography sx={{ color: 'error.main' }}>حذف</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>

                                {/* الصورة */}
                                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Avatar
                                        src={hasImage ? imageRaw : undefined}
                                        alt=""
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 14px rgba(34,56,95,0.12)',
                                        }}
                                    >
                                        {!hasImage && <PersonIcon sx={{ color: '#9aa6b2', fontSize: 42 }} />}
                                    </Avatar>
                                </Box>

                                {/* الاسم */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        mt: '1rem',
                                        mb: '1.5rem',
                                        color: '#308A9F',
                                        textShadow: '0 1px 5px rgb(155 155 155 / 40%)',
                                    }}
                                >
                                    {name}
                                </Typography>

                                {/* صف المعلومات */}
                                <Box sx={{ my: '2rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}>
                                        <Typography sx={{ color: '#308A9F' }}><strong>رقم السجل:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>الجنس:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>تاريخ التوظيف:</strong></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{prefix}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{gender}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{hiring}</Typography>
                                    </Box>
                                </Box>

                                {/* شريط البريد */}
                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                        p: '.6rem 1rem',
                                        borderRadius: 1,
                                        my: '2rem',
                                        width: '80%',
                                        mx: 'auto',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: '#fff', ml: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px', direction: 'ltr' }}>
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* أزرار سفلية */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: 'linear-gradient(90deg, #308A9F,#22385F)',
                                            '&:hover': { backgroundColor: '#308A9F' },
                                            fontSize: '14px',
                                            px: '12px',
                                        }}
                                        onClick={() => openDetailsModal(sup.id)}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                    <Box>
                                        {phone !== '—' && (
                                            <IconButton component="a" href={`tel:${phone}`} title={phone}>
                                                <PhoneIcon sx={{ color: '#22385F', fontSize: '20px' }} />
                                            </IconButton>
                                        )}
                                        <IconButton>
                                            <ChatIcon sx={{ color: '#22385F', fontSize: '20px' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* موديل تفاصيل المشرف */}
            <SupervisorDetailsModal
                open={openDetails}
                onClose={closeDetailsModal}
                id={detailsId}
            />

            {/* موديل تعديل المشرف */}
            <SupervisorEditModal
                open={openEdit}
                onClose={closeEditModal}
                id={editId}
                onSuccess={() => {
                    queryClient.invalidateQueries(['supervisors']);
                    setSuccess({
                        show: true,
                        title: 'تم تحديث المشرف بنجاح!',
                        message: 'تم حفظ التغييرات.',
                        severity: 'success',
                    });
                    setTimeout(() => setSuccess((s) => ({ ...s, show: false })), 2500);
                }}
            />

            {/* الحذف */}
            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف المشرف؟"
                message="سيتم حذف بيانات المشرف من النظام."
            />

            {success.show && (
                <SuccessAlert
                    title={success.title}
                    message={success.message}
                    severity={success.severity}
                    onClose={() => setSuccess((s) => ({ ...s, show: false }))}
                />
            )}
        </Box>
    );
};

export default Section2;
