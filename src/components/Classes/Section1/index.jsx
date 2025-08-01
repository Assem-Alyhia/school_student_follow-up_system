import React, { useState } from 'react';
import {
    Box, Typography, Avatar, Grid, TextField, MenuItem, Button,
    Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClassrooms } from '../../../api/Admin/Classrooms/getAllClassrooms';
import { deleteClassroom } from '../../../api/Admin/Classrooms/deleteClassroom';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';

const Section1 = ({ page, rowsPerPage }) => {
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['classrooms', page, rowsPerPage],
        queryFn: () => getAllClassrooms(page, rowsPerPage),
        keepPreviousData: true,
    });

    const { mutate: handleDelete } = useMutation({
        mutationFn: deleteClassroom,
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            queryClient.invalidateQueries(['classrooms']);
        },
        onError: (err) => {
            alert(err.message);
        },
    });

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            handleDelete(selectedId);
            setOpenDeleteModal(false);
        }
    };

    const classrooms = data?.data || [];

    const filteredClassrooms = classrooms
        .filter((cls) => {
            const nameMatch = cls.name?.includes(search);
            const levelMatch = levelFilter
                ? cls.level?.name?.includes(levelFilter)
                : true;
            return (nameMatch || levelMatch);
        })
        .sort((a, b) => {
            if (sortOption === 'students_desc') return b.students_count - a.students_count;
            if (sortOption === 'students_asc') return a.students_count - b.students_count;
            return 0;
        });

    const totalStudents = classrooms.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
    const totalSubjects = classrooms.reduce((acc, cls) => acc + (cls.level?.subjects_count || 0), 0);

    if (isLoading) return <Typography>جاري تحميل الصفوف...</Typography>;
    if (isError) return <Typography color="error">حدث خطأ: {error.message}</Typography>;

    return (
        <Box sx={{ padding: 4 }}>
            {/* الصورة والإحصائيات */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    src="/images/classroom-icon.png"
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                    {data?.meta?.total || 0}
                </Typography>
                <Typography sx={{ color: '#888' }}>عدد الصفوف الكلي</Typography>
                <Typography sx={{ color: '#666' }}>إجمالي الطلاب: {totalStudents}</Typography>
                <Typography sx={{ color: '#666' }}>إجمالي المواد: {totalSubjects}</Typography>
            </Box>

            {/* الفلاتر */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="ابحث هنا"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="اختر المرحلة"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <MenuItem value="">الكل</MenuItem>
                        <MenuItem value="الابتدائية">الابتدائية</MenuItem>
                        <MenuItem value="المتوسطة">المتوسطة</MenuItem>
                        <MenuItem value="الثانوية">الثانوية</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="ترتيب"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <MenuItem value="">الافتراضي</MenuItem>
                        <MenuItem value="students_desc">الأكثر طلاباً</MenuItem>
                        <MenuItem value="students_asc">الأقل طلاباً</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button fullWidth variant="contained" sx={{ height: '100%' }}>
                        قائمة
                    </Button>
                </Grid>
            </Grid>

            {/* الجدول */}
            <Table sx={{ border: '1px solid #eee' }}>
                <TableHead sx={{ backgroundColor: '#F0F8FB' }}>
                    <TableRow>
                        <TableCell align="center"><strong>الإجراءات</strong></TableCell>
                        <TableCell align="center"><strong>الحالة</strong></TableCell>
                        <TableCell align="center"><strong>عدد المواد</strong></TableCell>
                        <TableCell align="center"><strong>عدد الطلاب</strong></TableCell>
                        <TableCell align="center"><strong>المرحلة</strong></TableCell>
                        <TableCell align="center"><strong>الصف</strong></TableCell>
                        <TableCell align="center"><strong>المعرف</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredClassrooms.map((cls, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">
                                <IconButton><EditIcon color="primary" /></IconButton>
                                <IconButton onClick={() => handleDeleteClick(cls.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={cls.status === 'active' ? 'نشط' : 'معطل'}
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: cls.status === 'active' ? '#E6F4EA' : '#FDECEA',
                                        color: cls.status === 'active' ? '#2E7D32' : '#D32F2F',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">{cls.level?.subjects_count}</TableCell>
                            <TableCell align="center">{cls.students_count}</TableCell>
                            <TableCell align="center">{cls.level?.name}</TableCell>
                            <TableCell align="center">{cls.name}</TableCell>
                            <TableCell align="center">{`C${cls.id.toString().padStart(5, '0')}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* موديولات التأكيد والنجاح */}
            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد بأنك تريد حذف الصف؟"
                message="سيتم إزالة جميع البيانات المرتبطة به"
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الصف بنجاح!"
                    message="تم حذف بيانات الصف من النظام."
                    onClose={() => setShowSuccess(false)}
                    severity="error"
                />
            )}
        </Box>
    );
};

export default Section1;
