// src/components/TeacherRole/Classrooms/ClassroomsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getTeacherExamsList } from "../../../../../api/Teacher/Exam/getTeacherExamsList";

const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const termToArabic = (t) => {
    if (!t) return "—";
    const s = String(t);
    if (/1/.test(s)) return "الأول";
    if (/2/.test(s)) return "الثاني";
    return s;
};

const pickRowValues = (raw) => {
    const id = raw?.id;
    const code = raw?.prefix ?? raw?.code ?? (id != null ? `EX-${id}` : "—");

    const subjectName = raw?.subject?.name ?? "—";
    const term = termToArabic(raw?.term ?? raw?.subject?.term);

    const yearName = raw?.academic_year?.name ?? "—";

    const startText = formatDateTime(raw?.start_time);
    const endText = formatDateTime(raw?.end_time);

    const maxScore = raw?.max_score ?? "—";
    const weight = raw?.weight ?? "—";

    return { code, subjectName, term, yearName, startText, endText, maxScore, weight };
};

const Section2   = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exams", page, rowsPerPage],
        queryFn: () => getTeacherExamsList(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rowsAll = useMemo(() => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return list.map(pickRowValues);
    }, [data]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rowsAll];
        arr.sort((a, b) => {
            const av = a[orderBy] ?? "";
            const bv = b[orderBy] ?? "";
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
    if (isError) return <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>خطأ: {error.message}</Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="قائمة الامتحانات">
                        <TableHead sx={{ backgroundColor: "#308A9F" }}>
                            <TableRow>
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "code"}
                                        direction={orderBy === "code" ? order : "asc"}
                                        onClick={() => handleRequestSort("code")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المعرّف
                                        {orderBy === "code" && <Box component="span" sx={visuallyHidden}>{order === "desc" ? "تنازلي" : "تصاعدي"}</Box>}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "subjectName"}
                                        direction={orderBy === "subjectName" ? order : "asc"}
                                        onClick={() => handleRequestSort("subjectName")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المادة
                                        {orderBy === "subjectName" && <Box component="span" sx={visuallyHidden}>{order === "desc" ? "تنازلي" : "تصاعدي"}</Box>}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    الفصل
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    السنة
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    البداية
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    النهاية
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    الدرجة العظمى
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    الوزن
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography color="text.secondary">لا توجد امتحانات حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row.code}-${idx}`} hover>
                                        <TableCell align="center">{row.code}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.subjectName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{row.term}</TableCell>
                                        <TableCell align="center">{row.yearName}</TableCell>
                                        <TableCell align="center">{row.startText}</TableCell>
                                        <TableCell align="center">{row.endText}</TableCell>
                                        <TableCell align="center">{row.maxScore}</TableCell>
                                        <TableCell align="center">{row.weight}</TableCell>
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
