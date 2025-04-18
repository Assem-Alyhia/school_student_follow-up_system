import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ExamScheduleTable = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('subject');

    const rows = [
        { subject: 'اللغة الإلكترونية', examDate: '2025/05/13', startTime: '09:30 AM', endTime: '10:30 AM', duration: '1 ساعة', baseNumber: '01', maxScore: '40', minScore: '20' },
        { subject: 'الغزيلاء', examDate: '2025/05/15', startTime: '09:30 AM', endTime: '11:30 AM', duration: '2 ساعة', baseNumber: '02', maxScore: '60', minScore: '30' },
        { subject: 'الكيمياء', examDate: '2025/05/17', startTime: '09:30 AM', endTime: '11:30 AM', duration: '2 ساعة', baseNumber: '03', maxScore: '60', minScore: '30' },
        { subject: 'العلوم', examDate: '2025/05/19', startTime: '09:30 AM', endTime: '11:30 AM', duration: '2 ساعة', baseNumber: '15', maxScore: '60', minScore: '30' },
        { subject: 'اللغة العربية', examDate: '2025/05/21', startTime: '09:30 AM', endTime: '11:30 AM', duration: '2 ساعة', baseNumber: '01', maxScore: '20', minScore: '10' },
        { subject: 'التربية الإسلامية', examDate: '2025/05/23', startTime: '09:30 AM', endTime: '10:30 AM', duration: '1 ساعة', baseNumber: '12', maxScore: '60', minScore: '30' },
    ];

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = rows.sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="جدول الامتحانات">
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'subject'}
                                        direction={orderBy === 'subject' ? order : 'asc'}
                                        onClick={() => handleRequestSort('subject')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        اسم المادة
                                        {orderBy === 'subject' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'examDate'}
                                        direction={orderBy === 'examDate' ? order : 'asc'}
                                        onClick={() => handleRequestSort('examDate')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        موعد الامتحان
                                        {orderBy === 'examDate' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'startTime'}
                                        direction={orderBy === 'startTime' ? order : 'asc'}
                                        onClick={() => handleRequestSort('startTime')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        وقت البدء
                                        {orderBy === 'startTime' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'endTime'}
                                        direction={orderBy === 'endTime' ? order : 'asc'}
                                        onClick={() => handleRequestSort('endTime')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        وقت الانتهاء
                                        {orderBy === 'endTime' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'duration'}
                                        direction={orderBy === 'duration' ? order : 'asc'}
                                        onClick={() => handleRequestSort('duration')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        المدة
                                        {orderBy === 'duration' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'baseNumber'}
                                        direction={orderBy === 'baseNumber' ? order : 'asc'}
                                        onClick={() => handleRequestSort('baseNumber')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        رقم القاعدة
                                        {orderBy === 'baseNumber' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'maxScore'}
                                        direction={orderBy === 'maxScore' ? order : 'asc'}
                                        onClick={() => handleRequestSort('maxScore')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الحد الأعلى للعلامة
                                        {orderBy === 'maxScore' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'minScore'}
                                        direction={orderBy === 'minScore' ? order : 'asc'}
                                        onClick={() => handleRequestSort('minScore')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الحد الأدنى للعلامة
                                        {orderBy === 'minScore' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.subject}</TableCell>
                                    <TableCell>{row.examDate}</TableCell>
                                    <TableCell>{row.startTime}</TableCell>
                                    <TableCell>{row.endTime}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.baseNumber}</TableCell>
                                    <TableCell>{row.maxScore}</TableCell>
                                    <TableCell>{row.minScore}</TableCell>
                                    <TableCell>
                                        <IconButton aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="view">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default ExamScheduleTable;