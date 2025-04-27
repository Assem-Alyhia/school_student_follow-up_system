import React from 'react';
import { Box, Paper, Typography, Button, Divider, Table, TableBody, TableCell, TableRow, Chip } from '@mui/material';
import { Email, Phone, Description } from '@mui/icons-material';
import TeacherCard from './teacherCard';
import ProfileDetailsCard from './personalClassDetails';
import DocumentsCard from './teacherDocuments';
import JobDetailsCard from './workDetails';
import BasicInfoCard from './basicInformation';

const TeacherProfile = () => {
    return (
        <Box sx={{ padding:"0", display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
                <Paper elevation={0} sx={{ flex: 2}}>
                    <ProfileDetailsCard/>
                    <DocumentsCard/>
                    <JobDetailsCard/>
                </Paper>

                <Paper elevation={0} sx={{ flex: 1 }}>
                    <TeacherCard/>
                    <BasicInfoCard/>
                </Paper>
            </Box>
        </Box>
    );
};

export default TeacherProfile;