// src/components/TeacherRole/Grades/GradesTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { getTeacherGrades } from './../../../../api/Teacher/Grades/getTeacherGrades';

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

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta, onEdit, onDelete }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-grades", page, rowsPerPage],
        queryFn: () => getTeacherGrades(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rowsAll = useMemo(() => {
        return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    }, [data]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rowsAll];
        arr.sort((a, b) => {
            const av = (a[orderBy] ?? "").toString();
            const bv = (b[orderBy] ?? "").toString();
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [rowsAll, order, orderBy]);

    const start = (page - 1) * rowsPerPage;
    const viewRows = sortedRows.slice(start, start + rowsPerPage);

    useEffect(() => {
        if (data?.meta) onMeta?.(data.meta);
        else {
            onMeta?.({
                total: sortedRows.length,
                last_page: Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)),
            });
        }
    }, [data?.meta, sortedRows.length, rowsPerPage, onMeta]);

    if (isLoading) return <Box sx={{ p: 3, textAlign: "center" }}><CircularProgress /></Box>;
    if (isError) return <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>خطأ: {error?.message}</Box>;

    // الترتيب من اليمين لليسار كما بالصورة
    const columns = [
        { key: "actions", label: "الإجراءات", sortable: false },
        { key: "note", label: "ملاحظة", sortable: true },
        { key: "final_mark", label: "العلامة النهائية", sortable: true }, // اسم الحقل من API
        { key: "subject_name", label: "المادة", sortable: true },
        { key: "grade", label: "الصف", sortable: true },
        { key: "stage", label: "المرحلة", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "student_name", label: "اسم الطالب", sortable: true },
        { key: "code", label: "المعرف", sortable: true },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table
                        aria-label="الدرجات"
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
                            {viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">لا توجد درجات حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row.id}-${idx}`} hover>
                                        {/* الإجراءات */}
                                        <TableCell>
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" onClick={() => onEdit?.(row)}>
                                                    <EditCalendarRoundedIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => onDelete?.(row)}>
                                                    <DeleteRoundedIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: noteColor(row.note) }}>
                                                {row.note}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.final_mark}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.subject_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.grade}</TableCell>
                                        <TableCell>{row.stage}</TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>{row.student_name}</TableCell>
                                        <TableCell>{row.code}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Section2;
