// SectionFinancials.jsx
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
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import EditFinancialModal from '../UpdateFinancials';
import FinancialsDetails from '../FinancialsDetails';
import { deleteFinancial } from './../../../api/Admin/Financials/deleteFinancial';

const Section2 = ({ financials }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);



    const [openDetails, setOpenDetails] = useState(false);
    const [detailsData, setDetailsData] = useState(null);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteFinancial,
        onSuccess: () => {
            queryClient.invalidateQueries(['financials']);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
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

    const asArGender = (g) => (g === 'male' ? 'ذكر' : g === 'female' ? 'أنثى' : '—');



    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {financials.map((fin) => {
                    const user = fin?.user ?? fin ?? {};
                    const name = fin.name || user.name || '—';
                    const email = user.email || '—';
                    const imageRaw = user.image || '';
                    const hasImage = Boolean(imageRaw && String(imageRaw).trim());
                    const joinDateISO = fin.hiring_date || user.created_at;
                    const joinDate = joinDateISO ? new Date(joinDateISO).toLocaleDateString('ar-EG') : '—';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={fin.id}>
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
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={(e) => handleMenuClick(e, fin.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl) && menuRowId === fin.id}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    setDetailsData(fin);
                                                    setOpenDetails(true);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <VisibilityIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography sx={{ color: 'primary.main' }}>عرض التفاصيل</Typography>
                                            </MenuItem>



                                            <MenuItem
                                                onClick={() => {
                                                    setSelectedRow(fin);
                                                    setOpenEditModal(true);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <EditIcon fontSize="small" sx={{ color: '#FB8C00', mr: 1 }} />
                                                <Typography sx={{ color: '#FB8C00' }}>تعديل</Typography>
                                            </MenuItem>

                                            <MenuItem onClick={() => { handleDelete(fin.id); handleMenuClose(); }}>
                                                <DeleteIcon fontSize="small" sx={{ color: 'error.main', mr: 1 }} />
                                                <Typography sx={{ color: 'error.main' }}>حذف</Typography>
                                            </MenuItem>
                                        </Menu>

                                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                            {fin.prefix}
                                        </Typography>
                                    </Box>

                                    <IconButton>
                                        <PersonIcon sx={{ color: '#22385F' }} />
                                    </IconButton>
                                </Box>

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

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        my: '1rem',
                                        color: '#308A9F',
                                        textShadow: '0 1px 5px rgb(155,155,155)',
                                    }}
                                >
                                    {name}
                                </Typography>

                                <Box sx={{ my: '2rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}>
                                        <Typography sx={{ color: '#308A9F' }}><strong>رقم الموظف:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>الجنس:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>تاريخ التعيين:</strong></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{fin.prefix}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{asArGender(fin.gender)}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{joinDate}</Typography>
                                    </Box>
                                </Box>

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
                                        <EmailIcon sx={{ color: '#fff', mr: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px', direction: 'ltr' }}>
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton><PhoneIcon sx={{ color: '#22385F', fontSize: '20px' }} /></IconButton>
                                    <IconButton><ChatIcon sx={{ color: '#22385F', fontSize: '20px' }} /></IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <FinancialsDetails
                open={openDetails}
                onClose={() => { setOpenDetails(false); setDetailsData(null); }}
                financial={detailsData}
            />

            <EditFinancialModal
                open={openEditModal}
                onClose={() => { setOpenEditModal(false); setSelectedRow(null); }}
                initialData={selectedRow}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الموظف المالي؟"
                message="سيتم حذف بيانات الموظف من النظام."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم الحذف بنجاح!"
                    message="تمت إزالة بيانات الموظف المالي."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
