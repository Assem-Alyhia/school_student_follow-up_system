// src/features/Grades/Section2.jsx
import React, { useMemo, useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, IconButton, Typography,
    Avatar, CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGrade } from '../../../api/Admin/Grades/deleteGrade';
import { getGradeById } from '../../../api/Admin/Grades/getGradeById';

import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import EditGradeModal from '../UpdateGradeModal';
import GradeDetailsModal from '../GradeDetailsModal';

const Section2 = ({ rows = [], page = 1, rowsPerPage = 10 }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewGradeData, setViewGradeData] = useState(null);
    const [loadingViewId, setLoadingViewId] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editGrade, setEditGrade] = useState(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grades', page, rowsPerPage] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getScoreColor = (score) => (Number(score) >= 60 ? 'green' : 'red');

    const sortedRows = useMemo(() => {
        const arr = Array.isArray(rows) ? [...rows] : [];
        return arr.sort((a, b) => {
            const av = a?.[orderBy] ?? '';
            const bv = b?.[orderBy] ?? '';
            if (av === bv) return 0;
            if (order === 'asc') return av > bv ? 1 : -1;
            return av < bv ? 1 : -1;
        });
    }, [rows, order, orderBy]);

    const handleDeleteClick = (id) => {
        setSelectedGradeId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedGradeId) deleteMutation.mutate(selectedGradeId);
        setOpenDeleteModal(false);
    };

    const handleViewClick = async (id) => {
        setLoadingViewId(id);
        setOpenViewModal(true);
        try {
            const res = await getGradeById(id);
            setViewGradeData(res?.data ?? res ?? null);
        } catch (err) {
            console.log(err);
            setViewGradeData(null);
        } finally {
            setLoadingViewId(null);
        }
    };

    const handleEditClick = (row) => {
        setEditGrade({
            id: row.id,
            student_id: row.student_id ?? row.student?.id,
            academic_year_id: row.academic_year_id ?? row.academic_year?.id,
            classroom_id: row.classroom_id ?? row.classroom?.id,
            subject_id: row.subject_id ?? row.subject?.id,
            term: row.term,
            final_score: row.final_score,
            note: row.note ?? '',
        });
        setOpenEditModal(true);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper} sx={{ direction: 'rtl' }}>
                    <Table
                        sx={{
                            minWidth: 650,
                            // توسيط كل الخلايا: رؤوس + جسم
                            '& th, & td': {
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            },
                        }}
                        aria-label="قائمة الدرجات"
                    >
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'id'}
                                        direction={orderBy === 'id' ? order : 'asc'}
                                        onClick={() => handleRequestSort('id')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        المعرف
                                        {orderBy === 'id' && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'تنازلي' : 'تصاعدي'}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الطالب</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الصف</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>المادة</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'final_score'}
                                        direction={orderBy === 'final_score' ? order : 'asc'}
                                        onClick={() => handleRequestSort('final_score')}
                                        sx={{ fontWeight: 'bold', color: '#fff' }}
                                    >
                                        العلامة
                                        {orderBy === 'final_score' && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'تنازلي' : 'تصاعدي'}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الفصل</TableCell>
                                {/* يبقى عمود الإجراءات آخر يسار، لكن المحتوى نفسه مُوسّط داخل الخليّة */}
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <Avatar src={row.student?.avatar} sx={{ width: 32, height: 32 }} />
                                            <Typography>{row.student?.name ?? `#${row.student_id}`}</Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>{row.classroom?.name || `#${row.classroom_id}`}</TableCell>
                                    <TableCell>{row.subject?.name || `#${row.subject_id}`}</TableCell>

                                    <TableCell sx={{ color: getScoreColor(parseInt(row.final_score, 10)) }}>
                                        {row.final_score}
                                    </TableCell>

                                    <TableCell>{row.term}</TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <IconButton onClick={() => handleViewClick(row.id)}>
                                                {loadingViewId === row.id ? <CircularProgress size={18} /> : <VisibilityIcon />}
                                            </IconButton>
                                            <IconButton onClick={() => handleEditClick(row)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(row.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <GradeDetailsModal
                open={openViewModal}
                onClose={() => setOpenViewModal(false)}
                grade={viewGradeData}
            />

            <EditGradeModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditGrade(null);
                    queryClient.invalidateQueries({ queryKey: ['grades', page, rowsPerPage] });
                }}
                grade={editGrade}
                title="تعديل نتيجة"
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد بأنك تريد حذف النتيجة؟"
                message="سيتم إزالة الدرجة من السجل نهائيًا."
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف النتيجة بنجاح!"
                    message="تم حذف بيانات النتيجة من النظام."
                    onClose={() => setShowSuccess(false)}
                    severity="error"
                />
            )}
        </Box>
    );
};

export default Section2;
