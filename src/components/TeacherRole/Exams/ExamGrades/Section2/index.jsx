// src/components/TeacherRole/ExamResults/ResultsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { getTeacherExamResults } from "../../../../../api/Teacher/Exam/getTeacherExamResults";

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta, onEdit, onDelete }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-results", page, rowsPerPage],
        queryFn: () => getTeacherExamResults(page, rowsPerPage),
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

    const columns = [
        { key: "code", label: "المعرف", sortable: true },
        { key: "student_name", label: "باسم الطالب", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "grade", label: "الصف", sortable: true },
        { key: "stage", label: "المرحلة", sortable: true },
        { key: "exam_name", label: "اسم الامتحان", sortable: true },
        { key: "subject_name", label: "المادة", sortable: true },
        { key: "exam_type_name", label: "نوع الامتحان", sortable: true },
        { key: "date", label: "التاريخ", sortable: true },
        { key: "start_time", label: "وقت البداية", sortable: true },
        { key: "end_time", label: "وقت النهاية", sortable: true },
        { key: "score", label: "الدرجة", sortable: true },
        { key: "max_score", label: "العلامة الكاملة", sortable: true },
        { key: "weight", label: "الوزن", sortable: true },
        { key: "actions", label: "الإجراءات", sortable: false },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table
                        aria-label="نتائج الامتحانات"
                        sx={{ minWidth: 1200, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}
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
                            {viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">لا توجد نتائج حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row.id}-${idx}`} hover>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell><Typography sx={{ fontWeight: 600, color: "#22385F" }}>{row.student_name}</Typography></TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>{row.grade}</TableCell>
                                        <TableCell>{row.stage}</TableCell>
                                        <TableCell>{row.exam_name}</TableCell>
                                        <TableCell>{row.subject_name}</TableCell>
                                        <TableCell>{row.exam_type_name}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.start_time}</TableCell>
                                        <TableCell>{row.end_time}</TableCell>
                                        <TableCell>{row.score}</TableCell>
                                        <TableCell>{row.max_score}</TableCell>
                                        <TableCell>{row.weight}%</TableCell>
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
