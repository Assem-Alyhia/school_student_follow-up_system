import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeacherGrade } from "./../../../../api/Teacher/Grades/deleteTeacherGrade";
import ConfirmDeleteModal from "../../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../../layout/SuccessAlert";
import UpdateGradeModal from "../UpdateGradeModal";

const noteColor = (note) => {
    if (!note) return "text.secondary";
    const n = String(note).trim();
    if (n.includes("ممتاز")) return "success.main";
    if (n.includes("جيد جدا")) return "secondary.main";
    if (n.includes("جيد")) return "info.main";
    if (n.includes("متوسط")) return "warning.main";
    if (n.includes("ضعيف")) return "error.main";
    return "text.primary";
};

const Section2 = ({ rows = [], loading = false, errorMessage = null }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteTeacherGrade(id),
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-grades"] });
        },
    });

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const flatRows = useMemo(() => {
        return rows.map((r) => ({
            id: r?.id ?? "",
            student_name: r?.student?.name ?? r?.student_name ?? "",
            classroom_name: r?.classroom?.name ?? r?.classroom_name ?? "",
            subject_name: r?.subject?.name ?? r?.subject_name ?? "",
            term: r?.term ?? r?.subject?.term ?? "",
            final_score: r?.final_score ?? r?.final_mark ?? "",
            note: r?.note ?? "",
            _raw: r,
        }));
    }, [rows]);

    const sortedRows = useMemo(() => {
        const arr = [...flatRows];
        arr.sort((a, b) => {
            const av = a?.[orderBy];
            const bv = b?.[orderBy];
            if (!Number.isNaN(Number(av)) && !Number.isNaN(Number(bv))) {
                const na = Number(av), nb = Number(bv);
                return order === "asc" ? na - nb : nb - na;
            }
            const as = (av ?? "").toString();
            const bs = (bv ?? "").toString();
            if (order === "asc") return as > bs ? 1 : as < bs ? -1 : 0;
            return as < bs ? 1 : as > bs ? -1 : 0;
        });
        return arr;
    }, [flatRows, order, orderBy]);

    const columns = [
        { key: "id", label: "المعرف", sortable: true },
        { key: "student_name", label: "اسم الطالب", sortable: true },
        { key: "classroom_name", label: "اسم الشعبة", sortable: true },
        { key: "subject_name", label: "اسم المادة", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "final_score", label: "الدرجة النهائية", sortable: true },
        { key: "note", label: "ملاحظة", sortable: true },
        { key: "actions", label: "الإجراءات", sortable: false },
    ];

    const askDelete = (row) => {
        setSelectedRow(row);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedRow?.id) deleteMutation.mutate(selectedRow.id);
        setOpenDeleteModal(false);
    };

    const openEdit = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setSelectedRow(null);
    };

    const afterUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ["teacher-grades"] });
        closeEdit();
    };

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table aria-label="الدرجات" sx={{ minWidth: 900, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Box sx={{ py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا توجد درجات (${errorMessage})` : "لا توجد درجات حالياً."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRows.map((row, idx) => (
                                    <TableRow key={`${row.id ?? idx}`} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.student_name}</TableCell>
                                        <TableCell>{row.classroom_name}</TableCell>
                                        <TableCell>{row.subject_name}</TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>{row.final_score}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: noteColor(row.note) }}>
                                                {row.note}
                                            </Typography>
                                        </TableCell>
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

            <UpdateGradeModal
                open={editOpen}
                onClose={closeEdit}
                grade={{ ...selectedRow?._raw, ...selectedRow }}
                onUpdated={afterUpdated}
                title="تعديل درجة"
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
};

export default Section2;
