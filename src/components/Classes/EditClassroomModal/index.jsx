// components/Classrooms/EditClassroomModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Modal, Paper, Typography, Button, TextField, Grid, IconButton,
    CircularProgress, FormControl, InputLabel, Select, MenuItem,
    FormHelperText, Autocomplete
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getAllLevels } from "../../../api/Admin/Levels/getAllLevels";
import { getClassroomById } from "../../../api/Admin/Classrooms/getClassroomById";
import { updateClassroom } from "../../../api/Admin/Classrooms/updateClassroom";

const STATUSES = [
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
];

const defaultForm = { level_id: "", name: "", capacity: "", status: "active" };

const EditClassroomModal = ({ open, classroomId, onClose, onUpdated }) => {
    const [form, setForm] = useState(defaultForm);
    const [levels, setLevels] = useState([]);
    const [levelsLoading, setLevelsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // جلب بيانات الصف + المراحل
    useEffect(() => {
        if (!open || !classroomId) return;

        const load = async () => {
            setErrorMsg("");
            setFieldErrors({});
            setLoading(true);
            setLevelsLoading(true);

            try {
                const [lvlList, classroom] = await Promise.all([
                    getAllLevels(),
                    getClassroomById(classroomId),
                ]);
                setLevels(Array.isArray(lvlList) ? lvlList : []);

                // دعم الحالتين: level_id مباشرة أو كائن level
                const levelId =
                    classroom?.level_id ??
                    classroom?.level?.id ??
                    classroom?.level?.data?.id ?? // احتياط لو مغلف
                    "";

                setForm({
                    level_id: levelId || "",
                    name: classroom?.name ?? "",
                    capacity: classroom?.capacity ?? "",
                    status: classroom?.status ?? "active",
                });
            } catch (e) {
                setErrorMsg(e?.message || "تعذر تحميل البيانات");
            } finally {
                setLoading(false);
                setLevelsLoading(false);
            }
        };

        setForm(defaultForm);
        load();
    }, [open, classroomId]);

    // العنصر المحدد في الـ Autocomplete
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

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        if (!isValid) return;

        setSubmitting(true);
        setErrorMsg("");
        setFieldErrors({});

        try {
            const payload = {
                level_id: Number(form.level_id),
                name: String(form.name).trim(),
                capacity: Number(form.capacity),
                status: form.status,
            };
            const updated = await updateClassroom(classroomId, payload);
            onUpdated?.(updated);
            onClose?.();
        } catch (e) {
            setErrorMsg(e?.message || "فشل في تعديل الصف");
            setFieldErrors(e?.details || {});
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) return;
        setForm(defaultForm);
        setFieldErrors({});
        setErrorMsg("");
        onClose?.();
    };

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

                {errorMsg && <Typography sx={{ color: "red", mb: 2, fontSize: 14 }}>{errorMsg}</Typography>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            {/* المرحلة (Autocomplete مع اختيار المرحلة الحالية) */}
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
                                disabled={submitting || levelsLoading || !isValid}
                                sx={{
                                    maxWidth: "30%",
                                    background: "linear-gradient(to right, #00C6FF, #002952)",
                                    color: "#fff",
                                    "&:hover": { opacity: 0.9 },
                                }}
                            >
                                {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "حفظ التعديلات"}
                            </Button>
                            <Button
                                onClick={handleClose}
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
