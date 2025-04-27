import React from 'react';
import { Box } from '@mui/material';
import DailySchedule from './dailySchedule';
import BreakAndHolidays from './teacherBreaks';


const TeacherDailySchedule = () => {
    return (
        <Box sx={{ padding:"0", display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DailySchedule/>
            <BreakAndHolidays/>
        </Box>
    );
};

export default TeacherDailySchedule;