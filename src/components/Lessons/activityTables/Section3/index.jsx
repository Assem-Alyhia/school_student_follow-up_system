import React from 'react';
import {
    Box,
    Typography,
    Paper,
    useTheme,
    Grid
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UpcomingEvents = () => {
    const theme = useTheme();

    const events = [
        {
            title: "اجتماع مع أولياء الأمور",
            icon: <GroupIcon color="primary" />,
            date: "04/04/2023"
        },
        {
            title: "اختماج مع أولياء الأمور",
            icon: <AssignmentIcon color="primary" />,
            date: "04/04/2023"
        },
        {
            title: "إرشاد",
            icon: <SchoolIcon color="primary" />,
            date: "04/04/2023"
        }
    ];

    return (
        <Paper elevation={3} sx={{
            width: '100%',
            p: 3,
            borderRadius: '12px',
            direction: 'rtl'
        }}>
            {/* Header */}
            <Typography variant="h6" sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <EventIcon color="primary" />
                الأحداث القادمة
            </Typography>

            {/* Events Grid */}
            <Grid container spacing={2}>
                {events.map((event, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            borderRadius: '8px',
                            height: '100%'
                        }}>
                            <Box sx={{
                                color: theme.palette.primary.main,
                                mb: 1,
                                fontSize: '2.5rem'
                            }}>
                                {event.icon}
                            </Box>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 'bold',
                                mb: 0.5
                            }}>
                                {event.title}
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: theme.palette.text.secondary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <EventIcon fontSize="small" />
                                {event.date}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default UpcomingEvents;