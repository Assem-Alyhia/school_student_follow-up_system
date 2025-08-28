import React, { useMemo, useState } from "react";
import {
    Box, Button, Grid, IconButton, Paper, TextField, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, MenuItem, Select, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";

const STATUS_LABEL = { completed: "مدفوع" };

const Section1 = ({
    rows = [],
    loading = false,
    search,
    setSearch,
    status,
    setStatus,
    onResetPage,
}) => {
    const [classroomNameFilter, setClassroomNameFilter] = useState("");

    // حالة البحث المحلية
    const [localSearch, setLocalSearch] = useState(search || "");

    const classroomOptions = useMemo(() => {
        const names = new Set();
        rows.forEach((p) => {
            const n = p?.student?.classroom?.name;
            if (n) names.add(n);
        });
        return Array.from(names);
    }, [rows]);

    const clientFilteredRows = useMemo(() => {
        let list = [...rows];

        if (classroomNameFilter) {
            list = list.filter(
                (p) => p?.student?.classroom?.name === classroomNameFilter
            );
        }

        if ((search || "").trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((p) => {
                const sName = p?.student?.name?.toLowerCase() || "";
                const pName = p?.parent?.name?.toLowerCase() || "";
                const cName = p?.student?.classroom?.name?.toLowerCase() || "";
                const idStr = String(p?.id ?? "").toLowerCase();
                const paymentNo = (p?.payment_number || "").toLowerCase();
                return (
                    sName.includes(q) ||
                    pName.includes(q) ||
                    cName.includes(q) ||
                    idStr.includes(q) ||
                    paymentNo.includes(q)
                );
            });
        }

        if ((status || "").trim()) {
            const wanted = status.toLowerCase();
            list = list.filter((p) => (p?.status || "").toLowerCase() === wanted);
        }

        return list;
    }, [rows, classroomNameFilter, search, status]);

    const currency = (v) => {
        if (v == null) return "-";
        const num = Number(v);
        if (Number.isNaN(num)) return String(v);
        return `${num.toFixed(2)}$`;
    };

    const statusLabel = (s) => {
        if (!s) return "غير مدفوع";
        return STATUS_LABEL[s] || (s === "completed" ? "مدفوع" : "غير مدفوع");
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 1.5, mb: 2 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            placeholder="ابحث هنا (الطالب/ولي الأمر/الصف/معرّف الدفع)..."
                            size="small"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                                sx: { height: 36 },
                            }}
                            sx={{
                                flexGrow: 1,
                                "& .MuiInputBase-root": { minHeight: 36, fontSize: "14px", px: 1 },
                            }}
                        />

                        {/* زر البحث */}
                        <Button
                            size="small"
                            variant="contained"
                            sx={{
                                backgroundColor: "#35AFBC",
                                "&:hover": { backgroundColor: "#30BA9F" },
                                minHeight: 36,
                            }}
                            onClick={() => {
                                setSearch(localSearch);
                                onResetPage?.();
                            }}
                        >
                            بحث
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}
                            onClick={() => onResetPage?.()}
                        >
                            فلترة
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}
                            disabled
                            title="الترتيب قادم لاحقًا"
                        >
                            ترتيب
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        <Select
                            value={classroomNameFilter}
                            displayEmpty
                            size="small"
                            sx={{ minWidth: 160, height: 36 }}
                            onChange={(e) => {
                                setClassroomNameFilter(e.target.value);
                                onResetPage?.();
                            }}
                        >
                            <MenuItem value="">اختر الصف</MenuItem>
                            {classroomOptions.map((name) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={status}
                            displayEmpty
                            size="small"
                            sx={{ minWidth: 140, height: 36 }}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                onResetPage?.();
                            }}
                        >
                            <MenuItem value="">كل الحالات</MenuItem>
                            <MenuItem value="completed">مدفوع</MenuItem>
                            <MenuItem value="pending">غير مدفوع</MenuItem>
                            <MenuItem value="failed">فشل</MenuItem>
                        </Select>

                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            sx={{
                                backgroundColor: "#35AFBC",
                                "&:hover": { backgroundColor: "#30BA9F" },
                                minHeight: 36,
                            }}
                            onClick={() => {
                                console.log("Export current filtered rows", clientFilteredRows);
                            }}
                        >
                            تصدير البيانات
                        </Button>

                        <IconButton sx={{ color: "#35AFBC", height: 36, width: 36 }}>
                            <PrintIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3}>
                <TableContainer>
                    <Table dir="rtl">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#308A9F" }}>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    معرّف الدفع (ID)
                                </TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    الطالب
                                </TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    الصف
                                </TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    المبلغ
                                </TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    آخر تاريخ دفع
                                </TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>
                                    الحالة
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : clientFilteredRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        لا توجد بيانات مطابقة
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clientFilteredRows.map((row, idx) => {
                                    const student = row?.student;
                                    const parent = row?.parent;
                                    const classroom = student?.classroom;
                                    const amountShown = row?.amount ?? row?.schoolFee?.amount ?? null;

                                    return (
                                        <TableRow key={row?.id ?? idx}>
                                            <TableCell align="center">{row?.id}</TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                    <Avatar src="/avatars/user.png" sx={{ width: 30, height: 30, ml: 1 }} />
                                                    <Box>
                                                        <Typography>{student?.name || "-"}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {parent?.name || ""}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">{classroom?.name || "-"}</TableCell>
                                            <TableCell align="center">{currency(amountShown)}</TableCell>
                                            <TableCell align="center">
                                                {row?.paid_at ? new Date(row.paid_at).toLocaleString("ar-EG") : "-"}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography
                                                    sx={{
                                                        backgroundColor: (row?.status || "") === "completed" ? "#DFF5E4" : "#FFEBEE",
                                                        color: (row?.status || "") === "completed" ? "#2E7D32" : "#C62828",
                                                        px: 1.5, py: 0.5, borderRadius: 1, display: "inline-block", fontSize: "14px",
                                                    }}
                                                >
                                                    {statusLabel(row?.status)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Section1;
