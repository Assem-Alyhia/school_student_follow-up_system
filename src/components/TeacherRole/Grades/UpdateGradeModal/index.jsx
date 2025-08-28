// src/features/Grades/EditGradeModal.jsx
"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Autocomplete from "@mui/material/Autocomplete";

import { getAllTeacherClassrooms } from "../../../../api/Teacher/Classrooms/getAllTeacherClassrooms";
import { getTeacherStudents } from "../../../../api/Teacher/Students/getTeacherStudents";
import { getTeacherSubjects } from "../../../../api/Teacher/Subjects/getTeacherSubjects";
import { updateTeacherGrade } from "../../../../api/Teacher/Grades/updateTeacherGrade";

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
const TERM_OPTIONS = [
    { label: "الفصل الأول", value: "term 1" },
    { label: "الفصل الثاني", value: "term 2" },
];

export default function UpdateGradeModal({
    open,
    onClose,
    grade,            // الكيان المراد تعديله
    onUpdated,        // يستدعى بعد التحديث بنجاح
    title = "تعديل درجة",
}) {
    const [values, setValues] = useState({
        student_id: "",
        classroom_id: "",
        subject_id: "",
        term: "",
        final_score: "",
        note: "",
    });
    const [gradeId, setGradeId] = useState(null);

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // تحميل القوائم عند الفتح
    useEffect(() => {
        if (!open) return;
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const [stRes, clRes, sbRes] = await Promise.all([
                    getTeacherStudents(1, 1000).catch(() => ({ data: [] })),
                    getAllTeacherClassrooms().catch(() => ({ data: [] })),
                    getTeacherSubjects().catch(() => ({ data: [] })),
                ]);

                if (!alive) return;
                setStudents(Array.isArray(stRes?.data) ? stRes.data : []);
                setClasses(Array.isArray(clRes?.data) ? clRes.data : (Array.isArray(clRes) ? clRes : []));
                setSubjects(Array.isArray(sbRes?.data) ? sbRes.data : []);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [open]);

    // تعبئة القيم من الدرجة الواردة
    useEffect(() => {
        if (!open) return;
        const g = grade || {};
        setGradeId(g.id ?? null);
        setValues({
            student_id: g.student_id ?? g.student?.id ?? "",
            classroom_id: g.classroom_id ?? g.classroom?.id ?? "",
            subject_id: g.subject_id ?? g.subject?.id ?? "",
            term: g.term ?? "",
            final_score: g.final_score ?? g.final_mark ?? "",
            note: g.note ?? "",
        });
    }, [open, grade]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const canSubmit =
        gradeId &&
        values.student_id &&
        values.classroom_id &&
        values.subject_id &&
        values.term &&
        values.final_score !== "" &&
        !Number.isNaN(Number(values.final_score));

    const handleUpdate = async () => {
        const payload = {
            student_id: Number(values.student_id),
            classroom_id: Number(values.classroom_id),
            subject_id: Number(values.subject_id),
            term: values.term, // "term 1" | "term 2"
            final_score: Number(values.final_score),
            note: values.note?.trim() || "",
        };
        try {
            setSaving(true);
            const updated = await updateTeacherGrade(gradeId, payload);
            onUpdated?.(updated);
            onClose?.();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const findById = (arr, id) => arr.find((x) => String(x?.id) === String(id)) || null;

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { direction: "rtl", borderRadius: 4 } }}
        >
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ position: "absolute", left: 8, top: 8 }}
                    aria-label="إغلاق"
                    disabled={saving}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
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
                        {/* الطالب */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>الطالب</Typography></Grid>
                        <Grid item {...longFieldCols}>
                            <Autocomplete
                                options={students}
                                value={findById(students, values.student_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, student_id: v?.id || "" }))}
                                getOptionLabel={(o) => o?.name || `#${o?.id || ""}`}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="ابحث عن الطالب" sx={fieldSx} disabled={saving} />
                                )}
                            />
                        </Grid>

                        {/* الشعبة */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <Autocomplete
                                options={classes}
                                value={findById(classes, values.classroom_id)}
                                onChange={(_, v) => setValues((s) => ({ ...s, classroom_id: v?.id || "" }))}
                                getOptionLabel={(c) => c?.name || `شعبة #${c?.id || ""}`}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="اختر الشعبة" sx={fieldSx} disabled={saving} />
                                )}
                            />
                        </Grid>

                        {/* المادة */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>المادة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <Autocomplete
                                options={subjects}
                                value={findById(subjects, values.subject_id)}
                                onChange={(_, v) =>
                                    setValues((s) => ({
                                        ...s,
                                        subject_id: v?.id || "",
                                        term: v?.term && ["term 1", "term 2"].includes(v.term) ? v.term : s.term,
                                    }))
                                }
                                getOptionLabel={(s) => s?.name || `مادة #${s?.id || ""}`}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="اختر المادة" sx={fieldSx} disabled={saving} />
                                )}
                            />
                        </Grid>

                        {/* الفصل */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>الفصل</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.term}
                                    onChange={change("term")}
                                    displayEmpty
                                    disabled={saving}
                                >
                                    <MenuItem value="" disabled>اختر الفصل</MenuItem>
                                    {TERM_OPTIONS.map((t) => (
                                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* الدرجة النهائية */}
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
                                disabled={saving}
                            />
                        </Grid>

                        {/* ملاحظة */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>ملاحظة</Typography></Grid>
                        <Grid item {...longFieldCols}>
                            <TextField
                                fullWidth
                                value={values.note}
                                onChange={change("note")}
                                sx={fieldSx}
                                placeholder="اكتب ملاحظة عن الدرجة (اختياري)"
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleUpdate}
                    disabled={!canSubmit || saving}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ التحديث..." : "تحديث"}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={saving}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
