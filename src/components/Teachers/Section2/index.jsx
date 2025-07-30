import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton, Menu, MenuItem
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
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeacher } from '../../../api/Admin/Teachers/deleteTeacher';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import { getAllTeachers } from '../../../api/Admin/Teachers/getAllTeachers';

const Section2 = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuTeacherId, setMenuTeacherId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await getAllTeachers();
                setTeachers(response?.data || []);
            } catch (error) {
                console.error('خطأ في جلب المعلمين:', error.message);
            }
        };
        fetchTeachers();
    }, []);

    const deleteMutation = useMutation({
        mutationFn: deleteTeacher,
        onMutate: async (teacherId) => {
            setIsDeleting(true);
            // تحديث واجهة المستخدم فوراً قبل اكتمال الطلب
            setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
            return { previousTeachers: teachers };
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['teachers']);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (err, teacherId, context) => {
            // استعادة الحالة السابقة في حالة الخطأ
            setTeachers(context.previousTeachers);
            console.error('فشل في حذف المعلم:', err.message);
        },
        onSettled: () => {
            setIsDeleting(false);
        }
    });

    const handleMenuClick = (event, teacherId) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuTeacherId(teacherId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuTeacherId(null);
    };

    const handleDelete = (id) => {
        setSelectedTeacher(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(selectedTeacher);
        setOpenDeleteModal(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {teachers.map((teacher) => (
                    <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                        <Paper elevation={3} sx={{
                            padding: 2,
                            height: '100%',
                            textAlign: 'center',
                            backgroundColor: '#F5F5F5',
                            border: '1px solid #308A9F',
                            maxWidth: '90%',
                            margin: 'auto',
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={(e) => handleMenuClick(e, teacher.id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={menuAnchorEl}
                                        open={Boolean(menuAnchorEl) && menuTeacherId === teacher.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                navigate(`/dashboard/teacher/teacherManagement/${teacher.id}`);
                                                handleMenuClose();
                                            }}
                                        >
                                            <VisibilityIcon fontSize="small" sx={{ color: 'primary.main', marginRight: 1 }} />
                                            <Typography sx={{ color: 'primary.main' }}>عرض التفاصيل</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                navigate(`/dashboard/teacher/updateTeacher/${teacher.id}`);
                                                handleMenuClose();
                                            }}
                                        >
                                            <EditIcon fontSize="small" sx={{ color: '#FB8C00', marginRight: 1 }} />
                                            <Typography sx={{ color: '#FB8C00' }}>تعديل</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => { handleDelete(teacher.id); handleMenuClose(); }}
                                            disabled={isDeleting}
                                        >
                                            <DeleteIcon fontSize="small" sx={{ color: 'error.main', marginRight: 1 }} />
                                            <Typography sx={{ color: 'error.main' }}>حذف</Typography>
                                        </MenuItem>
                                    </Menu>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                        {teacher.id || '---'}
                                    </Typography>
                                </Box>
                                <IconButton>
                                    <PersonIcon sx={{ color: '#22385F' }} />
                                </IconButton>
                            </Box>

                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: 2,
                                    overflow: 'hidden',
                                    width: 100,
                                    height: 100,
                                    margin: 'auto',
                                    borderRadius: '8px',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={teacher.avatar || '/Teachers/default.jpg'}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: teacher.status === 'active' ? '#4CAF50' : '#F44336',
                                        border: '2px solid #F5F5F5',
                                    }}
                                />
                            </Box>

                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                margin: "1rem 0 2rem",
                                color: '#308A9F',
                                textShadow: "0 1px  5px rgb(155, 155, 155)"
                            }}>
                                {teacher.name}
                            </Typography>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography sx={{ color: '#586E75', marginBottom: 1 }}>
                                    <strong>البريد الإلكتروني:</strong>
                                </Typography>
                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                        padding: '.6rem 1rem',
                                        borderRadius: 1,
                                        margin: "0 auto",
                                        width: "100%",
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px' }}>
                                            {teacher.user?.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography sx={{ color: '#586E75', marginBottom: 1 }}>
                                    <strong>رقم الهاتف:</strong>
                                </Typography>
                                <Box
                                    sx={{
                                        background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                        padding: '.6rem 1rem',
                                        borderRadius: 1,
                                        margin: "0 auto",
                                        width: "100%",
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <PhoneIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px' }}>
                                            {teacher.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Typography variant="body2" sx={{
                                    color: '#F44336',
                                    backgroundColor: '#FFCDD2',
                                    padding: '.4rem 1rem',
                                    borderRadius: '4px',
                                }}>
                                    {teacher.subject || '---'}
                                </Typography>

                                <Button
                                    component={Link}
                                    to={`/dashboard/teacher/teacherManagement/${teacher.id}`}
                                    variant="outlined"
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
                                        textDecoration: 'none',
                                    }}
                                >
                                    عرض التفاصيل
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف المعلم؟"
                message="سيتم حذف بيانات المعلم من النظام."
                isLoading={isDeleting}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف المعلم بنجاح!"
                    message="تمت إزالة بيانات المعلم من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;