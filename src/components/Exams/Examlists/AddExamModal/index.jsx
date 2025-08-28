// src/features/Exams/AddExamModal.jsx
"use client";

import { useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllClassroomsNoPaginate } from "../../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import { getAllSubjectsNoPaginate } from "../../../../api/Admin/Subjects/getAllSubjectsNoPaginate";
import { getAllExamTypesNoPaginate } from "../../../../api/Admin/examTypes/getAllExamTypesNoPaginate";
import { getAllAcademicYears } from "../../../../api/Admin/AcademicYears/getAllAcademicYears";
import { createAdminExam } from "../../../../api/Admin/Exams/createAdminExam";
import SuccessAlert from "../../../../layout/SuccessAlert";

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

const toApiDateTime = (v) => {
    if (!v) return "";
    if (v.includes("T")) {
        const [d, t] = v.split("T");
        const hhmm = t.slice(0, 5);
        return `${d} ${hhmm}:00`;
    }
    return `${v.slice(0, 10)} 00:00:00`;
};

const INITIAL_VALUES = {
    academic_year_id: "",
    classroom_id: "",
    subject_id: "",
    exam_type_id: "",
    term: "",
    start_time: "",
    end_time: "",
    max_score: "",
    weight: "",
};

export default function AddExamModal({ open, onClose, onCreated, title = "إضافة امتحان" }) {
    const [values, setValues] = useState(INITIAL_VALUES);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const queryClient = useQueryClient();

    const pickFirstError = (resp) => {
        const errs = resp?.errors;
        if (!errs || typeof errs !== "object") return null;
        for (const key of Object.keys(errs)) {
            const v = errs[key];
            if (Array.isArray(v) && v[0]) return v[0];
        }
        return null;
    };

    // ===== Queries: القوائم =====
    const yearsQ = useQuery({
        queryKey: ["academic-years:all"],
        queryFn: getAllAcademicYears,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const classroomsQ = useQuery({
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

    const typesQ = useQuery({
        queryKey: ["exam-types:nopage"],
        queryFn: getAllExamTypesNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const academicYears = useMemo(() => {
        const raw = yearsQ.data;
        return Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    }, [yearsQ.data]);

    const classrooms = useMemo(() => {
        const raw = classroomsQ.data;
        return Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    }, [classroomsQ.data]);

    const subjects = useMemo(() => {
        const raw = subjectsQ.data;
        return Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    }, [subjectsQ.data]);

    const examTypes = useMemo(() => {
        const raw = typesQ.data;
        return Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    }, [typesQ.data]);

    const loadingLists = yearsQ.isLoading || classroomsQ.isLoading || subjectsQ.isLoading || typesQ.isLoading;
    const listsError = yearsQ.isError || classroomsQ.isError || subjectsQ.isError || typesQ.isError;
    const firstListsErrorMsg =
        yearsQ.error?.message ||
        classroomsQ.error?.message ||
        subjectsQ.error?.message ||
        typesQ.error?.message;

    // إعادة الضبط عند الإغلاق/الفتح
    const handleClose = () => {
        setValues(INITIAL_VALUES);
        setShowAlert(false);
        onClose?.();
    };

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

    // ===== Mutation: إنشاء امتحان =====
    const createMut = useMutation({
        mutationFn: async () => {
            const payload = {
                academic_year_id: Number(values.academic_year_id),
                classroom_id: Number(values.classroom_id),
                subject_id: Number(values.subject_id),
                exam_type_id: Number(values.exam_type_id),
                term: values.term,
                start_time: toApiDateTime(values.start_time),
                end_time: toApiDateTime(values.end_time),
                max_score: Number(values.max_score),
                weight: Number(values.weight),
            };
            return createAdminExam(payload);
        },
        onSuccess: async (created) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["admin-exams"] }),
                queryClient.invalidateQueries({ queryKey: ["teacher-exams"] }),
            ]);
            setAlertSeverity("success");
            setAlertMsg("تم إنشاء الامتحان بنجاح.");
            setShowAlert(true);
            setValues(INITIAL_VALUES);
            onCreated?.(created);
        },
        onError: (e) => {
            const resp = e?.response?.data;
            const fieldMsg = pickFirstError(resp);
            setAlertSeverity("error");
            setAlertMsg(fieldMsg || resp?.message || e?.message || "تعذر إنشاء الامتحان.");
            setShowAlert(true);
        },
    });

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={createMut.isPending ? undefined : handleClose}
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
                {loadingLists ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : listsError ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error" sx={{ mb: 1.5 }}>
                            {firstListsErrorMsg || "تعذر تحميل القوائم."}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            <Button variant="outlined" onClick={() => { yearsQ.refetch(); classroomsQ.refetch(); subjectsQ.refetch(); typesQ.refetch(); }}>
                                إعادة المحاولة
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Grid container spacing={2.25} alignItems="center">
                        <Grid item {...labelCols}><Typography sx={labelSx}>العام الدراسي</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.academic_year_id}
                                    onChange={change("academic_year_id")}
                                    displayEmpty
                                    disabled={createMut.isPending}
                                >
                                    <MenuItem value="" disabled>اختر العام الدراسي</MenuItem>
                                    {academicYears.map((y) => (
                                        <MenuItem key={y.id} value={y.id}>{y.name || `عام #${y.id}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item {...labelCols}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                        <Grid item {...fieldCols}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select
                                    value={values.classroom_id}
                                    onChange={change("classroom_id")}
                                    displayEmpty
                                    disabled={createMut.isPending}
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
                                    disabled={createMut.isPending}
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
                                    disabled={createMut.isPending}
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
                                    disabled={createMut.isPending}
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
                                disabled={createMut.isPending}
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
                                disabled={createMut.isPending}
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
                                disabled={createMut.isPending}
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
                                disabled={createMut.isPending}
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
                    onClick={() => createMut.mutate()}
                    disabled={!canSubmit || createMut.isPending || loadingLists || listsError}
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
                <Button onClick={handleClose} disabled={createMut.isPending} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, py: 1 }}>
                    إلغاء
                </Button>
            </Box>

            {showAlert && (
                <SuccessAlert
                    title={alertSeverity === "success" ? "تم بنجاح" : "حدث خطأ"}
                    message={alertMsg}
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </Dialog>
    );
}
