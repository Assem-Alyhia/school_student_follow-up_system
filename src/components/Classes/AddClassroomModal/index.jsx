// components/Classrooms/AddClassroomModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, Grid, IconButton,
    CircularProgress, FormControl, Select, MenuItem, FormHelperText,
    Autocomplete, Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllLevels } from "../../../api/Admin/Levels/getAllLevels";
import { createClassroom } from "../../../api/Admin/Classrooms/createClassroom";

const STATUSES = [
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
];

const defaultForm = { level_id: "", name: "", capacity: "", status: "active" };

const AddClassroomModal = ({ open, onClose, onCreated }) => {
    const queryClient = useQueryClient();

    const [form, setForm] = useState(defaultForm);
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // ===== Query: levels (only when modal open) =====
    const {
        data: levelsData,
        isLoading: levelsLoading,
        isError: levelsErr,
        error: levelsError,
    } = useQuery({
        queryKey: ["levels:all"],
        queryFn: getAllLevels,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const levels = Array.isArray(levelsData) ? levelsData : levelsData?.data || [];

    useEffect(() => {
        if (!open) return;
        setForm(defaultForm);
        setErrorMsg("");
        setFieldErrors({});
    }, [open]);

    const selectedLevel = useMemo(
        () => levels.find((l) => String(l.id) === String(form.level_id)) || null,
        [levels, form.level_id]
    );

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

    // ===== Mutation: create classroom =====
    const createMut = useMutation({
        mutationFn: createClassroom,
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
            queryClient.invalidateQueries({ queryKey: ["levels:stats"] });
            onCreated?.(created);
            onClose?.();
        },
        onError: (e) => {
            const apiMsg = e?.response?.data?.message || e?.message || "فشل في إنشاء الصف";
            const apiFields = e?.response?.data?.errors || e?.details || {};
            setErrorMsg(apiMsg);
            setFieldErrors(apiFields);
        },
    });

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        if (!isValid || createMut.isPending) return;
        setErrorMsg("");
        setFieldErrors({});

        const payload = {
            level_id: Number(form.level_id),
            name: String(form.name).trim(),
            capacity: Number(form.capacity),
            status: form.status,
        };
        createMut.mutate(payload);
    };

    const handleClose = () => {
        if (createMut.isPending) return;
        setForm(defaultForm);
        setFieldErrors({});
        setErrorMsg("");
        onClose?.();
    };

    const fieldSx = {
        bgcolor: "#F3F5F7",
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": { borderColor: "#E5E7EB" },
            "&:hover fieldset": { borderColor: "#D1D5DB" },
            "&.Mui-focused fieldset": { borderColor: "#1BB5C4", borderWidth: 2 },
        },
        "& .MuiInputBase-input": { padding: "12px 14px" },
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", px: 2 }}
        >
            <Paper
                sx={{
                    width: 820, maxWidth: "100%", borderRadius: 4, overflow: "hidden",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
                }}
            >
                <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                    <IconButton onClick={handleClose} size="small" sx={{ position: "absolute", left: 8, top: 8 }} aria-label="إغلاق">
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0C4A6E", textAlign: "right", pr: 1 }}>
                        أضف صف
                    </Typography>

                    <Divider sx={{ mt: 1.25, mx: 1.5 }} />
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
                    {levelsErr && (
                        <Typography sx={{ color: "error.main", mb: 1.5, textAlign: "right" }}>
                            تعذر تحميل المراحل: {levelsError?.message}
                        </Typography>
                    )}
                    {errorMsg ? (
                        <Typography sx={{ color: "error.main", mb: 2, textAlign: "right" }}>
                            {errorMsg}
                        </Typography>
                    ) : null}

                    <Grid container spacing={2.25} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={levels}
                                value={selectedLevel}
                                loading={levelsLoading}
                                onChange={(_, v) => setField("level_id", v?.id || "")}
                                getOptionLabel={(o) => o?.name || `#${o?.id}` || ""}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="اختر المرحلة"
                                        sx={fieldSx}
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
                                fullWidth
                                placeholder="اسم الصف"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                sx={fieldSx}
                                error={Boolean(fieldErrors?.name)}
                                helperText={fieldErrors?.name?.[0] || ""}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="السعة"
                                value={form.capacity}
                                onChange={(e) => setField("capacity", e.target.value)}
                                sx={fieldSx}
                                inputProps={{ min: 1 }}
                                error={Boolean(fieldErrors?.capacity)}
                                helperText={fieldErrors?.capacity?.[0] || ""}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={Boolean(fieldErrors?.status)}>
                                <Select
                                    value={form.status}
                                    onChange={(e) => setField("status", e.target.value)}
                                    displayEmpty
                                    sx={fieldSx}
                                >
                                    {STATUSES.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>
                                            {s.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors?.status ? (
                                    <FormHelperText>{fieldErrors.status[0]}</FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: "flex", gap: 2, justifyContent: "center", alignItems: "center",
                            mt: 3.5, mb: 3,
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            disabled={createMut.isPending}
                            sx={{
                                minWidth: 140, borderRadius: 2, py: 1,
                                borderColor: "rgba(0,0,0,0.12)", bgcolor: "#fff",
                            }}
                        >
                            تجاهل
                        </Button>

                        <Button
                            type="submit"
                            disabled={createMut.isPending || levelsLoading || !isValid}
                            variant="contained"
                            sx={{
                                minWidth: 180, borderRadius: 2, py: 1,
                                background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                                boxShadow: "none",
                                "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                            }}
                        >
                            {createMut.isPending ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "إضافة الصف"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddClassroomModal;
