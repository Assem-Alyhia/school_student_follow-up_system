// src/components/SupervisorRole/Parents/ParentDetailsModal.jsx
import React from "react";
import {
    Box, Modal, Paper, Typography, IconButton, Avatar, Chip, Divider,
    Grid, CircularProgress
} from "@mui/material";
import {
    Close as CloseIcon,
    Email as EmailIcon,
    PhoneIphone as PhoneIcon,
    Wc as GenderIcon,
    CalendarMonth as CalendarIcon,
    Home as HomeIcon,
    Badge as BadgeIcon,
    Person as PersonIcon,
    CreditCard as PrefixIcon,
    Groups as ChildrenIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getSupervisorParentById } from "../../../../api/Supervisor/Parents/getSupervisorParentById";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function ParentDetailsModal({ open, onClose, id }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supervisor-parent-by-id", id],
        queryFn: () => getSupervisorParentById(id).then((r) => r?.data ?? r),
        enabled: open && !!id,
    });

    const parent = data || {};
    const user = parent.user || {};
    const name = parent.name || user.name || "—";
    const email = user.email || "—";
    const phone = parent.phone || "—";
    const gender = asArGender(parent.gender);
    const dob = fmtDate(parent.dob);
    const createdAt = fmtDate(user.created_at || parent.created_at);
    const address = (parent.address || "—").split("\n").join("، ");
    const prefix = parent.prefix || "—";
    const userPrefix = user.prefix || "—";
    const avatarSrc = user.image || "";
    const students = Array.isArray(parent.students) ? parent.students : [];

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 820, maxWidth: "96%", p: "38px 28px 28px",
                    borderRadius: "16px", position: "relative", backgroundColor: "#fff", direction: "rtl",
                }}
            >
                {/* إغلاق */}
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 14, left: 18, color: "#308A9F" }}>
                    <CloseIcon />
                </IconButton>

                {/* بادج الدور */}
                <Box sx={{ position: "absolute", top: 14, right: 18, display: "flex", gap: 1 }}>
                    <Chip label="parent" size="small" sx={{ border: "1px solid #308A9F", color: "#308A9F", fontWeight: "bold" }} />
                    <Chip label="وليّ أمر" size="small" sx={{ border: "1px solid #FF5C5C", color: "#FF5C5C", fontWeight: "bold" }} />
                </Box>

                {/* أعلى: أفاتار + اسم + إيميل */}
                <Box sx={{ mt: 4.5, textAlign: "center" }}>
                    <Avatar
                        src={avatarSrc || undefined}
                        alt=""
                        sx={{ width: 84, height: 84, mx: "auto", mb: 1, border: "2px solid #308A9F", bgcolor: "#E6EEF5" }}
                        variant="rounded"
                    >
                        {!avatarSrc && <PersonIcon sx={{ color: "#9aa6b2", fontSize: 40 }} />}
                    </Avatar>

                    <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: "bold", mb: 0.6 }}>
                        {isLoading ? "..." : name}
                    </Typography>

                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "#7A8899", direction: "ltr" }}>
                        <EmailIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{email}</Typography>
                    </Box>
                </Box>

                {/* حالات التحميل/الخطأ */}
                {isLoading && (
                    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                        <CircularProgress size={28} />
                        <Typography sx={{ mt: 1.5, color: "#7A8899" }}>جاري تحميل البيانات…</Typography>
                    </Box>
                )}

                {isError && !isLoading && (
                    <Box sx={{ py: 3, textAlign: "center", color: "error.main" }}>
                        فشل الجلب: {error?.message || "حدث خطأ غير متوقع"}
                    </Box>
                )}

                {!isLoading && !isError && (
                    <>
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
                                    <InfoRow icon={<CalendarIcon />} label="تاريخ الإنشاء" value={createdAt} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<PrefixIcon />} label="رقم سجل وليّ الأمر" value={prefix} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<BadgeIcon />} label="رقم سجل المستخدم" value={userPrefix} />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoRow icon={<HomeIcon />} label="العنوان" value={address} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        {/* الأبناء: قائمة عمودية قابلة للتمرير */}
                        <SectionLabel icon={<ChildrenIcon />} text="الأبناء" />
                        {students.length === 0 ? (
                            <Typography sx={{ color: "#97A6B2", mb: 1 }}>لا يوجد أبناء مرتبطون.</Typography>
                        ) : (
                            <Box
                                sx={{
                                    maxHeight: 260,
                                    overflowY: "auto",
                                    pr: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.2,
                                }}
                            >
                                {students.map((st, i) => {
                                    const sUser = st?.user || {};
                                    return (
                                        <Box
                                            key={st?.id ?? i}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                                p: 1.2,
                                                border: "1px solid #E6EDF2",
                                                borderRadius: 2,
                                                bgcolor: "#FAFCFD",
                                            }}
                                        >
                                            <Avatar
                                                src={sUser.image || "/images/avatars/default.png"}
                                                alt=""
                                                sx={{ width: 44, height: 44, borderRadius: 2 }}
                                                variant="rounded"
                                            />
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 800, color: "#22385F" }}>
                                                    {st?.name || sUser?.name || "—"}
                                                </Typography>
                                                <Typography sx={{ color: "#5E7285", fontSize: 13 }}>
                                                    الرقم: <b>{st?.prefix || sUser?.prefix || "—"}</b> • الجنس:{" "}
                                                    <b>{asArGender(st?.gender)}</b>
                                                </Typography>
                                                <Typography sx={{ color: "#7A8899", fontSize: 12 }} dir="ltr">
                                                    {st?.phone || "—"}
                                                </Typography>
                                                <Typography sx={{ color: "#7A8899", fontSize: 12 }}>
                                                    {(st?.address || "—").split("\n").join("، ")}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </>
                )}
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
