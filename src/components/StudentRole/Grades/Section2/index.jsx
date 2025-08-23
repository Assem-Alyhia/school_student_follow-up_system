// src/components/StudentRole/Grades/StudentGradesTable.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
    Grid, TextField, Button, FormControl, Select, MenuItem, Chip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getStudentGrades } from "../../../../api/Student/Grades/getStudentGrades";

const GRADIENT = "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)";

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

const mapSubjectTerm = (t) => {
    switch ((t || "").toLowerCase()) {
        case "term 1": return "الفصل الأول";
        case "term 2": return "الفصل الثاني";
        case "term 3": return "الفصل الثالث";
        default: return t || "—";
    }
};

export default function Section2({ page = 1, rowsPerPage = 10, onMeta }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");
    const [filters, setFilters] = useState({ q: "", term: "", from: "", to: "" });
    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", term: "", from: "", to: "" });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-grades"],
        queryFn: () => getStudentGrades(),
        staleTime: 60_000,
    });

    const errorMessage = isError ? (error?.response?.data?.message || error?.message) : null;

    // تطبيع الداتا: {id, term, final_score, note}
    const rowsAll = useMemo(() => {
        if (isError) return [];
        const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return src.map((x) => ({
            id: x?.id ?? "",
            term: x?.term ?? "",
            final_score: Number(x?.final_score ?? 0),
            note: x?.note ?? "",
        }));
    }, [data, isError]);

    // فلاتر محلية: بحث في (المعرّف/الملاحظة) + الفصل + مدى درجات
    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const term = filters.term || "";
        const min = filters.from === "" ? null : Number(filters.from);
        const max = filters.to === "" ? null : Number(filters.to);

        return rowsAll.filter((r) => {
            if (term && r.term !== term) return false;
            if (q) {
                const hay = `${r.id} ${r.note}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (min !== null && !Number.isNaN(min) && r.final_score < min) return false;
            if (max !== null && !Number.isNaN(max) && r.final_score > max) return false;
            return true;
        });
    }, [rowsAll, filters]);

    // فرز
    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...filteredRows];
        arr.sort((a, b) => {
            let av = a?.[orderBy];
            let bv = b?.[orderBy];
            if (orderBy === "final_score") {
                av = Number(av ?? 0);
                bv = Number(bv ?? 0);
            } else {
                av = (av ?? "").toString();
                bv = (bv ?? "").toString();
            }
            if (order === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
            return av < bv ? 1 : av > bv ? -1 : 0;
        });
        return arr;
    }, [filteredRows, order, orderBy]);

    // تقسيم صفحات محلي + إرسال meta للأب
    const start = (page - 1) * rowsPerPage;
    const viewRows = sortedRows.slice(start, start + rowsPerPage);

    const metaRef = useRef({ total: 0, last_page: 1 });
    useEffect(() => {
        const next = {
            total: sortedRows.length,
            last_page: Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)),
        };
        if (
            metaRef.current.total !== next.total ||
            metaRef.current.last_page !== next.last_page
        ) {
            metaRef.current = next;
            onMeta?.(next);
        }
    }, [sortedRows.length, rowsPerPage, onMeta]);

    const columns = [
        { key: "id", label: "المعرّف", sortable: true },
        { key: "term", label: "الفصل الدراسي", sortable: true },
        { key: "final_score", label: "الدرجة النهائية", sortable: true },
        { key: "note", label: "ملاحظة", sortable: false },
    ];

    const renderCell = (k, r) => {
        switch (k) {
            case "term":
                return (
                    <Chip
                        size="small"
                        label={mapSubjectTerm(r.term)}
                        sx={{ bgcolor: "#E8F6F7", color: "#308A9F", fontWeight: 800, height: 24 }}
                    />
                );
            case "final_score":
                return <Typography sx={{ fontWeight: 800, color: "#1F2937" }}>{r.final_score}</Typography>;
            default:
                return r[k] ?? "—";
        }
    };

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                {/* الفلاتر */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            value={filters.q}
                            onChange={set("q")}
                            placeholder="بحث بالملاحظة/المعرّف..."
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
                            type="number"
                            value={filters.from}
                            onChange={set("from")}
                            fullWidth
                            sx={fieldSx}
                            placeholder="درجة من"
                            inputProps={{ min: 0, step: 1 }}
                        />
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <TextField
                            type="number"
                            value={filters.to}
                            onChange={set("to")}
                            fullWidth
                            sx={fieldSx}
                            placeholder="درجة إلى"
                            inputProps={{ min: 0, step: 1 }}
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
                    <Table aria-label="درجات الطالب" sx={{ minWidth: 800, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
                        <TableHead>
                            <TableRow sx={{ background: GRADIENT }}>
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
                                        {columns.map((c) => (
                                            <TableCell key={c.key}>{renderCell(c.key, row)}</TableCell>
                                        ))}
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
