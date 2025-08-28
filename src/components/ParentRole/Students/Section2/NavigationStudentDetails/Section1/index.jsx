// src/components/ParentRole/StudentDetails/StudentDetailsPage.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Avatar,
    Divider,
    Stack,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    FormControl,
    CircularProgress,
} from "@mui/material";
import { Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";
import { getParentStudents } from './../../../../../../api/Parent/Students/getParentStudents';

const c = {
    teal: "#35AFBC",
    tealDark: "#308A9F",
    navy: "#22385F",
    labelGray: "#6B7A90",
    mutedGray: "#9AA6B2",
    headerGray: "#D9D9D9",
    surface: "#FFFFFF",
    border: "rgba(53,175,188,0.28)",
    shadow: "0 4px 16px rgba(34,56,95,0.08)",
};

/* ترويسة قسم */
const SectionHeader = ({ title }) => (
    <Box
        sx={{
            bgcolor: c.headerGray,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            px: 2.5,
            py: 1.25,
            textAlign: "center",
            borderBottom: `1px solid ${c.border}`,
        }}
    >
        <Typography sx={{ fontWeight: 800, color: c.tealDark }}>{title}</Typography>
    </Box>
);

/* كرت قسم */
const SectionCard = ({ title, children, sx }) => (
    <Paper
        elevation={0}
        sx={{
            borderRadius: 2,
            overflow: "hidden",
            background: c.surface,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadow,
            ...sx,
        }}
    >
        {title && <SectionHeader title={title} />}
        <Box sx={{ p: { xs: 2.5, md: 3 } }}>{children}</Box>
    </Paper>
);

/* صف وسم - قيمة */
const KeyValueRow = ({ label, value, labelColor = c.labelGray, valueColor = c.navy }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.6,
            minHeight: 56,
            "&:not(:last-of-type)": { borderBottom: `1px solid ${c.border}` },
        }}
    >
        <Typography sx={{ color: labelColor, fontSize: 15 }}>{label}</Typography>
        <Typography sx={{ fontWeight: 700, color: valueColor, fontSize: 15 }}>{value ?? "—"}</Typography>
    </Box>
);

const StudentDetailsPage = () => {
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await getParentStudents();
                setStudents(res.data || []);
                if (res.data?.length > 0) {
                    setSelectedId(res.data[0].id); // أول طالب تلقائيًا
                }
            } catch (e) {
                console.error("فشل جلب الطلاب", e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    const selectedStudent = students.find((s) => s.id === selectedId);

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, direction: "rtl", bgcolor: "#F6F8FA" }}>
            {/* اختيار الطالب */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    displayEmpty
                    sx={{ bgcolor: "#fff", borderRadius: 2 }}
                >
                    {students.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                            {s.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedStudent ? (
                <Grid container spacing={3}>
                    {/* السايدبار */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                mb: 3,
                                border: `1px solid ${c.border}`,
                                boxShadow: c.shadow,
                            }}
                        >
                            <Box sx={{ p: 3, textAlign: "center" }}>
                                <Avatar
                                    src={selectedStudent.user?.image || "/avatar.jpg"}
                                    alt={selectedStudent.name}
                                    sx={{ width: 92, height: 92, mb: 1.5, border: `3px solid ${c.teal}`, mx: "auto" }}
                                />
                                <Typography sx={{ fontWeight: 900, color: c.navy }}>{selectedStudent.name}</Typography>
                                <Typography variant="caption" sx={{ color: c.mutedGray }}>
                                    {selectedStudent.classroom?.level?.name}
                                </Typography>
                                <Button
                                    fullWidth
                                    startIcon={<EmailIcon />}
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        color: "#fff",
                                        background: `linear-gradient(90deg, ${c.teal}, ${c.navy})`,
                                        "&:hover": { background: `linear-gradient(90deg, ${c.tealDark}, ${c.navy})` },
                                    }}
                                >
                                    {selectedStudent.user?.email}
                                </Button>
                            </Box>
                        </Paper>

                        <SectionCard title="العنوان" sx={{ mb: 3 }}>
                            <KeyValueRow label="العنوان" value={selectedStudent.address} />
                        </SectionCard>
                    </Grid>

                    {/* المحتوى الرئيسي */}
                    <Grid item xs={12} md={8}>
                        <SectionCard title="تفاصيل الطالب" sx={{ mb: 3 }}>
                            <KeyValueRow label="المرحلة" value={selectedStudent.classroom?.level?.name} />
                            <KeyValueRow label="الصف" value={selectedStudent.classroom?.name} />
                            <KeyValueRow label="الحالة" value={selectedStudent.classroom?.status} />
                            <KeyValueRow label="تاريخ الميلاد" value={selectedStudent.dob?.split("T")[0]} />
                            <KeyValueRow label="رقم الهاتف" value={selectedStudent.phone} />
                        </SectionCard>
                    </Grid>
                </Grid>
            ) : (
                <Typography>لا يوجد طلاب</Typography>
            )}
        </Box>
    );
};

export default StudentDetailsPage;
