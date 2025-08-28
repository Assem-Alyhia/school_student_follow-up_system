// src/features/Grades/EditGradeModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem, CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllSubjectsNoPaginate } from "../../../api/Admin/Subjects/getAllSubjectsNoPaginate";
import { getAllStudentsNoPaginate } from "../../../api/Admin/Students/getAllStudentsNoPaginate";
import { getAllAcademicYears } from "../../../api/Admin/AcademicYears/getAllAcademicYears";
import { getAllClassroomsNoPaginate } from "../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { updateGrade } from "../../../api/Admin/Grades/updateGrade";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        margin: ".7rem",
        backgroundColor: "#F9FAFB",
        "& fieldset": { borderColor: "#E5E7EB" },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": { borderColor: "#1BB5C4", borderWidth: "2px" },
    },
    "& .MuiInputBase-input": { textAlign: "right", padding: "12px 14px" },
};
const labelSx = { color: "text.secondary", fontSize: 14, pr: 1, textAlign: "right", whiteSpace: "nowrap" };
const TERMS = ["term 1", "term 2", "term 3"];

export default function EditGradeModal({ open, onClose, grade, title = "تعديل نتيجة" }) {
    const queryClient = useQueryClient();

    const [values, setValues] = useState({
        student_id: "",
        academic_year_id: "",
        classroom_id: "",
        subject_id: "",
        term: "",
        final_score: "",
        note: "",
    });

    useEffect(() => {
        if (!open || !grade) return;
        setValues({
            student_id: grade.student_id ?? "",
            academic_year_id: grade.academic_year_id ?? "",
            classroom_id: grade.classroom_id ?? "",
            subject_id: grade.subject_id ?? "",
            term: grade.term ?? "",
            final_score: grade.final_score ?? "",
            note: grade.note ?? "",
        });
    }, [open, grade]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const canSubmit = useMemo(() => {
        const n = Number(values.final_score);
        return (
            grade?.id &&
            values.student_id &&
            values.academic_year_id &&
            values.classroom_id &&
            values.subject_id &&
            values.term &&
            String(values.note || "").trim() !== "" &&
            !Number.isNaN(n) && n >= 0 && n <= 100
        );
    }, [values, grade?.id]);

    const studentsQ = useQuery({
        queryKey: ["students:nopage"],
        queryFn: getAllStudentsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const yearsQ = useQuery({
        queryKey: ["academic-years:all"],
        queryFn: getAllAcademicYears,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const classesQ = useQuery({
        queryKey: ["classrooms:nopage"],
        queryFn: getAllClassroomsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const subjectsQ = useQuery({
        queryKey: ["subjects:nopage"],
        queryFn: getAllSubjectsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const loading =
        studentsQ.isLoading || yearsQ.isLoading || classesQ.isLoading || subjectsQ.isLoading;

    const students = useMemo(() => {
        const raw = studentsQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [studentsQ.data]);

    const years = useMemo(() => {
        const raw = yearsQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [yearsQ.data]);

    const classes = useMemo(() => {
        const raw = classesQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [classesQ.data]);

    const subjects = useMemo(() => {
        const raw = subjectsQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [subjectsQ.data]);

    // Mutation للتعديل
    const saveMut = useMutation({
        mutationFn: async () => {
            const payload = {
                student_id: Number(values.student_id),
                academic_year_id: Number(values.academic_year_id),
                classroom_id: Number(values.classroom_id),
                subject_id: Number(values.subject_id),
                term: values.term,
                final_score: Number(values.final_score),
                note: String(values.note || "").trim(),
            };
            return updateGrade(grade.id, payload);
        },
        onSuccess: () => {
            // تحديث الكاش
            queryClient.invalidateQueries({ queryKey: ["grades"] });
            queryClient.invalidateQueries({ queryKey: ["grades", String(values.student_id || "")] });
            queryClient.invalidateQueries({ queryKey: ["grade", String(grade.id)] });
            onClose?.();
        },
    });

    const getById = (arr, id) => arr.find((x) => String(x?.id) === String(id)) || null;

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={saveMut.isPending ? undefined : onClose}
            fullWidth
            maxWidth="md"
            keepMounted
            PaperProps={{ sx: { direction: "rtl", borderRadius: 4, overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.18)" } }}
        >
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ position: "absolute", left: 8, top: 8 }}
                    aria-label="إغلاق"
                    disabled={saveMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0C4A6E", textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2.25} alignItems="center">
                        <Grid item {...labelCols}><Typography sx={labelSx}>الطالب</Typography></Grid>
                        <Grid item {...longFieldCols}>
                            <Autocomplete
                                options={students}
                                value={getById(students, values.student_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, student_id: v?.id || "" }))}
                                getOptionLabel={(o) => (o?.name ?? o?.full_name ?? o?.title ?? `#${o?.id}`)}
                                isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="ابحث عن الطالب" sx={fieldSx} disabled={saveMut.isPending} />
                                )}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>السنة الأكاديمية</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <Autocomplete
                                options={years}
                                value={getById(years, values.academic_year_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, academic_year_id: v?.id || "" }))}
                                getOptionLabel={(y) =>
                                    (y?.name ?? y?.title ?? y?.label ?? `${y?.start_year ?? ""}${y?.end_year ? ` / ${y.end_year}` : ""}`) || `سنة #${y?.id}`
                                }
                                isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="اختر السنة الأكاديمية" sx={fieldSx} disabled={saveMut.isPending} />
                                )}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <Autocomplete
                                options={classes}
                                value={getById(classes, values.classroom_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, classroom_id: v?.id || "" }))}
                                getOptionLabel={(c) => (c?.name ?? c?.title ?? c?.label ?? `شعبة #${c?.id}`)}
                                isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="اختر الشعبة" sx={fieldSx} disabled={saveMut.isPending} />
                                )}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>المادة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <Autocomplete
                                options={subjects}
                                value={getById(subjects, values.subject_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, subject_id: v?.id || "" }))}
                                getOptionLabel={(s) => (s?.name ?? s?.title ?? s?.label ?? `مادة #${s?.id}`)}
                                isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="اختر المادة" sx={fieldSx} disabled={saveMut.isPending} />
                                )}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>الترم</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.term}
                                    onChange={change("term")}
                                    displayEmpty
                                    disabled={saveMut.isPending}
                                >
                                    <MenuItem value="" disabled>اختر الترم</MenuItem>
                                    {TERMS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>الدرجة النهائية</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="number"
                                value={values.final_score}
                                onChange={change("final_score")}
                                fullWidth
                                sx={fieldSx}
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                placeholder="0 - 100"
                                disabled={saveMut.isPending}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>ملاحظة</Typography></Grid>
                        <Grid item {...longFieldCols}>
                            <TextField
                                fullWidth
                                value={values.note}
                                onChange={change("note")}
                                sx={fieldSx}
                                placeholder="اكتب ملاحظة عن النتيجة"
                                disabled={saveMut.isPending}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={() => saveMut.mutate()}
                    disabled={!canSubmit || saveMut.isPending}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saveMut.isPending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={saveMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1, borderColor: "rgba(0,0,0,0.12)", bgcolor: "#fff" }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
