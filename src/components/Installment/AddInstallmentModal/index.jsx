// src/components/Admin/SchoolFees/AddSchoolFeeModal.jsx

import React, { useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, Autocomplete, Checkbox, FormControlLabel
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllAcademicYears } from "../../../api/Admin/AcademicYears/getAllAcademicYears";
import { getAllLevelsPaginate } from "../../../api/Admin/Levels/getAllLevelsPaginate";
import { createSchoolFee } from "../../../api/Admin/SchoolFees/createSchoolFee";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        margin: ".7rem",
        backgroundColor: "#F9FAFB",
        "& fieldset": { borderColor: "#E5E7EB" },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": { borderColor: "#1BB5C4", borderWidth: "2px" },
    },
    "& .MuiInputBase-input": { textAlign: "right", padding: "12px 14px", direction: "rtl" },
};

// خصائص تسمية متوافقة مع RTL حتى لا تتداخل مع النص داخل الحقل
const rtlLabelProps = {
    shrink: true,
    sx: {
        right: 14,
        left: "auto",
        transformOrigin: "top right",
        // إصلاح موضع التحويل عند الانكماش
        "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
        },
    },
};

const FREQ_OPTIONS = [
    { value: "monthly", label: "شهري" },
    { value: "term", label: "فصلي" },
    { value: "yearly", label: "سنوي" },
];

const INITIAL = {
    name: "",
    amount: "",
    frequency: "monthly",
    is_required: false,
    deadline: "",
    level_id: "",
    academic_year_id: "",
};

export default function AddInstallmentModal({
    open,
    onClose,
    onCreated,
    title = "إضافة رسم دراسي",
}) {
    const [values, setValues] = useState(INITIAL);
    const [errorMsg, setErrorMsg] = useState("");
    const qc = useQueryClient();

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const yearsQ = useQuery({ queryKey: ["years:nopaginate"], queryFn: getAllAcademicYears, enabled: open, staleTime: 5 * 60 * 1000 });
    const levelsQ = useQuery({ queryKey: ["levels:paginate"], queryFn: getAllLevelsPaginate, enabled: open, staleTime: 5 * 60 * 1000 });

    const years = Array.isArray(yearsQ.data) ? yearsQ.data : yearsQ.data?.data || [];
    const levels = Array.isArray(levelsQ.data) ? levelsQ.data : levelsQ.data?.data || [];

    const canSave = useMemo(
        () =>
            values.name.trim() &&
            values.amount !== "" && Number(values.amount) > 0 &&
            values.frequency &&
            values.level_id &&
            values.academic_year_id,
        [values]
    );

    const resetAll = () => {
        setValues(INITIAL);
        setErrorMsg("");
    };

    const handleClose = () => {
        if (createMut.isPending) return;
        resetAll();
        onClose?.();
    };

    const normalizeDeadline = (v) => {
        if (!v) return null;
        const d = dayjs(v);
        return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : null;
    };

    const upsertIntoCache = (key, item) => {
        qc.setQueryData(key, (old) => {
            if (!old) return [item];
            if (Array.isArray(old?.data)) return { ...old, data: [item, ...(old.data || [])] };
            if (Array.isArray(old)) return [item, ...old];
            return old;
        });
    };

    const createMut = useMutation({
        mutationFn: async () => {
            const payload = {
                name: values.name.trim(),
                amount: Number(values.amount),
                frequency: values.frequency,
                is_required: Boolean(values.is_required),
                deadline: normalizeDeadline(values.deadline),
                level_id: Number(values.level_id),
                academic_year_id: Number(values.academic_year_id),
            };
            return createSchoolFee(payload);
        },
        onSuccess: (res) => {
            const created = res?.data ?? res;
            upsertIntoCache(["school-fees"], created);
            upsertIntoCache(["admin-school-fees"], created);
            onCreated?.(created);
            handleClose();
        },
        onError: (e) => {
            setErrorMsg(e?.response?.data?.message || e?.message || "تعذر إنشاء الرسم الدراسي.");
        },
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{ sx: { direction: "rtl", borderRadius: 4 } }}
        >
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ position: "absolute", left: 8, top: 8 }}
                    aria-label="إغلاق"
                    disabled={createMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {errorMsg && (
                    <Typography sx={{ color: "error.main", mb: 1.5, textAlign: "right" }}>
                        {errorMsg}
                    </Typography>
                )}

                <Grid container spacing={2.25} alignItems="center">
                    {/* صف 1 */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={levels}
                            loading={levelsQ.isLoading}
                            value={levels.find(l => String(l.id) === String(values.level_id)) || null}
                            onChange={(_, v) => setValues(s => ({ ...s, level_id: v?.id || "" }))}
                            getOptionLabel={(o) => o?.name || ""}
                            renderInput={(p) => (
                                <TextField
                                    {...p}
                                    label="المرحلة"
                                    sx={fieldSx}
                                    InputLabelProps={rtlLabelProps}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={years}
                            loading={yearsQ.isLoading}
                            value={years.find(y => String(y.id) === String(values.academic_year_id)) || null}
                            onChange={(_, v) => setValues(s => ({ ...s, academic_year_id: v?.id || "" }))}
                            getOptionLabel={(o) => o?.name || ""}
                            renderInput={(p) => (
                                <TextField
                                    {...p}
                                    label="السنة الدراسية"
                                    sx={fieldSx}
                                    InputLabelProps={rtlLabelProps}
                                />
                            )}
                        />
                    </Grid>

                    {/* صف 2 */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="اسم القسط"
                            value={values.name}
                            onChange={change("name")}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={rtlLabelProps}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="المبلغ"
                            value={values.amount}
                            onChange={change("amount")}
                            fullWidth
                            type="number"
                            sx={fieldSx}
                            inputProps={{ step: "0.01", min: "0" }}
                            InputLabelProps={rtlLabelProps}
                        />
                    </Grid>

                    {/* صف 3 */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={FREQ_OPTIONS}
                            value={FREQ_OPTIONS.find(f => f.value === values.frequency) || null}
                            onChange={(_, v) => setValues(s => ({ ...s, frequency: v?.value || "monthly" }))}
                            getOptionLabel={(o) => o?.label || ""}
                            renderInput={(p) => (
                                <TextField
                                    {...p}
                                    label="الدورية"
                                    sx={fieldSx}
                                    InputLabelProps={rtlLabelProps}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="آخر موعد"
                            type="datetime-local"
                            value={values.deadline ? dayjs(values.deadline).format("YYYY-MM-DDTHH:mm") : ""}
                            onChange={(e) => setValues(s => ({ ...s, deadline: e.target.value }))}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={{ ...rtlLabelProps, shrink: true }}
                            placeholder="YYYY-MM-DDTHH:mm"
                        />
                    </Grid>

                    {/* صف 4 */}
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            labelPlacement="start"
                            sx={{ mr: 1.5, ml: 1 }}
                            control={
                                <Checkbox
                                    checked={Boolean(values.is_required)}
                                    onChange={(_, c) => setValues(s => ({ ...s, is_required: c }))}
                                />
                            }
                            label="إلزامي؟"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} />
                </Grid>
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={() => createMut.mutate()}
                    disabled={!canSave || createMut.isPending}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {createMut.isPending ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={createMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
