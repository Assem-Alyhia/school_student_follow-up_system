// src/components/ParentRole/Exams/ParentExamsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
    Grid, TextField, Button, FormControl, Select, MenuItem
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getStudentExams } from "../../../../../api/Student/Exams/getStudentExams";

const onlyTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const onlyDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

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

export default function Section2({ page = 1, rowsPerPage = 10, onMeta }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    const [filters, setFilters] = useState({ q: "", term: "", from: "", to: "" });
    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", term: "", from: "", to: "" });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-exams"],
        queryFn: () => getStudentExams(), 
        staleTime: 60_000,
    });

    const errorMessage = isError
        ? (error?.response?.data?.message || error?.message || null)
        : null;

    const rowsAll = useMemo(() => {
        if (isError) return [];
        const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return src.map((x) => {
            const sISO = x?.start_time ?? "";
            const eISO = x?.end_time ?? "";
            return {
                id: x?.id ?? "",
                academic_year_name: x?.academic_year?.name ?? "",
                term: x?.term ?? "",
                subject_name: x?.subject?.name ?? "",
                date: onlyDate(sISO),
                start_time: onlyTime(sISO),
                end_time: onlyTime(eISO),
                start_time_raw: sISO,
                end_time_raw: eISO,
                max_score: x?.max_score ?? "",
                weight: x?.weight ?? "",
            };
        });
    }, [data, isError]);

    // تطبيق الفلاتر محليًا
    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const term = filters.term || "";
        const from = filters.from ? new Date(filters.from) : null;
        const to = filters.to ? new Date(filters.to) : null;

        return rowsAll.filter((r) => {
            if (term && r.term !== term) return false;

            if (q) {
                const hay = `${r.subject_name || ""} ${r.id}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            if (from || to) {
                const d = new Date(r.start_time_raw);
                if (Number.isNaN(d.getTime())) return false;
                if (from && d < from) return false;

                if (to) {
                    const toEnd = new Date(to);
                    toEnd.setHours(23, 59, 59, 999);
                    if (d > toEnd) return false;
                }
            }

            return true;
        });
    }, [rowsAll, filters]);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...filteredRows];
        arr.sort((a, b) => {
            const key =
                orderBy === "start_time" ? "start_time_raw" :
                    orderBy === "end_time" ? "end_time_raw" :
                        orderBy;
            const av = (a?.[key] ?? "").toString();
            const bv = (b?.[key] ?? "").toString();
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [filteredRows, order, orderBy]);

    // تقسيم الصفحات محليًا
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
        { key: "academic_year_name", label: "العام الدراسي", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "subject_name", label: "المادة", sortable: true },
        { key: "date", label: "التاريخ", sortable: true },
        { key: "start_time", label: "وقت البداية", sortable: true },
        { key: "end_time", label: "وقت النهاية", sortable: true },
        { key: "max_score", label: "العلامة الكاملة", sortable: true },
        { key: "weight", label: "الوزن", sortable: true },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                {/* الفلاتر */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            value={filters.q}
                            onChange={set("q")}
                            placeholder="بحث بالمعرّف أو اسم المادة..."
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

                    <Grid item xs={6} md={2}>
                        <TextField type="date" value={filters.from} onChange={set("from")} fullWidth sx={fieldSx} placeholder="من" />
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <TextField type="date" value={filters.to} onChange={set("to")} fullWidth sx={fieldSx} placeholder="إلى" />
                    </Grid>

                    <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Button variant="outlined" onClick={resetFilters} sx={{ borderRadius: 2 }}>
                            مسح
                        </Button>
                    </Grid>
                </Grid>

                {/* الجدول */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table aria-label="قوائم الامتحانات" sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                                        <Box sx={{ py: 4 }}>
                                            <CircularProgress />
                                        </Box>
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
                                        <TableCell>{row.academic_year_name}</TableCell>
                                        <TableCell>{row.term}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.subject_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.start_time}</TableCell>
                                        <TableCell>{row.end_time}</TableCell>
                                        <TableCell>{row.max_score}</TableCell>
                                        <TableCell>{row.weight}%</TableCell>
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
