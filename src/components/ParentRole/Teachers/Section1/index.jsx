// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Card, Typography, Avatar, Skeleton, Alert,
    TextField, InputAdornment, Select, MenuItem, FormControl, Button
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { getParentTeachers } from "../../../../api/Parent/Teachers/getParentTeachers";

const GRADIENT = "linear-gradient(180deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";

const getName = (t) => t?.name || t?.user?.name || "—";
const getImg = (t) => t?.user?.image || "/images/avatars/default.png";
const getCls = (t) => t?.classroom?.name || t?.classroom_name || "";
const getSex = (t) => t?.gender || "";

export default function ParentTeacher({ onSelect }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // فلاتر مبسّطة
    const [q, setQ] = useState("");
    const [cls, setCls] = useState("");
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
            } finally { setLoading(false); }
        })();
    }, []);

    const classOptions = useMemo(() => [...new Set(items.map(getCls).filter(Boolean))], [items]);

    const data = useMemo(() => {
        const nameMatch = (t) => !q || getName(t).toLowerCase().includes(q.trim().toLowerCase());
        const clsMatch = (t) => !cls || getCls(t) === cls;
        const sexMatch = (t) => !sex || getSex(t) === sex;
        return items.filter((t) => nameMatch(t) && clsMatch(t) && sexMatch(t));
    }, [items, q, cls, sex]);

    const reset = () => { setQ(""); setCls(""); setSex(""); };

    return (
        <Box sx={{ direction: "rtl", px: { xs: 2, sm: 3, md: 5 }, py: { xs: 2, md: 3 } }}>
            {/* شريط بسيط: بحث بالاسم + صف + جنس + إعادة ضبط */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <TextField
                    size="small" placeholder="ابحث بالاسم"
                    value={q} onChange={(e) => setQ(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
                    sx={{ minWidth: 220, flex: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select value={cls} displayEmpty onChange={(e) => setCls(e.target.value)}>
                        <MenuItem value="">كل الصفوف</MenuItem>
                        {classOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select value={sex} displayEmpty onChange={(e) => setSex(e.target.value)}>
                        <MenuItem value="">الكل (الجنس)</MenuItem>
                        <MenuItem value="male">ذكر</MenuItem>
                        <MenuItem value="female">أنثى</MenuItem>
                    </Select>
                </FormControl>
                <Button size="small" startIcon={<RestartAltRoundedIcon />} onClick={reset}>إعادة الضبط</Button>
            </Box>

            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

            <Grid container spacing={3} columns={12} sx={{ m: 0 }}>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Grid item key={i} xs={12} sm={6} md={4} lg={4}>
                            <Card sx={{ p: 2, borderRadius: 2, border: "2px solid #308A9F20" }}>
                                <Skeleton variant="text" width={80} sx={{ ml: "auto" }} />
                                <Skeleton variant="rounded" width={120} height={120} sx={{ mx: "auto", my: 1.5, borderRadius: 3 }} />
                                <Skeleton variant="text" sx={{ mx: "auto" }} width={140} />
                                <Skeleton variant="text" sx={{ mx: "auto" }} width={100} />
                            </Card>
                        </Grid>
                    ))
                    : data.map((t) => {
                        const name = getName(t), clsName = getCls(t);
                        return (
                            <Grid item key={t.id ?? name} xs={12} sm={6} md={4} lg={4} sx={{ display: "flex" }}>
                                <Card
                                    onClick={() => onSelect?.(t)}
                                    sx={{
                                        width: "100%", p: 2, borderRadius: 2, cursor: "pointer",
                                        border: "2px solid #308A9F", boxShadow: "0 10px 24px rgba(34,56,95,.15)",
                                        transition: "transform .18s ease, box-shadow .18s ease",
                                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 28px rgba(34,56,95,.22)" }
                                    }}
                                >
                                    <Box sx={{ width: 120, height: 120, mx: "auto", my: 1.5, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "#fff" }}>
                                        <Avatar src={getImg(t)} alt={name} variant="rounded" sx={{ width: 96, height: 96, borderRadius: 3 }} />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 900, fontSize: 22, lineHeight: 1.2, mt: 1, mb: .5, textAlign: "center",
                                            background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                    <Typography sx={{ color: "#8A8F99", fontSize: 15, fontWeight: 700, textAlign: "center" }}>
                                        {clsName || "—"}{getSex(t) ? ` • ${getSex(t) === "male" ? "ذكر" : "أنثى"}` : ""}
                                    </Typography>
                                </Card>
                            </Grid>
                        );
                    })}
            </Grid>
        </Box>
    );
}
