// src/components/TeacherRole/Dashboard/OverviewSection.jsx
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
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import GroupsIcon from "@mui/icons-material/Groups";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useQuery } from "@tanstack/react-query";
import { getTeacherDashboard } from "../../../../api/Teacher/Dashboard/getTeacherDashboard";

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

export default function OverviewSection() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-dashboard"],
        queryFn: getTeacherDashboard,
    });

    const overview = data?.generalOverview ?? {};
    const meta = data?.meta ?? {};
    const gender = data?.studentGenderDistribution ?? {};

    // بطاقات الإحصائيات
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
                key: "totalParents",
                label: "العدد الإجمالي لأولياء الأمور",
                value: overview.totalParents,
                suffix: "وليّ أمر",
                Icon: SupervisorAccountIcon,
            },
            {
                key: "totalClassrooms",
                label: "العدد الإجمالي للصفوف",
                value: overview.totalClassrooms,
                suffix: "صف",
                Icon: GroupsIcon,
            },
            {
                key: "totalBuses",
                label: "العدد الإجمالي للحافلات",
                value: overview.totalBuses,
                suffix: "حافلة",
                Icon: DirectionsBusIcon,
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
                Icon: PeopleAltIcon,
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
            { name: "أولياء", value: Number(overview.totalParents || 0) },
            { name: "صفوف", value: Number(overview.totalClassrooms || 0) },
            { name: "حافلات", value: Number(overview.totalBuses || 0) },
            { name: "معلمون", value: Number(overview.totalTeachers || 0) },
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
                        نظرة عامة على الأداء
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
                    فشل في جلب بيانات لوحة تحكم المعلم — {error?.message || "حدث خطأ غير متوقع"}
                </Alert>
            )}

            {/* بطاقات الأرقام */}
            <Grid container spacing={2.5}>
                {(isLoading ? Array.from({ length: 6 }) : cards).map((c, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={c?.key || i}>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
                        ) : (
                            <StatCard
                                Icon={c.Icon}
                                label={c.label}
                                value={formatNumber(c.value)}
                                suffix={c.suffix}
                            />
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
        </Paper>
    );
}

/* ===== بطاقة الإحصائية ===== */
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
