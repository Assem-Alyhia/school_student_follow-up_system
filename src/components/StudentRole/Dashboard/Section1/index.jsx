// src/components/StudentRole/Dashboard/OverviewSection.jsx
import React, { useMemo } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Skeleton,
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import QuizIcon from "@mui/icons-material/Quiz";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "../../../../api/Student/Dashboard/getStudentDashboard";

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

const gradient = "linear-gradient(135deg, #35AFBC 0%, #22385F 100%)";
const COLORS = ["#1B806A", "#D6455D", "#308A9F", "#22385F", "#9aa6b2"];

const formatNumber = (n) =>
    typeof n === "number"
        ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "—";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function OverviewSection() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-dashboard"],
        queryFn: getStudentDashboard,
    });

    const overview = data?.generalOverview ?? {};
    const meta = data?.meta ?? {};
    const gender = data?.studentGenderDistribution ?? {};
    const upcoming = Array.isArray(data?.upcomingEvents) ? data.upcomingEvents : [];
    const student = data?.student ?? {};
    const payments = data?.studentPayments ?? {};

    const cards = useMemo(
        () => [
            {
                key: "totalStudents",
                label: "العدد الإجمالي للطلاب",
                value: overview.totalStudents,
                suffix: "طالب",
                Icon: PeopleAltIcon,
            },
            {
                key: "totalClassrooms",
                label: "العدد الإجمالي للصفوف",
                value: overview.totalClassrooms,
                suffix: "صف",
                Icon: GroupsIcon,
            },
            {
                key: "totalTeachers",
                label: "العدد الإجمالي للمعلمين",
                value: overview.totalTeachers,
                suffix: "معلّم",
                Icon: SchoolIcon,
            },
            {
                key: "totalSupervisors",
                label: "العدد الإجمالي للمشرفين",
                value: overview.totalSupervisors,
                suffix: "مشرف",
                Icon: SupervisorAccountIcon,
            },
        ],
        [overview]
    );

    // بيانات المخططات
    const genderData = useMemo(
        () => [
            { name: "ذكور", value: Number(gender.maleStudents || 0) },
            { name: "إناث", value: Number(gender.femaleStudents || 0) },
        ],
        [gender]
    );

    const overviewBarData = useMemo(
        () => [
            { name: "طلاب", value: Number(overview.totalStudents || 0) },
            { name: "صفوف", value: Number(overview.totalClassrooms || 0) },
            { name: "معلّمون", value: Number(overview.totalTeachers || 0) },
            { name: "مشرفون", value: Number(overview.totalSupervisors || 0) },
        ],
        [overview]
    );

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                p: { xs: 2, md: 3.5 },
                direction: "rtl",
                width: "96%",
                m: "2rem auto",
                boxShadow: "0 0 12px rgb(0 0 0 / 10%)",
                bgcolor: "#fff",
            }}
        >
            {/* العنوان */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2.5,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#308A9F", mb: 0.6 }}>
                        لوحة معلومات الطالب
                    </Typography>
                    <Typography sx={{ color: "#8F929C" }}>
                        إحصاءات دقيقة تمنحك رؤية واضحة وشاملة
                    </Typography>
                </Box>

                {meta?.currentAcademicYear && (
                    <Chip
                        label={`العام الدراسي: ${meta.currentAcademicYear}`}
                        sx={{
                            border: "1px solid #dbe7ef",
                            color: "#1f3b57",
                            bgcolor: "#f7fbff",
                            fontWeight: 700,
                        }}
                    />
                )}
            </Box>

            {/* خطأ */}
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    فشل في جلب بيانات لوحة الطالب — {error?.message || "حدث خطأ غير متوقع"}
                </Alert>
            )}

            {/* بطاقة معلومات الطالب + ملخص السداد */}
            <Grid container spacing={2.5} sx={{ mb: 1 }}>
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            p: 2.2,
                            height: "100%",
                            border: "1px solid #edf2f7",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {isLoading ? (
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Avatar
                                    src={student?.image || student?.avatar || "/images/avatars/default.png"}
                                    alt={student?.name || "student"}
                                    variant="rounded"
                                    sx={{
                                        width: 84,
                                        height: 84,
                                        borderRadius: 2,
                                        border: "2px solid #308A9F",
                                        bgcolor: "#E6EEF5",
                                        flexShrink: 0,
                                    }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: "#22385F" }}>
                                        {student?.name || "—"}
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 0.8, color: "#5E7285" }}>
                                        <Info label="الرقم" icon={<BadgeIcon sx={{ fontSize: 18 }} />} value={student?.prefix} />
                                        <Info
                                            label="الجنس"
                                            icon={<PeopleAltIcon sx={{ fontSize: 18 }} />}
                                            value={asArGender(student?.gender)}
                                        />
                                        <Info
                                            label="الهاتف"
                                            icon={<PhoneIphoneIcon sx={{ fontSize: 18 }} />}
                                            value={student?.phone}
                                            dir="ltr"
                                        />
                                        <Info
                                            label="الميلاد"
                                            icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                                            value={fmtDate(student?.dob)}
                                        />
                                        <Info
                                            label="الالتحاق"
                                            icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                                            value={fmtDate(student?.enrollment_date)}
                                        />
                                    </Box>

                                    {(student?.classroom?.name || student?.address) && (
                                        <Box sx={{ mt: 1.2, color: "#5E7285" }}>
                                            {student?.classroom?.name && (
                                                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                                                    الصف: {student.classroom.name}
                                                </Typography>
                                            )}
                                            {student?.address && (
                                                <Typography sx={{ fontSize: 13, mt: 0.4 }}>
                                                    <HomeIcon sx={{ fontSize: 15, ml: 0.5 }} />
                                                    {student.address.toString().split("\n").join("، ")}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {student?.medical_info && (
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 13,
                                                color: "#8A8F99",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <FavoriteIcon sx={{ fontSize: 14, ml: 0.5 }} />
                                            {student.medical_info}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            p: 2.2,
                            height: "100%",
                            border: "1px solid #edf2f7",
                            background:
                                "radial-gradient(1200px 400px at 110% -20%, rgba(48,138,159,.06), transparent 60%)",
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, color: "#308A9F", mb: 1 }}>
                            ملخص السداد
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Grid container spacing={1.8}>
                                <PaymentBox label="الإجمالي المطلوب" value={payments?.total_required} />
                                <PaymentBox label="الإجمالي المدفوع" value={payments?.total_paid} />
                                <PaymentBox label="المتبقي" value={payments?.remaining_amount} emphasis />
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* بطاقات الأرقام */}
            <Grid container spacing={2.5}>
                {(isLoading ? Array.from({ length: 4 }) : cards).map((c, i) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} key={c?.key || i}>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
                        ) : (
                            <StatCard Icon={c.Icon} label={c.label} value={formatNumber(c.value)} suffix={c.suffix} />
                        )}
                    </Grid>
                ))}
            </Grid>

            {/* مخططات */}
            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#22385F" }}>
                    مخططات توضيحية
                </Typography>
                <Typography sx={{ color: "#7A8899", fontSize: 13 }}>
                    آخر تحديث: {meta?.generated_at ? new Date(meta.generated_at).toLocaleString("ar-EG") : "—"}
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                {/* Pie: الجنس */}
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
                            توزيع الطلاب حسب الجنس
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
                                        {genderData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RTooltip formatter={(v) => formatNumber(v)} />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>

                {/* Bar: نظرة عامة */}
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

            {/* الفعاليات القادمة */}
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
                        {upcoming.slice(0, 6).map((ev) => {
                            const isExam = ev.type === "exam";
                            return (
                                <ListItem key={ev.id} sx={{ borderBottom: "1px dashed #edf2f7" }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: isExam ? "#D6455D" : "#308A9F" }}>
                                        {isExam ? <QuizIcon /> : <EventIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 800, color: "#22385F" }}>{ev.title}</Typography>}
                                        secondary={
                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", color: "#5E7285" }}>
                                                <Typography sx={{ fontSize: 13 }}>
                                                    من: {new Date(ev.start_time).toLocaleString("ar-EG")}
                                                </Typography>
                                                <Typography sx={{ fontSize: 13 }}>
                                                    إلى: {new Date(ev.end_time).toLocaleString("ar-EG")}
                                                </Typography>
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
        </Paper>
    );
}

/* === عناصر فرعية === */
function StatCard({ Icon, label, value, suffix }) {
    return (
        <Box
            sx={{
                position: "relative",
                background: gradient,
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
            }}
        >
            {/* زخارف */}
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

            {/* فقاعة الأيقونة */}
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

            {/* النص */}
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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>
                        {value}
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", opacity: 0.98 }}>{suffix}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

function Info({ label, value, icon, dir }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            {icon}
            <Typography sx={{ fontSize: 14, color: "#1f3b57", fontWeight: 700 }}>
                {label}:
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#425669", direction: dir || "rtl" }}>
                {value || "—"}
            </Typography>
        </Box>
    );
}

function PaymentBox({ label, value, emphasis }) {
    return (
        <Grid item xs={12} sm={4}>
            <Paper
                sx={{
                    p: 1.6,
                    textAlign: "center",
                    borderRadius: 2,
                    border: "1px solid #e6eef5",
                    bgcolor: emphasis ? "rgba(214,69,93,.06)" : "rgba(48,138,159,.06)",
                }}
                elevation={0}
            >
                <Typography sx={{ color: "#6b7a88", fontSize: 13, mb: 0.3 }}>{label}</Typography>
                <Typography sx={{ fontWeight: 900, color: emphasis ? "#D6455D" : "#22385F", fontSize: 20 }}>
                    {formatNumber(Number(value || 0))}
                </Typography>
            </Paper>
        </Grid>
    );
}
