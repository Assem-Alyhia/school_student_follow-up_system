// pages/financials/Section2.jsx
import React, { useMemo, useState } from "react";
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Chip, Button, CircularProgress,
    Menu, MenuItem, ListItemIcon, ListItemText
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import PaymentDetails from "../PaymentDetails";
import EditPaymentModal from "../EditPaymentModal";

const FREQ_AR = { monthly: "شهري", yearly: "سنوي", weekly: "أسبوعي", once: "مرة" };
const STATUS_AR = { pending: "غير مدفوع", completed: "مدفوع", partial: "مدفوع جزئياً" };

export default function Section2({ financials = [] }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("id");

    const [openView, setOpenView] = useState(false);
    const [viewRow, setViewRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const [actionsAnchor, setActionsAnchor] = useState(null);
    const [actionsRow, setActionsRow] = useState(null);
    const openActions = Boolean(actionsAnchor);
    const handleOpenActions = (e, row) => { setActionsAnchor(e.currentTarget); setActionsRow(row); };
    const handleCloseActions = () => { setActionsAnchor(null); setActionsRow(null); };

    const rows = Array.isArray(financials) ? financials : [];

    const getVal = (row, key) => {
        switch (key) {
            case "parent_name": return row?.parent?.name ?? "";
            case "student_name": return row?.student?.name ?? "";
            default: return row?.[key];
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sorted = useMemo(() => {
        const arr = [...rows];
        return arr.sort((a, b) => {
            const av = getVal(a, orderBy);
            const bv = getVal(b, orderBy);

            const aNum = typeof av === "number" || /^\d+(\.\d+)?$/.test(String(av ?? ""));
            const bNum = typeof bv === "number" || /^\d+(\.\d+)?$/.test(String(bv ?? ""));

            if (aNum && bNum) {
                const aVal = Number(av); const bVal = Number(bv);
                if (aVal > bVal) return order === "asc" ? 1 : -1;
                if (aVal < bVal) return order === "asc" ? -1 : 1;
                return 0;
            }
            const aStr = String(av ?? "");
            const bStr = String(bv ?? "");
            if (aStr > bStr) return order === "asc" ? 1 : -1;
            if (aStr < bStr) return order === "asc" ? -1 : 1;
            return 0;
        });
    }, [rows, order, orderBy]);

    const headerCell = (key, label) => (
        <TableCell align="center" sx={{ px: 1.5 }}>
            <TableSortLabel
                active={orderBy === key}
                direction={orderBy === key ? order : "asc"}
                onClick={() => handleRequestSort(key)}
                sx={{
                    fontWeight: 800, color: "#fff",
                    "&.Mui-active": { color: "#fff" }, "& .MuiTableSortLabel-icon": { color: "#fff !important" }
                }}
            >
                {label}
                {orderBy === key && (
                    <Box component="span" sx={visuallyHidden}>
                        {order === "desc" ? "ترتيب تنازلي" : "ترتيب تصاعدي"}
                    </Box>
                )}
            </TableSortLabel>
        </TableCell>
    );

    const isLoading = false;
    const isError = false;
    const error = null;

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <TableContainer component={Paper} sx={{ direction: "rtl", borderRadius: 3, overflow: "hidden" }}>
                    <Table
                        aria-label="جدول المدفوعات"
                        sx={{
                            minWidth: 980,
                            "& td, & th": { textAlign: "center" }, // توسيط كل الخلايا
                            "& thead th": { fontWeight: 800, color: "#fff" },
                        }}
                    >
                        <TableHead sx={{ background: "linear-gradient(90deg,#35AFBC,#308A9F)" }}>
                            <TableRow>
                                {headerCell("id", "المعرّف")}
                                {headerCell("parent_name", "وليّ الأمر")}
                                {headerCell("student_name", "الطالب")}
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>الصف</TableCell>
                                {/* تمت إزالة عمود المرحلة */}
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>السنة</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>اسم الرسم</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>الدورية</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>$ المبلغ</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>المَدفوع</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>المتبقي</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>الموعد النهائي</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>الحالة</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#fff" }}>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={13} align="center" sx={{ py: 6 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={13} align="center" sx={{ py: 3, color: "error.main", fontWeight: 700 }}>
                                        خطأ: {error?.message || "تعذر جلب البيانات"}
                                    </TableCell>
                                </TableRow>
                            ) : sorted.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={13} align="center" sx={{ py: 3, color: "text.secondary" }}>
                                        لا توجد بيانات
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sorted.map((r) => {
                                    const parentName = r?.parent?.name ?? "—";
                                    const studentName = r?.student?.name ?? "—";

                                    const classroom = r?.student?.classroom;
                                    const className = classroom?.name ?? "—";
                                    const year = new Date(r?.paid_at || r?.student?.created_at || Date.now()).getFullYear();
                                    const fee = r?.schoolFee;
                                    const freqAr = FREQ_AR[fee?.frequency] || "—";
                                    const fullAmt = fee?.amount ?? "—";
                                    const paid = r?.amount ?? "—";
                                    const remain = r?.remaining_amount ?? "—";
                                    const deadline = fee?.deadline ? new Date(fee.deadline).toLocaleDateString("ar-EG") : "—";
                                    const statusKey = r?.status ?? "pending";
                                    const statusAr = STATUS_AR[statusKey] || statusKey;

                                    const chipStyle =
                                        statusKey === "completed"
                                            ? { color: "#0E7D5A", bgcolor: "rgba(14,125,90,.10)" }
                                            : statusKey === "pending"
                                                ? { color: "#C62828", bgcolor: "rgba(198,40,40,.10)" }
                                                : { color: "#8a6d00", bgcolor: "rgba(255,193,7,.18)" };

                                    return (
                                        <TableRow
                                            key={r.id}
                                            sx={{
                                                "&:nth-of-type(odd)": { bgcolor: "rgba(0,0,0,0.015)" },
                                                "&:hover": { bgcolor: "rgba(53,175,188,.08)" },
                                                transition: "background-color .15s ease-in-out",
                                            }}
                                        >
                                            <TableCell>{r.id}</TableCell>
                                            <TableCell>{parentName}</TableCell>
                                            <TableCell>{studentName}</TableCell>
                                            <TableCell>{className}</TableCell>
                                            {/* المرحلة محذوفة */}
                                            <TableCell>{year}</TableCell>
                                            <TableCell>{fee?.name ?? "—"}</TableCell>
                                            <TableCell>{freqAr}</TableCell>
                                            <TableCell>{fullAmt}</TableCell>
                                            <TableCell>{paid}</TableCell>
                                            <TableCell>{remain}</TableCell>
                                            <TableCell>{deadline}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={statusAr} sx={{ fontWeight: 700, ...chipStyle }} />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    endIcon={<MoreVertIcon />}
                                                    onClick={(e) => handleOpenActions(e, r)}
                                                    sx={{
                                                        borderColor: "#35AFBC",
                                                        color: "#35AFBC",
                                                        "&:hover": { borderColor: "#2a8a89", color: "#2a8a89", bgcolor: "rgba(53,175,188,.08)" },
                                                    }}
                                                >
                                                    الإجراءات
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={actionsAnchor}
                open={openActions}
                onClose={handleCloseActions}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
                <MenuItem
                    onClick={() => {
                        setEditRow(actionsRow);
                        setOpenEdit(true);
                        handleCloseActions();
                    }}
                >
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>تعديل الدفع</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        setViewRow(actionsRow);
                        setOpenView(true);
                        handleCloseActions();
                    }}
                >
                    <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>العرض</ListItemText>
                </MenuItem>
            </Menu>

            <PaymentDetails open={openView} onClose={() => setOpenView(false)} payment={viewRow} />
            <EditPaymentModal open={openEdit} onClose={() => setOpenEdit(false)} initialData={editRow} />
        </Box>
    );
}
