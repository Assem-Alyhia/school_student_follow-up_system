// components/users/UserDetails.jsx
import React from "react";
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Avatar,
    Chip,
    Divider,
    Grid,
} from "@mui/material";
import {
    Close as CloseIcon,
    Email as EmailIcon,
    CalendarMonth as CalendarIcon,
    Groups as RolesIcon,
    Shield as ShieldIcon,
    Badge as PrefixIcon,
    Person as PersonIcon,
} from "@mui/icons-material";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function UserDetails({ open, onClose, user }) {
    const u = (user && (user.data || user)) || {};

    const prefix = u.prefix || "—";
    const name = u.name || "—";
    const email = u.email || "—";
    const roles = Array.isArray(u.roles) ? u.roles : [];
    const permissions = Array.isArray(u.permissions) ? u.permissions : [];
    const createdAt = fmtDate(u.created_at);
    const avatarSrc = u.image || "";

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 640,
                    maxWidth: "95%",
                    p: "38px 28px 28px",
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    direction: "rtl",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 14, left: 18, color: "#308A9F" }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 18,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Chip
                        label={roles?.[0] || "user"}
                        size="small"
                        sx={{
                            border: "1px solid #308A9F",
                            color: "#308A9F",
                            fontWeight: "bold",
                        }}
                    />
                    <Chip
                        label="مستخدم"
                        size="small"
                        sx={{
                            border: "1px solid #FF5C5C",
                            color: "#FF5C5C",
                            fontWeight: "bold",
                        }}
                    />
                </Box>

                <Box sx={{ mt: 4.5, textAlign: "center" }}>
                    <Avatar
                        src={avatarSrc || undefined}
                        alt=""
                        variant="rounded"
                        sx={{
                            width: 84,
                            height: 84,
                            mx: "auto",
                            mb: 1,
                            border: "2px solid #308A9F",
                            bgcolor: "#E6EEF5",
                        }}
                    >
                        {!avatarSrc && <PersonIcon sx={{ color: "#9aa6b2", fontSize: 40 }} />}
                    </Avatar>

                    <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: "bold", mb: 0.6 }}>
                        {name}
                    </Typography>

                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#7A8899",
                            direction: "ltr",
                        }}
                    >
                        <EmailIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{email}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2.2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<PrefixIcon />} label="رقم المستخدم" value={prefix} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<CalendarIcon />} label="تاريخ الإنشاء" value={createdAt} />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Grid container spacing={2.2}>
                    <Grid item xs={12} md={4}>
                        <SectionLabel icon={<RolesIcon />} text="الأدوار" />
                        <TagsList items={roles} emptyText="—" />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <SectionLabel icon={<ShieldIcon />} text="الصلاحيات" />
                        <TagsList
                            items={permissions}
                            emptyText="—"
                            sx={{ maxHeight: 140, overflow: "auto", pr: 0.5 }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
}


function InfoRow({ icon, label, value }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ color: "#203656" }}>{icon}</Box>
            <Typography sx={{ color: "#308A9F", fontWeight: "bold", minWidth: 120 }}>
                {label}:
            </Typography>
            <Typography sx={{ color: "#203656", fontWeight: 700 }}>{value || "—"}</Typography>
        </Box>
    );
}

function SectionLabel({ icon, text }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ color: "#308A9F" }}>{icon}</Box>
            <Typography sx={{ color: "#308A9F", fontWeight: 900 }}>{text}</Typography>
        </Box>
    );
}

function TagsList({ items = [], emptyText = "—", sx }) {
    if (!items.length) return <Typography sx={{ color: "#97A6B2" }}>{emptyText}</Typography>;
    return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", ...sx }}>
            {items.map((x, i) => (
                <Chip
                    key={i}
                    size="small"
                    label={x}
                    sx={{
                        bgcolor: "#F6FAFB",
                        border: "1px solid #E3ECEF",
                        color: "#203656",
                        fontWeight: 600,
                    }}
                />
            ))}
        </Box>
    );
}
