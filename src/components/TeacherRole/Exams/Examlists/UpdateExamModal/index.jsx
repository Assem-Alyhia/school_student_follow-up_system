import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { getAllTeacherClassrooms } from "../../../../../api/Teacher/Classrooms/getAllTeacherClassrooms";
import { getTeacherSubjects } from "../../../../../api/Teacher/Subjects/getTeacherSubjects";
import { getTeacherExamTypes } from "../../../../../api/Teacher/Exam/getTeacherExamTypes";
import { getTeacherExamById } from "../../../../../api/Teacher/Exam/ExamList/getTeacherExamById";
import { updateTeacherExam } from "../../../../../api/Teacher/Exam/ExamList/updateTeacherExam";

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

// datetime-local "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm:ss"
const toApiDateTime = (v) => {
    if (!v) return "";
    if (v.includes("T")) {
        const [d, t] = v.split("T");
        const time = t.length === 5 ? `${t}:00` : t;
        return `${d} ${time}`;
    }
    return `${v} 00:00:00`;
};

// يحوّل من ISO/SQL إلى قيمة مناسبة لـ datetime-local
const toLocalInput = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) {
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }
    // fallback بسيط لو كان تاريخ فقط
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v}T00:00`;
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(v)) return v.replace(" ", "T").slice(0, 16);
    return "";
};

export default function UpdateExamModal({
    open,
    examId,       
    onClose,
    onUpdated,
    title = "تعديل امتحان",
}) {
    const [values, setValues] = useState({
        classroom_id: "",
        subject_id: "",
        exam_type_id: "",
        term: "",
        start_time: "",
        end_time: "",
        max_score: "",
        weight: "",
    });

    const [loadingLists, setLoadingLists] = useState(true);
    const [loadingExam, setLoadingExam] = useState(false);
    const [saving, setSaving] = useState(false);

    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [examTypes, setExamTypes] = useState([]);

    // تحميل القوائم (مرة عند الفتح)
    useEffect(() => {
        if (!open) return;
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

    // جلب بيانات الامتحان المطلوب تعديله
    useEffect(() => {
        if (!open || !examId) return;
        let alive = true;
        (async () => {
            try {
                setLoadingExam(true);
                const res = await getTeacherExamById(examId);
                const ex = res?.data ?? res ?? {};
                if (!alive) return;
                setValues({
                    classroom_id: ex?.classroom_id ?? ex?.classroom?.id ?? "",
                    subject_id: ex?.subject_id ?? ex?.subject?.id ?? "",
                    exam_type_id: ex?.exam_type_id ?? ex?.exam_type?.id ?? "",
                    term: ex?.term ?? "",
                    start_time: toLocalInput(ex?.start_time),
                    end_time: toLocalInput(ex?.end_time),
                    max_score: ex?.max_score !== undefined && ex?.max_score !== null ? Number(ex.max_score) : "",
                    weight: ex?.weight !== undefined && ex?.weight !== null ? Number(ex.weight) : "",
                });
            } finally {
                if (alive) setLoadingExam(false);
            }
        })();
        return () => { alive = false; };
    }, [open, examId]);

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
            const updated = await updateTeacherExam(examId, payload);
            onUpdated?.(updated);
            onClose?.();
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
                {loadingLists || loadingExam ? (
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
                        <Grid item {...longFieldCols}>
                            <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
                                يتم حفظ الأوقات بصيغة <b>YYYY-MM-DD HH:mm:ss</b> حسب متطلبات الخادم.
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || saving || loadingLists || loadingExam}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ التعديل"}
                </Button>
                <Button onClick={onClose} disabled={saving} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, py: 1 }}>
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
