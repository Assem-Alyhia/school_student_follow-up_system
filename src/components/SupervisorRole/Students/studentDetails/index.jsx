// src/components/SupervisorRole/Students/StudentDetails.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Chip,
    Divider,
    IconButton,
    TextField,
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSupervisorStudentById } from "../../../../api/Supervisor/Students/getSupervisorStudentById";

const GRADIENT = "linear-gradient(90deg, #35AFBC, #308A9F, #22385F)";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");
const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const arStatus = (s) => {
    if (!s) return "—";
    const map = { active: "نشط", inactive: "غير نشط", at_home: "في المنزل" };
    return map[s] || s;
};

export default function StudentDetails() {
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisor-student-by-id", id],
        queryFn: () => getSupervisorStudentById(id),
        enabled: !!id,
    });

    // مشتقات البيانات
    const student = data?.data || {};
    const user = student.user || {};
    const parent = student.parent || {};
    const parentUser = parent.user || {};
    const classroom = student.classroom || {};
    const level = classroom.level || {};

    const showParentCard = Boolean(parentUser.name || parent.phone || parentUser.email);
    const medicalDescription = student.medical_info || "";
    const showMedicalCard = Boolean(medicalDescription);

    // الدردشة
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const parentName = parentUser.name || parent.name || "وليّ الأمر";

    useEffect(() => {
        if (messages.length === 0 && parentName) {
            setMessages([
                {
                    id: 1,
                    author: parentName,
                    role: "guardian",
                    text: "أرجو التأكيد على الواجب الخاص بالرياضيات.",
                    date: new Date(),
                },
            ]);
        }
    }, [parentName, id, messages.length]);

    const sendMessage = () => {
        const t = draft.trim();
        if (!t) return;
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, author: "أنت", role: "supervisor", text: t, date: new Date() },
        ]);
        setDraft("");
    };

    return (
        <Box sx={{ p: 2, direction: "rtl", bgcolor: "#f5f6fa" }}>
            {/* رسائل النظام */}
            {isLoading && <Typography sx={{ mb: 2, p: 2 }}>جاري تحميل البيانات...</Typography>}
            {isError && (
                <Typography sx={{ mb: 2, p: 2, color: "error.main" }}>خطأ: {error?.message}</Typography>
            )}

            <Grid container spacing={2}>
                {/* يمين: بطاقة الطالب — دائماً أولاً */}
                <Grid item xs={12} md={4} order={{ xs: 1, md: 1 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: "1px solid #308A9F",
                            borderRadius: 2,
                            mb: 2,
                            textAlign: "center",
                            position: "relative",
                        }}
                    >
                        <Typography variant="caption" sx={{ position: "absolute", top: 10, left: 14, color: "#9aa6b2" }}>
                            {student.prefix || "—"}
                        </Typography>

                        <Box sx={{ display: "grid", placeItems: "center", mt: 1.5, mb: 2 }}>
                            <Avatar
                                src={user.image || "/Students/default.jpg"}
                                alt={user.name || student.name}
                                variant="rounded"
                                sx={{ width: 96, height: 96, borderRadius: 2, boxShadow: "0 12px 24px rgba(34,56,95,.12)" }}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 900, color: "#308A9F" }}>
                            {student.name || user.name || "—"}
                        </Typography>
                        <Typography sx={{ color: "#7A8899", mb: 2 }}>
                            {classroom.name || "—"} {level?.name ? `— ${level.name}` : ""}
                        </Typography>

                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                            <Grid item xs={4}>
                                <Typography sx={{ color: "#308A9F", fontWeight: 800 }}>رقم التسجيل</Typography>
                                <Typography sx={{ color: "#586E75" }}>{student.prefix || "—"}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ color: "#308A9F", fontWeight: 800 }}>الجنس</Typography>
                                <Typography sx={{ color: "#586E75" }}>{asArGender(student.gender)}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ color: "#308A9F", fontWeight: 800 }}>تاريخ الانضمام</Typography>
                                <Typography sx={{ color: "#586E75" }}>
                                    {fmtDate(student.enrollment_date || user.created_at)}
                                </Typography>
                            </Grid>
                        </Grid>

                        {user.email && (
                            <Box sx={{ background: GRADIENT, borderRadius: 1, p: 1, mb: 1.5 }}>
                                <Typography sx={{ color: "#fff", fontSize: 14, direction: "ltr" }}>{user.email}</Typography>
                            </Box>
                        )}

                        <Grid container spacing={1.5} sx={{ mb: 1 }}>
                            {student.phone && (
                                <Grid item xs={6}>
                                    <Chip sx={{ width: "100%" }} icon={<PhoneIphoneIcon />} label={student.phone} variant="outlined" />
                                </Grid>
                            )}
                            {student.dob && (
                                <Grid item xs={6}>
                                    <Chip
                                        sx={{ width: "100%" }}
                                        icon={<CalendarMonthIcon />}
                                        label={`الميلاد: ${fmtDate(student.dob)}`}
                                        variant="outlined"
                                    />
                                </Grid>
                            )}
                        </Grid>

                        <Chip
                            sx={{ width: "100%" }}
                            icon={<PersonIcon />}
                            color="default"
                            variant="outlined"
                            label={`الحالة: ${arStatus(student.status)}`}
                        />
                    </Paper>

                    {(student.address && student.address.trim()) && (
                        <Paper elevation={0} sx={{ border: "1px solid #308A9F", borderRadius: 2, mb: 2 }}>
                            <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
                                <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                    العنوان
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}><Typography sx={{ color: "#586E75" }}>المدينة</Typography></Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{ color: "#308A9F" }}>
                                            {(student.address || "").split("\n")[1] || "—"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}><Typography sx={{ color: "#586E75" }}>العنوان</Typography></Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{ color: "#308A9F" }}>
                                            {(student.address || "").split("\n")[0] || "—"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    )}
                </Grid>

                {/* الوسط/يسار: تفاصيل ولي الأمر والسجل الطبي — ثانياً */}
                <Grid item xs={12} md={8} order={{ xs: 2, md: 2 }}>
                    {showParentCard && (
                        <Paper elevation={0} sx={{ border: "1px solid #308A9F", borderRadius: 2, mb: 2 }}>
                            <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
                                <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                    تفاصيل وليّ الأمر
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                    <Avatar src="/Students/parent.png" sx={{ width: 64, height: 64, borderRadius: 2 }} />
                                    <Box>
                                        <Typography sx={{ color: "#22385F", fontWeight: 900 }}>
                                            {parentUser.name || parent.name || "—"}
                                        </Typography>
                                        {parent.phone && (
                                            <Typography sx={{ color: "#586E75" }}>
                                                <strong style={{ color: "#308A9F" }}>رقم الهاتف:</strong> {parent.phone}
                                            </Typography>
                                        )}
                                        {parentUser.email && (
                                            <Typography sx={{ color: "#586E75", direction: "ltr" }}>
                                                {parentUser.email}
                                                <strong style={{ color: "#308A9F", direction: "rtl" }}>  :البريد الإلكتروني</strong>{" "}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {showMedicalCard && (
                        <Paper elevation={0} sx={{ border: "1px solid #308A9F", borderRadius: 2 }}>
                            <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
                                <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                    السجل الطبي
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Grid container>
                                    {!!student.chronic_diseases && (
                                        <Grid item xs={12} md={6} sx={{ p: 1 }}>
                                            <Typography sx={{ color: "#7A8899", mb: 0.5 }}>الأمراض المزمنة</Typography>
                                            <Typography sx={{ color: "#308A9F", fontWeight: 700 }}>
                                                {student.chronic_diseases}
                                            </Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6} sx={{ p: 1 }}>
                                        <Typography sx={{ color: "#7A8899", mb: 0.5 }}>الوصفة الطبية</Typography>
                                        <Typography sx={{ color: "#308A9F", fontWeight: 700 }}>
                                            {medicalDescription}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    )}
                </Grid>

                {/* الدردشة — دائماً أخيراً */}
                <Grid item xs={12} order={{ xs: 3, md: 3 }}>
                    <Paper elevation={0} sx={{ border: "1px solid #308A9F", borderRadius: 2 }}>
                        <Box
                            sx={{
                                bgcolor: "#e0e0e0",
                                p: 1.5,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography fontWeight="bold" sx={{ color: "#308A9F" }}>
                                أضف تعليق
                            </Typography>
                        </Box>

                        {/* إدخال رسالة */}
                        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton onClick={sendMessage} sx={{ bgcolor: "#308A9F", "&:hover": { bgcolor: "#22385F" } }}>
                                <SendIcon sx={{ color: "#fff" }} />
                            </IconButton>
                            <TextField
                                fullWidth
                                placeholder="اكتب رسالتك هنا..."
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                size="small"
                            />
                        </Box>

                        <Divider />

                        {/* قائمة الرسائل */}
                        <Box sx={{ p: 2 }}>
                            {messages.map((m) => (
                                <Box key={m.id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                    <Avatar
                                        src={m.role === "guardian" ? "/Students/parent.png" : "/Students/supervisor.png"}
                                        sx={{ width: 40, height: 40, ml: 1 }}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ color: "#308A9F", fontWeight: 800 }}>{m.author}</Typography>
                                        <Typography sx={{ color: "#6b7b8a", fontSize: 13, mb: 0.5 }}>
                                            {fmtDate(m.date)}
                                        </Typography>
                                        <Typography sx={{ color: "#22385F" }}>{m.text}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
