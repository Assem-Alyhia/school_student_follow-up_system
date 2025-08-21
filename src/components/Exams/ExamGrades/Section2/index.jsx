// src/components/TeacherRole/ExamResults/ResultsTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ConfirmDeleteModal from "../../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../../layout/SuccessAlert";
import UpdateExamResultModal from "../UpdateExamResultModal"; 
import { deleteExamResult } from "../../../../api/Admin/ExamResults/deleteExamResult";

const onlyTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function Section2({ rows = [], loading = false, errorMessage = null }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("student_name");

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteExamResult(id),
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-exam-results"] });
        },
    });

    const preparedRows = useMemo(() => {
        const mapped = rows.map((item) => {
            const startISO = item?.exam?.start_time ?? "";
            const endISO = item?.exam?.end_time ?? "";
            return {
                id: item?.id ?? "",
                score: item?.score ?? "",
                term: item?.exam?.term ?? "",
                start_time_raw: startISO,
                end_time_raw: endISO,
                start_time: onlyTime(startISO),
                end_time: onlyTime(endISO),
                max_score: item?.exam?.max_score ?? "",
                weight: item?.exam?.weight ?? "",
                student_prefix: item?.student?.prefix ?? "",
                student_id: item?.student?.id ?? "",
                student_name: item?.student?.name ?? "",
                _raw: item,
                exam_id: item?.exam_id ?? item?.exam?.id ?? "",
                exam: item?.exam ?? null,
                classroom: item?.classroom ?? item?.exam?.classroom ?? null,
                student: item?.student ?? null,
            };
        });

        return mapped.sort((a, b) => {
            const key =
                orderBy === "start_time" ? "start_time_raw" :
                    orderBy === "end_time" ? "end_time_raw" :
                        orderBy;
            const av = (a?.[key] ?? "").toString();
            const bv = (b?.[key] ?? "").toString();
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
    }, [rows, order, orderBy]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const askDelete = (row) => {
        setSelectedRow(row);
        setOpenDeleteModal(true);
    };
    const confirmDelete = () => {
        if (selectedRow?.id) deleteMutation.mutate(selectedRow.id);
        setOpenDeleteModal(false);
    };

    const openEdit = (row) => { setSelectedRow(row); setEditOpen(true); };
    const closeEdit = () => { setEditOpen(false); setSelectedRow(null); };
    const afterUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ["teacher-exam-results"] });
        closeEdit();
    };

    const columns = [
        { key: "student_prefix", label: "رقم الطالب", sortable: true },
        { key: "student_name", label: "اسم الطالب", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "start_time", label: "وقت البداية", sortable: true },
        { key: "end_time", label: "وقت النهاية", sortable: true },
        { key: "max_score", label: "العلامة الكاملة", sortable: true },
        { key: "weight", label: "الوزن", sortable: true },
        { key: "score", label: "الدرجة", sortable: true },
        { key: "actions", label: "الإجراءات", sortable: false },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table aria-label="نتائج الامتحانات" sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                                                        {order === "desc" ? "مرتب تنازلي" : "مرتب تصاعدي"}
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Box sx={{ py: 4 }}><CircularProgress /></Box>
                                    </TableCell>
                                </TableRow>
                            ) : preparedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا يوجد بيانات (${errorMessage})` : "لا يوجد بيانات"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                preparedRows.map((row, idx) => (
                                    <TableRow key={`${row.id}-${idx}`} hover>
                                        <TableCell>{row.student_prefix}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F", textAlign: "center" }}>
                                                {row.student_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>{row.start_time}</TableCell>
                                        <TableCell>{row.end_time}</TableCell>
                                        <TableCell>{row.max_score}</TableCell>
                                        <TableCell>{row.weight}%</TableCell>
                                        <TableCell>{row.score}</TableCell>
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

            <UpdateExamResultModal
                open={editOpen}
                onClose={closeEdit}
                onUpdated={afterUpdated}
                examResult={selectedRow}
                title="تعديل درجة امتحان"
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الدرجة؟"
                message="سيتم حذف بيانات الدرجة من النظام."
                isLoading={deleteMutation.isLoading}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف الدرجة بنجاح!"
                    message="تمت إزالة بيانات الدرجة من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
}

export default Section2;
