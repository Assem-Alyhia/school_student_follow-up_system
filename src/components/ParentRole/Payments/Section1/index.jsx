// src/components/ParentRole/Payments/ParentPaymentsTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TableSortLabel, Typography, CircularProgress, Grid,
    TextField, Button, FormControl, Select, MenuItem, Chip
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const GRADIENT = "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)";

const fieldSx = {
    "& .MuiOutlinedInput-root": { height: 40, backgroundColor: "#F9FAFB" },
    "& .MuiInputBase-input": { textAlign: "right", padding: "10px 12px" },
};

const onlyDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("ar-EG");
};
const toNumber = (v) => (v == null ? 0 : Number(v) || 0);
const fmtMoney = (v) =>
    `${toNumber(v).toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;

const STATUS_OPTIONS = [
    { label: "الكل", value: "" },
    { label: "مدفوع", value: "completed" },
    { label: "غير مدفوع", value: "unpaid" },
    { label: "معلّق", value: "pending" },
];

const statusChip = (s) => {
    switch (s) {
        case "completed": return { label: "مدفوع", sx: { bgcolor: "#E6F7ED", color: "#1F9254", fontWeight: 800 } };
        case "pending": return { label: "معلّق", sx: { bgcolor: "#FFF7E6", color: "#B76E00", fontWeight: 800 } };
        case "unpaid": return { label: "غير مدفوع", sx: { bgcolor: "#FDECEE", color: "#B42318", fontWeight: 800 } };
        default: return { label: s || "—", sx: { bgcolor: "#E8F6F7", color: "#308A9F", fontWeight: 800 } };
    }
};

export default function Section1({ rows = [], loading = false, errorMessage = null }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("paid_at");
    const [filters, setFilters] = useState({ q: "", status: "", from: "", to: "" });

    const set = (k) => (e) => setFilters((s) => ({ ...s, [k]: e.target.value }));
    const resetFilters = () => setFilters({ q: "", status: "", from: "", to: "" });

    const prepared = useMemo(() => {
        return rows.map((x) => ({
            id: x.id,
            payment_number: x.payment_number,
            status: x.status,
            paid_at: onlyDate(x.paid_at),
            paid_at_raw: x.paid_at,

            student_prefix: x.student?.prefix,
            student_name: x.student?.name,
            classroom_name: x.student?.classroom?.name,
            parent_prefix: x.parent?.prefix,
            parent_name: x.parent?.name,

            fee_name: x.schoolFee?.name,

            amount: x.amount,
            discount: x.discount,
            discount_status: x.discount_status,
            remaining_amount: x.remaining_amount,
        }));
    }, [rows]);

    const filteredRows = useMemo(() => {
        const q = (filters.q || "").toLowerCase().trim();
        const st = filters.status || "";
        const from = filters.from ? new Date(filters.from) : null;
        const to = filters.to ? new Date(filters.to) : null;

        return prepared.filter((r) => {
            if (st && r.status !== st) return false;

            if (q) {
                const hay = `${r.payment_number} ${r.student_name} ${r.student_prefix} ${r.parent_prefix} ${r.fee_name}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            if (from || to) {
                const d = new Date(r.paid_at_raw);
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
    }, [prepared, filters]);

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

    // ✅ رتبنا الأعمدة بحيث المعرف (id) يكون أول عمود => يظهر على اليمين في RTL
    const columns = [
        { key: "id", label: "المعرّف", sortable: true },
        { key: "payment_number", label: "معرّف الدفع", sortable: true },
        { key: "student_prefix", label: "معرّف الطالب", sortable: true },
        { key: "student_name", label: "الاسم", sortable: true }, // ← عمود الاسم
        { key: "classroom_name", label: "الصف", sortable: true },
        { key: "fee_name", label: "نوع الرسوم", sortable: true },
        { key: "discount_status", label: "نوع الخصم", sortable: true },
        { key: "discount", label: "الخصم", sortable: true },
        { key: "remaining_amount", label: "المتبقي", sortable: true },
        { key: "amount", label: "المدفوع", sortable: true },
        { key: "status", label: "الحالة", sortable: true },
        { key: "paid_at", label: "تاريخ الدفع", sortable: true },
    ];

    const renderCell = (key, r) => {
        switch (key) {
            case "id":
                return r.id;
            case "payment_number":
                return <Typography sx={{ fontWeight: 600, color: "#22385F" }}>{r.payment_number}</Typography>;
            case "student_prefix":
                return r.student_prefix || "—";
            case "student_name":
                return <Typography sx={{ fontWeight: 600, color: "#22385F" }}>{r.student_name || "—"}</Typography>;
            case "classroom_name":
                return r.classroom_name || "—";
            case "fee_name":
                return r.fee_name || "—";
            case "discount_status":
                return r.discount_status || "—";
            case "discount": {
                const v = toNumber(r.discount);
                const text = r.discount_status === "percentage" ? `${v}%` : fmtMoney(v);
                return text;
            }
            case "remaining_amount":
                return fmtMoney(r.remaining_amount);
            case "amount":
                return <Typography sx={{ fontWeight: 700, color: "#22385F" }}>{fmtMoney(r.amount)}</Typography>;
            case "status": {
                const st = statusChip(r.status);
                return <Chip size="small" label={st.label} sx={{ ...st.sx, height: 24 }} />;
            }
            case "paid_at":
                return r.paid_at;
            default:
                return r[key] ?? "—";
        }
    };

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2.5 }}>
                {/* الفلاتر */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            value={filters.q}
                            onChange={set("q")}
                            placeholder="بحث برقم الدفع، اسم الطالب، نوع الرسوم..."
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
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 24px rgba(34,56,95,0.10)" }}>
                    <Table aria-label="قوائم المدفوعات" sx={{ minWidth: 1000, "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Box sx={{ py: 4 }}><CircularProgress /></Box>
                                    </TableCell>
                                </TableRow>
                            ) : sortedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography color="text.secondary">
                                            {errorMessage ? `لا يوجد بيانات (${errorMessage})` : "لا يوجد بيانات"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRows.map((r, idx) => (
                                    <TableRow key={`${r?.id ?? "row"}-${idx}`} hover>
                                        {columns.map((c) => (
                                            <TableCell key={c.key}>{renderCell(c.key, r)}</TableCell>
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
