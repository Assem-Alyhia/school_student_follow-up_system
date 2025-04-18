import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Avatar } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';

const Section2 = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');

    const rows = [
        { id: 'T123890', teacher: 'Cody Fisher', avatar: 'https://via.placeholder.com/40', sunday: true, monday: false, tuesday: true, wednesday: false, thursday: true, friday: false, saturday: true },
        { id: 'T123891', teacher: 'Jane Doe', avatar: 'https://via.placeholder.com/40', sunday: false, monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false },
        { id: 'T123892', teacher: 'John Smith', avatar: 'https://via.placeholder.com/40', sunday: true, monday: true, tuesday: false, wednesday: false, thursday: true, friday: true, saturday: false },
        { id: 'T123890', teacher: 'Cody Fisher', avatar: 'https://via.placeholder.com/40', sunday: true, monday: false, tuesday: true, wednesday: false, thursday: true, friday: false, saturday: true },
        { id: 'T123891', teacher: 'Jane Doe', avatar: 'https://via.placeholder.com/40', sunday: false, monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false },
        { id: 'T123892', teacher: 'John Smith', avatar: 'https://via.placeholder.com/40', sunday: true, monday: true, tuesday: false, wednesday: false, thursday: true, friday: true, saturday: false },
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

    const getStatusIcon = (status) => {
        if (status === true) {
            return <CheckCircleIcon sx={{ color: 'green' }} />;
        } else if (status === false) {
            return <CancelIcon sx={{ color: 'red' }} />;
        } else {
            return <WarningIcon sx={{ color: 'orange' }} />;
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="جدول المعلمين">
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'id'}
                                        direction={orderBy === 'id' ? order : 'asc'}
                                        onClick={() => handleRequestSort('id')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        المعرف
                                        {orderBy === 'id' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '150px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'teacher'}
                                        direction={orderBy === 'teacher' ? order : 'asc'}
                                        onClick={() => handleRequestSort('teacher')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        المعلم
                                        {orderBy === 'teacher' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'sunday'}
                                        direction={orderBy === 'sunday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('sunday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الأحد
                                        {orderBy === 'sunday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'monday'}
                                        direction={orderBy === 'monday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('monday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الاثنين
                                        {orderBy === 'monday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'tuesday'}
                                        direction={orderBy === 'tuesday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('tuesday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الثلاثاء
                                        {orderBy === 'tuesday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'wednesday'}
                                        direction={orderBy === 'wednesday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('wednesday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الأربعاء
                                        {orderBy === 'wednesday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'thursday'}
                                        direction={orderBy === 'thursday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('thursday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الخميس
                                        {orderBy === 'thursday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'friday'}
                                        direction={orderBy === 'friday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('friday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الجمعة
                                        {orderBy === 'friday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'saturday'}
                                        direction={orderBy === 'saturday' ? order : 'asc'}
                                        onClick={() => handleRequestSort('saturday')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        السبت
                                        {orderBy === 'saturday' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Typography>{row.teacher}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.sunday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.monday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.tuesday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.wednesday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.thursday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.friday)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{getStatusIcon(row.saturday)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Section2;