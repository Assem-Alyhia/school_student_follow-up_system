import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
    Grid, TextField, Button, FormControl, Select, MenuItem, Avatar, Stack
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getStudentSubjects } from "../../../../api/Student/Subjects/getStudentSubjects";

const TERM_OPTIONS = [
    { label: "الكل", value: "" },
    { label: "الفصل الأول", value: "term 1" },
    { label: "الفصل الثاني", value: "term 2" },
    { label: "الفصل الثالث", value: "term 3" },
];

const fieldSx = {
    "& .MuiOutlinedInput-root": { height: 40, backgroundColor: "#F9FAFB" },
    "& .MuiInputBase-input": { textAlign: "right", padding: "10px 12px" },
};

export default function Section1({ page = 1, rowsPerPage = 10, onMeta }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    // فلاتر
    const [filters, setFilters] = useState({ q: "", term: "" });
    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", term: "" });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-subjects"],
        queryFn: () => getStudentSubjects(), 
        staleTime: 60_000,
    });

    const errorMessage = isError
        ? (error?.response?.data?.message || error?.message || null)
        : null;

    const rowsAll = useMemo(() => {
        if (isError) return [];
        const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return src.map((x) => ({
            id: x?.id ?? "",
            level_name: x?.level?.name ?? "",
            subject_name: x?.name ?? "",
            description: x?.description ?? "",
            term: x?.term ?? "",
        }));
    }, [data, isError]);

    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const term = filters.term || "";
        return rowsAll.filter((r) => {
            if (term && r.term !== term) return false;
            if (q) {
                const hay = `${r.subject_name || ""} ${r.level_name || ""} ${r.id || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [rowsAll, filters]);

    // الترتيب
    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...filteredRows];
        arr.sort((a, b) => {
            const av = (a?.[orderBy] ?? "").toString();
            const bv = (b?.[orderBy] ?? "").toString();
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [filteredRows, order, orderBy]);

    const start = (page - 1) * rowsPerPage;
    const viewRows = sortedRows.slice(start, start + rowsPerPage);

    useEffect(() => {
        onMeta?.({
            total: sortedRows.length,
            last_page: Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)),
        });
    }, [sortedRows.length, rowsPerPage, onMeta]);

    const columns = [
        { key: "id", label: "المعرّف", sortable: true },
        { key: "level_name", label: "المرحلة الدراسية", sortable: true },
        { key: "subject_name", label: "اسم المادة", sortable: true },
        { key: "description", label: "الوصف", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
    ];

    const totalSubjects = rowsAll.length;

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Avatar
                        src="/images/avatars/subject.png"
                        alt="Subjects"
                        sx={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>
                        {totalSubjects}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                        عدد المواد الكلي
                    </Typography>
                </Stack>

                {/* الفلاتر */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={5}>
                        <TextField
                            value={filters.q}
                            onChange={set("q")}
                            placeholder="ابحث هنا (الاسم/المستوى/المعرّف)…"
                            fullWidth
                            sx={fieldSx}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth sx={fieldSx}>
                            <Select value={filters.term} onChange={set("term")} displayEmpty>
                                {TERM_OPTIONS.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Button variant="outlined" onClick={resetFilters} sx={{ borderRadius: 2 }}>
                            مسح
                        </Button>
                    </Grid>
                </Grid>

                {/* الجدول */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table aria-label="مواد الطالب" sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Box sx={{ py: 4 }}><CircularProgress /></Box>
                                    </TableCell>
                                </TableRow>
                            ) : viewRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا يوجد بيانات (${errorMessage})` : "لا يوجد بيانات"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                viewRows.map((row, idx) => (
                                    <TableRow key={`${row?.id ?? "row"}-${idx}`} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.level_name}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.subject_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 360 }}>
                                            <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {row.description || "—"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.term}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
