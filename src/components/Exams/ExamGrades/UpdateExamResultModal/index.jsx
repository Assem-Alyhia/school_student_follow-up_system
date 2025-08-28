// src/features/ExamResults/UpdateSingleExamResultModal.jsx
import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress, Snackbar, Alert
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { updateExamResult } from "./../../../../api/Admin/ExamResults/updateExamResult";
import { getExamResultById } from "./../../../../api/Admin/ExamResults/getExamResultById";

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
    const queryClient = useQueryClient();

    const [examId, setExamId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [studentName, setStudentName] = useState("");
    const [score, setScore] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    const hasDirect = useMemo(() => {
        return (
            examResult &&
            (examResult.exam_id !== undefined ||
                (examResult.exam && examResult.exam.id !== undefined)) &&
            (examResult.student_id !== undefined ||
                (examResult.student && examResult.student.id !== undefined))
        );
    }, [examResult]);

    // ===== Query: fetch exam result only if needed =====
    const resultQ = useQuery({
        queryKey: ["exam-result", String(examResult?.id || "")],
        queryFn: () => getExamResultById(examResult.id),
        enabled: !!open && !!examResult?.id && !hasDirect,
        staleTime: 5 * 60 * 1000,
    });

    const fetched = useMemo(() => {
        if (!resultQ.data) return null;
        const d = resultQ.data?.data ?? resultQ.data ?? {};
        return {
            examId: d.exam_id ?? d.exam?.id ?? "",
            studentId: d.student_id ?? d.student?.id ?? "",
            studentName: d.student?.name ?? "",
            score: d.score ?? d.final_score ?? "",
        };
    }, [resultQ.data]);

    useEffect(() => {
        if (!open) return;

        setErrorMsg("");
        setSuccessOpen(false);

        if (hasDirect) {
            setExamId(examResult.exam_id ?? examResult.exam?.id ?? "");
            setStudentId(examResult.student_id ?? examResult.student?.id ?? "");
            setStudentName(examResult.student?.name ?? "");
            setScore(examResult.score ?? examResult.final_score ?? "");
            return;
        }

        if (fetched) {
            setExamId(fetched.examId || "");
            setStudentId(fetched.studentId || "");
            setStudentName(fetched.studentName || "");
            setScore(fetched.score ?? "");
        } else {
            setExamId("");
            setStudentId("");
            setStudentName("");
            setScore("");
        }
    }, [open, hasDirect, examResult, fetched]);

    const canSubmit =
        examResult?.id &&
        examId !== "" &&
        studentId !== "" &&
        score !== "" &&
        !Number.isNaN(Number(score));

    // ===== Mutation: update exam result =====
    const updateMut = useMutation({
        mutationFn: async () => {
            const payload = {
                exam_id: Number(examId),
                student_id: Number(studentId),
                score: Number(score),
            };
            return updateExamResult(examResult.id, payload);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["exam-result", String(examResult?.id || "")] });
            queryClient.invalidateQueries({ queryKey: ["exam-results"] });
            queryClient.invalidateQueries({ queryKey: ["exam-results", String(examId || "")] });

            onUpdated?.(res);
            setSuccessOpen(true); 
        },
        onError: (e) => {
            const apiMsg = e?.response?.data?.message || e?.message || "فشل تعديل الدرجة";
            setErrorMsg(apiMsg);
        },
    });

    const handleSave = () => {
        setErrorMsg("");
        if (!canSubmit || updateMut.isPending) return;
        updateMut.mutate();
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        onClose?.();
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 10 };

    const anyLoading = resultQ.isLoading;

    return (
        <Dialog
            open={open}
            onClose={updateMut.isPending ? undefined : onClose}
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
                ) : resultQ.isError ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error" sx={{ mb: 1.5 }}>
                            {resultQ.error?.message || "تعذّر تحميل بيانات النتيجة"}
                        </Typography>
                        <Button variant="outlined" onClick={() => resultQ.refetch()}>
                            إعادة المحاولة
                        </Button>
                    </Box>
                ) : (
                    <>
                        {errorMsg && (
                            <Typography sx={{ color: "error.main", mb: 2, textAlign: "right" }}>
                                {errorMsg}
                            </Typography>
                        )}

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
                                    disabled={updateMut.isPending}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || updateMut.isPending || anyLoading}
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
                    onClick={onClose}
                    disabled={updateMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>

            <Snackbar
                open={successOpen}
                autoHideDuration={6000}
                onClose={handleSuccessClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSuccessClose} severity="success" variant="filled" sx={{ width: "100%" }}>
                    تم حفظ التعديلات بنجاح 🎉
                </Alert>
            </Snackbar>
        </Dialog>
    );
}
