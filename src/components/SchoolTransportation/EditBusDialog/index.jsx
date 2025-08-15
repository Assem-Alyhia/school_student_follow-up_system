// components/Buses/EditBusDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, Autocomplete, MenuItem,
    Select, InputLabel, FormControl, CircularProgress,
    Alert, Box, FormHelperText
} from "@mui/material";

import { updateBus } from "../../../api/Admin/Buses/updateBus";
import { getAllSupervisors } from "../../../api/Admin/Supervisors/getAllSupervisors";
import { getBusById } from "../../../api/Admin/Buses/getBusById";

const BUS_TYPES = [
    { value: "microbus", label: "Microbus Bus" },
    { value: "mini_bus", label: "Mini Bus" },
    { value: "medium_bus", label: "Medium Bus" },
    { value: "coach", label: "Coach" },
];
const BUS_TYPES_ALLOWED = new Set(BUS_TYPES.map(t => t.value));

const STATUSES = [
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
];

const defaultForm = {
    supervisor_id: "",
    driver_name: "",
    driver_number: "",
    capacity: "",
    bus_type: "",
    status: "active",
};

const EditBusDialog = ({ open, busId, onClose, onUpdated }) => {
    const [form, setForm] = useState(defaultForm);
    const [supervisors, setSupervisors] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const selectedSupervisor = useMemo(
        () => supervisors.find(s => String(s?.id) === String(form.supervisor_id)) || null,
        [supervisors, form.supervisor_id]
    );

    useEffect(() => {
        if (!open || !busId) return;
        const load = async () => {
            setLoadingLists(true);
            setErrorMsg("");
            setFieldErrors({});
            try {
                const [bus, supsRaw] = await Promise.all([
                    getBusById(busId),
                    getAllSupervisors(),
                ]);
                const sups = Array.isArray(supsRaw) ? supsRaw : Array.isArray(supsRaw?.data) ? supsRaw.data : [];
                setSupervisors(sups);
                setForm({
                    supervisor_id: bus?.supervisor_id ?? bus?.supervisor?.id ?? "",
                    driver_name: bus?.driver_name ?? "",
                    driver_number: bus?.driver_number ?? "",
                    capacity: bus?.capacity ?? "",
                    bus_type: bus?.bus_type ?? "",
                    status: bus?.status ?? "active",
                });
            } catch (e) {
                setErrorMsg(e?.message || "تعذر تحميل بيانات الباص");
            } finally {
                setLoadingLists(false);
            }
        };
        load();
    }, [open, busId]);

    const setField = (k, v) => {
        setFieldErrors(prev => ({ ...prev, [k]: undefined }));
        setForm((f) => ({ ...f, [k]: v }));
    };

    const isValid = useMemo(() => {
        return (
            form.supervisor_id &&
            form.driver_name.trim() &&
            String(form.capacity).trim() &&
            Number(form.capacity) > 0 &&
            form.bus_type &&
            BUS_TYPES_ALLOWED.has(form.bus_type) &&
            form.status
        );
    }, [form]);

    const handleSubmit = async () => {
        setFieldErrors({});
        setErrorMsg("");
        if (!form.bus_type || !BUS_TYPES_ALLOWED.has(form.bus_type)) {
            setFieldErrors(prev => ({ ...prev, bus_type: "يجب اختيار نوع الحافلة من القائمة." }));
            return;
        }
        if (!isValid) return;
        setSubmitting(true);
        try {
            const payload = {
                supervisor_id: Number(form.supervisor_id),
                driver_name: form.driver_name.trim(),
                driver_number: form.driver_number?.trim() || "",
                capacity: Number(form.capacity),
                bus_type: form.bus_type,
                status: form.status,
            };
            const updated = await updateBus(busId, payload);
            onUpdated?.(updated);
        } catch (e) {
            const apiErrors = e?.response?.data?.errors || {};
            if (apiErrors.bus_type?.length) {
                setFieldErrors(prev => ({ ...prev, bus_type: apiErrors.bus_type[0] }));
            }
            setErrorMsg(e?.response?.data?.message || e?.message || "فشل في تعديل بيانات الباص");
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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth dir="rtl" keepMounted>
            <DialogTitle sx={{ fontWeight: 700, color: "#308A9F" }}>
                تعديل بيانات الباص
            </DialogTitle>

            <DialogContent dividers>
                {errorMsg ? <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert> : null}

                {loadingLists ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={supervisors}
                                value={selectedSupervisor}
                                getOptionLabel={(o) => o?.name || o?.user?.name || `#${o?.id}` || ""}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                onChange={(_, v) => setField("supervisor_id", v?.id || "")}
                                disabled={submitting}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.name || option.user?.name}
                                        {option?.user?.email ? (
                                            <small style={{ color: "#888", marginRight: 6 }}>({option.user.email})</small>
                                        ) : null}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="المشرف"
                                        margin="dense"
                                        required
                                        placeholder="ابحث باسم المشرف..."
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="اسم السائق"
                                margin="dense"
                                fullWidth
                                value={form.driver_name}
                                onChange={(e) => setField("driver_name", e.target.value)}
                                required
                                disabled={submitting}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="رقم السائق"
                                margin="dense"
                                fullWidth
                                value={form.driver_number}
                                onChange={(e) => setField("driver_number", e.target.value)}
                                placeholder="مثال: +9665xxxxxxx"
                                disabled={submitting}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="السعة"
                                type="number"
                                margin="dense"
                                fullWidth
                                value={form.capacity}
                                onChange={(e) => setField("capacity", e.target.value)}
                                required
                                inputProps={{ min: 1 }}
                                disabled={submitting}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense" error={Boolean(fieldErrors.bus_type)}>
                                <InputLabel id="bus-type-label">نوع الباص</InputLabel>
                                <Select
                                    labelId="bus-type-label"
                                    label="نوع الباص"
                                    value={form.bus_type}
                                    onChange={(e) => setField("bus_type", e.target.value)}
                                    required
                                    disabled={submitting}
                                >
                                    <MenuItem value="">
                                        <em>اختر النوع</em>
                                    </MenuItem>
                                    {BUS_TYPES.map((t) => (
                                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors.bus_type ? (
                                    <FormHelperText>{fieldErrors.bus_type}</FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="status-label">الحالة</InputLabel>
                                <Select
                                    labelId="status-label"
                                    label="الحالة"
                                    value={form.status}
                                    onChange={(e) => setField("status", e.target.value)}
                                    required
                                    disabled={submitting}
                                >
                                    {STATUSES.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} variant="outlined" disabled={submitting} sx={{ ml: 3 }}>
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ backgroundColor: "#35AFBC" }}
                    disabled={!isValid || submitting || loadingLists}
                >
                    {submitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "حفظ التعديلات"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBusDialog;
