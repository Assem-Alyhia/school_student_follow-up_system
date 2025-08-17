import React, { useState } from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton,
    Avatar, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom'; // ⬅️ جديد

import ParentChildrenModal from '../parentChildrenModal/ParentChildrenModal';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import { deleteParent } from '../../../api/Admin/Parents/deleteParent';
import { getParentById } from '../../../api/Admin/Parents/getParentById';

const Section2 = ({ parents = [], setParents }) => {
    const navigate = useNavigate(); // ⬅️ جديد

    const [selectedParent, setSelectedParent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuParent, setMenuParent] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleMenuOpen = (event, parent) => {
        setAnchorEl(event.currentTarget);
        setMenuParent(parent);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuParent(null);
    };

    const handleOpenModal = async (parentId) => {
        try {
            const response = await getParentById(parentId);
            const fullParent = response?.data?.parent ?? response?.data ?? response;
            if (!fullParent?.id) return;
            setSelectedParent(fullParent);
            setOpenModal(true);
        } catch (err) {
            console.error("خطأ في جلب بيانات ولي الأمر", err);
        }
    };

    const handleEdit = (parent) => {
        if (!parent?.id) return;
        navigate(`/dashboard/guardian/parentFormEdit/${parent.id}`);
        handleMenuClose();
    };

    const handleDelete = (parent) => {
        handleMenuClose();
        setTimeout(() => {
            setMenuParent(parent);
            setOpenDeleteModal(true);
        }, 0);
    };

    const confirmDelete = async () => {
        if (!menuParent || !menuParent.id) {
            alert("تعذر تحديد العنصر للحذف");
            return;
        }

        try {
            await deleteParent(menuParent.id);
            if (setParents) setParents((prev) => prev.filter((p) => p.id !== menuParent.id));
            setShowSuccess(true);
        } catch (error) {
            alert("فشل في الحذف: " + error.message);
        } finally {
            setOpenDeleteModal(false);
            setMenuParent(null);
        }
    };

    const handleCloseModal = () => {
        setSelectedParent(null);
        setOpenModal(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {parents.map((parent, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: 2,
                                height: '100%',
                                textAlign: 'center',
                                backgroundColor: '#F5F5F5',
                                border: '1px solid #308A9F',
                                maxWidth: '90%',
                                margin: 'auto',
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={(e) => handleMenuOpen(e, parent)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                        {parent.id}
                                    </Typography>
                                </Box>
                                <IconButton>
                                    <PersonIcon sx={{ color: '#22385F' }} />
                                </IconButton>
                            </Box>

                            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 2, overflow: 'hidden', width: 100, height: 100, margin: 'auto', borderRadius: '8px' }}>
                                <Box component="img" src={parent.user.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: parent.status === 'active' ? '#4CAF50' : '#F44336',
                                    border: '2px solid #F5F5F5',
                                }} />
                            </Box>

                            <Typography variant="h6" sx={{
                                fontWeight: 'bold', margin: "1rem 0 2rem",
                                color: '#308A9F', textShadow: "0 1px 5px rgb(155, 155, 155)"
                            }}>
                                {parent.name}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#586E75', marginBottom: 2 }}>
                                <strong>تمت الإضافة:</strong> {parent.addedDate}
                            </Typography>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography sx={{ color: '#586E75', marginBottom: 1 }}>
                                    <strong>البريد الإلكتروني:</strong>
                                </Typography>
                                <Box sx={{
                                    background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                    padding: '.6rem 1rem',
                                    borderRadius: 1,
                                    margin: "0 auto", width: "100%"
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px' }}>
                                            {parent.user?.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography sx={{ color: '#586E75', marginBottom: 1 }}>
                                    <strong>رقم الهاتف:</strong>
                                </Typography>
                                <Box sx={{
                                    background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                    padding: '.6rem 1rem',
                                    borderRadius: 1,
                                    margin: "0 auto", width: "100%"
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <PhoneIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px' }}>
                                            {parent.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', margin: "3rem 0 0", padding: '0 16px'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
                                    {parent.childrenAvatars?.map((avatar, idx) => (
                                        <Avatar
                                            key={idx}
                                            src={avatar}
                                            sx={{
                                                width: idx === 1 ? 40 : 30,
                                                height: idx === 1 ? 40 : 30,
                                                border: '2px solid #F5F5F5',
                                                position: 'relative',
                                                top: idx === 1 ? '-15px' : '0',
                                                marginLeft: idx !== 0 ? '-10px' : '0',
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Button
                                    variant="outlined"
                                    onClick={() => handleOpenModal(parent.id)}
                                    sx={{
                                        borderColor: '#308A9F',
                                        color: '#308A9F',
                                        '&:hover': {
                                            borderColor: '#22385F',
                                            backgroundColor: '#308A9F',
                                            color: '#fff',
                                        },
                                        fontSize: '14px',
                                        padding: '6px 12px',
                                    }}
                                >
                                    عرض التفاصيل
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleOpenModal(menuParent?.id); handleMenuClose(); }}>
                    <ListItemIcon><VisibilityIcon sx={{ color: '#0D47A1' }} /></ListItemIcon>
                    <ListItemText primary="عرض التفاصيل" primaryTypographyProps={{ color: '#0D47A1' }} />
                </MenuItem>

                <MenuItem onClick={() => handleEdit(menuParent)}>
                    <ListItemIcon><EditIcon sx={{ color: '#FB8C00' }} /></ListItemIcon>
                    <ListItemText primary="تعديل" primaryTypographyProps={{ color: '#FB8C00' }} />
                </MenuItem>

                <MenuItem onClick={() => handleDelete(menuParent)}>
                    <ListItemIcon><DeleteIcon sx={{ color: '#C62828' }} /></ListItemIcon>
                    <ListItemText primary="حذف" primaryTypographyProps={{ color: '#C62828' }} />
                </MenuItem>
            </Menu>

            <ParentChildrenModal
                open={openModal}
                onClose={handleCloseModal}
                parent={selectedParent}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف ولي الأمر؟"
                message="سيتم حذف بيانات ولي الأمر من النظام."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف ولي الأمر بنجاح!"
                    message="تمت إزالة بياناته من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
