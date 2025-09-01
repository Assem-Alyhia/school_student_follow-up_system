// src/components/Admin/SchoolFees/UpdateSchoolFeeModal.jsx
// (بديل UpdateExamTypeModal — مُكيّف للرسوم الدراسية)

import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, Autocomplete, Checkbox,
    FormControlLabel, CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllAcademicYears } from "../../../api/Admin/AcademicYears/getAllAcademicYears";
import { getAllLevelsPaginate } from "../../../api/Admin/Levels/getAllLevelsPaginate";
import { getSchoolFeeById } from "../../../api/Admin/SchoolFees/getSchoolFeeById";
import { updateSchoolFee } from "../../../api/Admin/SchoolFees/updateSchoolFee";

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

export default function UpdateInstallmentModal({
    open,
    schoolFeeId,
    onClose,
    onUpdated,
    title = "تعديل رسم دراسي",
}) {
    const qc = useQueryClient();

    const [values, setValues] = useState({
        name: "", amount: "", frequency: "monthly", is_required: false,
        deadline: "", level_id: "", academic_year_id: ""
    });
    const [errorMsg, setErrorMsg] = useState("");

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    // القوائم: سنوات دراسية + مراحل
    const yearsQ = useQuery({ queryKey: ["years:nopaginate"], queryFn: getAllAcademicYears, enabled: open, staleTime: 5 * 60 * 1000 });
    const levelsQ = useQuery({ queryKey: ["levels:paginate"], queryFn: getAllLevelsPaginate, enabled: open, staleTime: 5 * 60 * 1000 });

    // جلب الرسم المراد تعديله
    const feeQ = useQuery({
        queryKey: ["school-fee", String(schoolFeeId || "")],
        queryFn: () => getSchoolFeeById(schoolFeeId),
        enabled: open && !!schoolFeeId,
        staleTime: 60_000,
    });

    const years = Array.isArray(yearsQ.data) ? yearsQ.data : yearsQ.data?.data || [];
    const levels = Array.isArray(levelsQ.data) ? levelsQ.data : levelsQ.data?.data || [];

    // تعبئة القيم عند فتح النافذة
    useEffect(() => {
        if (!open || !feeQ.data) return;
        const raw = feeQ.data?.data ?? feeQ.data;

        setValues({
            name: raw?.name ?? "",
            amount: raw?.amount ?? "",
            frequency: raw?.frequency ?? "monthly",
            is_required: Boolean(raw?.is_required),
            // للعرض داخل input[type=datetime-local]
            deadline: raw?.deadline ? dayjs(raw.deadline).format("YYYY-MM-DDTHH:mm") : "",
            level_id: raw?.level?.id ?? raw?.level_id ?? "",
            academic_year_id: raw?.academic_year?.id ?? raw?.academic_year_id ?? "",
        });
        setErrorMsg("");
    }, [open, feeQ.data]);

    const canSave = useMemo(
        () =>
            values.name.trim() &&
            values.amount !== "" && Number(values.amount) > 0 &&
            values.frequency &&
            values.level_id &&
            values.academic_year_id,
        [values]
    );

    const handleClose = () => {
        if (updateMut.isPending) return;
        onClose?.();
    };

    const normalizeDeadline = (v) => {
        if (!v) return null;
        const d = dayjs(v);
        return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : null;
    };

    const updateMut = useMutation({
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
            return updateSchoolFee(schoolFeeId, payload);
        },
        onSuccess: async (updated) => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["school-fees"] }),
                qc.invalidateQueries({ queryKey: ["admin-school-fees"] }),
                qc.invalidateQueries({ queryKey: ["school-fee", String(schoolFeeId || "")] }),
            ]);
            onUpdated?.(updated);
            onClose?.();
        },
        onError: (e) => {
            const msg = e?.response?.data?.message || e?.message || "تعذر تحديث الرسم الدراسي.";
            setErrorMsg(msg);
        },
    });

    const anyLoading = yearsQ.isLoading || levelsQ.isLoading || feeQ.isLoading;
    const anyError = feeQ.isError;
    const firstErr = feeQ.error?.message;

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
                    disabled={updateMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {anyLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : anyError ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error" sx={{ mb: 1.5 }}>
                            {firstErr || "تعذّر تحميل بيانات الرسم"}
                        </Typography>
                        <Button variant="outlined" onClick={() => feeQ.refetch()}>
                            إعادة المحاولة
                        </Button>
                    </Box>
                ) : (
                    <>
                        {errorMsg && (
                            <Typography sx={{ color: "error.main", mb: 1.5, textAlign: "right" }}>
                                {errorMsg}
                            </Typography>
                        )}

                        <Grid container spacing={2.25} alignItems="center">
                            {/* صف 1: المرحلة / السنة الدراسية */}
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={levels}
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

                            {/* صف 2: اسم القسط / المبلغ */}
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

                            {/* صف 3: الدورية / آخر موعد */}
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
                                    value={values.deadline}
                                    onChange={(e) => setValues(s => ({ ...s, deadline: e.target.value }))}
                                    fullWidth
                                    sx={fieldSx}
                                    InputLabelProps={{ ...rtlLabelProps, shrink: true }}
                                    placeholder="YYYY-MM-DDTHH:mm"
                                />
                            </Grid>

                            {/* صف 4: إلزامي؟ */}
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
                    </>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={() => updateMut.mutate()}
                    disabled={!canSave || updateMut.isPending || anyLoading || anyError}
                    variant="contained"
                    sx={{
                        minWidth: 180,
                        borderRadius: 2,
                        py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ التعديل"}
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={updateMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
