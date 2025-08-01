import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import AccountSettings from './accountSettings';
import SecuritySettings from './securitySettings';
import NotificationSettings from './notifications';




const SettingNavigation = () => {
    const [activeTab, setActiveTab] = useState('اعدادات الحساب');

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
                        onClick={() => handleTabChange('اعدادات الحساب')}
                        sx={{
                            backgroundColor: activeTab === 'تقارير الدرجات' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '33.33%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        اعدادات الحساب
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('اعدادات الامان')}
                        sx={{
                            backgroundColor: activeTab === 'تقارير الرسوم' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '33.33%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        اعدادات الامان
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleTabChange('الاشعارات')}
                        sx={{
                            backgroundColor: activeTab === 'تقارير الرسوم' ? '#22385F' : '#35AFBC',
                            '&:hover': { backgroundColor: '#30BA9F' },
                            fontSize: '14px',
                            padding: '8px 16px',
                            minWidth: '33.33%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        الاشعارات
                    </Button>
                </Box>

                {/* Content Area */}
                <Box sx={{ mt: 3 }}>
                    {activeTab === 'اعدادات الحساب' && (
                        <AccountSettings />
                    )}
                    {activeTab === 'اعدادات الامان' && (
                        <SecuritySettings />
                    )}
                    {activeTab === 'الاشعارات' && (
                        <NotificationSettings />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingNavigation;