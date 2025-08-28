// src/components/Students/Fees/StudentFeesTable.jsx
import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TableSortLabel,
    TextField,
    Grid,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllPaymentsNoPaginate } from "../../../../../api/Admin/Payments/getAllPaymentsNoPaginate";
import PaymentModal from "./../../../PaymentModal";

export default function StudentFeesTable() {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
    const [filters, setFilters] = useState({
        student: "",
        parent: "",
        feeType: "",
        status: "",
    });

    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleOpenPayment = () => {
        setSelectedStudent({ id: Number(id) });
        setOpenPaymentModal(true);
    };
    const handleClosePayment = () => {
        setSelectedStudent(null);
        setOpenPaymentModal(false);
    };

    // -------- Fetch payments with React Query --------
    const {
        data: payments = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["payments:student", String(id)],
        queryFn: async () => {
            const all = await getAllPaymentsNoPaginate();
            const list = Array.isArray(all) ? all : all?.data ?? [];
            return list.filter(
                (p) => String(p?.student?.id ?? p?.student_id) === String(id)
            );
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });

    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    // -------- Filters --------
    const filtered = useMemo(() => {
        const f = (v) => String(v ?? "").toLowerCase();
        return payments.filter(
            (item) =>
                f(item?.student?.name).includes(f(filters.student)) &&
                f(item?.parent?.name).includes(f(filters.parent)) &&
                f(item?.schoolFee?.name ?? item?.school_fee?.name).includes(
                    f(filters.feeType)
                ) &&
                f(item?.status).includes(f(filters.status))
        );
    }, [payments, filters]);

    // -------- Sorting --------
    const sorted = useMemo(() => {
        const arr = [...filtered];
        const dir = sortConfig.direction === "asc" ? 1 : -1;

        const valueByKey = (row, key) => {
            switch (key) {
                case "id":
                    return row.id;
                case "student":
                    return row.student?.name ?? "";
                case "parent":
                    return row.parent?.name ?? "";
                case "feeType":
                    return row.schoolFee?.name ?? row.school_fee?.name ?? "";
                case "fullAmount":
                    return row.schoolFee?.amount ?? row.school_fee?.amount ?? 0;
                case "paidAmount":
                    return row.amount ?? 0;
                case "discount":
                    return row.discount ?? 0;
                case "discountStatus":
                    return row.discount_status ?? "";
                case "remaining":
                    return row.remaining_amount ?? 0;
                case "paymentNo":
                    return row.payment_number ?? "";
                case "date":
                    return row.paid_at ?? "";
                case "status":
                    return row.status ?? "";
                default:
                    return "";
            }
        };

        arr.sort((a, b) => {
            const va = valueByKey(a, sortConfig.key);
            const vb = valueByKey(b, sortConfig.key);
            if (va == null && vb == null) return 0;
            if (va == null) return -1 * dir;
            if (vb == null) return 1 * dir;
            if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
            return String(va).localeCompare(String(vb), "ar") * dir;
        });

        return arr;
    }, [filtered, sortConfig]);

    return (
        <Box sx={{ p: 3 }}>
            {/* Header + Add button */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    تفاصيل الرسوم للطالب #{id}
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleOpenPayment}
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        background: "linear-gradient(90deg, #308A9F,#22385F)",
                        "&:hover": { opacity: 0.95 },
                    }}
                >
                    أضف الرسوم
                </Button>
            </Box>

            {/* Loading / Error */}
            {isLoading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CircularProgress size={20} /> جاري تحميل المدفوعات...
                </Box>
            )}
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    خطأ أثناء جلب المدفوعات: {error?.message || "حدث خطأ غير متوقع"}
                </Alert>
            )}

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="بحث باسم الطالب"
                        value={filters.student}
                        onChange={(e) => setFilters({ ...filters, student: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="بحث باسم ولي الأمر"
                        value={filters.parent}
                        onChange={(e) => setFilters({ ...filters, parent: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="بحث بنوع الرسوم"
                        value={filters.feeType}
                        onChange={(e) => setFilters({ ...filters, feeType: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="بحث بالحالة"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    />
                </Grid>
            </Grid>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                { key: "id", label: "المعرف" },
                                { key: "student", label: "اسم الطالب" },
                                { key: "parent", label: "اسم ولي الأمر" },
                                { key: "feeType", label: "نوع الرسوم" },
                                { key: "fullAmount", label: "المبلغ الكامل" },
                                { key: "paidAmount", label: "المبلغ المدفوع" },
                                { key: "discount", label: "الخصم" },
                                { key: "discountStatus", label: "حالة الخصم" },
                                { key: "remaining", label: "المبلغ المتبقي" },
                                { key: "paymentNo", label: "رقم الدفع" },
                                { key: "date", label: "تاريخ الدفع" },
                                { key: "status", label: "الحالة" },
                            ].map((col) => (
                                <TableCell
                                    key={col.key}
                                    sx={{ fontWeight: "bold", color: "#22385F", cursor: "pointer" }}
                                >
                                    <TableSortLabel
                                        active={sortConfig.key === col.key}
                                        direction={sortConfig.direction}
                                        onClick={() => requestSort(col.key)}
                                        IconComponent={
                                            sortConfig.direction === "asc" ? ArrowUpwardIcon : ArrowDownwardIcon
                                        }
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!isLoading && sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center">
                                    لا توجد بيانات
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.student?.name}</TableCell>
                                    <TableCell>{row.parent?.name}</TableCell>
                                    <TableCell>{row.schoolFee?.name ?? row.school_fee?.name}</TableCell>
                                    <TableCell>{row.schoolFee?.amount ?? row.school_fee?.amount}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.discount}</TableCell>
                                    <TableCell>{row.discount_status}</TableCell>
                                    <TableCell>{row.remaining_amount}</TableCell>
                                    <TableCell>{row.payment_number}</TableCell>
                                    <TableCell>
                                        {row.paid_at
                                            ? row.paid_at.includes("T")
                                                ? row.paid_at.split("T")[0]
                                                : String(row.paid_at).split(" ")[0]
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={
                                                row.status === "completed"
                                                    ? "مدفوع"
                                                    : row.status === "pending"
                                                        ? "قيد المعالجة"
                                                        : "فشل الدفع"
                                            }
                                            sx={{
                                                backgroundColor:
                                                    row.status === "completed"
                                                        ? "#E8F5E9"
                                                        : row.status === "pending"
                                                            ? "#FFF8E1"
                                                            : "#FFEBEE",
                                                color:
                                                    row.status === "completed"
                                                        ? "#2E7D32"
                                                        : row.status === "pending"
                                                            ? "#F9A825"
                                                            : "#C62828",
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <PaymentModal
                open={openPaymentModal}
                handleClose={handleClosePayment}
                student={selectedStudent}
                onCreated={() =>
                    queryClient.invalidateQueries({ queryKey: ["payments:student", String(id)] })
                }
            />
        </Box>
    );
}
