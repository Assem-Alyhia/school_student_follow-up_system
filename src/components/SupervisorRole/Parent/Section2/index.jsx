// src/components/SupervisorRole/Parents/ParentsCards.jsx
import React from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    IconButton,
    Button,
    Avatar,
    AvatarGroup,
    Chip,
} from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    CalendarMonth as CalendarMonthIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GRADIENT = "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function Section2({ parents = [] }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3, direction: "rtl" }}>
            <Grid container spacing={3}>
                {parents.map((p, idx) => {
                    const id = p?.id ?? p?.user?.id ?? idx;
                    const prefix = p?.prefix || p?.user?.prefix || "—";
                    const name = p?.user?.name || p?.name || "—";
                    const email = p?.user?.email || p?.email || "—";
                    const image = p?.user?.image || "/images/avatars/default.png";
                    const created = fmtDate(p?.user?.created_at || p?.created_at);
                    const phone =
                        p?.phone ||
                        (Array.isArray(p?.students) && p.students[0]?.phone) ||
                        "—";

                    const students = Array.isArray(p?.students) ? p.students : [];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={`${id}-${prefix}`}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2.5,
                                    border: "1px solid rgba(53,175,188,0.35)",
                                    boxShadow: "0 10px 24px rgba(34,56,95,0.10)",
                                    bgcolor: "#fff",
                                    position: "relative",
                                    minHeight: { xs: 420, sm: 430 },
                                }}
                            >
                                {/* أعلى البطاقة: رقم وليّ الأمر + شارة */}
                                <Typography
                                    variant="caption"
                                    sx={{ position: "absolute", top: 12, left: 14, color: "#A0A8B0" }}
                                >
                                    {prefix}
                                </Typography>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        right: 12,
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        background: "#fff",
                                        border: "1px solid rgba(53,175,188,0.25)",
                                        boxShadow: "0 2px 8px rgba(34,56,95,0.14)",
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 17, color: "#308A9F" }} />
                                </Box>

                                {/* صورة وليّ الأمر */}
                                <Box sx={{ display: "grid", placeItems: "center", mt: 3, mb: 1 }}>
                                    <Box sx={{ position: "relative" }}>
                                        <Avatar
                                            src={image}
                                            alt={name}
                                            variant="rounded"
                                            sx={{
                                                width: 104,
                                                height: 104,
                                                borderRadius: 2,
                                                bgcolor: "#fff",
                                                boxShadow: "0 14px 28px rgba(34,56,95,.14)",
                                            }}
                                        />
                                        {/* نقطة حالة زخرفية */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                right: -4,
                                                bottom: -4,
                                                width: 14,
                                                height: 14,
                                                borderRadius: "50%",
                                                bgcolor: "#2ecc71",
                                                border: "2px solid #fff",
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* الاسم + تاريخ الإضافة */}
                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: 900,
                                        fontSize: 18,
                                        color: "#308A9F",
                                        textAlign: "center",
                                        letterSpacing: ".2px",
                                    }}
                                >
                                    {name}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        color: "#7A8899",
                                        mb: 2,
                                    }}
                                >
                                    <CalendarMonthIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body2">تمت الإضافة</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {created}
                                    </Typography>
                                </Box>

                                {/* شريط البريد */}
                                <Box
                                    sx={{
                                        background: GRADIENT,
                                        px: 2,
                                        py: 1.1,
                                        borderRadius: 1.8,
                                        width: "92%",
                                        mx: "auto",
                                        my: 1.6,
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,.28)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 1.2,
                                        }}
                                    >
                                        <EmailIcon sx={{ color: "#fff", fontSize: 17 }} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#fff", fontSize: 14, direction: "ltr" }}
                                        >
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* شريط الهاتف */}
                                <Box
                                    sx={{
                                        background: GRADIENT,
                                        px: 2,
                                        py: 1.1,
                                        borderRadius: 1.8,
                                        width: "92%",
                                        mx: "auto",
                                        my: 1,
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 1.2,
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: "#fff", fontSize: 17 }} />
                                        <Typography variant="body2" sx={{ color: "#fff", fontSize: 14 }}>
                                            {phone}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* أبناء مرتبطون */}
                                {!!students.length && (
                                    <Box sx={{ mt: 2, mb: 1.5 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#7A8899", fontWeight: 700, mb: 1 }}
                                        >
                                            الأبناء
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                            }}
                                        >
                                            <AvatarGroup max={4} sx={{ direction: "ltr" }}>
                                                {students.slice(0, 8).map((st, i) => (
                                                    <Avatar
                                                        key={`${st?.id ?? i}-child`}
                                                        alt={st?.name}
                                                        src={st?.user?.image || "/images/avatars/default.png"}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        {st?.name?.charAt(0)}
                                                    </Avatar>
                                                ))}
                                            </AvatarGroup>

                                            <Chip
                                                size="small"
                                                label={`${students.length} طالب/ـة`}
                                                sx={{ bgcolor: "#F4F7F9", border: "1px solid #E3ECEF", color: "#5E7285" }}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* أزرار أسفل البطاقة */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mt: 2.2,
                                        direction: "ltr",
                                    }}
                                >
                                    <Box sx={{ display: "flex", gap: 1.2 }}>
                                        {[<PhoneIcon />, <EmailIcon />].map((Icon, i) => (
                                            <IconButton
                                                key={i}
                                                size="small"
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    bgcolor: "#F4F7F9",
                                                    border: "1px solid #E3ECEF",
                                                    boxShadow: "0 3px 8px rgba(34,56,95,0.10)",
                                                }}
                                            >
                                                {React.cloneElement(Icon, { sx: { color: "#8FA0AE", fontSize: 17 } })}
                                            </IconButton>
                                        ))}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        onClick={() =>
                                            navigate(`/supervisorDashboard/parents/details/${id}`)
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            px: 2.6,
                                            py: 0.6,
                                            borderColor: "#D0DCE0",
                                            color: "#5E7285",
                                            fontWeight: 800,
                                            "&:hover": { borderColor: "#308A9F", color: "#308A9F" },
                                        }}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
