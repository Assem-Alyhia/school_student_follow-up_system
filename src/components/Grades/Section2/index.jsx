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
        { id: 'AD933', name: 'Cody Fisher', registrationNumber: '35013', avatar: 'https://via.placeholder.com/40', physics: 90, chemistry: 100, science: 95, arabic: 100, english: 95, islamic: 99, math: 96, result: 'AIPB' },
        { id: 'AD434', name: 'Jane Doe', registrationNumber: '35014', avatar: 'https://via.placeholder.com/40', physics: 77, chemistry: 85, science: 84, arabic: 59, english: 80, islamic: 77, math: 60, result: 'AIPB' },
        { id: 'AD435', name: 'John Smith', registrationNumber: '35015', avatar: 'https://via.placeholder.com/40', physics: 86, chemistry: 85, science: 80, arabic: 90, english: 90, islamic: 95, math: 90, result: 'AIPB' },
        { id: 'AD936', name: 'Cody Fisher', registrationNumber: '35016', avatar: 'https://via.placeholder.com/40', physics: 95, chemistry: 90, science: 90, arabic: 77, english: 70, islamic: 88, math: 99, result: 'AIPB' },
        { id: 'AD937', name: 'Cody Fisher', registrationNumber: '35017', avatar: 'https://via.placeholder.com/40', physics: 95, chemistry: 90, science: 100, arabic: 65, english: 70, islamic: 88, math: 90, result: 'AIPB' },
    ];

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getScoreColor = (score) => {
        return score >= 60 ? 'green' : 'red';
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
                    <Table sx={{ minWidth: 650 }} aria-label="نتائج الامتحانات">
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
                                <TableCell sx={{ width: '200px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleRequestSort('name')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        اسم الطالب
                                        {orderBy === 'name' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'physics'}
                                        direction={orderBy === 'physics' ? order : 'asc'}
                                        onClick={() => handleRequestSort('physics')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الفيزياء
                                        {orderBy === 'physics' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'chemistry'}
                                        direction={orderBy === 'chemistry' ? order : 'asc'}
                                        onClick={() => handleRequestSort('chemistry')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الكيمياء
                                        {orderBy === 'chemistry' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'science'}
                                        direction={orderBy === 'science' ? order : 'asc'}
                                        onClick={() => handleRequestSort('science')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        العلوم
                                        {orderBy === 'science' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'arabic'}
                                        direction={orderBy === 'arabic' ? order : 'asc'}
                                        onClick={() => handleRequestSort('arabic')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        اللغة العربية
                                        {orderBy === 'arabic' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'english'}
                                        direction={orderBy === 'english' ? order : 'asc'}
                                        onClick={() => handleRequestSort('english')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        اللغة الإنكليزية
                                        {orderBy === 'english' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'islamic'}
                                        direction={orderBy === 'islamic' ? order : 'asc'}
                                        onClick={() => handleRequestSort('islamic')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        التربية الإسلامية
                                        {orderBy === 'islamic' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'math'}
                                        direction={orderBy === 'math' ? order : 'asc'}
                                        onClick={() => handleRequestSort('math')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الرياضيات
                                        {orderBy === 'math' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem' }}>
                                    <TableSortLabel
                                        active={orderBy === 'result'}
                                        direction={orderBy === 'result' ? order : 'asc'}
                                        onClick={() => handleRequestSort('result')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        النتيجة
                                        {orderBy === 'result' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: '100px', fontSize: '0.875rem', fontWeight: 'bold', color: '#fff' }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Box>
                                                <Typography sx={{ fontSize: '0.875rem' }}>{row.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                    رقم التسجيل: {row.registrationNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.physics), fontSize: '0.875rem' }}>
                                            {row.physics}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.chemistry), fontSize: '0.875rem' }}>
                                            {row.chemistry}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.science), fontSize: '0.875rem' }}>
                                            {row.science}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.arabic), fontSize: '0.875rem' }}>
                                            {row.arabic}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.english), fontSize: '0.875rem' }}>
                                            {row.english}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.islamic), fontSize: '0.875rem' }}>
                                            {row.islamic}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.math), fontSize: '0.875rem' }}>
                                            {row.math}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <Typography sx={{ color: getScoreColor(row.result === 'AIPB' ? 100 : 0), fontSize: '0.875rem' }}>
                                            {row.result}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>
                                        <IconButton aria-label="edit" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="view" size="small">
                                            <VisibilityIcon fontSize="small" />
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