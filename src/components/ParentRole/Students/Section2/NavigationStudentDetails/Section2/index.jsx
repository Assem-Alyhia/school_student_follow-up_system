// src/components/Parents/StudentDetails/_ParentComments.jsx
import React from "react";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Chip,
    Divider,
    Stack,
    Tooltip,
    IconButton,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { useQuery } from "@tanstack/react-query";
import { getParentComments } from "../../../../../../api/Parent/Comments/getParentComments";

const mainColor = "#2ea394";

function formatDateTime(val) {
    if (!val) return "—";
    // يدعم كلا الشكلين: "2025-08-29 22:32:47" أو ISO
    const d = new Date(val.toString().replace(" ", "T"));
    if (isNaN(d)) return "—";
    const date = d.toLocaleDateString("ar-EG");
    const time = d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    return `${date} - ${time}`;
}

const CommentItem = ({ c }) => {
    const user = c?.user || {};
    const authorName = user?.name || "—";
    const authorEmail = user?.email || "—";
    const userPrefix = user?.prefix || "—";
    const avatar = user?.image || "/Students/default.jpg";
    const commentId = c?.id;
    const createdAt = formatDateTime(c?.created_at);
    const note = c?.note ?? "—";

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "#e9ecef",
                bgcolor: "#fff",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                {/* أعمدة معلومات مختصرة */}
                <Stack spacing={1} alignItems="flex-start" sx={{ minWidth: 120 }}>
                    <Chip
                        label={`Prefix: ${userPrefix}`}
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: "#f0fff8", color: mainColor, borderColor: mainColor }}
                    />
                    <Chip
                        label={`تعليق #${commentId ?? "—"}`}
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: "#eef2ff", color: "#3730a3", borderColor: "#c7d2fe" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {createdAt}
                    </Typography>
                </Stack>

                {/* المحتوى */}
                <Box sx={{ flex: 1 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography sx={{ fontWeight: 700, color: mainColor }}>
                                {authorName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", mt: 0.25, wordBreak: "break-all" }}
                            >
                                {authorEmail}
                            </Typography>
                        </Box>
                        <Avatar src={avatar} alt={authorName} sx={{ width: 40, height: 40 }} />
                    </Stack>

                    <Typography sx={{ mt: 1, lineHeight: 1.9, color: "text.secondary" }}>
                        {note}
                    </Typography>

                    {/* أيقونات عرض فقط (بدون تفاعلات) */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Tooltip title="رد">
                            <span>
                                <IconButton size="small" disabled>
                                    <ReplyOutlinedIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="إعجاب">
                            <span>
                                <IconButton size="small" disabled>
                                    <ThumbUpAltOutlinedIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">
                            {c?.likes ?? 0}
                        </Typography>
                        <Tooltip title="مرفقات">
                            <span>
                                <IconButton size="small" disabled>
                                    <AttachFileOutlinedIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default function ParentComments({ studentId }) {
    const sid = Number(studentId);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["parent-comments", sid || "all"],
        queryFn: () => (sid ? getParentComments({ student_id: sid }) : getParentComments({})),
        enabled: true,
    });

    const comments = data?.data || [];

    return (
        <Box sx={{ direction: "rtl" }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 800, color: "#22385F" }}>
                التعليقات
            </Typography>

            {isLoading ? (
                <Typography sx={{ p: 2 }}>جاري جلب التعليقات...</Typography>
            ) : isError ? (
                <Typography sx={{ p: 2, color: "error.main" }}>
                    حدث خطأ: {error?.message || "تعذر تحميل التعليقات"}
                </Typography>
            ) : comments.length === 0 ? (
                <Typography sx={{ p: 2, color: "text.secondary" }}>
                    لا توجد تعليقات حتى الآن.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {comments.map((c) => (
                        <React.Fragment key={c.id}>
                            <CommentItem c={c} />
                            <Divider sx={{ borderColor: "#f0f0f0" }} />
                        </React.Fragment>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
