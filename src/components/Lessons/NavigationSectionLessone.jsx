import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import NavigationDailySchedule from './DailySchedule/NavigationDailySchedule';
import NavigationExamSchedule from './ExamSchedule/NavigationDailySchedule';
import NavigationActivityTables from './activityTables/NavigationaAtivityTables';
import AddLessonModal from './AddLessonModal';

const NavigationSectionLessone = () => {
    const [activeButton, setActiveButton] = useState('الجدول اليومي');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleButtonClick = (buttonName) => setActiveButton(buttonName);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const isActive = (name) => activeButton === name;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('الجدول اليومي')}
                        sx={{
                            bgcolor: isActive('الجدول اليومي') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        الجدول اليومي
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('جدول الامتحانات')}
                        sx={{
                            bgcolor: isActive('جدول الامتحانات') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        جدول الامتحانات
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleButtonClick('النشاط')}
                        sx={{
                            bgcolor: isActive('النشاط') ? '#22385F' : '#35AFBC',
                            '&:hover': { bgcolor: '#30BA9F' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                    >
                        النشاط
                    </Button>

                    <Button
                        variant="contained"
                        onClick={openAddModal}
                        sx={{
                            bgcolor: '#35bc6bff',
                            '&:hover': { bgcolor: '#30ba3bff' },
                            fontSize: '14px',
                            px: 2, py: 0.75,
                            flexGrow: 1,
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={isAddModalOpen ? 'true' : 'false'}
                    >
                        إضافة حدث
                    </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                    {activeButton === 'الجدول اليومي' && <NavigationDailySchedule />}
                    {activeButton === 'جدول الامتحانات' && <NavigationExamSchedule />}
                    {activeButton === 'النشاط' && <NavigationActivityTables />}
                </Box>
            </Paper>

            <AddLessonModal
                open={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={() => {
                    closeAddModal();
                }}
            />
        </Box>
    );
};

export default NavigationSectionLessone;
