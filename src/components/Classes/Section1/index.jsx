import React, { useMemo, useState } from 'react';
import {
    Box, Typography, Avatar, Grid, TextField, MenuItem, Button,
    Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClassrooms } from '../../../api/Admin/Classrooms/getAllClassrooms';
import { deleteClassroom } from '../../../api/Admin/Classrooms/deleteClassroom';
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal';
import SuccessAlert from '../../../layout/SuccessAlert';
import AddClassroomModal from '../AddClassroomModal';
import EditClassroomModal from '../EditClassroomModal';

const Section1 = ({ page, rowsPerPage }) => {
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [sortOption, setSortOption] = useState(''); 
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    const levelOptions = useMemo(() => {
        const set = new Set(classrooms.map(c => c?.level?.name).filter(Boolean));
        return Array.from(set);
    }, [classrooms]);

    const filteredClassrooms = useMemo(() => {
        const s = String(search).toLowerCase().trim();
        const lf = String(levelFilter).toLowerCase().trim();

        const filtered = classrooms.filter((cls) => {
            const name = String(cls?.name ?? '').toLowerCase();
            const levelName = String(cls?.level?.name ?? '').toLowerCase();

            const nameMatch = s ? name.includes(s) : true;
            const levelMatch = lf ? levelName === lf : true;

            return nameMatch && levelMatch;
        });

        filtered.sort((a, b) => {
            if (sortOption === 'capacity_desc') return (b.capacity || 0) - (a.capacity || 0);
            if (sortOption === 'capacity_asc') return (a.capacity || 0) - (b.capacity || 0);
            return 0;
        });

        return filtered;
    }, [classrooms, search, levelFilter, sortOption]);

    if (isLoading) return <Typography>جاري تحميل الصفوف...</Typography>;
    if (isError) return <Typography color="error">حدث خطأ: {error.message}</Typography>;

    const resetFilters = () => {
        setSearch('');
        setLevelFilter('');
        setSortOption('');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                        إدارة الصفوف
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => setOpenAddModal(true)}
                        sx={{ backgroundColor: '#2a8a89', '&:hover': { backgroundColor: '#227472' } }}
                    >
                        إضافة صف
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    src="/images/classroom-icon.png"
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                    {data?.meta?.total || 0}
                </Typography>
                <Typography sx={{ color: '#888' }}>عدد الصفوف الكلي</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="ابحث هنا (اسم الصف)"
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
                        {levelOptions.map((lvl) => (
                            <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                        ))}
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
                        <MenuItem value="capacity_desc">الأكثر سعة</MenuItem>
                        <MenuItem value="capacity_asc">الأقل سعة</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={resetFilters}
                        sx={{ height: '100%' }}
                    >
                        تفريغ الفلاتر
                    </Button>
                </Grid>
            </Grid>

            <Table sx={{ border: '1px solid #eee' }}>
                <TableHead sx={{ backgroundColor: '#F0F8FB' }}>
                    <TableRow>
                        <TableCell align="center"><strong>الإجراءات</strong></TableCell>
                        <TableCell align="center"><strong>الحالة</strong></TableCell>
                        <TableCell align="center"><strong>السعة</strong></TableCell>
                        <TableCell align="center"><strong>المرحلة</strong></TableCell>
                        <TableCell align="center"><strong>الصف</strong></TableCell>
                        <TableCell align="center"><strong>المعرف</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredClassrooms.map((cls) => (
                        <TableRow key={cls.id}>
                            <TableCell align="center">
                                <IconButton
                                    onClick={() => {
                                        setEditingId(cls.id);
                                        setOpenEditModal(true);
                                    }}
                                >
                                    <EditIcon sx={{ color:"#2a8a89" }} />
                                </IconButton>
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
                            <TableCell align="center">{cls.capacity}</TableCell>
                            <TableCell align="center">{cls.level?.name}</TableCell>
                            <TableCell align="center">{cls.name}</TableCell>
                            <TableCell align="center">{`C${String(cls.id).padStart(5, '0')}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddClassroomModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                onCreated={() => {
                    queryClient.invalidateQueries(['classrooms']);
                    setOpenAddModal(false);
                }}
            />

            <EditClassroomModal
                open={openEditModal}
                classroomId={editingId}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditingId(null);
                }}
                onUpdated={() => {
                    queryClient.invalidateQueries(['classrooms']);
                    setOpenEditModal(false);
                    setEditingId(null);
                }}
            />

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
