// src/components/TeacherRole/ExamTypes/TypesGrid.jsx
import React, { useMemo, useEffect, useState } from "react";
import {
    Box, Paper, Grid, Card, CardContent, CardActions,
    Typography, Button, CircularProgress, Stack, Divider, IconButton, Tooltip
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ConfirmDeleteModal from "../../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../../layout/SuccessAlert";
import UpdateExamTypeModal from "../UpdateExamTypeModal";
import { getAllExamTypes } from './../../../../api/Admin/examTypes/getAllExamTypes';
import { deleteExamType } from './../../../../api/Admin/examTypes/deleteExamType';

const pickCardValues = (raw) => {
    const id = raw?.id ?? null;
    const code = raw?.code ?? (id != null ? `TYP-${id}` : "—");
    const name = raw?.name ?? "—";
    const description = raw?.description ?? "—";
    const count =
        raw?.exams_count ??
        raw?.count ??
        raw?.examsCount ??
        raw?.exams?.length ??
        0;

    return { id, code, name, description, count };
};

const Section2 = ({ page = 1, rowsPerPage = 12, onMeta, onView }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-types"],
        queryFn: getAllExamTypes,
        staleTime: 60_000,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const delMutation = useMutation({
        mutationFn: (id) => deleteExamType(id),
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-exam-types"] });
        },
    });

    const allCards = useMemo(() => {
        const list = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
                ? data
                : [];
        return list.map(pickCardValues);
    }, [data]);

    const sorted = useMemo(() => {
        const a = [...allCards];
        a.sort((x, y) => (x.name > y.name ? 1 : x.name < y.name ? -1 : 0));
        return a;
    }, [allCards]);

    const start = (page - 1) * rowsPerPage;
    const view = sorted.slice(start, start + rowsPerPage);

    useEffect(() => {
        onMeta?.({
            total: sorted.length,
            last_page: Math.max(1, Math.ceil(sorted.length / rowsPerPage)),
        });
    }, [sorted.length, rowsPerPage, onMeta]);

    const askDelete = (item) => {
        setSelectedItem(item);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedItem?.id) delMutation.mutate(selectedItem.id);
        setOpenDeleteModal(false);
    };

    const openEdit = (item) => {
        setEditId(item?.id ?? null);
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditId(null);
    };

    const afterUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ["teacher-exam-types"] });
        closeEdit();
    };

    if (isLoading)
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );

    if (isError)
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
                خطأ: {error?.message || "حدث خطأ غير متوقع"}
            </Box>
        );

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Paper elevation={0} sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        textAlign: "center",
                        background: "linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    أنواع الامتحانات
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {view.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography color="text.secondary" align="center">
                                لا توجد أنواع مسجّلة حالياً.
                            </Typography>
                        </Grid>
                    ) : (
                        view.map((item) => (
                            <Grid item key={item.code} xs={12} sm={6} md={3}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                        boxShadow: "none",
                                        transition: "all .2s ease",
                                        "&:hover": { boxShadow: 3, transform: "translateY(-3px)" },
                                        border: "2px solid transparent",
                                        backgroundImage:
                                            "linear-gradient(white, white), linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                                        backgroundOrigin: "border-box",
                                        backgroundClip: "content-box, border-box",
                                    }}
                                >
                                    {/* شريط علوي مستقل لأيقونات التعديل/الحذف */}
                                    <Box
                                        sx={{
                                            px: 1,
                                            py: 0.5,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Tooltip title="تعديل">
                                            <IconButton size="small" onClick={() => openEdit(item)}>
                                                <EditRoundedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="حذف">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => askDelete(item)}
                                                disabled={delMutation.isLoading}
                                            >
                                                <DeleteRoundedIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Divider />

                                    <CardContent>
                                        <Stack spacing={1} alignItems="center" textAlign="center">
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
                                                {item.description}
                                            </Typography>

                                            <Divider sx={{ my: 1.5, width: "100%" }} />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    background: "linear-gradient(180deg,#35AFBC,#308A9F,#22385F)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                }}
                                            >
                                                عدد الامتحانات: {item.count}
                                            </Typography>
                                        </Stack>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disableElevation
                                            onClick={() => onView?.(item)}
                                            disabled={item.count === 0}
                                            sx={{
                                                background: "#E6E6E6",
                                                color: "#233",
                                                fontWeight: 700,
                                                borderRadius: 1.5,
                                                "&:hover": { background: "#d9d9d9" },
                                            }}
                                        >
                                            عرض الامتحانات
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                        ))
                    )}
                </Grid>
            </Paper>

            {/* موديل تأكيد الحذف */}
            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف نوع الامتحان؟"
                message="سيتم حذف بيانات نوع الامتحان من النظام."
                isLoading={delMutation.isLoading}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف نوع الامتحان بنجاح!"
                    message="تمت إزالة نوع الامتحان من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <UpdateExamTypeModal
                open={editOpen}
                examTypeId={editId}
                onClose={closeEdit}
                onUpdated={afterUpdated}
                title="تعديل نوع امتحان"
            />
        </Box>
    );
};

export default Section2;
