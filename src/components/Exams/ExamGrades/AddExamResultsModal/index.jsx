// src/features/ExamResults/AddExamResultsModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { getAdminStudentsInClassroom } from "../../../../api/Admin/Students/getAdminStudentsInClassroom";
import { createExamResult } from "../../../../api/Admin/ExamResults/createExamResult";
import { getAllClassroomsNoPaginate } from './../../../../api/Admin/Classrooms/getAllClassroomsNoPaginate';

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
}) {
    const [classrooms, setClassrooms] = useState([]);
    const [classroomId, setClassroomId] = useState("");
    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState({});
    const [exam_id, setExamId] = useState(examId || "");

    const [loadingLists, setLoadingLists] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        let alive = true;
        (async () => {
            try {
                setLoadingLists(true);
                const cls = await getAllClassroomsNoPaginate();
                if (!alive) return;
                setClassrooms(Array.isArray(cls) ? cls : []);
            } finally {
                setLoadingLists(false);
            }
        })();
        return () => { alive = false; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        setExamId(examId || "");
        setClassroomId("");
        setStudents([]);
        setScores({});
    }, [open, examId]);

    const selectedClassroom = useMemo(
        () => classrooms.find((c) => String(c?.id) === String(classroomId)) || null,
        [classrooms, classroomId]
    );

    const fetchStudents = async (cid) => {
        if (!cid) return;
        setLoadingStudents(true);
        try {
            const list = await getAdminStudentsInClassroom(cid);
            const arr = Array.isArray(list) ? list : [];
            setStudents(arr);
            const init = {};
            arr.forEach((s) => { init[s.id] = ""; });
            setScores(init);
        } finally {
            setLoadingStudents(false);
        }
    };

    const changeScore = (id, val) => setScores((s) => ({ ...s, [id]: val }));

    const canSubmit = useMemo(() => {
        if (!exam_id || !classroomId) return false;
        const filled = Object.entries(scores).filter(([, v]) => v !== "" && !Number.isNaN(Number(v)));
        return filled.length > 0;
    }, [exam_id, classroomId, scores]);

    const handleSave = async () => {
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
        try {
            setSaving(true);
            const res = await createExamResult(payload);
            onCreated?.(res);
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
                {loadingLists ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2.25} alignItems="center">
                            {!examId && (
                                <>
                                    <Grid item {...labelCols}>
                                        <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>معرّف الامتحان</Typography>
                                    </Grid>
                                    <Grid item {...fieldCols}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={exam_id}
                                            onChange={(e) => setExamId(e.target.value)}
                                            sx={fieldSx}
                                            placeholder="أدخل معرّف الامتحان"
                                            disabled={saving}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item {...labelCols}>
                                <Typography sx={{ color: "text.secondary", fontSize: 14, pr: 1 }}>الشعبة</Typography>
                            </Grid>
                            <Grid item {...fieldCols}>
                                <Autocomplete
                                    options={classrooms}
                                    value={selectedClassroom}
                                    onChange={(_, v) => {
                                        const id = v?.id || "";
                                        setClassroomId(id);
                                        setStudents([]);
                                        setScores({});
                                        if (id) fetchStudents(id);
                                    }}
                                    getOptionLabel={(c) => c?.name || `شعبة #${c?.id || ""}`}
                                    isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="اختر الشعبة" sx={fieldSx} disabled={saving} />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            {loadingStudents ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : students.length === 0 ? (
                                <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                    {classroomId ? "لا يوجد طلاب في هذه الشعبة." : "اختر الشعبة أولاً لعرض الطلاب."}
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
                                                            disabled={saving}
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
                    disabled={!canSubmit || saving}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ النتائج"}
                </Button>
                <Button onClick={onClose} disabled={saving} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, py: 1 }}>
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
