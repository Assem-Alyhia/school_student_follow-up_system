import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Button,
    Chip,
    Divider,
    Stack,
    Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

const mainColor = "#2ea394";

const CommentItem = ({ c }) => {
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
                <Stack spacing={1} alignItems="flex-start" sx={{ minWidth: 72 }}>
                    <Chip label={c.role} size="small" variant="outlined" sx={{ bgcolor: "#f0fff8", color: mainColor, borderColor: mainColor }} />
                    <Chip label={c.sentiment} size="small" variant="outlined" sx={{ bgcolor: "#fff5f5", color: "#e85d75", borderColor: "#f3c5cc" }} />
                    <Typography variant="caption" color="text.secondary">
                        {c.date}
                    </Typography>
                </Stack>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontWeight: 700, color: mainColor }}>{c.author}</Typography>
                        <Avatar src={c.avatar} alt={c.author} sx={{ width: 40, height: 40 }} />
                    </Stack>

                    <Typography sx={{ mt: 1, lineHeight: 1.9, color: "text.secondary" }}>
                        {c.text}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Tooltip title="رد">
                            <IconButton size="small">
                                <ReplyOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="إعجاب">
                            <IconButton size="small">
                                <ThumbUpAltOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">
                            {c.likes}
                        </Typography>

                        <Tooltip title="مرفقات">
                            <IconButton size="small">
                                <AttachFileOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

const ChatCommentsStudentDetails = () => {
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Joann Michael",
            avatar: "/avatar.jpg",
            role: "معلم",
            sentiment: "إيجابي",
            date: "03/04/2025",
            likes: 24,
            text:
                "أثبتت شرح الفارق بين الرؤية والرسالة قد يكون من المفيد إضافة مثال محلي لشركات عربية معروفة لزيادة ارتباط القارئ.",
        },
        {
            id: 2,
            author: "Joann Michael",
            avatar: "/avatar.jpg",
            role: "ولي",
            sentiment: "سلبي",
            date: "03/04/2025",
            likes: 24,
            text:
                "أقترح تبسيط الأمثلة وإضافة جدول موجز يلخص الفروقات الرئيسية بين المفاهيم.",
        },
        {
            id: 3,
            author: "Joann Michael",
            avatar: "/avatar.jpg",
            role: "معلم",
            sentiment: "إيجابي",
            date: "03/04/2025",
            likes: 24,
            text:
                "المحتوى واضح ومتماسك؛ ممتاز لو أضفنا روابط لمصادر موثوقة في نهاية الدرس.",
        },
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        const newComment = {
            id: Date.now(),
            author: "أنت",
            avatar: "/avatar.jpg",
            role: "معلم",
            sentiment: "إيجابي",
            date: new Date().toLocaleDateString("ar-EG"),
            likes: 0,
            text: message.trim(),
        };
        setComments([newComment, ...comments]);
        setMessage("");
    };

    return (
        <Box sx={{ direction: "rtl" }}>
            {/* صندوق إضافة تعليق */}
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "#e9ecef",
                    bgcolor: "#f8fbfc",
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        onClick={handleSend}
                        sx={{
                            bgcolor: mainColor,
                            color: "#fff",
                            "&:hover": { bgcolor: "#23887d" },
                            borderRadius: 1,
                            width: 40,
                            height: 40,
                        }}
                        aria-label="إرسال"
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>

                    <TextField
                        fullWidth
                        placeholder="أضف تعليق"
                        size="small"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "#fff",
                                borderRadius: 2,
                            },
                        }}
                    />
                </Box>
            </Paper>

            <Stack spacing={2}>
                {comments.map((c) => (
                    <React.Fragment key={c.id}>
                        <CommentItem c={c} />
                        <Divider sx={{ borderColor: "#f0f0f0" }} />
                    </React.Fragment>
                ))}
            </Stack>
        </Box>
    );
};

export default ChatCommentsStudentDetails;
