import React, { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, IconButton
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MapIcon from '@mui/icons-material/Map';
import MapDialog from '../../MapDialog';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBus } from '../../../api/Admin/Buses/deleteBus';

const Section3 = ({ buses = [] }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [openMapDialog, setOpenMapDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [busToDelete, setBusToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteBus,
        onSuccess: () => {
            queryClient.invalidateQueries(['buses']);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'green' : 'red';
    };

    const handleOpenMap = (row) => {
        setSelectedRow(row);
        setOpenMapDialog(true);
    };

    const handleDeleteClick = (bus) => {
        setBusToDelete(bus);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(busToDelete.id);
        setOpenDeleteModal(false);
    };

    const sortedRows = [...buses].sort((a, b) => {
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
                    <Table>
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                {['id', 'driver_name', 'driver_number', 'capacity', 'bus_type', 'status', 'supervisor', 'created_at', 'actions'].map((headCell) => (
                                    <TableCell key={headCell} sx={{ fontSize: '0.75rem', color: '#fff' }}>
                                        <TableSortLabel
                                            active={orderBy === headCell}
                                            direction={orderBy === headCell ? order : 'asc'}
                                            onClick={() => handleRequestSort(headCell)}
                                            sx={{ fontWeight: 'bold', color: '#fff', fontSize: '0.75rem' }}
                                        >
                                            {{
                                                id: 'المعرف',
                                                driver_name: 'اسم السائق',
                                                driver_number: 'رقم السائق',
                                                capacity: 'السعة',
                                                bus_type: 'نوع الباص',
                                                status: 'الحالة',
                                                supervisor: 'المشرف',
                                                created_at: 'تاريخ الإضافة',
                                                actions: 'الإجراءات',
                                            }[headCell]}
                                            {orderBy === headCell && (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            )}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.driver_name}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.driver_number}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.capacity}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.bus_type}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', color: getStatusColor(row.status) }}>
                                        {row.status === 'active' ? 'نشط' : 'غير نشط'}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.supervisor?.name || '-'}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteClick(row)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => handleOpenMap(row)}>
                                            <MapIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {selectedRow && (
                <MapDialog
                    open={openMapDialog}
                    handleClose={() => setOpenMapDialog(false)}
                    supervisorId={selectedRow?.supervisor?.id} // ✅ تمرير ID المشرف
                    data={selectedRow} // إن أردت تمرير معلومات إضافية
                />
            )}

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الباص؟"
                message="سيتم حذف بيانات الباص من النظام."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الباص بنجاح!"
                    message="تمت إزالة بيانات الباص من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section3;
