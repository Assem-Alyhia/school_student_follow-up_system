// src/components/TeacherRole/Subjects/SubjectsTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TableSortLabel, Typography, CircularProgress,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getTeacherSubjects } from "../../../../api/Teacher/Subjects/getTeacherSubjects";

const stageFromGrade = (g) => {
    if (g == null) return "—";
    const n = Number(g);
    if (n <= 0) return "الروضة";
    if (n >= 1 && n <= 6) return "الابتدائية";
    if (n >= 7 && n <= 9) return "الإعدادية";
    if (n >= 10 && n <= 12) return "الثانوية";
    return "—";
};

// نطبّع صف الـ API إلى مفاتيح نستخدمها مباشرة في الجدول
const pickRowValues = (raw) => {
    const id = raw?.id;

    const code =
        raw?.prefix ??
        raw?.code ??
        raw?.subject_code ??
        (id != null ? `SB-${id}` : "—");

    const name = raw?.name ?? raw?.subject_name ?? raw?.title ?? "—";

    const gradeLevel =
        raw?.level?.grade_level ??
        raw?.grade_level ??
        raw?.classroom?.level?.grade_level ??
        null;

    // الـ API يعيد term كسلسلة (مثلاً "term 1")؛
    // ولو كانت رقمية نحولها لعربي.
    const termRaw =
        raw?.term ?? raw?.semester ?? raw?.classroom?.semester ?? null;
    const term =
        typeof termRaw === "string"
            ? termRaw
            : termRaw === 1
                ? "الأول"
                : termRaw === 2
                    ? "الثاني"
                    : "—";

    const levelName =
        raw?.level?.name ?? raw?.level_name ?? stageFromGrade(gradeLevel);

    return { code, name, term, levelName };
};

const Section2 = ({ page = 1, rowsPerPage = 10 }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("code");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-subjects", page, rowsPerPage],
        queryFn: () => getTeacherSubjects(page, rowsPerPage),
        keepPreviousData: true,
        staleTime: 60 * 1000,
    });

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
            if (typeof av === "number" && typeof bv === "number") {
                return order === "asc" ? av - bv : bv - av;
            }
            const as = av.toString();
            const bs = bv.toString();
            if (order === "asc") return as > bs ? 1 : as < bs ? -1 : 0;
            return as < bs ? 1 : as > bs ? -1 : 0;
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
                خطأ: {error?.message || "تعذّر الجلب"}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table
                        sx={{
                            minWidth: 650,
                            "& .MuiTableCell-root": { textAlign: "center" }, // توسيط جميع الخلايا
                        }}
                        aria-label="جدول المواد الدراسية"
                    >
                        <TableHead sx={{ backgroundColor: "#308A9F" }}>
                            <TableRow>
                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "code"}
                                        direction={orderBy === "code" ? order : "asc"}
                                        onClick={() => handleRequestSort("code")}
                                        sx={{
                                            color: "#fff",
                                            "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center", // توسيط محتوى العنوان مع أيقونة الفرز
                                            width: "100%",
                                        }}
                                    >
                                        المعرّف
                                        {orderBy === "code" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                        sx={{
                                            color: "#fff",
                                            "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                        }}
                                    >
                                        اسم المادة
                                        {orderBy === "name" && (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === "desc" ? "تنازلي" : "تصاعدي"}
                                            </Box>
                                        )}
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    الفصل
                                </TableCell>

                                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                                    المرحلة الدراسية
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography color="text.secondary">
                                            لا توجد مواد حالياً.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRows.map((row, idx) => (
                                    <TableRow key={`${row.code}-${idx}`} hover>
                                        <TableCell align="center">{row.code}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: "#22385F", textAlign: "center" }}>
                                                {row.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{row.term}</TableCell>
                                        <TableCell align="center">{row.levelName}</TableCell>
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
