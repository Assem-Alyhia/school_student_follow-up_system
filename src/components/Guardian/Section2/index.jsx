import React from 'react';
import { Box, Paper, Typography, Button, Grid, IconButton, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

const Section2 = () => {
    const parents = [
        {
            id: 'P1892433',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            addedDate: '20/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'active',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'],
        },
        {
            id: 'P1892434',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            addedDate: '21/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'inactive',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'], 
        },
        {
            id: 'P1892433',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            addedDate: '20/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'active',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'],
        },
        {
            id: 'P1892434',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            addedDate: '21/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'inactive',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'], 
        },
        {
            id: 'P1892433',
            name: 'Joann Michael',
            email: 'Pateiprince9595@gmail.com',
            phone: '+123 456 789 123',
            addedDate: '20/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'active',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'],
        },
        {
            id: 'P1892434',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            phone: '+123 456 789 124',
            addedDate: '21/02/2025',
            avatar: '/Guardian/1.jpg',
            status: 'inactive',
            childrenAvatars: ['/Students/1.jpg', '/Students/1.jpg', '/Students/1.jpg'], 
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {parents.map((parent, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{
                            padding: 2,
                            height: '100%',
                            textAlign: 'center',
                            backgroundColor: '#F5F5F5',
                            border: '1px solid #308A9F',
                            maxWidth: '90%',
                            margin: 'auto',
                            position: 'relative', // لجعل العناصر المطلقة تعمل بشكل صحيح
                        }}>
                            {/* أعلى الكارد: ثلاث نقاط وكود ولي الأمر وأيقونة */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton>
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

                            {/* صورة ولي الأمر مع إشارة الحالة */}
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
                                    src={parent.avatar}
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
                                        backgroundColor: parent.status === 'active' ? '#4CAF50' : '#F44336',
                                        border: '2px solid #F5F5F5',
                                    }}
                                />
                            </Box>

                            {/* اسم ولي الأمر */}
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                margin: "1rem 0 2rem",
                                color: '#308A9F',
                                textShadow: "0 1px  5px rgb(155, 155, 155)"
                            }}>
                                {parent.name}
                            </Typography>

                            {/* تاريخ الإضافة */}
                            <Typography variant="body2" sx={{ color: '#586E75', marginBottom: 2 }}>
                                <strong>تمت الإضافة:</strong> {parent.addedDate}
                            </Typography>

                            {/* البريد الإلكتروني */}
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
                                            {parent.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* رقم الهاتف */}
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
                                            {parent.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                margin: "3rem 0 0",
                                padding: '0 16px', 
                            }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-end', 
                                    gap: 0, 
                                }}>
                                    {parent.childrenAvatars.map((avatar, idx) => (
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