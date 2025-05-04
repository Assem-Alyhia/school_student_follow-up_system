import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Grid,
    TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const StudentFeesTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const feesData = [
        {
            id: '001', family: '0', receipt: '#435453', paymentDate: '2025/02/17',
            status: 'مدفوع', amount: 50, dueDate: '2025/02/17', feeType: 'رسوم التسجيل',
            discount: '10%', class: '100'
        },
        {
            id: '002', family: '0', receipt: '#435455', paymentDate: '2025/02/16',
            status: 'غير مدفوع', amount: 100, dueDate: '2025/02/16', feeType: 'رسوم المواصلات',
            discount: '25%', class: '600'
        },
        {
            id: '003', family: '0', receipt: '#435448', paymentDate: '2025/02/14',
            status: 'مدفوع', amount: 800, dueDate: '2025/02/14', feeType: 'الرسوم السنوية',
            discount: '0', class: '50'
        },
        {
            id: '004', family: '0', receipt: '#435453', paymentDate: '2025/02/13',
            status: 'غير مدفوع', amount: 50, dueDate: '2025/02/13', feeType: 'رسوم الكتب المدرسية',
            discount: '0', class: '0'
        },
        {
            id: '005', family: '0', receipt: '#435453', paymentDate: '2025/02/10',
            status: 'مدفوع', amount: 25, dueDate: '2025/02/10', feeType: 'رسوم النشاطات',
            discount: '10%', class: '100'
        },
    ];

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = feesData.filter(fee => {
        // Search filter
        const matchesSearch = fee.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.receipt.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    return (
        <Box sx={{ p: 3, direction: 'ltr' }}>
            {/* Filter Controls */}
            <Box sx={{ padding: 0, backgroundColor: '#f5f5f5', p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Left Side - Controls */}
                    <Grid item xs={8} sx={{ display: 'flex', gap: 2 }}>
                        {/* Search */}
                        <TextField
                            placeholder="بحث..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="#308A9F" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                '& .MuiInputBase-root': {
                                    height: 40,
                                    backgroundColor: 'white',
                                    '& fieldset': {
                                        borderColor: '#308A9F'
                                    }
                                }
                            }}
                        />

                        {/* Sort Dropdown */}
                        <Select
                            value={sortConfig.key || ''}
                            onChange={(e) => requestSort(e.target.value)}
                            displayEmpty
                            sx={{
                                minWidth: 120,
                                height: 40,
                                backgroundColor: 'white',
                                '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    color: '#308A9F'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#308A9F'
                                }
                            }}
                        >
                            <MenuItem value="" disabled>ترتيب حسب</MenuItem>
                            <MenuItem value="paymentDate">تاريخ الدفع</MenuItem>
                            <MenuItem value="dueDate">تاريخ التسليم</MenuItem>
                            <MenuItem value="amount">المبلغ</MenuItem>
                        </Select>

                        {/* Filter Dropdown */}
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            displayEmpty
                            sx={{
                                minWidth: 120,
                                height: 40,
                                backgroundColor: 'white',
                                '& .MuiSelect-select': {
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    color: '#308A9F'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#308A9F'
                                }
                            }}
                        >
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="مدفوع">مدفوع</MenuItem>
                            <MenuItem value="غير مدفوع">غير مدفوع</MenuItem>
                        </Select>
                    </Grid>

                    {/* Right Side - Title */}
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            color: '#308A9F',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            الرسوم
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #E0E0E0' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'id'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('id')}
                                    IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                >
                                    المنشئ
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'discount'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('discount')}
                                    IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                >
                                    الحسم
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>العائلة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>رقم الوصل</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'paymentDate'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('paymentDate')}
                                    IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                >
                                    تاريخ الدفع
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>المادة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'amount'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('amount')}
                                    IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                >
                                    التعبئة
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'dueDate'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('dueDate')}
                                    IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                >
                                    تاريخ التسليم
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>نوع الرسوم</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>اسم الرسوم</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#22385F' }}>الصفوف</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((fee) => (
                            <TableRow key={fee.id} hover>
                                <TableCell>{fee.id}</TableCell>
                                <TableCell>{fee.discount}</TableCell>
                                <TableCell>{fee.family}</TableCell>
                                <TableCell>{fee.receipt}</TableCell>
                                <TableCell>{fee.paymentDate}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={fee.status}
                                        sx={{
                                            backgroundColor: fee.status === 'مدفوع' ? '#E8F5E9' : '#FFEBEE',
                                            color: fee.status === 'مدفوع' ? '#2E7D32' : '#C62828',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{fee.amount}</TableCell>
                                <TableCell>{fee.dueDate}</TableCell>
                                <TableCell>{fee.feeType}</TableCell>
                                <TableCell>{fee.feeType}</TableCell>
                                <TableCell>{fee.class}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StudentFeesTable;