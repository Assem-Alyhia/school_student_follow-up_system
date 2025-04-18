import React from 'react';
import { Box, Paper, Typography, Button, Grid, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const Section2 = () => {
    const teachers = [
        {
            id: 'T12345',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            subject: 'فيزياء',
            avatar: '/Teachers/1.jpg',
            status: 'active',
        },
        {
            id: 'T12346',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            subject: 'رياضيات',
            avatar: '/Teachers/1.jpg',
            status: 'inactive',
        },
        {
            id: 'T12345',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            subject: 'فيزياء',
            avatar: '/Teachers/1.jpg',
            status: 'active',
        },
        {
            id: 'T12346',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            subject: 'رياضيات',
            avatar: '/Teachers/1.jpg',
            status: 'inactive',
        },
        {
            id: 'T12345',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            subject: 'فيزياء',
            avatar: '/Teachers/1.jpg',
            status: 'active',
        },
        {
            id: 'T12346',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            subject: 'رياضيات',
            avatar: '/Teachers/1.jpg',
            status: 'inactive',
        },
        {
            id: 'T12345',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            subject: 'فيزياء',
            avatar: '/Teachers/1.jpg',
            status: 'active',
        },
        {
            id: 'T12346',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            subject: 'رياضيات',
            avatar: '/Teachers/1.jpg',
            status: 'inactive',
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {teachers.map((teacher, index) => (
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
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                                        {teacher.id}
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
                                    src={teacher.avatar}
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

                            {/* اسم المعلم */}
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
                                            {teacher.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography  sx={{ color: '#586E75', marginBottom: 1 }}>
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
                                    {teacher.subject}
                                </Typography>
                                <Button
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
                                    }}
                                >
                                    عرض التفاصيل
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Section2;