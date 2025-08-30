// src/components/ParentRole/ExamResults/ResultsTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
    Grid, TextField, Button, FormControl, Select, MenuItem
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const HEADER_GRADIENT = "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)";

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

const onlyTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const timeToMinutes = (t) => {
    if (!t) return null;
    if (typeof t === "string" && t.includes(":") && t.length <= 5) {
        const [h, m] = t.split(":").map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
    }
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return null;
    return d.getHours() * 60 + d.getMinutes();
};

export default function ResultsTable({
    rows = [],
    loading = false,
    errorMessage = null,
}) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("student_name");

    const [filters, setFilters] = useState({ q: "", term: "", fromTime: "", toTime: "" });
    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", term: "", fromTime: "", toTime: "" });

    const preparedRows = useMemo(() => {
        const mapped = rows.map((item) => {
            const startISO = item?.exam?.start_time ?? "";
            const endISO = item?.exam?.end_time ?? "";
            return {
                id: item?.id ?? "",
                score: item?.score ?? "",
                term: item?.exam?.term ?? "",
                start_time_raw: startISO,
                end_time_raw: endISO,
                start_time: onlyTime(startISO),
                end_time: onlyTime(endISO),
                max_score: item?.exam?.max_score ?? "",
                weight: item?.exam?.weight ?? "",
                student_prefix: item?.student?.prefix ?? "",
                student_id: item?.student?.id ?? "",
                student_name: item?.student?.name ?? "",
                subject_name: item?.exam?.subject?.name ?? "",
            };
        });
        return mapped;
    }, [rows]);

    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const term = filters.term || "";
        const fromMin = filters.fromTime ? timeToMinutes(filters.fromTime) : null;
        const toMin = filters.toTime ? timeToMinutes(filters.toTime) : null;

        return preparedRows.filter((r) => {
            if (term && r.term !== term) return false;

            if (q) {
                const hay = `${r.student_prefix || ""} ${r.student_name || ""} ${r.subject_name || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            if (fromMin !== null || toMin !== null) {
                const startMinutes = timeToMinutes(r.start_time_raw);
                if (startMinutes === null) return false;
                if (fromMin !== null && startMinutes < fromMin) return false;
                if (toMin !== null && startMinutes > toMin) return false;
            }
            return true;
        });
    }, [preparedRows, filters]);

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

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const columns = [
        { key: "student_prefix", label: "رقم الطالب", sortable: true },
        { key: "student_name", label: "اسم الطالب", sortable: true },
        { key: "subject_name", label: "المادة", sortable: true },
        { key: "term", label: "الفصل", sortable: true },
        { key: "start_time", label: "وقت البداية", sortable: true },
        { key: "end_time", label: "وقت النهاية", sortable: true },
        { key: "max_score", label: "العلامة الكاملة", sortable: true },
        { key: "weight", label: "الوزن", sortable: true },
        { key: "score", label: "الدرجة", sortable: true },
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
                            placeholder="بحث برقم/اسم الطالب أو المادة..."
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
                        <TextField
                            type="time"
                            value={filters.fromTime}
                            onChange={set("fromTime")}
                            fullWidth
                            sx={fieldSx}
                            placeholder="من (وقت)"
                            inputProps={{ step: 60 }}
                        />
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <TextField
                            type="time"
                            value={filters.toTime}
                            onChange={set("toTime")}
                            fullWidth
                            sx={fieldSx}
                            placeholder="إلى (وقت)"
                            inputProps={{ step: 60 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Button variant="outlined" onClick={resetFilters} sx={{ borderRadius: 2 }}>
                            مسح
                        </Button>
                    </Grid>
                </Grid>

                {/* الجدول */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table aria-label="نتائج الامتحانات" sx={{ minWidth: 1000 }}>
                        <TableHead>
                            <TableRow sx={{ background: HEADER_GRADIENT }}>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        align="center"                                       // <-- التوسيط في الرأس
                                        sx={{ color: "#fff", fontWeight: "bold", whiteSpace: "nowrap" }}
                                    >
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
                            {loading ? (
                                <TableRow>
                                    <TableCell align="center" colSpan={columns.length}>
                                        <Box sx={{ py: 4 }}><CircularProgress /></Box>
                                    </TableCell>
                                </TableRow>
                            ) : sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell align="center" colSpan={columns.length}>
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا يوجد بيانات (${errorMessage})` : "لا يوجد بيانات"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRows.map((row, idx) => (
                                    <TableRow key={`${row.id}-${idx}`} hover>
                                        <TableCell align="center">{row.student_prefix}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                {row.student_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{row.subject_name}</TableCell>
                                        <TableCell align="center">{row.term}</TableCell>
                                        <TableCell align="center">{row.start_time}</TableCell>
                                        <TableCell align="center">{row.end_time}</TableCell>
                                        <TableCell align="center">{row.max_score}</TableCell>
                                        <TableCell align="center">{row.weight}%</TableCell>
                                        <TableCell align="center">{row.score}</TableCell>
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
