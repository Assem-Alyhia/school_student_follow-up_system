import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Button,
    Chip,
    InputBase,
    IconButton,
    Divider,
    Stack,
    TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeacherStudentById } from "../../../../api/Teacher/Students/getTeacherStudentById";
import { getTeacherComments } from "../../../../api/Teacher/Comments/getTeacherComments";
import { createTeacherComment } from "../../../../api/Teacher/Comments/createTeacherComment";
import { updateTeacherComment } from "../../../../api/Teacher/Comments/updateTeacherComment";
import { deleteTeacherComment } from "../../../../api/Teacher/Comments/deleteTeacherComment";

const gradientColor = "linear-gradient(90deg, #35AFBC, #308A9F, #22385F)";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

const fmtDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d) ? "—" : d.toLocaleDateString("ar-EG");
};

const CommentRow = ({ c, onEdit, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [note, setNote] = useState(c.note || "");
    const disabled = c.__optimistic || !isNum(c.id);
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                opacity: c.__optimistic ? 0.7 : 1,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip
                        size="small"
                        label="—"
                        sx={{ bgcolor: "#eef2ff", color: "#3730a3", borderRadius: 1 }}
                    />
                    <Chip
                        size="small"
                        label="المعلم"
                        sx={{ bgcolor: "#e0f2f1", color: "#00695c", borderRadius: 1 }}
                    />
                </Box>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                >
                    <Typography sx={{ color: "#308A9F", fontWeight: 700 }}>
                        {c.user?.name || "—"}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {!editing ? (
                            <>
                                <span>
                                    <IconButton
                                        size="small"
                                        onClick={() => setEditing(true)}
                                        disabled={disabled}
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                                <span>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(c.id)}
                                        disabled={disabled}
                                    >
                                        <DeleteOutlineOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                        onEdit(c.id, note);
                                        setEditing(false);
                                    }}
                                >
                                    <SaveOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setNote(c.note || "");
                                        setEditing(false);
                                    }}
                                >
                                    <CloseOutlinedIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </Stack>
                </Stack>

                {!editing ? (
                    <Typography sx={{ color: "#374151", lineHeight: 1.9, mb: 1 }}>
                        {c.note}
                    </Typography>
                ) : (
                    <TextField
                        fullWidth
                        size="small"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                )}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        color: "text.secondary",
                    }}
                >
                    <Typography variant="caption">
                        {fmtDate(c.created_at || c.updated_at)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ThumbUpOffAltOutlinedIcon fontSize="small" />
                        <Typography variant="caption">أعجبني</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                        <Typography variant="caption">رد</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ReplyOutlinedIcon fontSize="small" />
                        <Typography variant="caption">رد</Typography>
                    </Box>
                </Box>
            </Box>

            <Avatar
                src={c.user?.image || "/Students/default.jpg"}
                sx={{ width: 54, height: 54, borderRadius: 2 }}
            />
        </Paper>
    );
};

const TStudentDetails = () => {
    const { id } = useParams();
    const studentId = Number(id);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    const qc = useQueryClient();
    const commentsKey = useMemo(
        () => ["teacher", "comments", { studentId }],
        [studentId]
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!studentId) return;
                setLoading(true);
                const res = await getTeacherStudentById(studentId);
                if (mounted) setStudentData(res?.data ?? null);
            } catch {
                if (mounted) setStudentData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [studentId]);

    const { data: commentsData, isLoading: loadingComments } = useQuery({
        queryKey: commentsKey,
        queryFn: () => getTeacherComments({ student_id: studentId }),
        enabled: Number.isFinite(studentId),
    });

    const createMut = useMutation({
        mutationFn: (note) => createTeacherComment({ student_id: studentId, note }),
        onMutate: async (note) => {
            await qc.cancelQueries({ queryKey: commentsKey });
            const prev = qc.getQueryData(commentsKey);
            const tmpId = `tmp-${Date.now()}`;
            const optimistic = {
                id: tmpId,
                __optimistic: true,
                note,
                created_at: new Date().toISOString(),
                user: { name: "المعلم", image: "" },
            };
            qc.setQueryData(commentsKey, (old) => ({
                ...(old || {}),
                data: [optimistic, ...(old?.data || [])],
            }));
            return { prev, tmpId };
        },
        onSuccess: (res, _v, ctx) => {
            const serverItem = res?.data;
            if (!serverItem || !ctx?.tmpId) return;
            qc.setQueryData(commentsKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).map((c) => (c.id === ctx.tmpId ? serverItem : c)),
            }));
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(commentsKey, ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: commentsKey }),
    });

    const updateMut = useMutation({
        mutationFn: ({ id, note }) =>
            updateTeacherComment(Number(id), { student_id: studentId, note }),
        onMutate: async ({ id, note }) => {
            if (!isNum(id)) return;
            await qc.cancelQueries({ queryKey: commentsKey });
            const prev = qc.getQueryData(commentsKey);
            qc.setQueryData(commentsKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).map((c) => (c.id === id ? { ...c, note } : c)),
            }));
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(commentsKey, ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: commentsKey }),
    });

    const deleteMut = useMutation({
        mutationFn: (commentId) => deleteTeacherComment(Number(commentId)),
        onMutate: async (commentId) => {
            if (!isNum(commentId)) return;
            await qc.cancelQueries({ queryKey: commentsKey });
            const prev = qc.getQueryData(commentsKey);
            qc.setQueryData(commentsKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).filter((c) => c.id !== commentId),
            }));
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(commentsKey, ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: commentsKey }),
    });

    const handleAddComment = () => {
        const text = commentText.trim();
        if (!text || !Number.isFinite(studentId)) return;
        createMut.mutate(text);
        setCommentText("");
    };

    if (loading) return <Typography sx={{ p: 5 }}>جاري تحميل البيانات...</Typography>;
    if (!studentData) return <Typography sx={{ p: 5 }}>لا توجد بيانات متاحة.</Typography>;

    const u = studentData.user || {};
    const parent = studentData.parent || {};
    const classroom = studentData.classroom || {};
    const supervisor = studentData.supervisor || {};
    const avatarSrc = u.image && u.image !== "" ? u.image : "/Students/default.jpg";
    const displayGender =
        studentData.gender === "male" ? "ذكر" : studentData.gender === "female" ? "أنثى" : "—";
    const addrLine1 = (studentData.address || "").split("\n")[0] || "---";
    const addrLine2 = (studentData.address || "").split("\n")[1] || "---";
    const comments = commentsData?.data || [];

    return (
        <Box sx={{ p: 2, direction: "rtl", bgcolor: "#f5f6fa" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, textAlign: "center", border: "1px solid #308A9F", borderRadius: 2 }}
                    >
                        <Box sx={{ position: "relative", width: 100, height: 100, m: "auto", mb: 3 }}>
                            <Avatar src={avatarSrc} sx={{ width: "100%", height: "100%", borderRadius: 2 }} />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: "#4CAF50",
                                    border: "2px solid #F5F5F5",
                                }}
                            />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#308A9F", mb: 1 }}>
                            {studentData.name || u.name || "—"}
                        </Typography>
                        <Typography sx={{ color: "#586E75", mb: 2 }}>{classroom.name || "---"}</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
                            <Typography sx={{ color: "#308A9F" }}>
                                رقم التسجيل:<br />
                                <span style={{ color: "#586E75" }}>{studentData.prefix || "—"}</span>
                            </Typography>
                            <Typography sx={{ color: "#308A9F" }}>
                                الجنس:<br />
                                <span style={{ color: "#586E75" }}>{displayGender}</span>
                            </Typography>
                            <Typography sx={{ color: "#308A9F" }}>
                                تاريخ الانضمام:<br />
                                <span style={{ color: "#586E75" }}>{fmtDate(studentData.enrollment_date)}</span>
                            </Typography>
                        </Box>
                        <Box sx={{ background: gradientColor, borderRadius: 1, p: 1, mb: 1 }}>
                            <Typography sx={{ color: "#fff", fontSize: "14px" }}>{u.email || "---"}</Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ color: "#308A9F", borderColor: "#308A9F", mt: 1, mb: 2 }}
                            onClick={() => window.print()}
                        >
                            طباعة
                        </Button>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", mt: 2, borderRadius: 2 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                العنوان
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>المدينة</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#308A9F" }}>{addrLine2}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>العنوان</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#308A9F" }}>{addrLine1}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ border: "1px solid #308A9F", borderRadius: 2, mb: 2 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: "center", color: "#308A9F" }}>
                                تفاصيل ولي الأمر
                            </Typography>
                        </Box>
                        <Box sx={{ p: "1rem 2rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                <Avatar src="/Students/father.png" sx={{ width: 80, height: 80, borderRadius: 2 }} />
                                <Box sx={{ my: 1 }}>
                                    <Typography sx={{ color: "#586E75" }}>
                                        <strong style={{ color: "#308A9F" }}>رقم الهاتف:</strong> {parent.phone || "—"}
                                    </Typography>
                                    <Typography sx={{ color: "#586E75" }}>
                                        <strong style={{ color: "#308A9F" }}>البريد الإلكتروني:</strong> —
                                    </Typography>
                                    <Typography sx={{ color: "#22385F", fontWeight: "bold" }}>
                                        {parent.name || "—"}
                                    </Typography>
                                    <Typography sx={{ color: "#586E75" }}>ولي الأمر</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", mt: 2, borderRadius: 2, mb: 2 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                الإشراف والنقل
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            {[
                                { label: "المشرفة", name: supervisor.name || "—", avatar: "/Students/supervisor.png" },
                                { label: "السائق", name: "أبو محمد", avatar: "/Students/driver.png" },
                            ].map((p, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Avatar src={p.avatar} sx={{ width: 50, height: 50, ml: 1 }} />
                                    <Box>
                                        <Typography sx={{ color: "#308A9F" }}>{p.label}</Typography>
                                        <Typography sx={{ color: "#22385F", fontWeight: "bold" }}>{p.name}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", borderRadius: 2, mb: 3 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: "center", color: "#308A9F" }}>
                                تفاصيل النقل
                            </Typography>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>موعد الانطلاق</Typography>
                                    <Typography sx={{ color: "#308A9F", fontWeight: "bold" }}>7:15 صباحاً</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>موعد العودة</Typography>
                                    <Typography sx={{ color: "#308A9F", fontWeight: "bold" }}>2:45 ظهراً</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: "#586E75" }}>الملاحظات</Typography>
                                    {[
                                        "يجب على الطلاب الحضور إلى نقطة التجمع قبل 7:10 صباحاً",
                                        "في حال تغييرات طارئة يتم التواصل مع المشرفة مباشرة",
                                    ].map((note, i) => (
                                        <Box key={i} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                            <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 20, mr: 1, ml: 1 }} />
                                            <Typography sx={{ color: "#308A9F" }}>{note}</Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "#f0f2f5",
                            borderRadius: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 1,
                                background: gradientColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1,
                                boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                                cursor: "pointer",
                            }}
                            onClick={handleAddComment}
                        >
                            <SendRoundedIcon sx={{ color: "#fff" }} />
                        </Box>
                        <InputBase
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment();
                                }
                            }}
                            placeholder="أضف تعليق"
                            sx={{
                                flex: 1,
                                pr: 2,
                                bgcolor: "#fff",
                                borderRadius: 1,
                                height: 46,
                                display: "flex",
                                alignItems: "center",
                                boxShadow: "inset 0 0 0 1px #e5e7eb",
                                direction: "rtl",
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                        {loadingComments ? (
                            <Typography sx={{ p: 2 }}>جاري جلب التعليقات...</Typography>
                        ) : comments.length === 0 ? (
                            <Typography sx={{ p: 2, color: "text.secondary" }}>
                                لا توجد تعليقات حتى الآن.
                            </Typography>
                        ) : (
                            comments.map((n) => (
                                <CommentRow
                                    key={n.id ?? Math.random()}
                                    c={n}
                                    onEdit={(cid, note) => updateMut.mutate({ id: cid, note })}
                                    onDelete={(cid) => deleteMut.mutate(cid)}
                                />
                            ))
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TStudentDetails;
