import React from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Avatar, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Section2 = ({ grades = [] }) => {
    const getScoreColor = (score) => score >= 60 ? 'green' : 'red';

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                    نتائج الطلاب
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>المعرف</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>اسم الطالب</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>الصف</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>المادة</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>العلامة</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>الفصل</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {grades.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.student?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                                            <Typography>{row.student?.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.classroom?.name || '-'}</TableCell>
                                    <TableCell>{row.subject?.name || '-'}</TableCell>
                                    <TableCell sx={{ color: getScoreColor(parseInt(row.final_score)) }}>
                                        {row.final_score}
                                    </TableCell>
                                    <TableCell>{row.term}</TableCell>
                                    <TableCell>
                                        <IconButton aria-label="view" size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="edit" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small">
                                            <DeleteIcon fontSize="small" />
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
