// src/components/TeacherRole/Classrooms/ClassroomsTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Typography, CircularProgress,
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

    const code =
        raw?.prefix ??
        raw?.code ??
        (id != null ? `CL-${id}` : "—");

    const levelName = raw?.level?.name ?? "—";
    const gradeText = extractGradeFromLevelName(levelName);

    const studentsCount =
        raw?.students_count ??
        raw?.studentsCount ??
        (Array.isArray(raw?.students) ? raw.students.length : "—");

    const capacity = raw?.capacity ?? raw?.max_capacity ?? "—";

    return { code, gradeText, studentsCount, capacity };
};

const Section2 = ({ page = 1, rowsPerPage = 10, onMeta }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-classrooms", page, rowsPerPage],
        queryFn: () => getTeacherClassrooms(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60 * 1000,
    });

    const meta = data?.meta ?? {};
    if (onMeta) onMeta(meta);

    const rows = useMemo(() => (data?.data ?? []).map(pickRowValues), [data]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedRows = useMemo(() => {
        const arr = [...rows];
        arr.sort((a, b) => {
            const av = a[orderBy] ?? "";
            const bv = b[orderBy] ?? "";
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [rows, order, orderBy]);

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
                خطأ: {error.message}
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
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "code"}
                                        direction={orderBy === "code" ? order : "asc"}
                                        onClick={() => handleRequestSort("code")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        المعرّف
                                        {orderBy === "code" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "gradeText"}
                                        direction={orderBy === "gradeText" ? order : "asc"}
                                        onClick={() => handleRequestSort("gradeText")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        الصف
                                        {orderBy === "gradeText" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "studentsCount"}
                                        direction={orderBy === "studentsCount" ? order : "asc"}
                                        onClick={() => handleRequestSort("studentsCount")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        عدد الطلاب
                                        {orderBy === "studentsCount" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "capacity"}
                                        direction={orderBy === "capacity" ? order : "asc"}
                                        onClick={() => handleRequestSort("capacity")}
                                        sx={{ color: "#fff", "& .MuiTableSortLabel-icon": { color: "#fff !important" } }}
                                    >
                                        السعة
                                        {orderBy === "capacity" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
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
