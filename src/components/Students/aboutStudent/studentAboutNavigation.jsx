import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import StudentDetails from './studentDetails';
import DailySchedule from './DailySchedule';
import StudentFeesAboutTable from './studentFeesTable';


const StudentNavigation = () => {
    const [activeTab, setActiveTab] = useState('تفاصيل الطالب');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{
                padding: 2,
                backgroundColor: '#F5F5F5',
                borderRadius: 2,
                direction: 'rtl'
            }}>
                {/* Navigation Buttons */}
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('تفاصيل الطالب')}
                        sx={{
                            backgroundColor: activeTab === 'تفاصيل الطالب' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '25%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        تفاصيل الطالب
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('الجدول اليومي')}
                        sx={{
                            backgroundColor: activeTab === 'الجدول اليومي' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '25%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        الجدول اليومي
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('الرسوم')}
                        sx={{
                            backgroundColor: activeTab === 'الرسوم' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '25%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        الرسوم
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('نتائج الامتحانات')}
                        sx={{
                            backgroundColor: activeTab === 'نتائج الامتحانات' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '25%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        نتائج الامتحانات
                    </Button>
                </Box>

                {/* Content Area */}
                <Box sx={{ mt: 3 }}>
                    {activeTab === 'تفاصيل الطالب' && (
                        <StudentDetails />
                    )}
                    {activeTab === 'الجدول اليومي' && (
                        <DailySchedule />
                    )}
                    {activeTab === 'الرسوم' && (
                        <StudentFeesAboutTable />

                    )}
                    {activeTab === 'نتائج الامتحانات' && (
                        // <ExamResults />
                        <StudentDetails />

                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default StudentNavigation;