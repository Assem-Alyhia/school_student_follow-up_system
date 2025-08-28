// src/features/ExamResults/AddExamResultsModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Snackbar, Alert
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAdminStudentsInClassroom } from "../../../../api/Admin/Students/getAdminStudentsInClassroom";
import { createExamResult } from "../../../../api/Admin/ExamResults/createExamResult";
import { getAllClassroomsNoPaginate } from "./../../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";

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

export default function AddExamResultsModal({
    open,
    onClose,
    onCreated,
    title = "إضافة درجات امتحان",
    examId,
    subjectName,
}) {
    const queryClient = useQueryClient();

    const [classroomId, setClassroomId] = useState("");
    const [scores, setScores] = useState({});
    const [exam_id, setExamId] = useState(examId || "");
    const [errorMsg, setErrorMsg] = useState("");

    const [successOpen, setSuccessOpen] = useState(false);

    // ===== Q: classrooms (no paginate) =====
    const classroomsQ = useQuery({
        queryKey: ["classrooms:nopage"],
        queryFn: getAllClassroomsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const classrooms = useMemo(() => {
        const raw = classroomsQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [classroomsQ.data]);

    // ===== Q: students in classroom (depends on classroomId) =====
    const studentsQ = useQuery({
        queryKey: ["classroom:students", String(classroomId || "")],
        queryFn: () => getAdminStudentsInClassroom(classroomId),
        enabled: !!open && !!classroomId,
        staleTime: 60 * 1000,
        onSuccess: (arr) => {
            const list = Array.isArray(arr) ? arr : [];
            const init = {};
            list.forEach((s) => { init[s.id] = ""; });
            setScores(init);
        },
    });

    const students = useMemo(() => {
        const raw = studentsQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [studentsQ.data]);

    useEffect(() => {
        if (!open) return;
        setErrorMsg("");
        setExamId(examId || "");
        setClassroomId("");
        setScores({});
        setSuccessOpen(false);
    }, [open, examId]);

    const selectedClassroom = useMemo(
        () => classrooms.find((c) => String(c?.id) === String(classroomId)) || null,
        [classrooms, classroomId]
    );

    const changeScore = (id, val) => setScores((s) => ({ ...s, [id]: val }));

    const canSubmit = useMemo(() => {
        if (!exam_id || !classroomId) return false;
        const filled = Object.entries(scores).filter(([, v]) => v !== "" && !Number.isNaN(Number(v)));
        return filled.length > 0;
    }, [exam_id, classroomId, scores]);

    // ===== M: create exam results =====
    const saveMut = useMutation({
        mutationFn: async () => {
            const student_ids = [];
            const scoresArr = [];
            students.forEach((st) => {
                const v = scores[st.id];
                if (v !== "" && !Number.isNaN(Number(v))) {
                    student_ids.push(st.id);
                    scoresArr.push(Number(v));
                }
            });
            const payload = {
                exam_id: Number(exam_id),
                student_ids,
                scores: scoresArr,
            };
            return createExamResult(payload);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["exam-results"] });
            queryClient.invalidateQueries({ queryKey: ["exam-results", String(exam_id)] });
            queryClient.invalidateQueries({ queryKey: ["classroom:students", String(classroomId)] });
            onCreated?.(res);
            // عرض إشعار نجاح طويل بدلاً من الإغلاق الفوري
            setSuccessOpen(true);
        },
        onError: (e) => {
            const apiMsg = e?.response?.data?.message || e?.message || "فشل حفظ النتائج";
            setErrorMsg(apiMsg);
        },
    });

    const handleSave = () => {
        setErrorMsg("");
        if (!canSubmit || saveMut.isPending) return;
        saveMut.mutate();
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        onClose?.();
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={saveMut.isPending ? undefined : onClose}
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
                    disabled={saveMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>

                {/* المادة + الشعبة */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        pt: 0.75,
                        pb: 0.25,
                    }}
                >
                    <Typography sx={{ color: "#308A9F", fontWeight: 600 }}>
                        المادة: <span style={{ color: "#22385F" }}>{subjectName || "—"}</span>
                    </Typography>
                    <Typography sx={{ color: "#308A9F", fontWeight: 600 }}>
                        الشعبة: <span style={{ color: "#22385F" }}>{selectedClassroom?.name || "—"}</span>
                    </Typography>
                </Box>

                <Divider sx={{ mt: 1, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {classroomsQ.isLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : classroomsQ.isError ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error" sx={{ mb: 1.5 }}>
                            {classroomsQ.error?.message || "تعذّر تحميل الشعب"}
                        </Typography>
                        <Button variant="outlined" onClick={() => classroomsQ.refetch()}>
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
                            {!examId && (
                                <>
                                    <Grid item {...labelCols}>
                                        <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>
                                            معرّف الامتحان
                                        </Typography>
                                    </Grid>
                                    <Grid item {...fieldCols}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={exam_id}
                                            onChange={(e) => setExamId(e.target.value)}
                                            sx={fieldSx}
                                            placeholder="أدخل معرّف الامتحان"
                                            disabled={saveMut.isPending}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item {...labelCols}>
                                <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>
                                    الشعبة
                                </Typography>
                            </Grid>
                            <Grid item {...fieldCols}>
                                <Autocomplete
                                    options={classrooms}
                                    value={selectedClassroom}
                                    onChange={(_, v) => {
                                        const id = v?.id || "";
                                        setErrorMsg("");
                                        setClassroomId(id);
                                        setScores({});
                                    }}
                                    getOptionLabel={(c) => c?.name || `شعبة #${c?.id || ""}`}
                                    isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="اختر الشعبة"
                                            sx={fieldSx}
                                            disabled={saveMut.isPending}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            {(!classroomId && !studentsQ.isLoading) ? (
                                <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                    اختر الشعبة أولاً لعرض الطلاب.
                                </Typography>
                            ) : studentsQ.isLoading ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : studentsQ.isError ? (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                    <Typography color="error" sx={{ mb: 1.5 }}>
                                        {studentsQ.error?.message || "تعذّر تحميل الطلاب"}
                                    </Typography>
                                    <Button variant="outlined" onClick={() => studentsQ.refetch()}>
                                        إعادة المحاولة
                                    </Button>
                                </Box>
                            ) : students.length === 0 ? (
                                <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                    لا يوجد طلاب في هذه الشعبة.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                                    <Table sx={{ "& th, & td": { textAlign: "center", verticalAlign: "middle" } }}>
                                        <TableHead>
                                            <TableRow sx={{ background: "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)" }}>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>رقم الطالب</TableCell>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>اسم الطالب</TableCell>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>الدرجة</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {students.map((st) => (
                                                <TableRow key={st.id} hover>
                                                    <TableCell>{st.prefix || `ST-${st.id}`}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 600, color: "#22385F" }}>
                                                            {st.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={scores[st.id] ?? ""}
                                                            onChange={(e) => changeScore(st.id, e.target.value)}
                                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                                            inputProps={{ min: 0, step: "any" }}
                                                            placeholder="أدخل الدرجة"
                                                            disabled={saveMut.isPending}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    </>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || saveMut.isPending}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saveMut.isPending ? "جارٍ الحفظ..." : "حفظ النتائج"}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={saveMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>

            <Snackbar
                open={successOpen}
                autoHideDuration={8000}
                onClose={handleSuccessClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSuccessClose} severity="success" variant="filled" sx={{ width: "100%" }}>
                    تم حفظ النتائج بنجاح 🎉
                </Alert>
            </Snackbar>
        </Dialog>
    );
}
