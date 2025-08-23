// src/components/Financial/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Divider,
    Switch,
    Avatar,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { getFinancialProfile } from "../../../api/Financial/Profile/getFinancialProfile";

const FinancialProfile = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [financial, setFinancial] = useState(null);
    const [loading, setLoading] = useState(true);
    const mainColor = "#2ea394";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getFinancialProfile();
                setFinancial(res?.data || null);
            } catch (err) {
                console.error("Error fetching financial profile:", err);
                setFinancial(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const Row = ({ label, value, hideDivider = false }) => (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" py={1.5} px={1}>
                <Box>
                    {label && (
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                            {label}
                        </Typography>
                    )}
                    {typeof value === "string" || typeof value === "number" ? (
                        <Typography variant="body2">{value || "—"}</Typography>
                    ) : (
                        value
                    )}
                </Box>
                <IconButton size="small" sx={{ color: mainColor }}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Box>
            {!hideDivider && <Divider sx={{ my: 1 }} />}
        </>
    );

    const fmt = (d, pattern = "dd/MM/yyyy") => {
        if (!d) return "—";
        const dt = new Date(d);
        return isNaN(dt) ? "—" : format(dt, pattern, { locale: arSA });
    };

    const f = financial || {};
    const u = f.user || {};

    const profileData = {
        image: u.image || "/avatar.jpg",
        fullName: f.name || u.name || "—",
        email: u.email || "—",
        userPrefix: u.prefix || "—",
        financialPrefix: f.prefix || "—",

        name: f.name || u.name || "—",
        phone: f.phone || "—",
        address: f.address || "", // قد لا تأتي في الداتا الحالية
        gender: f.gender || "",
        dob: fmt(f.dob),
        hiringDate: fmt(f.hiring_date),
        createdAt: fmt(u.created_at, "dd/MM/yyyy HH:mm"),
        updatedAt: fmt(u.updated_at, "dd/MM/yyyy HH:mm"),
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                    <Typography>جارِ تحميل بروفايل المالية…</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            {/* المعلومات الشخصية */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    المعلومات الشخصية لموظف المالية
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                        alt={profileData.fullName}
                        src={profileData.image && profileData.image !== "" ? profileData.image : undefined}
                        sx={{
                            width: 60,
                            height: 60,
                            ml: 2,
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            bgcolor: "#ccc",
                        }}
                    >
                        {(!profileData.image || profileData.image === "") &&
                            (profileData.fullName?.charAt(0) || "ف")}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" color="text.secondary" display="block">
                            {profileData.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="block">
                            {profileData.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Row label="الاسم" value={profileData.name} />
                <Row
                    label="الجنس"
                    value={
                        <Chip
                            label={
                                profileData.gender === "male"
                                    ? "ذكر"
                                    : profileData.gender === "female"
                                        ? "أنثى"
                                        : "—"
                            }
                            size="small"
                        />
                    }
                />
                <Row label="الهاتف" value={profileData.phone} />
                <Row label="العنوان" value={profileData.address || "—"} />
                <Row label="تاريخ الميلاد" value={profileData.dob} />
                <Row label="تاريخ التعيين" value={profileData.hiringDate} />
                <Row label="الرقم (Financial)" value={profileData.financialPrefix} hideDivider />
            </Paper>

            {/* معلومات المستخدم */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    معلومات المستخدم
                </Typography>
                <Row label="البريد الإلكتروني" value={profileData.email} />
                <Row label="المعرّف (User Prefix)" value={profileData.userPrefix} />
                <Row label="تاريخ إنشاء الحساب" value={profileData.createdAt} />
                <Row label="آخر تحديث" value={profileData.updatedAt} hideDivider />
            </Paper>

            {/* الحالة */}
            <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold" fontSize="1.1rem" color={mainColor}>
                        الحالة
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={isAvailable}
                            onChange={() => setIsAvailable(!isAvailable)}
                            color="success"
                        />
                        <Typography fontSize="0.9rem" fontWeight="medium">
                            Available now
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Row
                    label="الحالة"
                    value={<Chip label={isAvailable ? "متاح" : "غير متاح"} size="small" />}
                    hideDivider
                />
            </Paper>
        </Box>
    );
};

export default FinancialProfile;
