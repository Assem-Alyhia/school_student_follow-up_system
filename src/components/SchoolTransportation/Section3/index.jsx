import React, { useCallback, useMemo, useState } from 'react';
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

const HEAD_CELLS = [
    { key: 'id', label: 'المعرف', sortable: true },
    { key: 'driver_name', label: 'اسم السائق', sortable: true },
    { key: 'driver_number', label: 'رقم السائق', sortable: true },
    { key: 'capacity', label: 'السعة', sortable: true },
    { key: 'bus_type', label: 'نوع الباص', sortable: true },
    { key: 'status', label: 'الحالة', sortable: true },
    { key: 'supervisor', label: 'المشرف', sortable: true }, 
    { key: 'created_at', label: 'تاريخ الإضافة', sortable: true },
    { key: 'actions', label: 'الإجراءات', sortable: false },
];

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

    const handleRequestSort = useCallback((property) => {
        const column = HEAD_CELLS.find(c => c.key === property);
        if (!column?.sortable) return;

        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }, [order, orderBy]);

    const getStatusColor = useCallback((status) => (
        status === 'active' ? 'green' : 'red'
    ), []);

    const handleOpenMap = useCallback((row) => {
        setSelectedRow(row);
        setOpenMapDialog(true);
    }, []);

    const handleDeleteClick = useCallback((bus) => {
        setBusToDelete(bus);
        setOpenDeleteModal(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!busToDelete?.id) return;
        deleteMutation.mutate(busToDelete.id);
        setOpenDeleteModal(false);
    }, [busToDelete, deleteMutation]);

    const dateFormatter = useMemo(() => new Intl.DateTimeFormat('ar-EG'), []);

    const comparator = useCallback((a, b) => {
        let av, bv;

        switch (orderBy) {
            case 'supervisor':
                av = a?.supervisor?.name || '';
                bv = b?.supervisor?.name || '';
                break;
            case 'created_at':
                av = a?.created_at ? Date.parse(a.created_at) : 0;
                bv = b?.created_at ? Date.parse(b.created_at) : 0;
                break;
            default:
                av = a?.[orderBy];
                bv = b?.[orderBy];
        }

        const typeA = typeof av;
        const typeB = typeof bv;

        if (typeA === 'string') av = av.toLowerCase();
        if (typeB === 'string') bv = bv.toLowerCase();

        if (av == null && bv == null) return 0;
        if (av == null) return order === 'asc' ? -1 : 1;
        if (bv == null) return order === 'asc' ? 1 : -1;

        if (av < bv) return order === 'asc' ? -1 : 1;
        if (av > bv) return order === 'asc' ? 1 : -1;
        return 0;
    }, [order, orderBy]);

    const sortedRows = useMemo(() => {
        const clone = Array.isArray(buses) ? [...buses] : [];
        clone.sort(comparator);
        return clone;
    }, [buses, comparator]);

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                {HEAD_CELLS.map((cell) => (
                                    <TableCell key={cell.key} sx={{ fontSize: '0.75rem', color: '#fff' }}>
                                        {cell.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === cell.key}
                                                direction={orderBy === cell.key ? order : 'asc'}
                                                onClick={() => handleRequestSort(cell.key)}
                                                sx={{ fontWeight: 'bold', color: '#fff', fontSize: '0.75rem' }}
                                            >
                                                {cell.label}
                                                {orderBy === cell.key && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            <span style={{ fontWeight: 'bold' }}>{cell.label}</span>
                                        )}
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
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        {row.created_at ? dateFormatter.format(new Date(row.created_at)) : '-'}
                                    </TableCell>
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
                    supervisorId={selectedRow?.supervisor?.id}
                    data={selectedRow}
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
