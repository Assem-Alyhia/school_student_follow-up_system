// src/features/ExamResults/UpdateSingleExamResultModal.jsx
import { useEffect, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { updateTeacherExamResult } from "../../../../../api/Teacher/Exam/ExamResults/updateTeacherExamResult";
import { getTeacherExamResultById } from "../../../../../api/Teacher/Exam/ExamResults/getTeacherExamResultById";

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

export default function UpdateExamResultModal({
    open,
    onClose,
    onUpdated,
    title = "تعديل درجة امتحان",
    examResult, 
}) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [examId, setExamId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [studentName, setStudentName] = useState("");
    const [score, setScore] = useState("");

    // تعبئة مباشرة وبسيطة: إن كانت القيم متوفرة نستخدمها، وإلا نجلبها مرة واحدة بالـ id
    useEffect(() => {
        let alive = true;
        (async () => {
            if (!open) return;

            const hasDirect =
                examResult &&
                (examResult.exam_id !== undefined ||
                    (examResult.exam && examResult.exam.id !== undefined)) &&
                (examResult.student_id !== undefined ||
                    (examResult.student && examResult.student.id !== undefined));

            if (hasDirect) {
                setExamId(
                    examResult.exam_id ??
                    examResult.exam?.id ??
                    ""
                );
                setStudentId(
                    examResult.student_id ??
                    examResult.student?.id ??
                    ""
                );
                setStudentName(examResult.student?.name ?? "");
                setScore(
                    examResult.score ??
                    examResult.final_score ??
                    ""
                );
                return;
            }

            if (!examResult?.id) return;

            setLoading(true);
            try {
                const res = await getTeacherExamResultById(examResult.id);
                const d = res?.data ?? res ?? {};
                if (!alive) return;
                setExamId(d.exam_id ?? d.exam?.id ?? "");
                setStudentId(d.student_id ?? d.student?.id ?? "");
                setStudentName(d.student?.name ?? "");
                setScore(d.score ?? d.final_score ?? "");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [open, examResult]);

    const canSubmit =
        examResult?.id &&
        examId !== "" &&
        studentId !== "" &&
        score !== "" &&
        !Number.isNaN(Number(score));

    const handleSave = async () => {
        if (!canSubmit) return;
        try {
            setSaving(true);
            // حسب طلبك، نرسل الحقول الثلاثة بشكل مباشر
            const payload = {
                exam_id: Number(examId),
                student_id: Number(studentId),
                score: Number(score),
            };
            const res = await updateTeacherExamResult(examResult.id, payload);
            onUpdated?.(res);
            onClose?.();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 10 };

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
                        <Grid item {...labelCols}>
                            <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>
                                معرّف الامتحان
                            </Typography>
                        </Grid>
                        <Grid item {...fieldCols}>
                            <TextField fullWidth value={examId} sx={fieldSx} InputProps={{ readOnly: true }} />
                        </Grid>

                        <Grid item {...labelCols}>
                            <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>
                                الطالب
                            </Typography>
                        </Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                fullWidth
                                value={studentName ? `${studentName} — ${studentId}` : String(studentId)}
                                sx={fieldSx}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item {...labelCols}>
                            <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>
                                الدرجة
                            </Typography>
                        </Grid>
                        <Grid item {...fieldCols}>
                            <TextField
                                type="number"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                fullWidth
                                sx={fieldSx}
                                inputProps={{ min: 0, step: "any" }}
                                placeholder="أدخل الدرجة"
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || saving || loading}
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
                    {saving ? "جارٍ الحفظ..." : "حفظ التعديل"}
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
