import React, { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, IconButton, Typography,
    Avatar, CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers } from '../../../api/Admin/Users/getAllUsers';
import { deleteUser } from '../../../api/Admin/Users/deleteUser';
import { getUserById } from '../../../api/Admin/Users/getUserById';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import { Link } from 'react-router-dom';
import UserDetails from '../UserDetails';

const Section2 = ({ page, rowsPerPage }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('prefix');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewUserData, setViewUserData] = useState(null);
    const [_loadingUser, setLoadingUser] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users', page, rowsPerPage],
        queryFn: () => getAllUsers(page, rowsPerPage),
        keepPreviousData: true,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', page, rowsPerPage] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getStatusColor = (status) => (status === 'نشط' ? 'green' : 'red');

    const sortedRows = (data?.data || []).sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        return order === 'asc' ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
    });

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedUserId) {
            deleteMutation.mutate(selectedUserId);
        }
        setOpenDeleteModal(false);
    };

    const handleViewClick = async (id) => {
        setLoadingUser(true);
        setOpenViewModal(true);
        try {
            const res = await getUserById(id);
            setViewUserData(res.data); // ✅ تمرير البيانات الصحيحة
        } catch (err) {
            console.error("❌ فشل في جلب بيانات المستخدم", err);
        } finally {
            setLoadingUser(false);
        }
    };

    if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
    if (isError) return <Box sx={{ p: 3, textAlign: 'center', color: 'red' }}>خطأ: {error.message}</Box>;

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="قائمة المستخدمين">
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'prefix'}
                                        direction={orderBy === 'prefix' ? order : 'asc'}
                                        onClick={() => handleRequestSort('prefix')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        الرقم
                                        {orderBy === 'prefix' && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'تنازلي' : 'تصاعدي'}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الاسم والبريد</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الدور</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>تاريخ الانضمام</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الحالة</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((user) => (
                                <TableRow key={user.prefix}>
                                    <TableCell>{user.prefix}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={user.image || 'https://via.placeholder.com/40'} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Box>
                                                <Typography>{user.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.roles?.[0] || '—'}</TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString('ar-EG')}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ color: getStatusColor('نشط') }}>نشط</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/dashboard/users/updateUser/${user.id}`}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleViewClick(user.id)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ✅ مكون عرض بيانات المستخدم */}
            <UserDetails
                open={openViewModal}
                onClose={() => setOpenViewModal(false)}
                user={viewUserData}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد بأنك تريد حذف المستخدم؟"
                message="سيتم إزالة جميع البيانات المرتبطة به"
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف المستخدم بنجاح!"
                    message="تم حذف بيانات المستخدم من النظام."
                    onClose={() => setShowSuccess(false)}
                    severity="error"
                />
            )}
        </Box>
    );
};

export default Section2;
