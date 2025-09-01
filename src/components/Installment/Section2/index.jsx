// src/components/TeacherRole/Fees/Section2.jsx
import React, { useMemo, useEffect, useState } from "react";
import {
    Box, Paper, Grid, Card, CardContent, Typography, CircularProgress,
    Stack, Divider, IconButton, Tooltip
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ConfirmDeleteModal from "../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../layout/SuccessAlert";
import UpdateInstallmentModal from "../UpdateInstallmentModal";
import { getAllSchoolFees } from "../../../api/Admin/SchoolFees/getAllSchoolFees";
import { deleteSchoolFee } from "../../../api/Admin/SchoolFees/deleteSchoolFee";

const FREQ_AR = { monthly: "شهري", yearly: "سنوي", once: "مرة واحدة", term: "فصلي" };

const normalizeArabic = (str = "") =>
    String(str)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ء/g, "")
        .replace(/\s+/g, " ")
        .trim();

const pickCardValues = (raw) => ({
    id: raw?.id ?? null,
    name: raw?.name ?? "—",
    amount: raw?.amount != null ? Number(raw.amount) : null,
    frequency: raw?.frequency ?? null,
    is_required: Boolean(raw?.is_required),
    deadline: raw?.deadline ? new Date(raw.deadline) : null,
});

const Section2 = ({ page = 1, rowsPerPage = 12, onMeta, searchTerm = "" }) => {
    const qc = useQueryClient();

    const perPageToFetch = searchTerm ? Math.max(rowsPerPage, 500) : rowsPerPage;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-school-fees", page, rowsPerPage, searchTerm],
        queryFn: () =>
            getAllSchoolFees(
                searchTerm ? 1 : page,
                perPageToFetch,
                searchTerm ? { search: searchTerm } : {}
            ),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);   // ✅ جديد

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const delMutation = useMutation({
        mutationFn: (id) => deleteSchoolFee(id),
        onSuccess: () => {
            setShowDeleteSuccess(true);
            setTimeout(() => setShowDeleteSuccess(false), 2500);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["teacher-school-fees"] });
        },
    });

    const list = useMemo(() => {
        const raw = Array.isArray(data?.data) ? data.data : [];
        return raw.map(pickCardValues);
    }, [data]);

    const filtered = useMemo(() => {
        if (!searchTerm) return list;
        const q = normalizeArabic(searchTerm);
        return list.filter((it) => normalizeArabic(it.name).includes(q));
    }, [list, searchTerm]);

    const start = (page - 1) * rowsPerPage;
    const view = filtered.slice(start, start + rowsPerPage);

    useEffect(() => {
        const serverMeta = data?.meta;
        if (searchTerm) {
            const total = filtered.length;
            onMeta?.({ total, last_page: Math.max(1, Math.ceil(total / rowsPerPage)) });
        } else {
            onMeta?.({
                total: Number(serverMeta?.total) || filtered.length,
                last_page: Number(serverMeta?.last_page) || Math.max(1, Math.ceil(filtered.length / rowsPerPage)),
            });
        }
    }, [data, filtered.length, rowsPerPage, onMeta, searchTerm, page]);

    const askDelete = (item) => { setSelectedItem(item); setOpenDeleteModal(true); };
    const confirmDelete = () => {
        if (selectedItem?.id) delMutation.mutate(selectedItem.id);
        setOpenDeleteModal(false);
    };

    const openEdit = (item) => { setEditId(item?.id ?? null); setEditOpen(true); };
    const closeEdit = () => { setEditOpen(false); setEditId(null); };

    const afterUpdated = () => {
        // يتم استدعاؤها من المودال بعد نجاح التعديل
        qc.invalidateQueries({ queryKey: ["teacher-school-fees"] });
        setShowUpdateSuccess(true);               // ✅ اعرض النجاح هنا
        closeEdit();
        setTimeout(() => setShowUpdateSuccess(false), 2500);
    };

    if (isLoading) return (<Box sx={{ p: 3, textAlign: "center" }}><CircularProgress /></Box>);
    if (isError) return (<Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        خطأ: {error?.message || "حدث خطأ غير متوقع"}
    </Box>);

    const formatAmount = (v) => v == null || Number.isNaN(v) ? "—" : `${Number(v).toFixed(2)} ر.س`;
    const formatDate = (d) => !d || Number.isNaN(d.valueOf()) ? "—" : d.toLocaleDateString("ar-SA");

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 3, fontWeight: 700, textAlign: "center",
                        background: "linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}
                >
                    الرسوم الدراسية
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {view.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography color="text.secondary" align="center">
                                لا توجد رسوم مطابقة لبحثك حالياً.
                            </Typography>
                        </Grid>
                    ) : (
                        view.map((item) => (
                            <Grid item key={item.id} xs={12} sm={6} md={3}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%", borderRadius: 2, boxShadow: "none",
                                        transition: "all .2s ease",
                                        "&:hover": { boxShadow: 3, transform: "translateY(-3px)" },
                                        border: "2px solid transparent",
                                        backgroundImage:
                                            "linear-gradient(white, white), linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                                        backgroundOrigin: "border-box",
                                        backgroundClip: "content-box, border-box",
                                    }}
                                >
                                    <Box sx={{ px: 1, py: 0.5, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5 }}>
                                        <Tooltip title="تعديل">
                                            <IconButton size="small" onClick={() => openEdit(item)}>
                                                <EditRoundedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="حذف">
                                            <IconButton
                                                size="small" color="error"
                                                onClick={() => askDelete(item)}
                                                disabled={delMutation.isLoading}
                                            >
                                                <DeleteRoundedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Divider />

                                    <CardContent>
                                        <Stack spacing={1.25} alignItems="center" textAlign="center">
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 800,
                                                    background: "linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                }}
                                            >
                                                {item.name}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                المبلغ: {formatAmount(item.amount)}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                الدورية: {FREQ_AR[item.frequency] || item.frequency || "—"}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                آخر موعد: {formatDate(item.deadline)}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    background: "linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                }}
                                            >
                                                {item.is_required ? "إلزامي" : "اختياري"}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Paper>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف الرسم؟"
                message="سيتم حذف بيانات الرسم من النظام."
                isLoading={delMutation.isLoading}
            />

            {/* ✅ نجاح الحذف */}
            {showDeleteSuccess && (
                <SuccessAlert
                    title="تم حذف الرسم بنجاح!"
                    message="تمت إزالة الرسم من النظام."
                    severity="error"
                    onClose={() => setShowDeleteSuccess(false)}
                />
            )}

            {showUpdateSuccess && (
                <SuccessAlert
                    title="تم حفظ التعديلات"
                    message="تم تحديث بيانات الرسم الدراسي بنجاح."
                    severity="success"
                    onClose={() => setShowUpdateSuccess(false)}
                />
            )}

            <UpdateInstallmentModal
                open={editOpen}
                schoolFeeId={editId}
                onClose={closeEdit}
                onUpdated={afterUpdated}  
                title="تعديل رسم دراسي"
            />
        </Box>
    );
};

export default Section2;
