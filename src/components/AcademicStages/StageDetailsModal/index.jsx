// src/components/Admin/AcademicStages/StageDetailsModal.jsx
import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Typography, Box, Button, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Tooltip, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useQuery } from '@tanstack/react-query';

import { getLevelsStats } from '../../../api/Admin/AcademicStages/getLevelsStats';
import { getAllClassroomsNoPaginate } from '../../../api/Admin/Classrooms/getAllClassroomsNoPaginate';

const GRADE_RANGES = {
    elementary_school: [1, 6], 
    middle_school: [7, 9],   
    high_school: [10, 12],    
};

const getGradeLevel = (row) => {
    const g =
        row?.grade_level ??
        row?.gradeLevel ??
        row?.level?.grade_level ??
        row?.level?.order ??
        row?.level_order;
    return g != null ? Number(g) : null;
};

const nameSuggestsStage = (row, stageKey) => {
    const name =
        row?.level?.name ??
        row?.level_name ??
        row?.levelName ??
        '';
    const n = String(name);
    if (!n) return false;
    if (stageKey === 'elementary_school') return /ابتدائي/.test(n);
    if (stageKey === 'middle_school') return /إعدادي|متوسط/.test(n);
    if (stageKey === 'high_school') return /ثانوي/.test(n);
    return false;
};

const matchStage = (row, stageKey) => {
    const [start, end] = GRADE_RANGES[stageKey] || [];
    const grade = getGradeLevel(row);
    if (grade != null && start != null && end != null) {
        return grade >= start && grade <= end;
    }
    return nameSuggestsStage(row, stageKey);
};

const StageDetailsModal = ({ open, onClose, stageKey, stageTitle }) => {
    const levelsQuery = useQuery({
        queryKey: ['levels-stats'],
        queryFn: getLevelsStats,
        enabled: open,
        staleTime: 60_000,
    });

    const classroomsQuery = useQuery({
        queryKey: ['classrooms-by-stage-nopaginate', stageKey],
        queryFn: async () => {
            const allRows = await getAllClassroomsNoPaginate(); 
            return (Array.isArray(allRows) ? allRows : []).filter((r) =>
                matchStage(r, stageKey)
            );
        },
        enabled: open && !!stageKey,
        staleTime: 60_000,
    });

    const {
        data: classrooms,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = classroomsQuery;

    const totalFromStats = levelsQuery?.data?.[stageKey]?.classrooms ?? null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ pr: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <InfoOutlinedIcon sx={{ color: '#308A9F' }} />
                    <Typography variant="h6" sx={{ color: '#22385F' }}>
                        تفاصيل الصفوف — {stageTitle || 'مرحلة'}
                    </Typography>
                    {isFetching && <CircularProgress size={18} sx={{ ml: 1 }} />}
                    {totalFromStats != null && (
                        <Typography variant="body2" sx={{ color: '#586E75', ml: 2 }}>
                            (إجمالي متوقّع: {totalFromStats})
                        </Typography>
                    )}
                </Stack>

                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent dividers>
                {isLoading ? (
                    <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="error" sx={{ mb: 2 }}>
                            حدث خطأ أثناء جلب بيانات الصفوف.
                        </Typography>
                        <Button variant="outlined" onClick={() => refetch()}>
                            إعادة المحاولة
                        </Button>
                    </Box>
                ) : !classrooms || classrooms.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: '#586E75' }}>
                            لا توجد صفوف مسجلة لهذه المرحلة حتى الآن.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={0}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">الصف</TableCell>
                                    <TableCell align="center">سعة الصف</TableCell>
                                    <TableCell align="center">عدد المواد</TableCell>
                                    <TableCell align="center">المستوى</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classrooms.map((row, idx) => (
                                    <TableRow key={row.id || idx} hover>
                                        <TableCell align="center">{idx + 1}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: '#22385F' }}>
                                                {row.name ?? row.classroomName ?? row.title ?? '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.capacity ??
                                                row.capacity ??
                                                row.capacity?.length ??
                                                '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.level.subjects_count ??
                                                row.level.subjects_count ??
                                                row.level.subjects_count?.length ??
                                                '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row?.level?.name ?? row?.level_name ?? '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Tooltip title="تحديث">
                    <span>
                        <IconButton onClick={() => refetch()} disabled={isFetching}>
                            <RefreshIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Box sx={{ flex: 1 }} />
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{ background: 'linear-gradient(90deg, #308A9F,#22385F)' }}
                >
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StageDetailsModal;
