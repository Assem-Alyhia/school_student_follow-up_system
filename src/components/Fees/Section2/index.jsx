import React from 'react';
import {
    Box, Paper, Grid, Button, TextField, IconButton, Typography, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Section2 = () => {
    const rows = [
        {
            id: 'AD989243',
            nationalId: 'PB892433',
            regNumber: '8930',
            name: 'Cody Fisher',
            email: 'Cody@gmail.com',
            grade: 'الأول',
            classroom: 'الأولى',
            section: 'الخامس',
            amount: '800$',
            date: '2025/02/17',
            status: 'مدفوع',
        },
        {
            id: 'AD989243',
            nationalId: 'PB892433',
            regNumber: '8930',
            name: 'Cody Fisher',
            email: 'Cody@gmail.com',
            grade: 'الثاني',
            classroom: 'الأولى',
            section: 'الخامس',
            amount: '800$',
            date: '2025/02/17',
            status: 'غير مدفوع',
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="outlined" startIcon={<SortIcon />} sx={{ mr: 2, color: '#35AFBC', borderColor: '#35AFBC' }}>
                            ترتيب
                        </Button>
                        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ mr: 2, color: '#35AFBC', borderColor: '#35AFBC' }}>
                            فلترة
                        </Button>
                        <TextField
                            placeholder="ابحث هنا"
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: '20px' }} />,
                            }}
                            sx={{
                                flexGrow: 1,
                                '& .MuiInputBase-root': {
                                    height: '40px',
                                    fontSize: '14px',
                                    padding: '6px 12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#35AFBC', mr: 2 }}>
                            أضف مسار
                        </Button>
                        <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ backgroundColor: '#35AFBC', mr: 2 }}>
                            تصدير البيانات
                        </Button>
                        <IconButton sx={{ color: '#35AFBC' }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                            <TableCell>الإجراءات</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>آخر تاريخ</TableCell>
                            <TableCell>المبلغ</TableCell>
                            <TableCell>الشقية</TableCell>
                            <TableCell>الصف</TableCell>
                            <TableCell>الاسم</TableCell>
                            <TableCell>رقم التسجيل</TableCell>
                            <TableCell>معرف الهوية</TableCell>
                            <TableCell>المعرف</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <IconButton><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: row.status === 'مدفوع' ? '#DFF5E4' : '#FFEBEE',
                                            color: row.status === 'مدفوع' ? '#2E7D32' : '#C62828',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.section}</TableCell>
                                <TableCell>{row.classroom}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar alt={row.name} src="/images/avatar.jpg" sx={{ width: 32, height: 32, mr: 1 }} />
                                        <Box>
                                            <Typography fontWeight="bold" fontSize={14}>{row.name}</Typography>
                                            <Typography fontSize={12} color="text.secondary">{row.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.regNumber}</TableCell>
                                <TableCell>{row.nationalId}</TableCell>
                                <TableCell>{row.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Section2;
