// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Card, Typography, Avatar, Skeleton, Alert,
    TextField, InputAdornment, Select, MenuItem, FormControl, Button, Stack, Chip, Divider
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { getParentTeachers } from "../../../../api/Parent/Teachers/getParentTeachers";

const GRADIENT = "linear-gradient(180deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";
const COLORS = {
    brand1: "#35AFBC",
    brand2: "#308A9F",
    brand3: "#22385F",
    textSub: "#6B7A90",
    field: "#FFFFFF",
    border: "1px solid rgba(48,138,159,0.18)",
};

const getName = (t) => t?.name || t?.user?.name || "—";
const getImg = (t) => t?.user?.image || "/images/avatars/default.png";
const getGender = (t) => t?.gender || "";
const getCode = (t) => t?.prefix || "—";
const getEmail = (t) => t?.user?.email || "—";
const getPhone = (t) => t?.phone || "—";
const getSpec = (t) => t?.specialization || "—";
const getAddress = (t) => t?.address || "—";
const getDob = (t) => t?.dob || "";
const getHire = (t) => t?.hiring_date || "";
const getClassrooms = (t) =>
    Array.isArray(t?.classrooms) && t.classrooms.length
        ? t.classrooms.map((c) => c?.name).filter(Boolean).join("، ")
        : "—";

const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("ar-EG");
};

export default function ParentTeacher({ onSelect }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // فلاتر مبسّطة
    const [q, setQ] = useState("");
    const [sex, setSex] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getParentTeachers(1, 50);
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setItems(list);
            } catch (e) {
                setErr(e?.response?.data?.message || e?.message || "تعذّر جلب المعلّمين");
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const data = useMemo(() => {
        const nameMatch = (t) => !q || getName(t).toLowerCase().includes(q.trim().toLowerCase());
        const sexMatch = (t) => !sex || getGender(t) === sex;
        return items.filter((t) => nameMatch(t) && sexMatch(t));
    }, [items, q, sex]);

    const reset = () => { setQ(""); setSex(""); };

    return (
        <Box sx={{ direction: "rtl", px: { xs: 2.5, sm: 4, md: 6 }, py: { xs: 2.5, md: 3.5 } }}>
            {/* شريط البحث */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mb: 2.5 }}>
                <TextField
                    size="small"
                    placeholder="ابحث بالاسم"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
                    sx={{ flex: 1, minWidth: 240, bgcolor: COLORS.field }}
                />
                <FormControl size="small" sx={{ minWidth: 160, bgcolor: COLORS.field }}>
                    <Select value={sex} displayEmpty onChange={(e) => setSex(e.target.value)}>
                        <MenuItem value="">الكل (الجنس)</MenuItem>
                        <MenuItem value="male">ذكر</MenuItem>
                        <MenuItem value="female">أنثى</MenuItem>
                    </Select>
                </FormControl>
                <Button size="small" startIcon={<RestartAltRoundedIcon />} onClick={reset}>
                    إعادة الضبط
                </Button>
            </Stack>

            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

            <Grid container spacing={2.5} columns={12} sx={{ m: 0 }}>
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <Grid item key={i} xs={12}>
                            <Card sx={{ p: 3, borderRadius: 3, border: COLORS.border }}>
                                <Skeleton variant="text" width={140} height={24} />
                                <Skeleton variant="rounded" height={120} sx={{ my: 2 }} />
                                <Skeleton variant="text" width={260} height={22} />
                            </Card>
                        </Grid>
                    ))
                    : data.map((t) => {
                        const name = getName(t);
                        const genderLabel = getGender(t) === "male" ? "ذكر" : getGender(t) === "female" ? "أنثى" : "—";
                        return (
                            // بطاقة بعرض الصفحة (عمود كامل)
                            <Grid item key={t.id ?? name} xs={12}>
                                <Card
                                    onClick={() => onSelect?.(t)}
                                    sx={{
                                        width: "100%",
                                        borderRadius: 3,
                                        border: "2px solid #308A9F22",
                                        boxShadow: "0 12px 28px rgba(34,56,95,0.14)",
                                        cursor: "pointer",
                                        overflow: "hidden",
                                        transition: "transform .18s ease, box-shadow .18s ease",
                                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 18px 36px rgba(34,56,95,0.22)" },
                                    }}
                                >
                                    {/* شريط علوي بنفس التدرّج الحالي */}
                                    <Box sx={{ height: 10, background: GRADIENT }} />

                                    <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                                        <Stack
                                            direction={{ xs: "column", md: "row" }}
                                            spacing={{ xs: 2.5, md: 3 }}
                                            alignItems="stretch"
                                        >
                                            {/* 1) تعريف المعلم */}
                                            <Stack sx={{ minWidth: 260, flex: 1 }} spacing={1.25}>
                                                <Avatar
                                                    src={getImg(t)}
                                                    alt={name}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 110, height: 110, borderRadius: 3,
                                                        border: `3px solid ${COLORS.brand1}`, bgcolor: "#fff",
                                                        boxShadow: "0 8px 18px rgba(53,175,188,.25)"
                                                    }}
                                                />
                                                <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1.25 }}>
                                                    <Box
                                                        component="span"
                                                        sx={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                                                    >
                                                        {name}
                                                    </Box>
                                                </Typography>

                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    <Chip size="small" icon={<BadgeRoundedIcon />} label={getCode(t)} />
                                                    <Chip size="small" icon={<WcRoundedIcon />} label={genderLabel} variant="outlined" />
                                                </Stack>

                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    <Chip
                                                        size="small"
                                                        icon={<SchoolRoundedIcon sx={{ color: COLORS.brand2 }} />}
                                                        label={getClassrooms(t)}
                                                        sx={{ bgcolor: "rgba(53,175,188,.08)", fontWeight: 700 }}
                                                    />
                                                    <Chip size="small" label={getSpec(t)} variant="outlined" />
                                                </Stack>
                                            </Stack>

                                            {/* فاصل صغير على الشاشات الواسعة */}
                                            <Divider flexItem sx={{ display: { xs: "none", md: "block" } }} />

                                            {/* 2) معلومات التواصل والتواريخ والعنوان */}
                                            <Stack sx={{ flex: 3, minWidth: 320 }} spacing={1.25}>
                                                <Row icon={<EmailRoundedIcon />} label="البريد" value={getEmail(t)} />
                                                <Row icon={<PhoneIphoneRoundedIcon />} label="الهاتف" value={getPhone(t)} />
                                                <Row icon={<CalendarMonthRoundedIcon />} label="الميلاد" value={fmtDate(getDob(t))} />
                                                <Row icon={<CalendarMonthRoundedIcon />} label="التوظيف" value={fmtDate(getHire(t))} />
                                                <Row icon={<LocationOnRoundedIcon />} label="العنوان" value={getAddress(t)} multiline />
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

function Row({ icon, label, value, multiline = false }) {
    return (
        <Stack spacing={0.25}>
            <Typography variant="caption" sx={{ color: COLORS.textSub, fontWeight: 900 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontWeight: 800,
                    color: "#22385F",
                    lineHeight: 1.9,
                    whiteSpace: multiline ? "pre-line" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                <Box component="span" sx={{ verticalAlign: "middle", mr: 0.75 }}>
                    {React.cloneElement(icon, { sx: { fontSize: 18, color: COLORS.brand2 } })}
                </Box>
                {value || "—"}
            </Typography>
        </Stack>
    );
}
