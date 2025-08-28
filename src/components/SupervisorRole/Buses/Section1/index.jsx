// src/components/SupervisorRole/Buses/Section1.jsx
import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    Tooltip,
} from "@mui/material";
import {
    DirectionsBusFilled as BusIcon,
    Place as PlaceIcon,
    Circle as CircleIcon,
    Person as PersonIcon,
    PhoneIphone as PhoneIcon,
    EventSeat as SeatIcon,
    Category as TypeIcon,
    Badge as BadgeIcon,
} from "@mui/icons-material";

import MapDialogSupervisorStudent from "../MapDialog";

const BORDER = "1px solid rgba(48,138,159,.45)";
const CARD_SHADOW = "0 8px 24px rgba(34,56,95,.10)";
const TITLE_COLOR = "#1aa1b3";
const LINK_COLOR = "#1e88e5";
const MUTED = "#6c7a89";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function Section1({ buses = [] }) {
    const [mapOpen, setMapOpen] = useState(false);
    const [mapTarget, setMapTarget] = useState(null);

    const openMapForSupervisor = (bus) => {
        const sup = bus?.supervisor || {};
        const mockStudent = {
            name: sup.name || "—",
            user: { image: "" }, 
            supervisor: {
                id: sup.id,
                name: sup.name,
                prefix: sup.prefix,
            },
        };
        setMapTarget(mockStudent);
        setMapOpen(true);
    };

    return (
        <Box sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 }, direction: "rtl" }}>
            <Grid container spacing={3}>
                {buses.map((b, i) => {
                    const id = b?.id ?? i;
                    const reg = b?.prefix || (b?.id ? `B-${String(b.id).padStart(4, "0")}` : "—");

                    const title = "الحافلة";
                    const status = b?.status;
                    const isActive = typeof status === "string" ? status.toLowerCase() === "active" : Boolean(status);
                    const statusText = isActive ? "المحرك في وضع التشغيل" : "متوقفة";

                    const driverName = b?.driver_name || "—";
                    const driverPhone = b?.driver_number || "—";
                    const capacity = b?.capacity ?? "—";
                    const busType = b?.bus_type || "—";
                    const createdAt = fmtDate(b?.created_at);

                    const supervisorName = b?.supervisor?.name || "—";
                    const supervisorCode = b?.supervisor?.prefix || "—";

                    return (
                        <Grid item xs={12} sm={12} md={12} key={`${id}-${reg}`}>
                            <Paper
                                elevation={0}
                                sx={{
                                    position: "relative",
                                    border: BORDER,
                                    borderRadius: 3,
                                    boxShadow: CARD_SHADOW,
                                    bgcolor: "#fff",
                                    pt: 5,
                                    pr: 4,
                                    pb: 3.5,
                                    pl: 4,
                                    minHeight: 220,
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{ position: "absolute", top: 14, left: 16, color: "#A0A8B0" }}
                                >
                                    {reg}
                                </Typography>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: 24,
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        background: "#fff",
                                        border: "1px solid rgba(53,175,188,0.25)",
                                        boxShadow: "0 4px 12px rgba(34,56,95,.18)",
                                    }}
                                >
                                    <BusIcon sx={{ fontSize: 22, color: "#308A9F" }} />
                                </Box>

                                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: 20,
                                            color: TITLE_COLOR,
                                            textDecoration: "underline",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {title}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                        <Tooltip title={isActive ? "نشطة" : "خامدة"}>
                                            <CircleIcon sx={{ fontSize: 14, color: isActive ? "#2ECC71" : "#98A2B3" }} />
                                        </Tooltip>
                                        <Chip
                                            size="small"
                                            label={statusText}
                                            sx={{
                                                bgcolor: "#F6FAFB",
                                                border: "1px solid #E3ECEF",
                                                color: "#203656",
                                                fontWeight: 700,
                                                height: 28,
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={8}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
                                            <BadgeIcon sx={{ fontSize: 20, color: "#203656" }} />
                                            <Typography sx={{ color: "#203656", fontWeight: 800, fontSize: 15 }}>
                                                {supervisorName}
                                            </Typography>
                                            <Typography sx={{ color: MUTED, fontWeight: 600, fontSize: 14 }}>
                                                ({supervisorCode})
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: "right", md: "left" } }}>
                                        <Typography sx={{ color: MUTED, fontWeight: 700, fontSize: 14 }}>
                                            تمت الإضافة: {createdAt}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3} sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
                                            <PersonIcon sx={{ fontSize: 20, color: "#203656" }} />
                                            <Typography sx={{ color: "#203656", fontWeight: 800, fontSize: 15 }}>
                                                {driverName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: "right", md: "left" } }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                                justifyContent: { xs: "flex-start", md: "flex-end" },
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <PhoneIcon sx={{ fontSize: 20, color: "#203656" }} />
                                            <Typography sx={{ color: "#203656", fontWeight: 800, fontSize: 15 }}>
                                                {driverPhone}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
                                            <SeatIcon sx={{ fontSize: 20, color: "#203656" }} />
                                            <Typography sx={{ color: "#203656", fontWeight: 800, fontSize: 15 }}>
                                                السعة: {capacity}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: "right", md: "left" } }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                                justifyContent: { xs: "flex-start", md: "flex-end" },
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <TypeIcon sx={{ fontSize: 20, color: "#203656" }} />
                                            <Typography sx={{ color: "#203656", fontWeight: 800, fontSize: 15 }}>
                                                النوع: {busType}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Box
                                    onClick={() => openMapForSupervisor(b)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === "Enter" ? openMapForSupervisor(b) : null)}
                                    sx={{
                                        display: "block",
                                        width: "100%",
                                        cursor: "pointer",
                                        color: LINK_COLOR,
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PlaceIcon sx={{ fontSize: 20 }} />
                                        <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.9 }}>
                                            افحص الموقع على الخريطة
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <MapDialogSupervisorStudent
                open={mapOpen}
                onClose={() => setMapOpen(false)}
                student={mapTarget}
            />
        </Box>
    );
}
