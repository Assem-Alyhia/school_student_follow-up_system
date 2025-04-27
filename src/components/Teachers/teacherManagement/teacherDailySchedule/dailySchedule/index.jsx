import React from 'react';
import { Paper, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

const DailySchedule = () => {
    const scheduleData = {
        'الأحد': [
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: فيزياء', time: '8:30 - 9:30 صباحًا' },
            { class: 'الشعبة الثانية', grade: 'الصف: السابع', subject: 'المادة: علوم', time: '9:15 - 10:15 صباحًا' },
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: لغة عربية', time: '10:30 - 11:30 صباحًا' },
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: تاريخ', time: '12:00 - 1:00 مساءً' },
        ],
        'الإثنين': [
            { class: 'الشعبة الثانية', grade: 'الصف: السابع', subject: 'المادة: كيمياء', time: '8:30 - 9:30 صباحًا' },
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: جغرافيا', time: '9:15 - 10:15 صباحًا' },
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: لغة إنجليزية', time: '10:30 - 11:30 صباحًا' },
        ],
        'الثلاثاء': [
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: فيزياء', time: '8:30 - 9:30 صباحًا'},
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: رياضيات', time: '9:15 - 10:15 صباحًا' },
            { class: 'الشعبة الثانية', grade: 'الصف: السابع', subject: 'المادة: أحياء', time: '10:30 - 11:30 صباحًا' },
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: حاسوب', time: '12:00 - 1:00 مساءً' },
        ],
        'الأربعاء': [
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: لغة عربية', time: '8:30 - 9:30 صباحًا' },
            { class: 'الشعبة الثانية', grade: 'الصف: السابع', subject: 'المادة: كيمياء', time: '9:15 - 10:15 صباحًا' },
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: تاريخ', time: '10:30 - 11:30 صباحًا'},
        ],
        'الخميس': [
            { class: 'الشعبة الأولى', grade: 'الصف: السابع', subject: 'المادة: علوم', time: '8:30 - 9:30 صباحًا' },
            { class: 'الشعبة الثانية', grade: 'الصف: السابع', subject: 'المادة: رياضيات', time: '9:15 - 10:15 صباحًا' },
            { class: 'الشعبة الثالثة', grade: 'الصف: السابع', subject: 'المادة: لغة إنجليزية', time: '10:30 - 11:30 صباحًا' },
        ],
        'الجمعة': [],
        'السبت': []
    };

    const maxRows = Math.max(...Object.values(scheduleData).map(day => day.length));

    return (
        <TableContainer component={Paper} sx={{ mt: 2, border: '1px solid #ddd', direction: 'rtl' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {Object.keys(scheduleData).map((day, index) => (
                            <TableCell key={index} sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#f5f5f5',
                                textAlign: 'center',
                                border: '1px solid #ddd',
                                color: '#8F929C',
                                minWidth: '150px'
                            }}>{day}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(maxRows)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Object.keys(scheduleData).map((day, colIndex) => (
                                <TableCell key={colIndex} sx={{
                                    verticalAlign: 'top',
                                    border: '1px solid #ddd',
                                    textAlign: 'center',
                                    padding: '8px',
                                    backgroundColor: 'white'
                                }}>
                                    {scheduleData[day][rowIndex] && (
                                        <Box sx={{
                                            mb: 1,
                                            padding: '2px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient( 180deg , #35AFBC, #308A9F,rgb(51, 73, 111))'
                                        }}>
                                            <Card sx={{
                                                backgroundColor: '#F5F5F5',
                                                borderRadius: '6px',
                                                boxShadow: 'none',
                                                border: 'none'
                                            }}>
                                                <CardContent sx={{ padding: '12px !important' }}>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2" sx={{
                                                            fontSize: '0.8rem',
                                                            background: 'linear-gradient( 180deg , #35AFBC, #308A9F,rgb(23, 94, 110))',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            marginBottom: '4px'
                                                        }}>
                                                            {scheduleData[day][rowIndex].class}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient( 180deg , #35AFBC, #308A9F, #22385F)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            marginBottom: '4px'
                                                        }}>
                                                            {scheduleData[day][rowIndex].grade}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{
                                                            fontWeight: 'bold',
                                                            background: 'linear-gradient( 180deg , #35AFBC, #308A9F, #22385F)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            marginBottom: '8px'
                                                        }}>
                                                            {scheduleData[day][rowIndex].subject}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: '#8F929C',
                                                            fontSize: '0.75rem'
                                                        }}>
                                                            {scheduleData[day][rowIndex].time}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DailySchedule;