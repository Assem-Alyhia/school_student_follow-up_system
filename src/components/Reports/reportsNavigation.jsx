import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import FeesReports from './feesReports';
import GradeReports from './gradeReports';




const ReportsNavigation = () => {
    const [activeTab, setActiveTab] = useState('تقارير الدرجات');

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
                        onClick={() => handleTabChange('تقارير الدرجات')}
                        sx={{
                            backgroundColor: activeTab === 'تقارير الدرجات' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '50%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        تقارير الدرجات
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('تقارير الرسوم')}
                        sx={{
                            backgroundColor: activeTab === 'تقارير الرسوم' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '50%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        تقارير الرسوم
                    </Button>
                </Box>

                {/* Content Area */}
                <Box sx={{ mt: 3 }}>
                    {activeTab === 'تقارير الدرجات' && (
                        <FeesReports />
                    )}
                    {activeTab === 'تقارير الرسوم' && (
                        <GradeReports/>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ReportsNavigation;