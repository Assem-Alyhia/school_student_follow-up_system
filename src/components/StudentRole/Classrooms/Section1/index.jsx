import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress,
    Grid, TextField, Button, FormControl, Select, MenuItem, Stack, Chip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useQuery } from "@tanstack/react-query";
import { getStudentClassrooms } from "../../../../api/Student/Classrooms/getStudentClassrooms";

const STATUS_OPTIONS = [
    { label: "الكل", value: "" },
    { label: "نشط", value: "active" },
    { label: "مُعطّل", value: "inactive" },
];

const fieldSx = {
    "& .MuiOutlinedInput-root": { height: 40, backgroundColor: "#F9FAFB" },
    "& .MuiInputBase-input": { textAlign: "right", padding: "10px 12px" },
};

export default function Section1({
    page = 1,
    rowsPerPage = 10,
    onMeta,
    onRequestPageChange, // من الأب لربط الباجينيشن
}) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    // فلاتر
    const [filters, setFilters] = useState({ q: "", status: "" });
    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", status: "" });

    // أعد الصفحة 1 عند تغيير الفلاتر
    useEffect(() => {
        onRequestPageChange?.(1);
    }, [filters.q, filters.status]); // eslint-disable-line

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-classrooms"], // مفتاح الكاش
        queryFn: () => getStudentClassrooms(), // GET /student/classrooms
        staleTime: 60_000,
    });

    const errorMessage = isError
        ? (error?.response?.data?.message || error?.message || null)
        : null;

    // تحويل البيانات إلى صفوف الجدول
    const rowsAll = useMemo(() => {
        if (isError) return [];
        const src = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return src.map((x) => ({
            id: x?.id ?? "",
            level_name: x?.level?.name ?? "",
            class_name: x?.name ?? "",
            students_count: x?.students_count ?? "",
            capacity: x?.capacity ?? "",
            status: x?.status ?? "",
        }));
    }, [data, isError]);

    // فلترة محلية
    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const status = filters.status || "";

        return rowsAll.filter((r) => {
            if (status && r.status !== status) return false;
            if (q) {
                const hay = `${r.class_name || ""} ${r.level_name || ""} ${r.id || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [rowsAll, filters]);

    // ترتيب
    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const sortedRows = useMemo(() => {
        const arr = [...filteredRows];
        arr.sort((a, b) => {
            // أرقام لحقول رقمية
            const numKeys = new Set(["id", "students_count", "capacity"]);
            const av = a?.[orderBy];
            const bv = b?.[orderBy];
            const aa = numKeys.has(orderBy) ? Number(av) : String(av ?? "");
            const bb = numKeys.has(orderBy) ? Number(bv) : String(bv ?? "");
            if (order === "asc") return aa > bb ? 1 : aa < bb ? -1 : 0;
            return aa < bb ? 1 : aa > bb ? -1 : 0;
        });
        return arr;
    }, [filteredRows, order, orderBy]);

    // صفحة العرض
    const start = (page - 1) * rowsPerPage;
    const viewRows = sortedRows.slice(start, start + rowsPerPage);

    // إرسال الميتا + تصحيح الصفحة إذا تجاوزت آخر صفحة
    useEffect(() => {
        const total = sortedRows.length;
        const last_page = Math.max(1, Math.ceil(total / rowsPerPage));
        onMeta?.({ total, last_page });
        if (page > last_page) onRequestPageChange?.(last_page);
    }, [sortedRows.length, rowsPerPage, page, onMeta, onRequestPageChange]);

    // أعمدة الجدول (مطابقة للصورة من اليمين لليسار)
    const columns = [
        { key: "id", label: "المعرّف", sortable: true },
        { key: "class_name", label: "الصف", sortable: true },
        { key: "students_count", label: "عدد الطلاب", sortable: true },
        { key: "capacity", label: "الكثافة", sortable: true },
        { key: "status", label: "الحالة", sortable: true },
    ];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                {/* الفلاتر */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
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
                            <Select value={filters.status} onChange={set("status")} displayEmpty>
                                {STATUS_OPTIONS.map((t) => (
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
                    <Table aria-label="صفوف الطالب" sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                                        <TableCell>{row.class_name}</TableCell>
                                        <TableCell>{row.students_count}</TableCell>
                                        <TableCell>{row.capacity}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status === "active" ? "نشط" : row.status === "inactive" ? "مُعطّل" : row.status || "—"}
                                                color={row.status === "active" ? "success" : row.status === "inactive" ? "error" : "default"}
                                                variant="outlined"
                                                size="small"
                                                sx={{ fontWeight: 700 , borderRadius:'8px'}}
                                            />
                                        </TableCell>
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
