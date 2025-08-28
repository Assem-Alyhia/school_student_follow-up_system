import React, { useEffect, useState } from "react";
import {
    Box, Paper, Grid, Avatar, Typography, Chip, Divider, Button, InputBase
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { getTeacherParentById } from "../../../../api/Teacher/Parents/getTeacherParentById";

const gradient = "linear-gradient(90deg, #35AFBC, #308A9F, #22385F)";

const fmtDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d) ? "—" : d.toLocaleDateString("ar-EG");
};

export default function TParentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [parentData, setParentData] = useState(null);
    const [loading, setLoading] = useState(true);

    // إشعارات
    const [notifyText, setNotifyText] = useState("");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getTeacherParentById(id);
                if (!mounted) return;
                const data = res?.data ?? null;
                setParentData(data);

                // لو الـ API يرجّع إشعارات => استخدمها، غير ذلك عين عينة افتراضية
                const apiNotes = Array.isArray(data?.notifications) ? data.notifications : null;
                setNotifications(
                    apiNotes ?? [
                        {
                            id: 1,
                            author: "إشعار من الإدارة",
                            role: "إداري",
                            tone: "عام",
                            avatar: "/Students/default.jpg",
                            text: "تم تحديث جدول الحصص الخاص بالأبناء. الرجاء المتابعة.",
                            date: new Date().toISOString(),
                            likes: 0,
                            replies: 0,
                        },
                    ]
                );
            } catch (e) {
                console.error(e?.message || e);
                if (mounted) setParentData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    const handleSend = async () => {
        const text = notifyText.trim();
        if (!text) return;

        // إضافة فورية للواجهة
        setNotifications((prev) => [
            {
                id: Date.now(),
                author: "أنت",
                role: "معلم",
                tone: "إشعار",
                avatar: parentData?.user?.image || "/Students/default.jpg",
                text,
                date: new Date().toISOString(),
                likes: 0,
                replies: 0,
            },
            ...prev,
        ]);
        setNotifyText("");

        // (اختياري) ربط API عند توفره:
        // try {
        //   await createParentNotification(parentData.id, { message: text });
        // } catch (e) { console.error(e); }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) return <Typography sx={{ p: 5 }}>جاري التحميل...</Typography>;
    if (!parentData) return <Typography sx={{ p: 5 }}>لا توجد بيانات متاحة.</Typography>;

    const u = parentData.user || {};
    const fullName = parentData.name || u.name || "—";
    const email = u.email || "—";
    const phone = parentData.phone || "—";
    const dob = fmtDate(parentData.dob);
    const prefix = parentData.prefix || "—";
    const userPrefix = u.prefix || "—";
    const img = u.image && String(u.image).trim() !== "" ? u.image : null;
    const initials =
        fullName !== "—" ? fullName.trim().split(" ").slice(0, 1).map((w) => w[0]).join("") : "—";
    const children = Array.isArray(parentData.students) ? parentData.students : [];

    return (
        <Box sx={{ p: 2, direction: "rtl", bgcolor: "#f5f6fa", minHeight: "100vh" }}>
            <Paper
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #308A9F",
                    maxWidth: 1300,
                    mx: "auto",
                    bgcolor: "#fff",
                }}
                elevation={2}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md="auto">
                        <Avatar
                            src={img || undefined}
                            alt={fullName}
                            variant="rounded"
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: 3,
                                bgcolor: img ? "transparent" : "#E0E0E0",
                                color: "#22385F",
                                fontWeight: 700,
                                fontSize: "1.4rem",
                            }}
                        >
                            {!img && initials}
                        </Avatar>
                    </Grid>

                    <Grid item xs={12} md>
                        <Typography variant="h5" sx={{ color: "#22385F", fontWeight: 800 }}>
                            {fullName}
                        </Typography>

                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip label={`رقم وليّ الأمر: ${prefix}`} size="small" sx={{ bgcolor: "#eef2ff", color: "#22385F" }} />
                            <Chip label={`رقم المستخدم: ${userPrefix}`} size="small" sx={{ bgcolor: "#e8f4f4", color: "#00695c" }} />
                            <Chip label={`تاريخ الميلاد: ${dob}`} size="small" sx={{ bgcolor: "#f1f5f9", color: "#334155" }} />
                            <Chip label={`الهاتف: ${phone}`} size="small" sx={{ bgcolor: "#fef3c7", color: "#92400e" }} />
                        </Box>

                        <Box
                            sx={{
                                mt: 2,
                                background: gradient,
                                color: "#fff",
                                px: 2,
                                py: 1,
                                borderRadius: 1.5,
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            <Typography sx={{ fontSize: 14 }}>{email}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: 700, mb: 2 }}>
                    الأبناء المرتبطون
                </Typography>

                {children.length === 0 ? (
                    <Typography sx={{ color: "text.secondary" }}>لا يوجد أبناء مرتبطون.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {children.map((st) => (
                            <Grid item xs={12} sm={6} md={4} key={st.id}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        borderColor: "#dbeafe",
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ color: "#22385F", fontWeight: 700 }}>
                                            {st.name || "—"}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                            <Chip label={`الرقم: ${st.prefix || "—"}`} size="small" />
                                            <Chip
                                                label={`الجنس: ${st.gender === "male" ? "ذكر" : st.gender === "female" ? "أنثى" : "—"}`}
                                                size="small"
                                            />
                                            <Chip label={`التحاق: ${fmtDate(st.enrollment_date)}`} size="small" />
                                        </Box>
                                        <Typography sx={{ mt: 1, color: "text.secondary" }}>{st.address || "—"}</Typography>
                                    </Box>

                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderColor: "#308A9F", color: "#308A9F" }}
                                            onClick={() => navigate(`/teacherDashboard/students/tStudentDetails/${st.id}`)}
                                        >
                                            عرض تفاصيل الطالب
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* إرسال إشعار */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: 700, mb: 1 }}>
                    إرسال إشعار
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f0f2f5",
                        borderRadius: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        onClick={handleSend}
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 1,
                            background: gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1,
                            boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                            cursor: "pointer",
                        }}
                        title="إرسال"
                    >
                        <SendRoundedIcon sx={{ color: "#fff" }} />
                    </Box>

                    <InputBase
                        value={notifyText}
                        onChange={(e) => setNotifyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="أكتب رسالة الإشعار هنا…"
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

                {/* قائمة الإشعارات */}
                {notifications.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        {notifications.map((n) => (
                            <Paper
                                key={n.id}
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
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        <Chip
                                            size="small"
                                            label={n.tone || "إشعار"}
                                            sx={{ bgcolor: "#eef2ff", color: "#22385F", borderRadius: 1 }}
                                        />
                                        <Chip
                                            size="small"
                                            label={n.role || "—"}
                                            sx={{ bgcolor: "#e0f2f1", color: "#00695c", borderRadius: 1 }}
                                        />
                                    </Box>

                                    <Typography sx={{ color: "#308A9F", fontWeight: 700, mb: 0.5 }}>
                                        {n.author || "—"}
                                    </Typography>

                                    <Typography sx={{ color: "#374151", lineHeight: 1.9, mb: 1 }}>
                                        {n.text}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary" }}>
                                        <Typography variant="caption">{fmtDate(n.date)}</Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <ThumbUpOffAltOutlinedIcon fontSize="small" />
                                            <Typography variant="caption">أعجبني</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                                            <Typography variant="caption">({n.likes ?? 0}) رد</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <ReplyOutlinedIcon fontSize="small" />
                                            <Typography variant="caption">رد</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Avatar src={n.avatar} sx={{ width: 54, height: 54, borderRadius: 2 }} />
                            </Paper>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
