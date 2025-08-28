// src/components/TeacherRole/Classrooms/ClassroomsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getTeacherClassrooms } from "../../../../api/Teacher/Classrooms/getTeacherClassrooms";

const extractGradeFromLevelName = (lvlName) => {
    if (!lvlName) return "—";
    const m = String(lvlName).match(/الصف\s+(.+)$/);
    return m ? m[1] : lvlName;
};

const pickRowValues = (raw) => {
    const id = raw?.id;
    const code = raw?.prefix ?? raw?.code ?? (id != null ? `CL-${id}` : "—");
    const levelName = raw?.level?.name ?? "—";
    const gradeText = extractGradeFromLevelName(levelName);
    const studentsCount =
        raw?.students_count ??
        raw?.studentsCount ??
        (Array.isArray(raw?.students) ? raw.students.length : "—");
    const capacity = raw?.capacity ?? raw?.max_capacity ?? "—";
    return { id, code, gradeText, studentsCount, capacity };
};

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-classrooms", page, rowsPerPage],
        queryFn: () => getTeacherClassrooms(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rowsAll = useMemo(() => {
        const arr = Array.isArray(data?.data) ? data.data : [];
        return arr.map(pickRowValues);
    }, [data]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rowsAll];
        arr.sort((a, b) => {
            const av = a?.[orderBy] ?? "";
            const bv = b?.[orderBy] ?? "";
            // فرز رقمي عندما يكون كلاهما أرقام
            if (typeof av === "number" && typeof bv === "number") {
                return order === "asc" ? av - bv : bv - av;
            }
            const as = av.toString();
            const bs = bv.toString();
            if (order === "asc") return as > bs ? 1 : as < bs ? -1 : 0;
            return as < bs ? 1 : as > bs ? -1 : 0;
        });
        return arr;
    }, [rowsAll, order, orderBy]);

    // تمرير الميتا للأب مع بديل احتياطي
    useEffect(() => {
        const m = data?.meta;
        if (m && typeof onMeta === "function") {
            onMeta(m);
            return;
        }
        if (typeof onMeta === "function") {
            const total = sortedRows.length;
            const last_page = Math.max(1, Math.ceil(total / rowsPerPage));
            onMeta({ total, last_page, current_page: page, per_page: rowsPerPage });
        }
    }, [data?.meta, sortedRows.length, rowsPerPage, page, onMeta]);

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (isError) {
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
                خطأ: {error?.message || "تعذّر الجلب"}
            </Box>
        );
    }

    const columns = [
        { key: "code", label: "المعرّف" },
        { key: "gradeText", label: "الصف" },
        { key: "studentsCount", label: "عدد الطلاب" },
        { key: "capacity", label: "السعة" },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="جدول الصفوف">
                        <TableHead sx={{ backgroundColor: "#308A9F" }}>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.key} sx={{ color: "#fff", fontWeight: "bold" }}>
                                        <TableSortLabel
                                            active={orderBy === col.key}
                                            direction={orderBy === col.key ? order : "asc"}
                                            onClick={() => handleRequestSort(col.key)}
                                            sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                        >
                                            {col.label}
                                            {orderBy === col.key && (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === "desc" ? "تنازلي" : "تصاعدي"}
                                                </Box>
                                            )}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">لا توجد صفوف حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRows.map((row, idx) => (
                                    <TableRow key={`${row.code}-${idx}`} hover>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.gradeText}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.studentsCount ?? "—"}</TableCell>
                                        <TableCell>{row.capacity ?? "—"}</TableCell>
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
