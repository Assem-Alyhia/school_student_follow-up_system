// src/components/TeacherRole/Classrooms/ClassroomsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherExamsList } from "../../../../../api/Teacher/Exam/getTeacherExamsList";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { deleteTeacherExam } from './../../../../../api/Teacher/Exam/ExamList/deleteTeacherExam';
import ConfirmDeleteModal from "../../../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../../../layout/SuccessAlert";
import UpdateExamModal from "../UpdateExamModal";

const onlyTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const onlyDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exams", page, rowsPerPage],
        queryFn: () => getTeacherExamsList(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteTeacherExam(id),
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-exams"] });
        },
    });

    const errorMessage = isError
        ? (error?.response?.data?.message || error?.message || null)
        : null;

    const rowsAll = useMemo(() => {
        if (isError) return [];
        const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return src.map((x) => {
            const sISO = x?.start_time ?? "";
            const eISO = x?.end_time ?? "";
            return {
                id: x?.id ?? "",
                term: x?.term ?? "",
                subject_name: x?.subject?.name ?? "",
                exam_type_name: x?.exam_type?.name ?? "",
                academic_year_name: x?.academic_year?.name ?? "",
                start_time_raw: sISO,
                end_time_raw: eISO,
                start_time: onlyTime(sISO),
                end_time: onlyTime(eISO),
                date: onlyDate(sISO),
                max_score: x?.max_score ?? "",
                weight: x?.weight ?? "",
                _raw: x,
            };
        });
    }, [data, isError]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rowsAll];
        arr.sort((a, b) => {
            const key =
                orderBy === "start_time" ? "start_time_raw" :
                    orderBy === "end_time" ? "end_time_raw" :
                        orderBy;
            const av = (a?.[key] ?? "").toString();
            const bv = (b?.[key] ?? "").toString();
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [rowsAll, order, orderBy]);

    const start = (page - 1) * rowsPerPage;
    const viewRows = sortedRows.slice(start, start + rowsPerPage);

    useEffect(() => {
        if (data?.meta && !isError) {
            onMeta?.(data.meta);
        } else {
            onMeta?.({
                total: sortedRows.length,
                last_page: Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)),
            });
        }
    }, [data?.meta, sortedRows.length, rowsPerPage, onMeta, isError]);

    const askDelete = (row) => {
        setSelectedRow(row);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedRow?.id) deleteMutation.mutate(selectedRow.id);
        setOpenDeleteModal(false);
    };

    const openEdit = (row) => {
        setSelectedExamId(row?.id);
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setSelectedExamId(null);
    };

    const afterUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ["teacher-exams"] });
        closeEdit();
    };

    const columns = [
        { key: "id", label: "المعرف", sortable: true },
        { key: "academic_year_name", label: "العام الدراسي", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "subject_name", label: "المادة", sortable: true },
        { key: "exam_type_name", label: "نوع الامتحان", sortable: true },
        { key: "date", label: "التاريخ", sortable: true },
        { key: "start_time", label: "وقت البداية", sortable: true },
        { key: "end_time", label: "وقت النهاية", sortable: true },
        { key: "max_score", label: "العلامة الكاملة", sortable: true },
        { key: "weight", label: "الوزن", sortable: true },
        { key: "actions", label: "الإجراءات", sortable: false },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table
                        aria-label="قوائم الامتحانات"
                        sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}
                    >
                        <TableHead>
                            <TableRow sx={{ background: "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)" }}>
                                {columns.map((col) => (
                                    <TableCell key={col.key} sx={{ color: "#fff", fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === col.key}
                                                direction={orderBy === col.key ? order : "asc"}
                                                onClick={() => handleRequestSort(col.key)}
                                                sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                            >

                                                {col.label}
                                                {orderBy === col.key && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === "desc" ? "مرتّب تنازلي" : "مرتّب تصاعدي"}
                                                    </Box>
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            col.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Box sx={{ py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا يوجد بيانات (${errorMessage})` : "لا يوجد بيانات"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row?.id ?? "row"}-${idx}`} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.academic_year_name}</TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.subject_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.exam_type_name}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.start_time}</TableCell>
                                        <TableCell>{row.end_time}</TableCell>
                                        <TableCell>{row.max_score}</TableCell>
                                        <TableCell>{row.weight}%</TableCell>
                                        <TableCell>
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" onClick={() => openEdit(row)}>
                                                    <EditCalendarRoundedIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => askDelete(row)}>
                                                    <DeleteRoundedIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <UpdateExamModal
                open={editOpen}
                examId={selectedExamId}
                onClose={closeEdit}
                onUpdated={afterUpdated}
                title="تعديل امتحان"
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الامتحان؟"
                message="سيتم حذف بيانات الامتحان من النظام."
                isLoading={deleteMutation.isLoading}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الامتحان بنجاح!"
                    message="تمت إزالة بيانات الامتحان من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
