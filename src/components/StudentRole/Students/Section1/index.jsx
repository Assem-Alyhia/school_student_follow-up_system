// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Card, Typography, Avatar, Skeleton, Alert,
    TextField, InputAdornment, Select, MenuItem, FormControl, Button, Chip,
    Stack, Divider, Tooltip, Paper
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
import { getStudents } from "../../../../api/Student/Students/getStudents";

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
    borderSoft: "1px solid rgba(48,138,159,0.18)",
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

export default function StudentStudentsCards({ onSelect }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [q, setQ] = useState("");
    const [level, setLevel] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getStudents({ page: 1, per_page: 50 });
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

    const levelOptions = useMemo(
        () => [...new Set(rows.map(getLevel).filter(Boolean))],
        [rows]
    );

    const data = useMemo(() => {
        const nameMatch = (s) => !q || getName(s).toLowerCase().includes(q.trim().toLowerCase());
        const levelMatch = (s) => !level || getLevel(s) === level;
        const sexMatch = (s) => !gender || getGender(s) === gender;
        return rows.filter((s) => nameMatch(s) && levelMatch(s) && sexMatch(s));
    }, [rows, q, level, gender]);

    const reset = () => { setQ(""); setLevel(""); setGender(""); };

    return (
        <Box sx={{ direction: "rtl", px: { xs: 2.5, sm: 4.5, md: 7 }, py: { xs: 3, md: 4 }, bgcolor: COLORS.softBg }}>
            {/* العنوان وأدوات البحث */}
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between" spacing={3} sx={{ mb: 3.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 900, letterSpacing: 0.2, background: GRADIENT,
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            fontSize: { xs: 18, md: 20 }
                        }}
                    >
                        الطلاب
                    </Typography>
                    <Chip
                        label={`${data.length} طالب`}
                        sx={{ bgcolor: COLORS.brand2, color: "#fff", fontWeight: 800, px: 1.25, height: 28, borderRadius: 2 }}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap sx={{ width: "100%", maxWidth: 1200 }}>
                    <TextField
                        size="medium"
                        placeholder="ابحث بالاسم"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        sx={{ minWidth: 300, flex: 1, bgcolor: COLORS.fieldBg }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: COLORS.brand2 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="medium" sx={{ minWidth: 240, bgcolor: COLORS.fieldBg }}>
                        <Select value={level} displayEmpty onChange={(e) => setLevel(e.target.value)}>
                            <MenuItem value="">كل المراحل/الصفوف</MenuItem>
                            {levelOptions.map((lv) => (
                                <MenuItem key={lv} value={lv}>{lv}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="medium" sx={{ minWidth: 200, bgcolor: COLORS.fieldBg }}>
                        <Select value={gender} displayEmpty onChange={(e) => setGender(e.target.value)}>
                            <MenuItem value="">الكل (الجنس)</MenuItem>
                            <MenuItem value="male">ذكر</MenuItem>
                            <MenuItem value="female">أنثى</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        startIcon={<RestartAltRoundedIcon />}
                        onClick={reset}
                        sx={{
                            fontWeight: 800, color: COLORS.brand3, bgcolor: "#fff",
                            border: COLORS.border, px: 2, height: 40, borderRadius: 2,
                            "&:hover": { bgcolor: "#fff" },
                        }}
                    >
                        إعادة الضبط
                    </Button>
                </Stack>
            </Stack>

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
                                    }}
                                >
                                    <Box sx={{ height: 10, background: GRADIENT }} />

                                    <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                                        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 3.5 }} alignItems="stretch">
                                            {/* التعريف */}
                                            <Stack direction="column" spacing={1.5} sx={{ flex: 1, minWidth: 280, textAlign: "right" }}>
                                                <Avatar
                                                    src={getImg(s)}
                                                    alt={name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 120, height: 120, borderRadius: 4,
                                                        border: `3px solid ${COLORS.brand1}`, bgcolor: "#fff",
                                                        boxShadow: "0 8px 18px rgba(53,175,188,.25)", alignSelf: "flex-start"
                                                    }}
                                                />
                                                <Typography sx={{ fontWeight: 900, color: COLORS.textMain, fontSize: 22, lineHeight: 1.25 }}>
                                                    {name}
                                                </Typography>

                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
                                                    <Chip
                                                        size="medium"
                                                        label={getLevel(s)}
                                                        icon={<SchoolRoundedIcon sx={{ mr: -.5 }} />}
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

                                            {/* بيانات الاتصال والتواريخ */}
                                            <Stack direction="row" spacing={{ xs: 2, md: 2.5 }} sx={{ flex: 2, minWidth: 340, flexWrap: "wrap" }}>
                                                <InfoItem icon={<EmailRoundedIcon />} label="البريد" value={getEmail(s)} wide />
                                                <InfoItem icon={<PhoneIphoneRoundedIcon />} label="الهاتف" value={getPhone(s)} />
                                                <InfoItem icon={<CalendarMonthRoundedIcon />} label="الميلاد" value={fmtDate(getDob(s))} />
                                                <InfoItem icon={<CalendarMonthRoundedIcon />} label="التحاق" value={fmtDate(getEnroll(s))} />
                                            </Stack>

                                            {/* الحالة والعنوان والمعلومة الطبية */}
                                            <Stack spacing={1.75} sx={{ flex: 2, minWidth: 360 }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    <Chip
                                                        size="medium"
                                                        label={
                                                            status === "in_school" ? "في المدرسة" :
                                                                status === "at_home" ? "في المنزل" :
                                                                    status === "on_way" ? "على الطريق" :
                                                                        status === "absent" ? "غائب" : status
                                                        }
                                                        sx={{ bgcolor: COLORS.softChip, color: COLORS.brand2, fontWeight: 800, px: 0.75 }}
                                                    />
                                                    <Chip
                                                        size="medium"
                                                        label={genderLabel}
                                                        icon={<WcRoundedIcon sx={{ mr: -.5 }} />}
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
                                                                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                                                                overflow: "hidden"
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
                                </Card>
                            </Grid>
                        );
                    })}
            </Grid>
        </Box>
    );
}

/* عناصر صغيرة منسّقة */
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
        <Typography variant="caption" sx={{ color: COLORS.textSub, fontWeight: 900, letterSpacing: 0.35, fontSize: 12.5 }}>
            {children}
        </Typography>
    );
}
