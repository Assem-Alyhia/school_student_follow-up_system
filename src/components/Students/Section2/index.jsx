import React, { useState } from 'react';
import {
    Box, Paper, Typography, Button, Grid, IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../PaymentModal';

const Section2 = () => {
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuStudentId, setMenuStudentId] = useState(null);
    const navigate = useNavigate();

    const [students, setStudents] = useState([
        {
            id: 'AD9892433',
            name: 'Joann Michael',
            address: 'الصف الخامس، الشعبة الأولى',
            registrationNumber: '#12345',
            gender: 'ذكر',
            releaseDate: '10/05/2025',
            email: 'Pateiprince9595@gmail.com',
            avatar: '/Students/1.jpg',
            status: 'active',
        },
        {
            id: 'AD9892434',
            name: 'John Doe',
            address: 'الصف الرابع، الشعبة الثانية',
            registrationNumber: '#12346',
            gender: 'أنثى',
            releaseDate: '10/06/2025',
            email: 'johndoe@gmail.com',
            avatar: '/Students/1.jpg',
            status: 'inactive',
        },
        // بقية الطلاب...
    ]);

    const handleOpen = (student) => {
        setSelectedStudent(student);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStudent(null);
    };

    const updateStudentStatus = (studentId, newStatus) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleMenuClick = (event, studentId) => {
        setAnchorEl(event.currentTarget);
        setMenuStudentId(studentId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuStudentId(null);
    };

    // const handleViewDetails = (studentId) => {
    const handleViewDetails = () => {
        // navigate(`/students/${studentId}`);
        navigate(`/dashboard/student/studentManagement`);
        handleMenuClose();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {students.map((student, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
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
                                    <IconButton onClick={(e) => handleMenuClick(e, student.id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && menuStudentId === student.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => handleViewDetails(student.id)}>
                                            <VisibilityIcon fontSize="small" sx={{ color: 'primary.main', marginRight: 1 }} />
                                            <Typography sx={{ color: 'primary.main' }}>عرض التفاصيل</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={() => { console.log("تعديل", student.id); handleMenuClose(); }}>
                                            <EditIcon fontSize="small" sx={{ color: '#FB8C00', marginRight: 1 }} />
                                            <Typography sx={{ color: '#FB8C00' }}>تعديل</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={() => { console.log("حذف", student.id); handleMenuClose(); }}>
                                            <DeleteIcon fontSize="small" sx={{ color: 'error.main', marginRight: 1 }} />
                                            <Typography sx={{ color: 'error.main' }}>حذف</Typography>
                                        </MenuItem>
                                    </Menu>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                        {student.id}
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
                                    src={student.avatar}
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
                                        backgroundColor: student.status === 'active' ? '#4CAF50' : '#F44336',
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
                                {student.name}
                            </Typography>

                            <Box sx={{ margin: "2.5rem 0" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 1 }}>
                                    <Typography sx={{ color: '#308A9F' }}>
                                        <strong>رقم التسجيل:</strong>
                                    </Typography>
                                    <Typography sx={{ color: '#308A9F' }}>
                                        <strong>الجنس:</strong>
                                    </Typography>
                                    <Typography sx={{ color: '#308A9F' }}>
                                        <strong>تاريخ الانضمام:</strong>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {student.registrationNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {student.gender}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586E75' }}>
                                        {student.releaseDate}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    background: 'linear-gradient(90deg, #35AFBC, #308A9F,#22385F)',
                                    padding: '.6rem 1rem',
                                    borderRadius: 1,
                                    margin: "2.5rem auto",
                                    width: "80%",
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <EmailIcon sx={{ color: '#fff', marginRight: 1, fontSize: '16px' }} />
                                    <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px' }}>
                                        {student.email}
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
                                    onClick={() => handleOpen(student)}
                                >
                                    أضف الرسوم
                                </Button>
                                <Box>
                                    <IconButton>
                                        <PhoneIcon sx={{ color: '#22385F', fontSize: '20px' }} />
                                    </IconButton>
                                    <IconButton>
                                        <ChatIcon sx={{ color: '#22385F', fontSize: '20px' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <PaymentModal
                open={open}
                handleClose={handleClose}
                student={selectedStudent}
                updateStudentStatus={updateStudentStatus}
            />
        </Box>
    );
};

export default Section2;
