import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Grid,
    Button,
    TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

const examResults = [
    { id: '001', subject: 'الفيزياء', grade: 100, average: 100, status: 'ناجح' },
    { id: '002', subject: 'العلوم', grade: 95, average: 100, status: 'ناجح' },
    { id: '003', subject: 'الرياضيات', grade: 100, average: 100, status: 'ناجح' },
    { id: '004', subject: 'اللغة العربية', grade: 90, average: 100, status: 'ناجح' },
    { id: '005', subject: 'اللغة الإنجليزية', grade: 100, average: 100, status: 'ناجح' },
    { id: '006', subject: 'التربية الإسلامية', grade: 99, average: 100, status: 'ناجح' },
    { id: '007', subject: 'الكيمياء', grade: null, average: 0, status: 'راسب' }
];

const StudentExamsTable = () => {
    const [orderBy, setOrderBy] = useState('grade');
    const [order, setOrder] = useState('desc');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedResults = [...examResults].sort((a, b) => {
        const valA = a[orderBy] ?? -1;
        const valB = b[orderBy] ?? -1;
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <Box sx={{ p: 2, direction: 'rtl', backgroundColor: '#f5f6fa' }}>
            <Paper elevation={0} sx={{ padding: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center" sx={{ direction: 'ltr' }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}>
                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ ml: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            ترتيب
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ ml: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            منقّح
                        </Button>
                        <TextField
                            placeholder="ابحث هنا"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: '20px' }} />
                                )
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#308A9F', fontWeight: 'bold' }}>
                            نتائج الامتحانات
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#308A9F' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>المعرف</TableCell>
                            <TableCell sx={{ color: '#fff' }}>اسم المادة</TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                                <TableSortLabel
                                    active={orderBy === 'grade'}
                                    direction={orderBy === 'grade' ? order : 'asc'}
                                    onClick={() => handleSort('grade')}
                                    sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff !important' } }}
                                >
                                    العلامة
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                                <TableSortLabel
                                    active={orderBy === 'average'}
                                    direction={orderBy === 'average' ? order : 'asc'}
                                    onClick={() => handleSort('average')}
                                    sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff !important' } }}
                                >
                                    المعدل
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>النتيجة</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResults.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.subject}</TableCell>
                                <TableCell sx={{ color: row.grade === null ? 'red' : undefined }}>
                                    {row.grade === null ? 'لم يتم التقديم' : row.grade}
                                </TableCell>
                                <TableCell>{row.average}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontWeight: 'bold',
                                            color: row.status === 'ناجح' ? '#388e3c' : '#d32f2f',
                                            backgroundColor: row.status === 'ناجح' ? '#c8e6c9' : '#ffcdd2'
                                        }}
                                    >
                                        {row.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StudentExamsTable;
