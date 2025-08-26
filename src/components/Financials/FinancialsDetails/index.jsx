// components/financials/FinancialsDetails.jsx
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
    PhoneIphone as PhoneIcon,
    Wc as GenderIcon,
    CalendarMonth as CalendarIcon,
    Badge as BadgeIcon,
    Shield as ShieldIcon,
    Groups as RolesIcon,
    Person as PersonIcon,
    CreditCard as PrefixIcon,
} from "@mui/icons-material";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");


export default function FinancialsDetails({ open, onClose, financial }) {
    // ندعم الشكلين: {data:{...}} أو {...}
    const fin = financial?.data ?? financial ?? {};
    const user = fin.user ?? {};

    const name = fin.name || user.name || "—";
    const email = user.email || "—";
    const phone = fin.phone || "—";
    const gender = asArGender(fin.gender);
    const dob = fmtDate(fin.dob);
    const hiringDate = fmtDate(fin.hiring_date || user.created_at);
    const prefix = fin.prefix || "—";
    const userPrefix = user.prefix || "—";
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    const avatarSrc = user.image || "";

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
                    width: 680,
                    maxWidth: "95%",
                    p: "38px 28px 28px",
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    direction: "rtl",
                }}
            >
                {/* زر إغلاق */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 14, left: 18, color: "#308A9F" }}
                >
                    <CloseIcon />
                </IconButton>

                {/* بادجات يمين أعلى */}
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
                        label={roles?.[0] || "financial"}
                        size="small"
                        sx={{
                            border: "1px solid #308A9F",
                            color: "#308A9F",
                            fontWeight: "bold",
                        }}
                    />
                    <Chip
                        label="موظف مالي"
                        size="small"
                        sx={{
                            border: "1px solid #FF5C5C",
                            color: "#FF5C5C",
                            fontWeight: "bold",
                        }}
                    />
                </Box>

                {/* أعلى: أفاتار + اسم + إيميل */}
                <Box sx={{ mt: 4.5, textAlign: "center" }}>
                    <Avatar
                        src={avatarSrc || undefined}
                        alt=""
                        sx={{
                            width: 84,
                            height: 84,
                            mx: "auto",
                            mb: 1,
                            border: "2px solid #308A9F",
                            bgcolor: "#E6EEF5",
                        }}
                        variant="rounded"
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

                {/* معلومات أساسية */}
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2.2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<PhoneIcon />} label="الهاتف" value={phone} dir="ltr" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<GenderIcon />} label="الجنس" value={gender} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<CalendarIcon />} label="تاريخ الميلاد" value={dob} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<CalendarIcon />} label="تاريخ التعيين" value={hiringDate} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<PrefixIcon />} label="رقم الموظف المالي" value={prefix} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow icon={<BadgeIcon />} label="رقم المستخدم" value={userPrefix} />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* الأدوار والصلاحيات */}
                <Grid container spacing={2.2}>
                    <Grid item xs={12} md={4}>
                        <SectionLabel icon={<RolesIcon />} text="الأدوار" />
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {roles.length ? (
                                roles.map((r, i) => (
                                    <Chip
                                        key={i}
                                        size="small"
                                        label={r}
                                        sx={{
                                            bgcolor: "#F1F7F9",
                                            border: "1px solid #D9E7EC",
                                            color: "#203656",
                                            fontWeight: 700,
                                        }}
                                    />
                                ))
                            ) : (
                                <Typography sx={{ color: "#97A6B2" }}>—</Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <SectionLabel icon={<ShieldIcon />} text="الصلاحيات" />
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                maxHeight: 140,
                                overflow: "auto",
                                pr: 0.5,
                            }}
                        >
                            {permissions.length ? (
                                permissions.map((p, i) => (
                                    <Chip
                                        key={i}
                                        size="small"
                                        label={p}
                                        sx={{
                                            bgcolor: "#F6FAFB",
                                            border: "1px solid #E3ECEF",
                                            color: "#203656",
                                            fontWeight: 600,
                                        }}
                                    />
                                ))
                            ) : (
                                <Typography sx={{ color: "#97A6B2" }}>—</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
}


function InfoRow({ icon, label, value, dir }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ color: "#203656" }}>{icon}</Box>
            <Typography sx={{ color: "#308A9F", fontWeight: "bold", minWidth: 140 }}>
                {label}:
            </Typography>
            <Typography sx={{ color: "#203656", fontWeight: 700, direction: dir || "rtl" }}>
                {value || "—"}
            </Typography>
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
