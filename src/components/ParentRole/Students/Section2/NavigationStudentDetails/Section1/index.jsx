import React from "react";
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
} from "@mui/material";
import { Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";

/* لوحة الألوان الموحّدة */
const c = {
    teal: "#35AFBC",        // إبراز/حالات خاصة
    tealDark: "#308A9F",    // عناوين الأقسام/عناوين فرعية
    navy: "#22385F",        // نصوص أساسية/أسماء
    labelGray: "#6B7A90",   // تسميات الحقول
    mutedGray: "#9AA6B2",   // نصوص ثانوية جدًا (وصف/ملاحظات)
    headerGray: "#D9D9D9",  // خلفية ترويسات الأقسام
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
        <Typography sx={{ fontWeight: 800, color: c.tealDark, letterSpacing: ".2px" }}>
            {title}
        </Typography>
    </Box>
);

/* كرت قسم عام */
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

/* صف “وسم - قيمة” مع مرونة في الألوان */
const KeyValueRow = ({
    label,
    value,
    labelColor = c.labelGray,
    valueColor = c.navy,
    boldValue = true,
}) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            py: 1.6,
            minHeight: 56,
            "&:not(:last-of-type)": { borderBottom: `1px solid ${c.border}` },
        }}
    >
        <Typography sx={{ color: labelColor, fontSize: 15, lineHeight: 2 }}>
            {label}
        </Typography>
        <Typography
            sx={{
                fontWeight: boldValue ? 900 : 600,
                color: valueColor,
                fontSize: 15,
                lineHeight: 2,
                textAlign: "left",
            }}
        >
            {value ?? "—"}
        </Typography>
    </Box>
);

const StudentDetailsPage = () => {
    /* بيانات تجريبية */
    const student = {
        name: "Joann Michael",
        email: "Potelprince9595@gmail.com",
        phone: "+123 456 789 123",
        image: "/avatar.jpg",
        grade: "الصف الخامس",
    };

    const school = {
        className: "الصف الخامس",
        stage: "الابتدائية",
        status: "نشط",
        capacity: 45,
        currentStudents: 30,
    };

    const siblings = [
        { name: "Julie Michael", note: "الابنة الرابعة الشعبة الأولى", img: "/avatar.jpg" },
        { name: "Richard Michael", note: "الابن الرابع الشعبة الأولى", img: "/avatar.jpg" },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, direction: "rtl", bgcolor: "#F6F8FA" }}>
            <Grid container spacing={3}>
                {/* السايدبار (يمين) */}
                <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            mb: 3,
                            border: `1px solid ${c.border}`,
                            boxShadow: c.shadow,
                            background: c.surface,
                        }}
                    >
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Avatar
                                src={student.image}
                                alt={student.name}
                                sx={{
                                    width: 92,
                                    height: 92,
                                    mx: "auto",
                                    mb: 1.5,
                                    border: `3px solid ${c.teal}`,
                                }}
                            />
                            <Typography sx={{ fontWeight: 900, color: c.navy }}>
                                {student.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.mutedGray }}>
                                {student.grade}
                            </Typography>

                            <Button
                                fullWidth
                                startIcon={<EmailIcon />}
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    py: 1.1,
                                    background: `linear-gradient(90deg, ${c.teal}, ${c.navy})`,
                                    "&:hover": { background: `linear-gradient(90deg, ${c.tealDark}, ${c.navy})` },
                                }}
                            >
                                {student.email}
                            </Button>
                        </Box>
                    </Paper>

                    {/* العنوان */}
                    <SectionCard title="العنوان" sx={{ mb: 3 }}>
                        <KeyValueRow label="المدينة" value="إعزاز" />
                        <KeyValueRow
                            label="العنوان"
                            value="حي النهضة، شارع المدارس، قرب المركز الثقافي"
                            boldValue={false}
                            valueColor={c.navy}
                        />
                    </SectionCard>

                    {/* الإخوة */}
                    <SectionCard title="معلومات الإخوة">
                        <List dense disablePadding>
                            {siblings.map((s, i) => (
                                <React.Fragment key={i}>
                                    {i !== 0 && <Divider sx={{ my: 1.2 }} />}
                                    <ListItem disableGutters sx={{ py: 0.5 }}>
                                        <ListItemAvatar>
                                            <Avatar src={s.img} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ fontWeight: 900, color: c.navy, fontSize: 14 }}>
                                                    {s.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" sx={{ color: c.mutedGray }}>
                                                    {s.note}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </SectionCard>
                </Grid>

                {/* المحتوى الرئيسي (يسار) */}
                <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                    {/* تفاصيل أولياء الأمور */}
                    <SectionCard title="تفاصيل أولياء الأمور" sx={{ mb: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-start">
                                    <Avatar src={student.image} alt={student.name} sx={{ width: 56, height: 56 }} />
                                    <Box>
                                        <Typography sx={{ fontWeight: 900, color: c.navy, mb: 0.25 }}>
                                            {student.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: c.mutedGray }}>
                                            الولي
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack spacing={0.8} alignItems="flex-start">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EmailIcon sx={{ fontSize: 18, color: c.tealDark }} />
                                        <Typography sx={{ fontWeight: 800, color: c.tealDark }}>
                                            البريد الإلكتروني
                                        </Typography>
                                    </Stack>
                                    <Typography sx={{ color: c.navy, lineHeight: 1.8 }}>
                                        {student.email}
                                    </Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack spacing={0.8} alignItems="flex-start">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PhoneIcon sx={{ fontSize: 18, color: c.tealDark }} />
                                        <Typography sx={{ fontWeight: 800, color: c.tealDark }}>
                                            رقم الهاتف
                                        </Typography>
                                    </Stack>
                                    <Typography sx={{ color: c.navy, lineHeight: 1.8 }}>
                                        {student.phone}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </SectionCard>

                    {/* تفاصيل المدرسة */}
                    <SectionCard title="تفاصيل المدرسة" sx={{ mb: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <KeyValueRow label="اسم الصف" value={school.className} />
                                <KeyValueRow label="المرحلة الدراسية" value={school.stage} />
                                <KeyValueRow
                                    label="الحالة"
                                    value={school.status}
                                    valueColor={c.teal}
                                    boldValue
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <KeyValueRow label="سعة الصف" value={school.capacity} />
                                <KeyValueRow label="عدد الطلاب الحاليين" value={school.currentStudents} />
                                <KeyValueRow label="المادة" value="—" boldValue={false} valueColor={c.mutedGray} />
                            </Grid>
                        </Grid>
                    </SectionCard>

                    {/* المدرسون */}
                    <SectionCard title="المدرسون">
                        <Grid container spacing={3}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Grid item xs={12} sm={4} key={i}>
                                    <Stack
                                        direction="row"
                                        spacing={3.5}
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{ px: 1, py: 1.8 }}
                                    >
                                        {/* أفاتار يمين */}
                                        <Avatar
                                            src="/avatar.jpg"
                                            alt="Joann Michael"
                                            variant="rounded"
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 3,
                                                boxShadow: "0 10px 22px rgba(34,56,95,0.18)",
                                                transition: "transform .18s ease, box-shadow .18s ease",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 12px 26px rgba(34,56,95,0.22)",
                                                },
                                            }}
                                        />

                                        {/* نصوص يسار */}
                                        <Box sx={{ textAlign: "left" }}>
                                            <Typography sx={{ fontWeight: 900, color: c.navy, mb: 0.8 }}>
                                                Joann Michael
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: c.mutedGray }}>
                                                معلم
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentDetailsPage;
