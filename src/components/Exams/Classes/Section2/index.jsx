// src/components/TeacherRole/Classrooms/ClassroomsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllLevelsPaginate } from "../../../../api/Admin/Levels/getAllLevelsPaginate";

// تحويل سجلّ واحد لشكل العرض
const pickRowValues = (raw) => ({
    id: raw?.id ?? "—",
    name: raw?.name ?? "—",
    gradeLevel: raw?.grade_level ?? "—",
    classroomsCount: raw?.classrooms_count ?? 0,
    subjectsCount: raw?.subjects_count ?? 0,
    studentsCount: raw?.students_count ?? 0,
});

const ClassroomsTable = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    // ✅ اربط الاستعلام بالصفحة والحجم، ونادِ الـ API بهما
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-levels-all", page, rowsPerPage],
        queryFn: () => getAllLevelsPaginate(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    // مصدر الصفوف من الاستجابة
    const listRaw = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.levels)) return data.levels;
        return [];
    }, [data]);

    const rowsAll = useMemo(() => listRaw.map(pickRowValues), [listRaw]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rowsAll];
        arr.sort((a, b) => {
            const av = a?.[orderBy];
            const bv = b?.[orderBy];
            if (typeof av === "number" && typeof bv === "number") {
                return order === "asc" ? av - bv : bv - av;
            }
            const as = (av ?? "").toString();
            const bs = (bv ?? "").toString();
            if (order === "asc") return as > bs ? 1 : as < bs ? -1 : 0;
            return as < bs ? 1 : as > bs ? -1 : 0;
        });
        return arr;
    }, [rowsAll, order, orderBy]);

    // ✅ إن كان السيرفر يرجّع meta اعتبر أن الصفحة الحالية جاهزة ولا تقطع محليًا
    const hasServerPagination = !!data?.meta;
    const start = (page - 1) * rowsPerPage;
    const viewRows = hasServerPagination ? sortedRows : sortedRows.slice(start, start + rowsPerPage);

    // ✅ مرّر معلومات الباجينيشن للأب
    useEffect(() => {
        if (data?.meta) {
            onMeta?.(data.meta);
        } else {
            const total = sortedRows.length;
            onMeta?.({
                total,
                last_page: Math.max(1, Math.ceil(total / rowsPerPage)),
                per_page: rowsPerPage,
                current_page: page,
            });
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
                خطأ: {error?.message || "تعذّر تحميل البيانات"}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="جدول الصفوف">
                        <TableHead sx={{ backgroundColor: "#308A9F" }}>
                            <TableRow>
                                {/* المعرّف */}
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "id"}
                                        direction={orderBy === "id" ? order : "asc"}
                                        onClick={() => handleRequestSort("id")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المعرّف
                                        {orderBy === "id" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                {/* الاسم */}
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المرحلة / الصف
                                        {orderBy === "name" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                {/* المستوى الدراسي */}
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "gradeLevel"}
                                        direction={orderBy === "gradeLevel" ? order : "asc"}
                                        onClick={() => handleRequestSort("gradeLevel")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المستوى الدراسي
                                        {orderBy === "gradeLevel" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>عدد الصفوف</TableCell>
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>عدد المواد</TableCell>
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>عدد الطلاب</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="text.secondary">لا توجد بيانات حالياً.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row.id}-${idx}`} hover>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{row.gradeLevel}</TableCell>
                                        <TableCell align="center">{row.classroomsCount}</TableCell>
                                        <TableCell align="center">{row.subjectsCount}</TableCell>
                                        <TableCell align="center">{row.studentsCount}</TableCell>
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

export default ClassroomsTable;
