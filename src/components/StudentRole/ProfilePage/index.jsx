// src/components/Student/ProfilePage.jsx
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
// عدّل المسار حسب مشروعك
import { getStudentProfile } from './../../../api/Student/Profile/getStudentProfile';

const StudentProfile = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const mainColor = "#2ea394";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getStudentProfile();
                // الـ API يعيد { data: {...student} }
                setStudent(res?.data || null);
            } catch (err) {
                console.error("Error fetching student profile:", err);
                setStudent(null);
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

    const s = student || {};
    const u = s.user || {};

    const statusLabel = (status) => {
        switch (status) {
            case "at_home":
                return "في المنزل";
            case "in_school":
                return "في المدرسة";
            case "absent":
                return "غائب";
            default:
                return "—";
        }
    };

    const profileData = {
        image: u.image || "/avatar.jpg",
        fullName: s.name || u.name || "—",
        email: u.email || "—",

        userPrefix: u.prefix || "—",
        studentPrefix: s.prefix || "—",

        name: s.name || u.name || "—",
        phone: s.phone || "—",
        address: s.address || "",
        gender: s.gender || "",
        dob: fmt(s.dob),
        enrollmentDate: fmt(s.enrollment_date),

        status: statusLabel(s.status),
        medicalInfo: s.medical_info || "—",

        createdAt: fmt(u.created_at, "dd/MM/yyyy HH:mm"),
        updatedAt: fmt(u.updated_at, "dd/MM/yyyy HH:mm"),
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                    <Typography>جارِ تحميل بروفايل الطالب…</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            {/* المعلومات الشخصية */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    المعلومات الشخصية للطالب
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
                            (profileData.fullName?.charAt(0) || "ط")}
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
                <Row label="تاريخ الالتحاق" value={profileData.enrollmentDate} />
                <Row label="الحالة الدراسية" value={<Chip label={profileData.status} size="small" />} />
                <Row
                    label="معلومات طبية"
                    value={<Typography variant="body2">{profileData.medicalInfo}</Typography>}
                    hideDivider
                />
            </Paper>

            {/* معلومات المستخدم */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    معلومات المستخدم
                </Typography>
                <Row label="البريد الإلكتروني" value={profileData.email} />
                <Row label="المعرّف (User Prefix)" value={profileData.userPrefix} />
                <Row label="رقم الطالب (Student Prefix)" value={profileData.studentPrefix} />
                <Row label="تاريخ إنشاء الحساب" value={profileData.createdAt} />
                <Row label="آخر تحديث" value={profileData.updatedAt} hideDivider />
            </Paper>

            {/* الحالة (اختيارية) */}
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

export default StudentProfile;
