import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';

const UpcomingEvents = () => {

    const events = [
        {
            title: "اجتماع مع أولياء الأمور",
            date: "04/04/2025",
            time: "04:00 مساءً",
            icon: <GroupIcon sx={{ color: '#fff',   }} />
        },
        {
            title: "اجتماع مع أولياء الأمور",
            date: "04/04/2025",
            time: "04:00 مساءً",
            icon: <GroupIcon sx={{ color: '#fff' }} />
        },
        {
            title: "اجتماع مع أولياء الأمور",
            date: "04/04/2025",
            time: "04:00 مساءً",
            icon: <GroupIcon sx={{ color: '#fff' }} />
        }
    ];

    return (
        <Box sx={{ direction: 'rtl', p: 2 }}>
            <Typography variant="h6" sx={{ color: '#22385F', fontWeight: 'bold', mb: 2 }}>
                الأحداث القادمة
            </Typography>
            <Grid container spacing={2}>
                {events.map((event, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: '#ebebf3' }}>
                            <Avatar sx={{ background: 'linear-gradient(180deg, #35AFBC, #308A9F, #22385F)', width: 56, height: 56, mr: 2  ,  ml:2 , borderRadius:"10px"}}>
                                {event.icon}
                            </Avatar>
                            <Box>
                                <Typography sx={{ color: '#22385F', fontWeight: 'bold' }}>{event.title}</Typography>
                                <Typography variant="body2" sx={{ color: '#586E75' }}>{`${event.time} | ${event.date}`}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UpcomingEvents;
