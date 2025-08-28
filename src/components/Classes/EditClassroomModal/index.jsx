// components/Classrooms/EditClassroomModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, Grid, IconButton,
    CircularProgress, FormControl, InputLabel, Select, MenuItem,
    FormHelperText,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllLevels } from "../../../api/Admin/Levels/getAllLevels";
import { getClassroomById } from "../../../api/Admin/Classrooms/getClassroomById";
import { updateClassroom } from "../../../api/Admin/Classrooms/updateClassroom";

const STATUSES = [
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
];

const defaultForm = { level_id: "", name: "", capacity: "", status: "active" };

const EditClassroomModal = ({ open, classroomId, onClose, onUpdated }) => {
    const queryClient = useQueryClient();

    const [form, setForm] = useState(defaultForm);
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [previewSubmitting, setPreviewSubmitting] = useState(false); // لعرض دوران الزر بسرعة عند البدء

    // ===== Queries =====
    const {
        data: levelsData,
        isLoading: levelsLoading,
        isError: levelsErr,
        error: levelsError,
    } = useQuery({
        queryKey: ["levels:all"],
        queryFn: getAllLevels,
        enabled: !!open,            // لا تجلب إلا إذا كان المودال مفتوح
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: classroomData,
        isLoading: classroomLoading,
        isError: classroomErr,
        error: classroomError,
    } = useQuery({
        queryKey: ["classroom", String(classroomId)],
        queryFn: () => getClassroomById(classroomId),
        enabled: !!open && !!classroomId,
        staleTime: 5 * 60 * 1000,
    });

    const levels = Array.isArray(levelsData) ? levelsData : levelsData?.data || [];

    const selectedLevel = useMemo(
        () => levels.find((l) => String(l?.id) === String(form.level_id)) || null,
        [levels, form.level_id]
    );

    // عند فتح المودال/وصول بيانات الصف: عبّي الحقول
    useEffect(() => {
        if (!open) return;
        setErrorMsg("");
        setFieldErrors({});
        setForm(defaultForm);

        if (classroomData) {
            const cls =
                classroomData?.data?.data ??
                classroomData?.data ??
                classroomData;

            const levelId =
                cls?.level_id ??
                cls?.level?.id ??
                cls?.level?.data?.id ??
                "";

            setForm({
                level_id: levelId || "",
                name: cls?.name ?? "",
                capacity: cls?.capacity ?? "",
                status: cls?.status ?? "active",
            });
        }
    }, [open, classroomData]);

    const setField = (k, v) => {
        setFieldErrors((p) => ({ ...p, [k]: undefined }));
        setForm((f) => ({ ...f, [k]: v }));
    };

    const isValid =
        form.level_id &&
        String(form.name).trim().length > 0 &&
        String(form.capacity).trim() &&
        Number(form.capacity) > 0 &&
        form.status;

    // ===== Mutation =====
    const updateMut = useMutation({
        mutationFn: ({ id, payload }) => updateClassroom(id, payload),
        onMutate: () => setPreviewSubmitting(true),
        onSuccess: (updated) => {
            // تحديث الكاش
            queryClient.invalidateQueries({ queryKey: ["classroom", String(classroomId)] });
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
            onUpdated?.(updated);
            onClose?.();
        },
        onError: (e) => {
            const apiMsg = e?.response?.data?.message || e?.message || "فشل في تعديل الصف";
            const apiFields = e?.response?.data?.errors || e?.details || {};
            setErrorMsg(apiMsg);
            setFieldErrors(apiFields);
        },
        onSettled: () => setPreviewSubmitting(false),
    });

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        if (!isValid || updateMut.isPending) return;

        setErrorMsg("");
        setFieldErrors({});

        const payload = {
            level_id: Number(form.level_id),
            name: String(form.name).trim(),
            capacity: Number(form.capacity),
            status: form.status,
        };
        updateMut.mutate({ id: classroomId, payload });
    };

    const handleClose = () => {
        if (updateMut.isPending) return;
        setForm(defaultForm);
        setFieldErrors({});
        setErrorMsg("");
        onClose?.();
    };

    const anyLoading = levelsLoading || classroomLoading;
    const anyError = levelsErr || classroomErr;
    const firstErrorMsg = levelsError?.message || classroomError?.message;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}
        >
            <Paper sx={{ borderRadius: "14px", width: 700, p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "#1E8796" }}>
                        تعديل الصف
                    </Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>

                {anyError && (
                    <Typography sx={{ color: "red", mb: 1.5, fontSize: 14 }}>
                        تعذّر تحميل البيانات: {firstErrorMsg}
                    </Typography>
                )}
                {errorMsg && (
                    <Typography sx={{ color: "red", mb: 1.5, fontSize: 14 }}>
                        {errorMsg}
                    </Typography>
                )}

                {anyLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={levels}
                                    value={selectedLevel}
                                    loading={levelsLoading}
                                    onChange={(_, v) => setField("level_id", v?.id || "")}
                                    getOptionLabel={(o) => o?.name || (o?.id ? `#${o.id}` : "")}
                                    isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="المرحلة"
                                            placeholder="ابحث باسم المرحلة..."
                                            margin="dense"
                                            size="small"
                                            error={Boolean(fieldErrors?.level_id)}
                                            helperText={fieldErrors?.level_id?.[0] || ""}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {levelsLoading ? <CircularProgress size={18} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="اسم الصف"
                                    margin="dense"
                                    size="small"
                                    fullWidth
                                    value={form.name}
                                    onChange={(e) => setField("name", e.target.value)}
                                    error={Boolean(fieldErrors?.name)}
                                    helperText={fieldErrors?.name?.[0] || ""}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="السعة"
                                    type="number"
                                    margin="dense"
                                    size="small"
                                    fullWidth
                                    value={form.capacity}
                                    onChange={(e) => setField("capacity", e.target.value)}
                                    inputProps={{ min: 1 }}
                                    error={Boolean(fieldErrors?.capacity)}
                                    helperText={fieldErrors?.capacity?.[0] || ""}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="dense" size="small" error={Boolean(fieldErrors?.status)}>
                                    <InputLabel id="status-label">الحالة</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        label="الحالة"
                                        value={form.status}
                                        onChange={(e) => setField("status", e.target.value)}
                                    >
                                        {STATUSES.map((s) => (
                                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {fieldErrors?.status ? (
                                        <FormHelperText>{fieldErrors.status[0]}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
                            <Button
                                type="submit"
                                disabled={updateMut.isPending || levelsLoading || !isValid}
                                sx={{
                                    maxWidth: "30%",
                                    background: "linear-gradient(to right, #00C6FF, #002952)",
                                    color: "#fff",
                                    "&:hover": { opacity: 0.9 },
                                }}
                            >
                                {updateMut.isPending || previewSubmitting
                                    ? <CircularProgress size={20} sx={{ color: "#fff" }} />
                                    : "حفظ التعديلات"}
                            </Button>
                            <Button
                                onClick={handleClose}
                                disabled={updateMut.isPending}
                                sx={{ maxWidth: "30%", backgroundColor: "#f5f5f5", color: "#333", "&:hover": { backgroundColor: "#e0e0e0" } }}
                            >
                                إلغاء
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Modal>
    );
};

export default EditClassroomModal;
