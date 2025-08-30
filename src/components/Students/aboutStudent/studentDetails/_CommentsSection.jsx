// src/components/Students/Details/_CommentsSection.jsx
import React, { useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Chip,
    Divider,
    Stack,
    Tooltip,
    Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminComments } from "../../../../api/Admin/Comments/getAdminComments";
import { createAdminComment } from "../../../../api/Admin/Comments/createAdminComment";
import { updateAdminComment } from "../../../../api/Admin/Comments/updateAdminComment";
import { deleteAdminComment } from "../../../../api/Admin/Comments/deleteAdminComment";

const mainColor = "#2ea394";
const isNumberId = (v) => typeof v === "number" && Number.isFinite(v);

const CommentRow = ({ c, onEdit, onDelete }) => {
    const [edit, setEdit] = useState(false);
    const [note, setNote] = useState(c.note || "");
    const disabled = c.__optimistic || !isNumberId(c.id);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e9ecef",
                bgcolor: "#fff",
                opacity: c.__optimistic ? 0.7 : 1,
            }}
        >
            <Box sx={{ display: "flex", gap: 1.5 }}>
                <Stack sx={{ minWidth: 72 }} spacing={1}>
                    <Chip
                        size="small"
                        label={c.user?.roles?.[0] || "—"}
                        variant="outlined"
                        sx={{ bgcolor: "#f0fff8", color: mainColor, borderColor: mainColor }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {new Date(c.created_at || Date.now()).toLocaleDateString("ar-EG")}
                    </Typography>
                </Stack>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontWeight: 700, color: mainColor }}>
                            {c.user?.name || "—"}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {!edit ? (
                                <>
                                    <span>
                                        <IconButton size="small" onClick={() => setEdit(true)} disabled={disabled}>
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
                                            setEdit(false);
                                        }}
                                    >
                                        <SaveOutlinedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setNote(c.note || "");
                                            setEdit(false);
                                        }}
                                    >
                                        <CloseOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Stack>
                    </Stack>

                    {!edit ? (
                        <Typography sx={{ mt: 1, color: "text.secondary" }}>{c.note}</Typography>
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    )}

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <IconButton size="small">
                            <ReplyOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                            <ThumbUpAltOutlinedIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">
                            {c.likes ?? 0}
                        </Typography>
                        <IconButton size="small">
                            <AttachFileOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default function ChatCommentsStudentDetails({ studentId }) {
    const qc = useQueryClient();
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const sid = Number(studentId);
    const queryKey = useMemo(() => ["admin", "comments", { studentId: sid }], [sid]);

    const { data, isLoading } = useQuery({
        queryKey,
        queryFn: () => getAdminComments({ student_id: sid }),
        enabled: Number.isFinite(sid),
    });

    const addMut = useMutation({
        mutationFn: (note) => createAdminComment({ student_id: sid, note }),
        onMutate: async (note) => {
            setErr("");
            await qc.cancelQueries({ queryKey });
            const prev = qc.getQueryData(queryKey);
            const tmpId = `tmp-${Date.now()}`;
            const optimistic = {
                id: tmpId,
                __optimistic: true,
                note,
                created_at: new Date().toISOString(),
                user: null,
            };
            qc.setQueryData(queryKey, (old) => ({
                ...(old || {}),
                data: [optimistic, ...(old?.data || [])],
            }));
            return { prev, tmpId };
        },
        onSuccess: (res, _v, ctx) => {
            const serverItem = res?.data;
            if (!serverItem || !ctx?.tmpId) return;
            qc.setQueryData(queryKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).map((c) => (c.id === ctx.tmpId ? serverItem : c)),
            }));
        },
        onError: (e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
            setErr(e?.message || "فشل إضافة التعليق");
        },
        onSettled: () => qc.invalidateQueries({ queryKey }),
    });

    const editMut = useMutation({
        mutationFn: ({ id, note }) => updateAdminComment(Number(id), { student_id: sid, note }),
        onMutate: async ({ id, note }) => {
            if (!isNumberId(id)) return;
            await qc.cancelQueries({ queryKey });
            const prev = qc.getQueryData(queryKey);
            qc.setQueryData(queryKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).map((c) => (c.id === id ? { ...c, note } : c)),
            }));
            return { prev };
        },
        onError: (e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
            setErr(e?.message || "فشل تعديل التعليق");
        },
        onSettled: () => qc.invalidateQueries({ queryKey }),
    });

    const delMut = useMutation({
        mutationFn: (id) => deleteAdminComment(Number(id)),
        onMutate: async (id) => {
            if (!isNumberId(id)) return;
            await qc.cancelQueries({ queryKey });
            const prev = qc.getQueryData(queryKey);
            qc.setQueryData(queryKey, (old) => ({
                ...(old || {}),
                data: (old?.data || []).filter((c) => c.id !== id),
            }));
            return { prev };
        },
        onError: (e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
            setErr(e?.message || "فشل حذف التعليق");
        },
        onSettled: () => qc.invalidateQueries({ queryKey }),
    });

    const send = () => {
        if (!msg.trim()) return;
        addMut.mutate(msg.trim());
        setMsg("");
    };

    const comments = data?.data || [];

    return (
        <Box sx={{ direction: "rtl", mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 800, color: "#22385F" }}>
                التعليقات
            </Typography>

            {!!err && <Alert severity="error" sx={{ mb: 1 }}>{err}</Alert>}

            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    border: "1px solid #e9ecef",
                    borderRadius: 2,
                    bgcolor: "#f8fbfc",
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        onClick={send}
                        disabled={addMut.isPending}
                        sx={{
                            bgcolor: mainColor,
                            color: "#fff",
                            "&:hover": { bgcolor: "#23887d" },
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                    <TextField
                        fullWidth
                        size="small"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                        placeholder="أضف تعليق"
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: 2 } }}
                    />
                </Box>
            </Paper>

            <Stack spacing={2}>
                {isLoading ? (
                    <Typography sx={{ p: 2 }}>جاري جلب التعليقات...</Typography>
                ) : comments.length === 0 ? (
                    <Typography sx={{ p: 2, color: "text.secondary" }}>
                        لا توجد تعليقات حتى الآن.
                    </Typography>
                ) : (
                    comments.map((c) => (
                        <React.Fragment key={c.id ?? Math.random()}>
                            <CommentRow
                                c={c}
                                onEdit={(id, note) => editMut.mutate({ id, note })}
                                onDelete={(id) => delMut.mutate(id)}
                            />
                            <Divider sx={{ borderColor: "#f0f0f0" }} />
                        </React.Fragment>
                    ))
                )}
            </Stack>
        </Box>
    );
}
