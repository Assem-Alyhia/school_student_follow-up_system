import React, { useState } from 'react';
import {
    Box, Paper, Typography, Grid, IconButton,
    Accordion, AccordionSummary, AccordionDetails,
    Menu, MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllRoles } from '../../../../api/Admin/Roles/getAllRoles';
import { deleteRole } from '../../../../api/Admin/Roles/deleteRole';
import { useNavigate } from 'react-router-dom';

import SuccessAlert from './../../../../layout/SuccessAlert';
import ConfirmDeleteModal from './../../../../layout/ConfirmDeleteModal';

const Section2 = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['roles'],
        queryFn: getAllRoles,
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const mutation = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            setShowSuccess(true);
            queryClient.invalidateQueries(['roles']);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (err) => alert("فشل الحذف: " + err.message),
    });

    const handleMenuOpen = (event, roleId) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoleId(roleId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const handleEdit = () => {
        navigate(`/dashboard/users/rolse/editRolse/${selectedRoleId}`);
        handleMenuClose();
    };

    const handleDelete = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const confirmDelete = () => {
        if (selectedRoleId) {
            mutation.mutate(selectedRoleId);
            setOpenDeleteModal(false);
        }
    };

    if (isLoading) return <Typography>جاري تحميل الأدوار...</Typography>;
    if (isError) return <Typography color="error">حدث خطأ: {error.message}</Typography>;

    const roles = data || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {roles.map((role, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SettingsIcon sx={{ color: '#35AFBC', marginRight: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {role.name}
                                    </Typography>
                                </Box>
                                <IconButton onClick={(e) => handleMenuOpen(e, role.id)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Accordion
                                disableGutters
                                elevation={0}
                                sx={{
                                    backgroundColor: '#F8FAFA',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    overflow: 'visible',
                                    margin: "1rem 0",
                                    '& .MuiAccordionSummary-root': {
                                        borderRadius: '8px',
                                    },
                                    '& .MuiAccordionDetails-root': {
                                        position: 'absolute',
                                        zIndex: 10,
                                        backgroundColor: '#fff',
                                        width: 'calc(100% - 32px)',
                                        left: 16,
                                        top: '100%',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                    }
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="subtitle2" sx={{ color: '#35AFBC', fontWeight: 'bold' }}>
                                        صلاحيات الدور
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ul style={{ paddingInlineStart: '20px', margin: 0 }}>
                                        {role.permissions.map((permission) => (
                                            <li key={permission.id} style={{ fontSize: '14px', color: '#555', marginBottom: 4 }}>
                                                {permission.name}
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ color: 'text.secondary', marginRight: 1 }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    عدد المستخدمين غير متاح
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        onClick={() => navigate('/dashboard/users/rolse/addRolse')}
                        elevation={0}
                        sx={{
                            padding: 2,
                            height: '100%',
                            border: '2px dashed #ccc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
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
                    </Paper>
                </Grid>
            </Grid>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ color: '#ff9800', fontSize: 20, mr: 1 }} />
                    <Typography sx={{ color: '#ff9800' }}>تعديل</Typography>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ color: '#f44336', fontSize: 20, mr: 1 }} />
                    <Typography sx={{ color: '#f44336' }}>حذف</Typography>
                </MenuItem>
            </Menu>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الدور؟"
                message="سيتم حذف هذا الدور وجميع صلاحياته المرتبطة من النظام."
            />

            {/* تنبيه النجاح */}
            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الدور بنجاح!"
                    message="تمت إزالة بيانات الدور من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
