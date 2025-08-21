import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { getAllClassroomsNoPaginate } from "../../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSubjectsNoPaginate } from "../../../../api/Admin/Subjects/getAllSubjectsNoPaginate";
import { getAllExamTypesNoPaginate } from "../../../../api/Admin/examTypes/getAllExamTypesNoPaginate";
import { getAllAcademicYears } from "../../../../api/Admin/AcademicYears/getAllAcademicYears";
import { getAdminExamById } from "../../../../api/Admin/Exams/getAdminExamById";
import { updateAdminExam } from "../../../../api/Admin/Exams/updateAdminExam";

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

// "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm:ss"
const toApiDateTime = (v) => {
    if (!v) return "";
    if (v.includes("T")) {
        const [d, t] = v.split("T");
        const hhmm = t.slice(0, 5);
        return `${d} ${hhmm}:00`;
    }
    return `${v.slice(0, 10)} 00:00:00`;
};

// تحويل ISO/SQL إلى قيمة مناسبة لـ input datetime-local
const toLocalInput = (v) => {
    if (!v) return "";
    if (typeof v === "string" && v.includes(" ")) {
        // "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm"
        return v.replace(" ", "T").slice(0, 16);
    }
    try {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) {
            const pad = (n) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
    } catch { ()=> console.log()} 
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
        academic_year_id: "",
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

    const [academicYears, setAcademicYears] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [examTypes, setExamTypes] = useState([]);

    useEffect(() => {
        if (!open) return;
        let alive = true;
        (async () => {
            try {
                setLoadingLists(true);
                const [years, cls, subs, types] = await Promise.all([
                    getAllAcademicYears(),
                    getAllClassroomsNoPaginate(),
                    getAllSubjectsNoPaginate(),
                    getAllExamTypesNoPaginate(),
                ]);
                if (!alive) return;
                setAcademicYears(Array.isArray(years?.data) ? years.data : (Array.isArray(years) ? years : []));
                setClassrooms(Array.isArray(cls?.data) ? cls.data : (Array.isArray(cls) ? cls : []));
                setSubjects(Array.isArray(subs?.data) ? subs.data : (Array.isArray(subs) ? subs : []));
                setExamTypes(Array.isArray(types?.data) ? types.data : (Array.isArray(types) ? types : []));
            } finally {
                if (alive) setLoadingLists(false);
            }
        })();
        return () => { alive = false; };
    }, [open]);

    // جلب بيانات الامتحان للتعديل
    useEffect(() => {
        if (!open || !examId) return;
        let alive = true;
        (async () => {
            try {
                setLoadingExam(true);
                const res = await getAdminExamById(examId);
                const ex = res?.data ?? res ?? {};
                if (!alive) return;
                setValues({
                    academic_year_id: ex?.academic_year_id ?? ex?.academic_year?.id ?? "",
                    classroom_id: ex?.classroom_id ?? ex?.classroom?.id ?? "",
                    subject_id: ex?.subject_id ?? ex?.subject?.id ?? "",
                    exam_type_id: ex?.exam_type_id ?? ex?.exam_type?.id ?? "",
                    term: ex?.term ?? "",
                    start_time: toLocalInput(ex?.start_time),
                    end_time: toLocalInput(ex?.end_time),
                    max_score: ex?.max_score != null ? Number(ex.max_score) : "",
                    weight: ex?.weight != null ? Number(ex.weight) : "",
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
            values.academic_year_id &&
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
            academic_year_id: Number(values.academic_year_id),
            classroom_id: Number(values.classroom_id),
            subject_id: Number(values.subject_id),
            exam_type_id: Number(values.exam_type_id),
            term: values.term,
            start_time: toApiDateTime(values.start_time), // Y-m-d H:i:s
            end_time: toApiDateTime(values.end_time),     // Y-m-d H:i:s
            max_score: Number(values.max_score),
            weight: Number(values.weight),
        };
        try {
            setSaving(true);
            const updated = await updateAdminExam(examId, payload);
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
                        {/* العام الدراسي */}
                        <Grid item {...labelCols}><Typography sx={labelSx}>العام الدراسي</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.academic_year_id}
                                    onChange={change("academic_year_id")}
                                    displayEmpty
                                    disabled={saving}
                                >
                                    <MenuItem value="" disabled>اختر العام الدراسي</MenuItem>
                                    {academicYears.map((y) => (
                                        <MenuItem key={y.id} value={y.id}>{y.name || `عام #${y.id}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* الشعبة */}
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

                        {/* المادة */}
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

                        {/* نوع الامتحان */}
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

                        {/* وقت البداية */}
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

                        {/* وقت النهاية */}
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

                        {/* العلامة والوزن */}
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
