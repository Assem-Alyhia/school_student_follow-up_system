// Section2.jsx
import React, { useState } from 'react';
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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePayment } from '../../../api/Admin/Payments/deletePayment';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';

const Section2 = ({ payments = [] }) => {
    const queryClient = useQueryClient();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries(['payments']);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleDeleteClick = (payment) => {
        setPaymentToDelete(payment);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (paymentToDelete) {
            deleteMutation.mutate(paymentToDelete.id);
            setOpenDeleteModal(false);
        }
    };

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
                            أضف دفعة
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
                            <TableCell align="center">الإجراءات</TableCell>
                            <TableCell align="center">الحالة</TableCell>
                            <TableCell align="center">تاريخ الدفع</TableCell> 
                            <TableCell align="center">آخر موعد</TableCell>     
                            <TableCell align="center">المبلغ</TableCell>
                            <TableCell align="center">الصف</TableCell>
                            <TableCell align="center">الاسم</TableCell>
                            <TableCell align="center">رقم التسجيل</TableCell>
                            <TableCell align="center">معرف الهوية</TableCell>
                            <TableCell align="center">المعرف</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {payments.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">
                                    <IconButton><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton onClick={() => handleDeleteClick(row)}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={
                                            row.status === 'completed'
                                                ? 'مكتمل'
                                                : row.status === 'pending'
                                                    ? 'قيد الانتظار'
                                                    : row.status === 'failed'
                                                        ? 'فشل'
                                                        : 'غير معروف'
                                        }
                                        size="small"
                                        sx={{
                                            backgroundColor:
                                                row.status === 'completed'
                                                    ? '#DFF5E4'
                                                    : row.status === 'pending'
                                                        ? '#FFF3CD'
                                                        : row.status === 'failed'
                                                            ? '#FFEBEE'
                                                            : '#E0E0E0',
                                            color:
                                                row.status === 'completed'
                                                    ? '#2E7D32'
                                                    : row.status === 'pending'
                                                        ? '#856404'
                                                        : row.status === 'failed'
                                                            ? '#C62828'
                                                            : '#555',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    {row.paid_at ? new Date(row.paid_at).toLocaleDateString() : '—'}
                                </TableCell>

                                <TableCell align="center">
                                    {row.schoolFee?.deadline ? new Date(row.schoolFee.deadline).toLocaleDateString() : '—'}
                                </TableCell>

                                <TableCell align="center">{row.schoolFee?.amount + '$'}</TableCell>
                                <TableCell align="center">{row.student?.classroom?.name || '-'}</TableCell>
                                <TableCell align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <Avatar alt={row.student?.name} src="/images/avatar.jpg" sx={{ width: 32, height: 32, mr: 1 }} />
                                        <Box>
                                            <Typography fontWeight="bold" fontSize={14}>{row.student?.name}</Typography>
                                            <Typography fontSize={12} color="text.secondary">{row.parent?.phone}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{row.student?.prefix}</TableCell>
                                <TableCell align="center">{row.parent?.prefix}</TableCell>
                                <TableCell align="center">{row.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            </TableContainer>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الدفعة؟"
                message="سيتم حذف بيانات الدفعة من النظام."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الدفعة بنجاح!"
                    message="تمت إزالة بيانات الدفعة من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
