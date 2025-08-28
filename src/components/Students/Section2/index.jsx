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
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '../../../api/Admin/Students/deleteStudent';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import PaymentModal from '../PaymentModal';

const Section2 = ({ students }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuStudentId, setMenuStudentId] = useState(null);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleMenuClick = (event, studentId) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuStudentId(studentId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuStudentId(null);
    };

    const handleDelete = (id) => {
        setSelectedStudent(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(selectedStudent);
        setOpenDeleteModal(false);
    };

    const handleOpenPayment = (student) => {
        setSelectedStudent(student);
        setOpenPaymentModal(true);
    };

    const handleClosePayment = () => {
        setSelectedStudent(null);
        setOpenPaymentModal(false);
    };

    const asArGender = (g) => (g === 'male' ? 'ذكر' : g === 'female' ? 'أنثى' : '—');

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {students.map((student) => {
                    const user = student?.user ?? student ?? {};
                    const name = user.name || '—';
                    const email = user.email || '—';
                    const imageRaw = user.image || ''; 
                    const hasImage = Boolean(imageRaw && String(imageRaw).trim());

                    return (
                        <Grid item xs={12} sm={6} md={4} key={student.id}>
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={(e) => handleMenuClick(e, student.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl) && menuStudentId === student.id}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    navigate(`/dashboard/student/studentManagement/${student.id}`);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <VisibilityIcon fontSize="small" sx={{ color: 'primary.main', marginRight: 1 }} />
                                                <Typography sx={{ color: 'primary.main' }}>عرض التفاصيل</Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    navigate(`/dashboard/student/updateStudent/${student.id}`);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <EditIcon fontSize="small" sx={{ color: '#FB8C00', marginRight: 1 }} />
                                                <Typography sx={{ color: '#FB8C00' }}>تعديل</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => { handleDelete(student.id); handleMenuClose(); }}>
                                                <DeleteIcon fontSize="small" sx={{ color: 'error.main', marginRight: 1 }} />
                                                <Typography sx={{ color: 'error.main' }}>حذف</Typography>
                                            </MenuItem>
                                        </Menu>

                                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                            {student.prefix}
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

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: student.status === 'active' ? '#4CAF50' : '#F44336',
                                            border: '2px solid #F5F5F5',
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        margin: '1rem 0 2rem',
                                        color: '#308A9F',
                                        textShadow: '0 1px 5px rgb(155,155,155)',
                                    }}
                                >
                                    {name}
                                </Typography>

                                <Box sx={{ margin: '2.5rem 0' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 1 }}>
                                        <Typography sx={{ color: '#308A9F' }}><strong>رقم التسجيل:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>الجنس:</strong></Typography>
                                        <Typography sx={{ color: '#308A9F' }}><strong>تاريخ الانضمام:</strong></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>{student.prefix}</Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {asArGender(student.gender)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#586E75' }}>
                                            {new Date(user.created_at).toLocaleDateString('ar-EG')}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                        padding: '.6rem 1rem',
                                        borderRadius: 1,
                                        margin: '2.5rem auto',
                                        width: '80%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px', direction: 'ltr' }}>
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: 'linear-gradient(90deg, #308A9F,#22385F)',
                                            '&:hover': { backgroundColor: '#308A9F' },
                                            fontSize: '14px',
                                            padding: '6px 12px',
                                        }}
                                        onClick={() => handleOpenPayment(student)}
                                    >
                                        أضف الرسوم
                                    </Button>
                                    <Box>
                                        <IconButton><PhoneIcon sx={{ color: '#22385F', fontSize: '20px' }} /></IconButton>
                                        <IconButton><ChatIcon sx={{ color: '#22385F', fontSize: '20px' }} /></IconButton>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <PaymentModal
                open={openPaymentModal}
                handleClose={handleClosePayment}
                student={selectedStudent}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الطالب؟"
                message="سيتم حذف بيانات الطالب من النظام."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الطالب بنجاح!"
                    message="تمت إزالة بيانات الطالب من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
