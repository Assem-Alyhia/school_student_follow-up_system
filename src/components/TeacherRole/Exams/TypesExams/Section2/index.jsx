// src/components/TeacherRole/ExamTypes/TypesTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, Typography, CircularProgress
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getTeacherExamTypes } from "../../../../../api/Teacher/Exam/getTeacherExamTypes";

const pickRowValues = (raw) => {
    const id = raw?.id;
    const code = raw?.code ?? (id != null ? `TYP-${id}` : "—");
    const name = raw?.name ?? "—";
    const description = raw?.description ?? "—";
    return { code, name, description };
};

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-types"],
        queryFn: getTeacherExamTypes,
        staleTime: 60_000,
    });

    const allRows = useMemo(() => {
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        return list.map(pickRowValues);
    }, [data]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...allRows];
        arr.sort((a, b) => {
            const av = a[orderBy] ?? "";
            const bv = b[orderBy] ?? "";
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [allRows, order, orderBy]);

    const start = (page - 1) * rowsPerPage;
    const view = sortedRows.slice(start, start + rowsPerPage);

    useEffect(() => {
        onMeta?.({
            total: sortedRows.length,
            last_page: Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)),
        });
    }, [sortedRows.length, rowsPerPage, onMeta]);

    if (isLoading) return <Box sx={{ p: 3, textAlign: "center" }}><CircularProgress /></Box>;
    if (isError) return <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>خطأ: {error.message}</Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="أنواع الاختبارات">
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
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        الاسم
                                        {orderBy === "name" && <Box component="span" sx={visuallyHidden}>{order === "desc" ? "تنازلي" : "تصاعدي"}</Box>}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    الوصف
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {view.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <Typography color="text.secondary">لا توجد أنواع مسجّلة حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                view.map((row, idx) => (
                                    <TableRow key={`${row.code}-${idx}`} hover>
                                        <TableCell align="center">{row.code}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>{row.name}</Typography>
                                        </TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
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
