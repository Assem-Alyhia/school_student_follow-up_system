import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TableSortLabel, TextField, Grid
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useParams } from 'react-router-dom';
import { getPaymentById } from '../../../../../api/Admin/Students/getPaymentById';

const StudentFeesTable = () => {
    const { id } = useParams();
    const [payment, setPayment] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [filters, setFilters] = useState({
        student: '', parent: '', feeType: '', status: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPaymentById(id);
                setPayment(result);
            } catch (error) {
                console.error("خطأ أثناء جلب بيانات الدفع:", error);
            }
        };
        fetchData();
    }, [id]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filtered = payment ? [payment].filter((item) => {
        return (
            item.student?.name.toLowerCase().includes(filters.student.toLowerCase()) &&
            item.parent?.name.toLowerCase().includes(filters.parent.toLowerCase()) &&
            item.schoolFee?.name.toLowerCase().includes(filters.feeType.toLowerCase()) &&
            item.status.toLowerCase().includes(filters.status.toLowerCase())
        );
    }) : [];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>تفاصيل الرسوم</Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="بحث باسم الطالب"
                        value={filters.student}
                        onChange={(e) => setFilters({ ...filters, student: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="بحث باسم ولي الأمر"
                        value={filters.parent}
                        onChange={(e) => setFilters({ ...filters, parent: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="بحث بنوع الرسوم"
                        value={filters.feeType}
                        onChange={(e) => setFilters({ ...filters, feeType: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="بحث بالحالة"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    />
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                { key: 'id', label: 'المعرف' },
                                { key: 'student', label: 'اسم الطالب' },
                                { key: 'parent', label: 'اسم ولي الأمر' },
                                { key: 'feeType', label: 'نوع الرسوم' },
                                { key: 'fullAmount', label: 'المبلغ الكامل' },
                                { key: 'paidAmount', label: 'المبلغ المدفوع' },
                                { key: 'discount', label: 'الخصم' },
                                { key: 'discountStatus', label: 'حالة الخصم' },
                                { key: 'remaining', label: 'المبلغ المتبقي' },
                                { key: 'paymentNo', label: 'رقم الدفع' },
                                { key: 'date', label: 'تاريخ الدفع' },
                                { key: 'status', label: 'الحالة' },
                            ].map((col) => (
                                <TableCell
                                    key={col.key}
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#22385F',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <TableSortLabel
                                        active={sortConfig.key === col.key}
                                        direction={sortConfig.direction}
                                        onClick={() => requestSort(col.key)}
                                        IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.student?.name}</TableCell>
                                <TableCell>{row.parent?.name}</TableCell>
                                <TableCell>{row.schoolFee?.name}</TableCell>
                                <TableCell>{row.schoolFee?.amount}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.discount}</TableCell>
                                <TableCell>{row.discount_status}</TableCell>
                                <TableCell>{row.remaining_amount}</TableCell>
                                <TableCell>{row.payment_number}</TableCell>
                                <TableCell>{row.paid_at?.split('T')[0]}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            row.status === 'completed' ? 'مدفوع' :
                                                row.status === 'pending' ? 'قيد المعالجة' :
                                                    'فشل الدفع'
                                        }
                                        sx={{
                                            backgroundColor:
                                                row.status === 'completed' ? '#E8F5E9' :
                                                    row.status === 'pending' ? '#FFF8E1' :
                                                        '#FFEBEE',
                                            color:
                                                row.status === 'completed' ? '#2E7D32' :
                                                    row.status === 'pending' ? '#F9A825' :
                                                        '#C62828',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StudentFeesTable;
