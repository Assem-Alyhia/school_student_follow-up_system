// src/features/Exams/AddExamModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQueryClient } from "@tanstack/react-query";

import { getAllTeacherClassrooms } from "../../../../../api/Teacher/Classrooms/getAllTeacherClassrooms";
import { getTeacherSubjects } from "../../../../../api/Teacher/Subjects/getTeacherSubjects";
import { getTeacherExamTypes } from "../../../../../api/Teacher/Exam/getTeacherExamTypes";
import { createTeacherExam } from "../../../../../api/Teacher/Exam/ExamList/createTeacherExam";

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
    { label: "الفصل الثالث", value: "term 3" },
];

// من "YYYY-MM-DDTHH:mm" إلى "YYYY-MM-DD HH:mm:ss"
const toApiDateTime = (v) => {
    if (!v) return "";
    if (v.includes("T")) {
        const [d, t] = v.split("T");
        const time = t.length === 5 ? `${t}:00` : t;
        return `${d} ${time}`;
    }
    return `${v} 00:00:00`;
};

// قيم ابتدائية للموديل
const INITIAL_VALUES = {
    classroom_id: "",
    subject_id: "",
    exam_type_id: "",
    term: "",
    start_time: "",
    end_time: "",
    max_score: "",
    weight: "",
};

export default function AddExamModal({
    open,
    onClose,
    onCreated,
    title = "إضافة امتحان",
}) {
    const [values, setValues] = useState(INITIAL_VALUES);
    const [loadingLists, setLoadingLists] = useState(true);
    const [saving, setSaving] = useState(false);

    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [examTypes, setExamTypes] = useState([]);

    const queryClient = useQueryClient();

    // عند كل فتح: صفّر الحقول ثم حمّل القوائم
    useEffect(() => {
        if (!open) return;
        setValues(INITIAL_VALUES);
        let alive = true;
        (async () => {
            try {
                setLoadingLists(true);
                const [cls, subs, types] = await Promise.all([
                    getAllTeacherClassrooms(),
                    getTeacherSubjects(),
                    getTeacherExamTypes(),
                ]);
                if (!alive) return;
                setClassrooms(Array.isArray(cls?.data) ? cls.data : (Array.isArray(cls) ? cls : []));
                setSubjects(Array.isArray(subs?.data) ? subs.data : (Array.isArray(subs) ? subs : []));
                setExamTypes(Array.isArray(types?.data) ? types.data : (Array.isArray(types) ? types : []));
            } finally {
                if (alive) setLoadingLists(false);
            }
        })();
        return () => { alive = false; };
    }, [open]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const canSubmit = useMemo(() => {
        return (
            values.classroom_id &&
            values.subject_id &&
            values.exam_type_id &&
            values.term &&
            values.start_time &&
            values.end_time &&
            values.max_score !== "" &&
            values.weight !== "" &&
            !Number.isNaN(Number(values.max_score)) &&
            !Number.isNaN(Number(values.weight))
        );
    }, [values]);

    const handleClose = () => {
        setValues(INITIAL_VALUES);
        onClose?.();
    };

    const handleSave = async () => {
        const payload = {
            classroom_id: Number(values.classroom_id),
            subject_id: Number(values.subject_id),
            exam_type_id: Number(values.exam_type_id),
            term: values.term,
            start_time: toApiDateTime(values.start_time),
            end_time: toApiDateTime(values.end_time),
            max_score: Number(values.max_score),
            weight: Number(values.weight),
        };
        try {
            setSaving(true);
            const created = await createTeacherExam(payload);

            await queryClient.invalidateQueries({ queryKey: ["teacher-exams"] });

            setValues(INITIAL_VALUES);
            onCreated?.(created);
            handleClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { direction: "rtl", borderRadius: 4 } }}
        >
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton
                    onClick={handleClose}
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
                {loadingLists ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2.25} alignItems="center">
                        <Grid item {...labelCols}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.classroom_id}
                                    onChange={change("classroom_id")}
                                    displayEmpty
                                    disabled={saving}
                                >
                                    <MenuItem value="" disabled>اختر الشعبة</MenuItem>
                                    {classrooms.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name || `شعبة #${c.id}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>المادة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.subject_id}
                                    onChange={change("subject_id")}
                                    displayEmpty
                                    disabled={saving}
                                >
                                    <MenuItem value="" disabled>اختر المادة</MenuItem>
                                    {subjects.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>{s.name || `مادة #${s.id}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>نوع الامتحان</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.exam_type_id}
                                    onChange={change("exam_type_id")}
                                    displayEmpty
                                    disabled={saving}
                                >
                                    <MenuItem value="" disabled>اختر النوع</MenuItem>
                                    {examTypes.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>{t.name || `نوع #${t.id}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

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

                        <Grid item {...labelCols}><Typography sx={labelSx}>وقت البداية</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="datetime-local"
                                value={values.start_time}
                                onChange={change("start_time")}
                                fullWidth
                                sx={fieldSx}
                                disabled={saving}
                                placeholder="YYYY-MM-DDTHH:mm"
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>وقت النهاية</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="datetime-local"
                                value={values.end_time}
                                onChange={change("end_time")}
                                fullWidth
                                sx={fieldSx}
                                disabled={saving}
                                placeholder="YYYY-MM-DDTHH:mm"
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>العلامة الكاملة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="number"
                                value={values.max_score}
                                onChange={change("max_score")}
                                fullWidth
                                sx={fieldSx}
                                inputProps={{ min: 0, step: 1 }}
                                placeholder="مثال: 100"
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>الوزن</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="number"
                                value={values.weight}
                                onChange={change("weight")}
                                fullWidth
                                sx={fieldSx}
                                inputProps={{ min: 0, step: 1 }}
                                placeholder="مثال: 10"
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} />
                        <Grid item {...labelCols} />
                        <Grid item {...longFieldCols} />
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || saving || loadingLists}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
                <Button onClick={handleClose} disabled={saving} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, py: 1 }}>
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
