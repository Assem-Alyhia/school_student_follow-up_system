// components/Buses/AddBusDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, Autocomplete, MenuItem,
    Select, InputLabel, FormControl, CircularProgress,
    Alert, Box, FormHelperText
} from "@mui/material";

import { createBus } from "../../../api/Admin/Buses/createBus";
import { getAllSupervisorsNoPaginate } from "./../../../api/Admin/Supervisors/getAllSupervisorsNoPaginate";

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

const AddBusDialog = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState(defaultForm);
    const [supervisors, setSupervisors] = useState([]);

    const [loadingLists, setLoadingLists] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            setLoadingLists(true);
            setErrorMsg("");
            setFieldErrors({});
            try {
                const supRes = await getAllSupervisorsNoPaginate();
                setSupervisors(Array.isArray(supRes) ? supRes : []);
            } catch (e) {
                setErrorMsg(e?.message || "تعذر تحميل قائمة المشرفين");
            } finally {
                setLoadingLists(false);
            }
        };

        setForm(defaultForm);
        load();
    }, [open]);

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

            // مهم: خذ العنصر الجديد من السيرفر وارجعه للأب
            const newBus = await createBus(payload);
            onCreated?.(newBus);
        } catch (e) {
            const apiErrors = e?.response?.data?.errors || {};
            if (apiErrors.bus_type?.length) {
                setFieldErrors(prev => ({ ...prev, bus_type: apiErrors.bus_type[0] }));
            }
            setErrorMsg(e?.response?.data?.message || e?.message || "فشل في إضافة باص جديد");
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
                أضف باص جديد
            </DialogTitle>

            <DialogContent dividers>
                {errorMsg ? <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert> : null}

                {loadingLists ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {/* المشرف */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={supervisors}
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

                        {/* اسم السائق */}
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

                        {/* رقم السائق */}
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

                        {/* السعة */}
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

                        {/* نوع الباص */}
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

                        {/* الحالة */}
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
                    {submitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "أضف باص"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBusDialog;
