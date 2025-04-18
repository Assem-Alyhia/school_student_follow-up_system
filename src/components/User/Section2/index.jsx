import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Typography, Avatar } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Section2 = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');

    const rows = [
        { id: '001', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'أدمن', joinDate: '2025/02/17', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '002', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'معلم', joinDate: '2025/02/16', status: 'غير نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '003', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'طالب', joinDate: '2025/02/14', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '004', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'طالب', joinDate: '2025/02/13', status: 'غير نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '005', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'مدير', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '006', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'معلم', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '007', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'سائق', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '008', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'مشرف النقل', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '009', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'معلم', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
        { id: '010', name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'طالب', joinDate: '2025/02/10', status: 'نشط', avatar: 'https://via.placeholder.com/40' },
    ];

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getStatusColor = (status) => {
        return status === 'نشط' ? 'green' : 'red';
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
                {/* <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 ,color:'#308A9F'}}>
                    قائمة المستخدمين
                </Typography> */}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="قائمة المستخدمين">
                        <TableHead sx={{ backgroundColor: '#308A9F' }}> 
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'id'}
                                        direction={orderBy === 'id' ? order : 'asc'}
                                        onClick={() => handleRequestSort('id')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }} 
                                    >
                                        الرقم
                                        {orderBy === 'id' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleRequestSort('name')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الاسم
                                        {orderBy === 'name' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'role'}
                                        direction={orderBy === 'role' ? order : 'asc'}
                                        onClick={() => handleRequestSort('role')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }} 
                                    >
                                        الدور
                                        {orderBy === 'role' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'joinDate'}
                                        direction={orderBy === 'joinDate' ? order : 'asc'}
                                        onClick={() => handleRequestSort('joinDate')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }} 
                                    >
                                        تاريخ الانضمام
                                        {orderBy === 'joinDate' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'asc'}
                                        onClick={() => handleRequestSort('status')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الحالة
                                        {orderBy === 'status' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الإجراءات</TableCell> {/* لون النص أبيض */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Box>
                                                <Typography>{row.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {row.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.joinDate}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ color: getStatusColor(row.status) }}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>
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

export default Section2;