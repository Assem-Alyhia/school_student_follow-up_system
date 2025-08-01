import React, { useState } from 'react';
import {
    Box, Grid, Paper, Typography, IconButton, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Menu, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllPermissions } from '../../../../api/Admin/Permissions/getAllPermissions';
import { createPermission } from '../../../../api/Admin/Permissions/createPermission';
import { deletePermission } from '../../../../api/Admin/Permissions/deletePermission';
import { getPermissionById } from '../../../../api/Admin/Permissions/getPermissionById';
import { updatePermission } from '../../../../api/Admin/Permissions/updatePermission';

import ConfirmDeleteModal from '../../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../../layout/SuccessAlert';

const Section2 = ({ page, rowsPerPage }) => {
    const queryClient = useQueryClient();

    const { data = { data: [] }, isLoading, isError, error } = useQuery({
        queryKey: ['permissions', page, rowsPerPage],
        queryFn: () => getAllPermissions(page, rowsPerPage),
        keepPreviousData: true,
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [permissionName, setPermissionName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [menuAnchorEls, setMenuAnchorEls] = useState({});
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleMenuOpen = (event, id) => {
        setMenuAnchorEls({ ...menuAnchorEls, [id]: event.currentTarget });
    };

    const handleMenuClose = (id) => {
        setMenuAnchorEls({ ...menuAnchorEls, [id]: null });
    };

    const handleAddClick = () => {
        setEditingId(null);
        setPermissionName('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setPermissionName('');
        setEditingId(null);
        setOpenDialog(false);
    };

    const createMutation = useMutation({
        mutationFn: createPermission,
        onSuccess: () => {
            queryClient.invalidateQueries(['permissions']);
            setSuccessMessage({ text: 'تمت الإضافة بنجاح', severity: 'success' });
            setTimeout(() => setSuccessMessage(false), 3000);
            handleCloseDialog();
        },
        onError: (error) => alert(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, name }) => updatePermission(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries(['permissions']);
            setSuccessMessage({ text: 'تم التعديل بنجاح', severity: 'success' });
            setTimeout(() => setSuccessMessage(false), 3000);
            handleCloseDialog();
        },
        onError: (error) => alert(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePermission,
        onSuccess: () => {
            queryClient.invalidateQueries(['permissions']);
            setSuccessMessage({ text: 'تم الحذف بنجاح', severity: 'error' });
            setTimeout(() => setSuccessMessage(false), 3000);

        },
        onError: (error) => alert(error.message),
    });

    const handleSubmit = () => {
        if (!permissionName.trim()) return;

        if (editingId) {
            updateMutation.mutate({ id: editingId, name: permissionName });
        } else {
            createMutation.mutate(permissionName);
        }
    };

    const handleEdit = async (id) => {
        try {
            const result = await getPermissionById(id);
            setPermissionName(result.data.name);
            setEditingId(id);
            setOpenDialog(true);
            handleMenuClose(id);
        } catch (err) {
            alert("فشل في جلب بيانات الصلاحية: " + err.message);
        }
    };

    const handleDelete = (id) => {
        setSelectedId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            deleteMutation.mutate(selectedId);
        }
        setOpenDeleteModal(false);
    };

    return (
        <Box sx={{ padding: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 10 }}>
                <Typography variant="h5" fontWeight="bold">الصلاحيات</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    sx={{ backgroundColor: '#35AFBC', '&:hover': { backgroundColor: '#30BA9F' } }}
                >
                    إضافة صلاحية
                </Button>
            </Box>

            {isLoading ? (
                <Typography>جاري تحميل الصلاحيات...</Typography>
            ) : isError ? (
                <Typography color="error">حدث خطأ: {error.message}</Typography>
            ) : (
                <Grid container spacing={6}>
                    {data.data.map((permission) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={permission.id}>
                            <Paper elevation={3} sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={(e) => handleMenuOpen(e, permission.id)}>
                                        <SettingsIcon sx={{ color: '#35AFBC', marginRight: 1 }} />
                                    </IconButton>
                                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                                        {permission.name}
                                    </Typography>
                                </Box>

                                <Menu
                                    anchorEl={menuAnchorEls[permission.id]}
                                    open={Boolean(menuAnchorEls[permission.id])}
                                    onClose={() => handleMenuClose(permission.id)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={() => handleEdit(permission.id)}>
                                        <EditIcon sx={{ color: 'orange', fontSize: 20, ml: 1 }} />
                                        <Typography sx={{ color: 'orange' }}>تعديل</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDelete(permission.id)}>
                                        <DeleteIcon sx={{ color: 'red', fontSize: 20, ml: 1 }} />
                                        <Typography sx={{ color: 'red' }}>حذف</Typography>
                                    </MenuItem>
                                </Menu>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingId ? 'تعديل الصلاحية' : 'إضافة صلاحية جديدة'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="اسم الصلاحية"
                        fullWidth
                        value={permissionName}
                        onChange={(e) => setPermissionName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>إلغاء</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!permissionName || createMutation.isLoading || updateMutation.isLoading}
                    >
                        {editingId
                            ? (updateMutation.isLoading ? 'جاري التعديل...' : 'تعديل')
                            : (createMutation.isLoading ? 'جاري الإضافة...' : 'إضافة')}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد بأنك تريد حذف هذه الصلاحية؟"
                message="لن تتمكن من استعادتها بعد الحذف."
            />

            {successMessage && (
                <SuccessAlert
                    title={successMessage.text}
                    message=""
                    severity={successMessage.severity}
                    onClose={() => setSuccessMessage(null)}
                />
            )}
        </Box>
    );
};

export default Section2;
