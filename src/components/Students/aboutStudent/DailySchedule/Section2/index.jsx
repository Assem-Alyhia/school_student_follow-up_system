import React from 'react';
import { Paper, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DailyScheduleAbout = () => {
    const scheduleData = {
        'الأحد': [
            { subject: 'رياضيات', time: '8:00 - 9:00 صباحًا', teacher: 'أحمد خالد' },
            { subject: 'علوم', time: '9:15 - 10:15 صباحًا', teacher: 'منى يوسف' },
            { subject: 'لغة عربية', time: '10:30 - 11:30 صباحًا', teacher: 'خالد محمود' },
            { subject: 'تاريخ', time: '12:00 - 1:00 مساءً', teacher: 'سعيد حسن' },
        ],
        'الإثنين': [
            { subject: 'كيمياء', time: '8:00 - 9:00 صباحًا', teacher: 'نورة عبد الله' },
            { subject: 'جغرافيا', time: '9:15 - 10:15 صباحًا', teacher: 'أيمن كمال' },
            { subject: 'لغة إنجليزية', time: '10:30 - 11:30 صباحًا', teacher: 'هالة ناصر' },
        ],
        'الثلاثاء': [
            { subject: 'فيزياء', time: '8:00 - 9:00 صباحًا', teacher: 'مروان سامي' },
            { subject: 'رياضيات', time: '9:15 - 10:15 صباحًا', teacher: 'أحمد خالد' },
            { subject: 'أحياء', time: '10:30 - 11:30 صباحًا', teacher: 'سمر عبد الكريم' },
            { subject: 'حاسوب', time: '12:00 - 1:00 مساءً', teacher: 'فادي حسن' },
        ],
        'الأربعاء': [
            { subject: 'لغة عربية', time: '8:00 - 9:00 صباحًا', teacher: 'خالد محمود' },
            { subject: 'كيمياء', time: '9:15 - 10:15 صباحًا', teacher: 'نورة عبد الله' },
            { subject: 'تاريخ', time: '10:30 - 11:30 صباحًا', teacher: 'سعيد حسن' },
        ],
        'الخميس': [
            { subject: 'علوم', time: '8:00 - 9:00 صباحًا', teacher: 'منى يوسف' },
            { subject: 'رياضيات', time: '9:15 - 10:15 صباحًا', teacher: 'أحمد خالد' },
            { subject: 'لغة إنجليزية', time: '10:30 - 11:30 صباحًا', teacher: 'هالة ناصر' },
        ],
        'الجمعة': [],
        'السبت': []
    };

    const maxRows = Math.max(...Object.values(scheduleData).map(day => day.length));

    return (
        <TableContainer component={Paper} sx={{ mt: 2, border: '1px solid #ddd' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {Object.keys(scheduleData).map((day, index) => (
                            <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'center', border: '1px solid #ddd', color: '#8F929C' }}>{day}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(maxRows)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Object.keys(scheduleData).map((day, colIndex) => (
                                <TableCell key={colIndex} sx={{ verticalAlign: 'top', border: '1px solid #ddd', textAlign: 'center' }}>
                                    {scheduleData[day][rowIndex] && (
                                        <Card sx={{ mb: 1, backgroundColor: '#F5F5F5', color: 'white', border: '1px solid #308A9F' }}>
                                            <CardContent>
                                                <Typography variant="body1" sx={{
                                                    fontWeight: 'medium', background: 'linear-gradient(0deg, #308A9F, #005F6B)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>{scheduleData[day][rowIndex].subject}</Typography>
                                                <Typography variant="body2" sx={{ color: '#8F929C' }}>{scheduleData[day][rowIndex].time}</Typography>
                                                <Typography sx={{ backgroundColor:'#D9D9D9' , padding:'0.5rem 1rem ' ,borderRadius:'8px', margin:"1rem 0 0 0"}}>
                                                    <Typography sx={{
                                                        fontWeight: 'bold',
                                                        background: 'linear-gradient(0deg, #308A9F, #005F6B)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent'
                                                    }}>{scheduleData[day][rowIndex].teacher}</Typography>
                                                </Typography>
                                            </CardContent>
                                        </Card>
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

export default DailyScheduleAbout;
