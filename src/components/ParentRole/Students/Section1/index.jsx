// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Card, Typography, Avatar, Skeleton, Alert,
    TextField, InputAdornment, Select, MenuItem, FormControl, Button, Chip,
    Stack, Paper, Tooltip, IconButton, Divider
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

import { getParentStudents } from "./../../../../api/Parent/Students/getParentStudents";
import MapDialogStudent from "../MapDialog";

const GRADIENT = "linear-gradient(180deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";
const COLORS = {
    brand1: "#35AFBC",
    brand2: "#308A9F",
    brand3: "#22385F",
    softBg: "#F6FAFB",
    softChip: "#E8F6F7",
    fieldBg: "#FFFFFF",
    textMain: "#22385F",
    textSub: "#6B7A90",
    border: "1px solid rgba(53,175,188,0.28)",
};

const getName = (s) => s?.name || s?.user?.name || "—";
const getImg = (s) => s?.user?.image || "/images/avatars/default.png";
const getLevel = (s) => s?.classroom?.level?.name || "—";
const getClass = (s) => s?.classroom?.name || "—";
const getGender = (s) => s?.gender || "";
const getEmail = (s) => s?.user?.email || "—";
const getPhone = (s) => s?.phone || "—";
const getStatus = (s) => s?.status || "—";
const getDob = (s) => s?.dob || "";
const getEnroll = (s) => s?.enrollment_date || "";
const getAddr = (s) => s?.address || "—";
const getCode = (s) => s?.prefix || "—";
const getMed = (s) => s?.medical_info || "";

const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("ar-EG");
};

export default function ParentStudentCards({ onSelect }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // فلاتر (مخفية حاليًا)
    const [q] = useState("");
    const [level] = useState("");
    const [gender] = useState("");

    // حالة الماب مودال
    const [mapOpen, setMapOpen] = useState(false);
    const [mapStudent, setMapStudent] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getParentStudents(1, 50);
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setRows(list);
            } catch (e) {
                setErr(e?.response?.data?.message || e?.message || "تعذّر جلب الطلاب");
                setRows([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const data = useMemo(() => {
        const nameMatch = (s) => !q || getName(s).toLowerCase().includes(q.trim().toLowerCase());
        const levelMatch = (s) => !level || getLevel(s) === level;
        const sexMatch = (s) => !gender || getGender(s) === gender;
        return rows.filter((s) => nameMatch(s) && levelMatch(s) && sexMatch(s));
    }, [rows, q, level, gender]);

    const openMapFor = (student) => {
        setMapStudent(student);
        setMapOpen(true);
    };

    return (
        <Box sx={{ direction: "rtl", px: { xs: 2.5, sm: 4.5, md: 7 }, py: { xs: 3, md: 4 }, bgcolor: COLORS.softBg }}>
            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

            <Grid container spacing={3} columns={12} sx={{ m: 0 }}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Grid item key={i} xs={12}>
                            <Card sx={{ p: 3, borderRadius: 3, border: COLORS.border }}>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="rounded" height={120} sx={{ my: 2 }} />
                                <Skeleton variant="text" width={260} height={24} />
                            </Card>
                        </Grid>
                    ))
                    : data.map((s) => {
                        const name = getName(s);
                        const code = getCode(s);
                        const genderLabel =
                            getGender(s) === "male" ? "ذكر" :
                                getGender(s) === "female" ? "أنثى" : "—";
                        const status = getStatus(s);

                        return (
                            <Grid item key={s.id ?? code} xs={12}>
                                <Card
                                    onClick={() => onSelect?.(s)}
                                    sx={{
                                        width: "100%",
                                        minHeight: 420,
                                        borderRadius: 4,
                                        border: COLORS.border,
                                        boxShadow: "0 12px 28px rgba(34,56,95,0.14)",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "transform .18s ease, box-shadow .18s ease",
                                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 18px 36px rgba(34,56,95,0.22)" },
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {/* شريط علوي */}
                                    <Box sx={{ height: 10, background: GRADIENT }} />

                                    {/* المحتوى */}
                                    <Box sx={{ p: { xs: 3, md: 3.5 }, flex: 1 }}>
                                        <Stack
                                            direction={{ xs: "column", md: "row" }}
                                            spacing={{ xs: 3, md: 3.5 }}
                                            alignItems="stretch"
                                        >
                                            {/* تعريف الطالب */}
                                            <Stack direction="column" spacing={1.5} sx={{ flex: 1, minWidth: 280, textAlign: "right" }}>
                                                <Avatar
                                                    src={getImg(s)}
                                                    alt={name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 120, height: 120, borderRadius: 4,
                                                        border: `3px solid ${COLORS.brand1}`, bgcolor: "#fff",
                                                        boxShadow: "0 8px 18px rgba(53,175,188,.25)",
                                                        alignSelf: "flex-start"
                                                    }}
                                                />

                                                <Typography sx={{ fontWeight: 900, color: COLORS.textMain, fontSize: 22, lineHeight: 1.25 }}>
                                                    {name}
                                                </Typography>

                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
                                                    <Chip
                                                        size="medium"
                                                        label={getLevel(s)}
                                                        icon={<SchoolRoundedIcon sx={{ mr: -.5, color: COLORS.brand2 }} />}
                                                        sx={{ bgcolor: COLORS.softChip, fontWeight: 700 }}
                                                    />
                                                    <Chip size="medium" label={getClass(s)} variant="outlined" sx={{ fontWeight: 700 }} />
                                                    {code !== "—" && (
                                                        <Chip
                                                            size="medium"
                                                            color="info"
                                                            label={code}
                                                            icon={<BadgeRoundedIcon />}
                                                            sx={{ bgcolor: COLORS.brand2, color: "#fff", fontWeight: 800, width: "8rem" }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>

                                            {/* وسط: بيانات الاتصال والتواريخ */}
                                            <Stack direction="row" spacing={{ xs: 2, md: 2.5 }} sx={{ flex: 2, minWidth: 340, flexWrap: "wrap" }}>
                                                <InfoItem icon={<EmailRoundedIcon />} label="البريد" value={getEmail(s)} wide />
                                                <InfoItem icon={<PhoneIphoneRoundedIcon />} label="الهاتف" value={getPhone(s)} />
                                                <InfoItem icon={<CalendarMonthRoundedIcon />} label="الميلاد" value={fmtDate(getDob(s))} />
                                                <InfoItem icon={<CalendarMonthRoundedIcon />} label="التحاق" value={fmtDate(getEnroll(s))} />
                                            </Stack>

                                            {/* يمين: الحالة والعنوان والملاحظات الطبية */}
                                            <Stack spacing={1.75} sx={{ flex: 2, minWidth: 360 }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    <Chip
                                                        size="medium"
                                                        label={
                                                            status === "active" ? "في المدرسة" :
                                                                status === "at_home" ? "في المنزل" :
                                                                    status === "on_way" ? "على الطريق" : status
                                                        }
                                                        sx={{ bgcolor: COLORS.softChip, color: COLORS.brand2, fontWeight: 800, px: 0.75 }}
                                                    />
                                                    <Chip
                                                        size="medium"
                                                        label={genderLabel}
                                                        icon={<WcRoundedIcon sx={{ mr: -.5, color: COLORS.brand2, width: "3rem" }} />}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </Stack>

                                                <TinyLabel>العنوان</TinyLabel>
                                                <Typography sx={{ color: "#425466", fontSize: 15.5, whiteSpace: "pre-line", lineHeight: 1.95 }}>
                                                    <LocationOnRoundedIcon sx={{ fontSize: 19, verticalAlign: "middle", ml: .85, color: COLORS.brand2 }} />
                                                    {getAddr(s)}
                                                </Typography>

                                                {getMed(s) && (
                                                    <>
                                                        <TinyLabel>معلومة طبية</TinyLabel>
                                                        <Typography
                                                            sx={{
                                                                color: COLORS.textSub, fontSize: 14.5, lineHeight: 2,
                                                                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                            }}
                                                            title={getMed(s)}
                                                        >
                                                            <MedicalServicesRoundedIcon sx={{ fontSize: 19, verticalAlign: "middle", ml: .85, color: COLORS.brand2 }} />
                                                            {getMed(s)}
                                                        </Typography>
                                                    </>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    {/* فاصل شفاف أعلى زر الخريطة */}
                                    <Divider sx={{ opacity: 0.15 }} />

                                    {/* زر الخريطة أسفل الكارد */}
                                    <Box sx={{ p: 2, pt: 1.5 }}>
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); openMapFor(s); }}
                                            fullWidth
                                            variant="contained"
                                            startIcon={<MapRoundedIcon sx={{ margin:"0 1rem" }}/>}
                                            sx={{
                                                bgcolor: COLORS.brand2,
                                                "&:hover": { bgcolor: COLORS.brand3 },
                                                height: 46,
                                                borderRadius: 2,
                                                fontWeight: 800,
                                                letterSpacing: 0.3,
                                            }}
                                        >
                                            عرض موقع الطالب على الخريطة
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
            </Grid>

            {/* موديول الخريطة للطالب */}
            <MapDialogStudent
                open={mapOpen}
                onClose={() => setMapOpen(false)}
                student={mapStudent}
            />
        </Box>
    );
}

/* عناصر صغيرة منسّقة — كما لديك */
function InfoItem({ icon, label, value, wide = false }) {
    return (
        <Paper elevation={0} sx={{ p: 1.25, px: 1.75, borderRadius: 2.5, bgcolor: "#fff", minWidth: wide ? 320 : 240, flexGrow: 1 }}>
            <Stack spacing={0.75}>
                <TinyLabel>{label}</TinyLabel>
                <Tooltip title={value || "—"}>
                    <Typography
                        sx={{
                            color: COLORS.textMain, fontWeight: 800, fontSize: 15.5,
                            display: "flex", alignItems: "center", gap: 1, maxWidth: 380,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}
                    >
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                            {React.cloneElement(icon, { sx: { fontSize: 19, color: COLORS.brand2 } })}
                        </Box>
                        {value || "—"}
                    </Typography>
                </Tooltip>
            </Stack>
        </Paper>
    );
}

function TinyLabel({ children }) {
    return (
        <Typography variant="caption" sx={{ color: "#6B7A90", fontWeight: 900, letterSpacing: 0.35, fontSize: 12.5 }}>
            {children}
        </Typography>
    );
}
