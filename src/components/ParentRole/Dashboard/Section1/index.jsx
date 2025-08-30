// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React, { useMemo } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    Paper,
    Skeleton,
    Alert,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import QuizIcon from "@mui/icons-material/Quiz";

import { useQuery } from "@tanstack/react-query";
import { getParentDashboard } from './../../../../api/Parent/Dashboard/getParentDashboard';

// Recharts
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RTooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const GRADIENT = "linear-gradient(135deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";
const CHART_COLORS = ["#1B806A", "#D6455D", "#308A9F", "#22385F", "#9aa6b2"];

const formatNumber = (n) =>
    !Number.isNaN(Number(n)) && n !== null && n !== undefined
        ? Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "—";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");

export default function ParentDetailsWithChartsAndChildren() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["parent-dashboard"],
        queryFn: getParentDashboard,
    });

    const overview = data?.generalOverview ?? {};
    const gender = data?.studentGenderDistribution ?? {};
    const upcoming = Array.isArray(data?.upcomingEvents) ? data.upcomingEvents : [];


    const students = Array.isArray(data?.students) ? data.students : [];
    const payments = Array.isArray(data?.studentPayments) ? data.studentPayments : [];

    const payById = useMemo(() => {
        const map = new Map();
        for (const p of payments) {
            if (p && typeof p.student_id !== "undefined") map.set(p.student_id, p);
        }
        return map;
    }, [payments]);

    // بطاقات الإحصاء
    const cards = useMemo(
        () => [
            {
                key: "totalStudents",
                label: "أبناؤك المسجّلون",
                value: formatNumber(overview?.totalStudents),
                suffix: "طالب",
                Icon: FamilyRestroomIcon,
            },
            {
                key: "totalClassrooms",
                label: "الصفوف",
                value: formatNumber(overview?.totalClassrooms),
                suffix: "صف",
                Icon: GroupsIcon,
            },
            {
                key: "totalTeachers",
                label: "المعلّمون",
                value: formatNumber(overview?.totalTeachers),
                suffix: "معلّم",
                Icon: SchoolIcon,
            },
            {
                key: "totalSupervisors",
                label: "المشرفون",
                value: formatNumber(overview?.totalSupervisors),
                suffix: "مشرف",
                Icon: PeopleAltIcon,
            },
        ],
        [overview]
    );

    // بيانات المخططات
    const genderData = useMemo(
        () => [
            { name: "ذكور", value: Number(gender?.maleStudents || 0) },
            { name: "إناث", value: Number(gender?.femaleStudents || 0) },
        ],
        [gender]
    );

    const overviewBarData = useMemo(
        () => [
            { name: "طلاب", value: Number(overview?.totalStudents || 0) },
            { name: "صفوف", value: Number(overview?.totalClassrooms || 0) },
            { name: "معلّمون", value: Number(overview?.totalTeachers || 0) },
            { name: "مشرفون", value: Number(overview?.totalSupervisors || 0) },
        ],
        [overview]
    );

    return (
        <Box sx={{ direction: "rtl", px: { xs: 2, sm: 3, md: 5 }, py: { xs: 2, md: 3 }, width: "100%" }}>
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    فشل جلب بيانات لوحة وليّ الأمر — {error?.message || "حدث خطأ غير متوقع"}
                </Alert>
            )}

            <Grid container spacing={3} columns={12} sx={{ m: 0, mb: 1 }}>
                {(isLoading ? Array.from({ length: 4 }) : cards).map((c, i) => (
                    <Grid item key={c?.key || i} xs={12} sm={6} md={3} lg={3} sx={{ display: "flex" }}>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3, width: "100%" }} />
                        ) : (
                            <StatCard Icon={c.Icon} label={c.label} value={c.value} suffix={c.suffix} />
                        )}
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            p: 2,
                            height: 360,
                            border: "1px solid #edf2f7",
                            background:
                                "radial-gradient(1200px 400px at 110% -20%, rgba(48,138,159,.06), transparent 60%)",
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, color: "#308A9F", mb: 1.5 }}>
                            توزيع الأبناء حسب الجنس
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {genderData.map((_, idx) => (
                                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RTooltip formatter={(v) => formatNumber(v)} />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            p: 2,
                            height: 360,
                            border: "1px solid #edf2f7",
                            background:
                                "radial-gradient(1200px 400px at -10% -20%, rgba(34,56,95,.06), transparent 60%)",
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, color: "#308A9F", mb: 1.5 }}>
                            ملخص الأعداد الرئيسية
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={overviewBarData} barSize={36}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <RTooltip formatter={(v) => formatNumber(v)} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#308A9F" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* شبكة بطاقات الأبناء (مع ملخص السداد) */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#22385F", mb: 1 }}>
                    أبناؤك
                </Typography>
                <Grid container spacing={3} columns={12} sx={{ m: 0 }}>
                    {(isLoading ? Array.from({ length: 6 }) : students).map((s, idx) => {
                        const code = s?.code || s?.prefix || s?.studentCode || `S-${idx + 1}`;
                        const name = s?.name || s?.fullName || s?.user?.name || "—";
                        const grade = s?.gradeName || s?.grade || s?.classroom?.name || "—";
                        const avatar = s?.avatar || s?.user?.image || "/images/avatars/default.png";
                        const phone = s?.phone || s?.user?.phone;
                        const genderTxt = asArGender(s?.gender);
                        const address = (s?.address || "").toString().split("\n").join("، ");
                        const pay = payById.get(s?.id) || {};
                        const totalPaid = Number(pay?.total_paid || 0);
                        const totalReq = Number(pay?.total_required || 0);
                        const remain = Number(pay?.remaining_amount || 0);
                        const remainColor = remain > 0 ? "#D6455D" : remain < 0 ? "#1B806A" : "#8A8F99";
                        const remainBg =
                            remain > 0
                                ? "rgba(214,69,93,.10)"
                                : remain < 0
                                    ? "rgba(27,128,106,.10)"
                                    : "rgba(138,143,153,.12)";

                        return (
                            <Grid item key={`${code}-${s?.id ?? idx}`} xs={12} sm={6} md={4} lg={4} sx={{ display: "flex" }}>
                                {isLoading ? (
                                    <Skeleton variant="rounded" height={230} sx={{ borderRadius: 3, width: "100%" }} />
                                ) : (
                                    <Card
                                        sx={{
                                            width: "100%",
                                            position: "relative",
                                            p: 2.2,
                                            borderRadius: 2,
                                            border: "2px solid #308A9F",
                                            boxShadow: "0 10px 24px rgba(34,56,95,.15)",
                                            transition: "transform .18s ease, box-shadow .18s ease",
                                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 28px rgba(34,56,95,.22)" },
                                        }}
                                    >
                                        <Box sx={{ position: "absolute", top: 10, left: 12, fontSize: 12, color: "#8F929C" }}>
                                            {code}
                                        </Box>

                                        <Box
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                mx: "auto",
                                                mt: 1.5,
                                                mb: 1.5,
                                                borderRadius: 3,
                                                background: "#fff",
                                                display: "grid",
                                                placeItems: "center",
                                                boxShadow: "inset 0 1px 0 rgba(0,0,0,.04), 0 8px 16px rgba(0,0,0,.08)",
                                            }}
                                        >
                                            <Avatar src={avatar} alt={name} variant="rounded" sx={{ width: 96, height: 96, borderRadius: 3 }} />
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: 22,
                                                lineHeight: 1.2,
                                                mt: 2,
                                                mb: 1,
                                                textAlign: "center",
                                                background: GRADIENT,
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                            title={name}
                                        >
                                            {name}
                                        </Typography>

                                        <Typography sx={{ color: "#8A8F99", fontSize: 15, fontWeight: 700, textAlign: "center" }}>
                                            {grade}
                                            {genderTxt !== "—" && (
                                                <Typography component="span" sx={{ ml: 1, color: "#5E7285", fontSize: 13 }}>
                                                    • {genderTxt}
                                                </Typography>
                                            )}
                                        </Typography>

                                        {(phone || address) && (
                                            <Box sx={{ mt: 1.2, color: "#5E7285", textAlign: "center" }}>
                                                {phone && (
                                                    <Typography sx={{ fontSize: 13 }} dir="ltr">
                                                        {phone}
                                                    </Typography>
                                                )}
                                                {address && (
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            mt: 0.3,
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <HomeIcon sx={{ fontSize: 14, mr: 0.3 }} />
                                                        {address}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}

                                        <Box
                                            sx={{
                                                mt: 1.4,
                                                display: "grid",
                                                gridTemplateColumns: "repeat(3, 1fr)",
                                                gap: 1,
                                                textAlign: "center",
                                            }}
                                        >
                                            <PayCell label="مطلوب" value={totalReq} color="#22385F" bg="rgba(34,56,95,.08)" />
                                            <PayCell label="مدفوع" value={totalPaid} color="#1B806A" bg="rgba(27,128,106,.12)" />
                                            <PayCell label="المتبقي" value={remain} color={remainColor} bg={remainBg} />
                                        </Box>
                                    </Card>
                                )}
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#22385F", mb: 1 }}>
                الفعاليات القادمة
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #edf2f7" }}>
                {isLoading ? (
                    <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
                ) : upcoming.length === 0 ? (
                    <Box sx={{ p: 2, color: "#7A8899" }}>لا توجد فعاليات قادمة.</Box>
                ) : (
                    <List sx={{ p: 1 }}>
                        {upcoming.slice(0, 6).map((ev, i) => {
                            const isExam = ev?.type === "exam";
                            const start = ev?.start_time ? new Date(ev.start_time) : null;
                            const end = ev?.end_time ? new Date(ev.end_time) : null;
                            return (
                                <ListItem key={`${ev?.id ?? i}-${ev?.start_time ?? ""}`} sx={{ borderBottom: "1px dashed #edf2f7" }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: isExam ? "#D6455D" : "#308A9F" }}>
                                        {isExam ? <QuizIcon /> : <EventIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 800, color: "#22385F" }}>{ev?.title || "—"}</Typography>}
                                        secondary={
                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", color: "#5E7285" }}>
                                                {start && (
                                                    <Typography sx={{ fontSize: 13 }}>
                                                        من: {start.toLocaleString("ar-EG")}
                                                    </Typography>
                                                )}
                                                {end && (
                                                    <Typography sx={{ fontSize: 13 }}>
                                                        إلى: {end.toLocaleString("ar-EG")}
                                                    </Typography>
                                                )}
                                                {ev?.description && (
                                                    <Typography sx={{ fontSize: 13, display: "block", width: "100%" }}>
                                                        {ev.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Paper>
        </Box>
    );
}

function StatCard({ Icon, label, value, suffix }) {
    return (
        <Box
            sx={{
                position: "relative",
                background: GRADIENT,
                color: "#fff",
                borderRadius: 3,
                height: 140,
                px: { xs: 2, md: 3 },
                py: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 10px 22px rgba(34, 56, 95, .22)",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    "&:before, &:after": {
                        content: '""',
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.07)",
                    },
                    "&:before": { left: -70, bottom: -100 },
                    "&:after": { right: -80, top: -110 },
                }}
            />
            <Box
                sx={{
                    position: "relative",
                    ml: 2,
                    width: 66,
                    height: 66,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(1px)",
                    flexShrink: 0,
                }}
            >
                {Icon ? <Icon sx={{ fontSize: 36, color: "#fff" }} /> : null}
            </Box>
            <Box sx={{ textAlign: "right", mr: 1, flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: ".98rem",
                        opacity: 0.95,
                        mb: 0.6,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                    }}
                    title={label}
                >
                    {label}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, justifyContent: "flex-end" }}>
                    <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>{value}</Typography>
                    <Typography sx={{ fontSize: "1rem", opacity: 0.98 }}>{suffix}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

function PayCell({ label, value, color, bg }) {
    return (
        <Box
            sx={{
                p: 1,
                borderRadius: 1.2,
                bgcolor: bg,
            }}
        >
            <Typography sx={{ fontSize: 12, color: "#55657a" }}>{label}</Typography>
            <Typography sx={{ fontWeight: 900, color, fontSize: 16 }}>
                {formatNumber(Number(value || 0))}
            </Typography>
        </Box>
    );
}
