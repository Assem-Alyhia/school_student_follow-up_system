// src/components/Students/Details/StudentDetails.jsx
import React from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "../../../../api/Admin/Students/getStudentById";
import ChatCommentsStudentDetails from "./_CommentsSection";

export default function StudentDetails() {
    const { id } = useParams();
    const gradientColor = "linear-gradient(90deg, #35AFBC, #308A9F, #22385F)";

    const { data: studentData, isLoading, isError, error } = useQuery({
        queryKey: ["student", String(id)],
        queryFn: () => getStudentById(id),
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <Typography sx={{ p: 5, display: "flex", gap: 1, alignItems: "center" }}>
                <CircularProgress size={20} /> جاري تحميل البيانات...
            </Typography>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    تعذّر تحميل بيانات الطالب: {error?.message || "خطأ غير متوقع"}
                </Alert>
            </Box>
        );
    }

    if (!studentData) return <Typography sx={{ p: 5 }}>لا توجد بيانات.</Typography>;

    const _handlePrint = () => window.print();

    return (
        <Box sx={{ padding: 2, direction: "rtl", backgroundColor: "#f5f6fa" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 3,
                            textAlign: "center",
                            border: "1px solid #308A9F",
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{ position: "relative", width: 100, height: 100, margin: "auto", mb: 3 }}
                        >
                            <Avatar
                                src={studentData.user?.image || "/Students/default.jpg"}
                                sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: "#4CAF50",
                                    border: "2px solid #F5F5F5",
                                }}
                            />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#308A9F", mb: 1 }}>
                            {studentData.name}
                        </Typography>
                        <Typography sx={{ color: "#586E75", mb: 2 }}>
                            {studentData.classroom?.name || "---"}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
                            <Typography sx={{ color: "#308A9F" }}>
                                رقم التسجيل:<br />
                                <span style={{ color: "#586E75" }}>{studentData.prefix}</span>
                            </Typography>
                            <Typography sx={{ color: "#308A9F" }}>
                                الجنس:<br />
                                <span style={{ color: "#586E75" }}>
                                    {studentData.gender === "male" ? "ذكر" : "أنثى"}
                                </span>
                            </Typography>
                            <Typography sx={{ color: "#308A9F" }}>
                                تاريخ الانضمام:<br />
                                <span style={{ color: "#586E75" }}>
                                    {studentData.enrollment_date
                                        ? new Date(studentData.enrollment_date).toLocaleDateString("ar-EG")
                                        : "---"}
                                </span>
                            </Typography>
                        </Box>

                        <Box sx={{ background: gradientColor, borderRadius: 1, p: 1, mb: 1 }}>
                            <Typography sx={{ color: "#fff", fontSize: "14px" }}>
                                {studentData.user?.email || "---"}
                            </Typography>
                        </Box>

                        <Button variant="outlined" onClick={_handlePrint} sx={{ mt: 2 }}>
                            طباعة
                        </Button>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", mt: 2, borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: "#e0e0e0", p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                العنوان
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}><Typography sx={{ color: "#586E75" }}>المدينة</Typography></Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#308A9F" }}>
                                        {studentData.address?.split("\n")[1] || "---"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}><Typography sx={{ color: "#586E75" }}>العنوان</Typography></Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#308A9F" }}>
                                        {studentData.address?.split("\n")[0] || "---"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {studentData.siblings?.length > 0 && (
                        <Paper sx={{ border: "1px solid #308A9F", mt: 2, borderRadius: 2 }}>
                            <Box sx={{ backgroundColor: "#e0e0e0", p: 1.5 }}>
                                <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                    معلومات الأخوة
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                {studentData.siblings.map((s, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar src={`/Students/sibling${i + 1}.png`} sx={{ width: 50, height: 50, ml: 1 }} />
                                        <Box>
                                            <Typography sx={{ color: "#308A9F", fontWeight: "bold" }}>{s.name}</Typography>
                                            <Typography sx={{ color: "#586E75" }}>{s.gender || "---"}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ border: "1px solid #308A9F", borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: "#e0e0e0", p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: "center", color: "#308A9F" }}>
                                تفاصيل ولي الأمر
                            </Typography>
                        </Box>
                        <Box sx={{ p: "1rem 2rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                <Avatar src="/Students/father.png" sx={{ width: 80, height: 80, borderRadius: 2 }} />
                                <Box sx={{ m: "1rem 0" }}>
                                    <Typography sx={{ color: "#586E75" }}>
                                        <strong style={{ color: "#308A9F" }}>رقم الهاتف:</strong> {studentData.parent?.user?.phone || "---"}
                                    </Typography>
                                    <Typography sx={{ color: "#586E75" }}>
                                        <strong style={{ color: "#308A9F" }}>البريد الإلكتروني:</strong> {studentData.parent?.user?.email || "---"}
                                    </Typography>
                                    <Typography sx={{ color: "#22385F", fontWeight: "bold" }}>
                                        {studentData.parent?.user?.name || "---"}
                                    </Typography>
                                    <Typography sx={{ color: "#586E75" }}>ولي الأمر</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", mt: 2, borderRadius: 2, mb: 2 }}>
                        <Box sx={{ backgroundColor: "#e0e0e0", p: 1.5 }}>
                            <Typography fontWeight="bold" sx={{ color: "#308A9F", textAlign: "center" }}>
                                الإشراف والنقل
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            {[
                                { label: "المشرفة", name: studentData.supervisor?.name || "---", avatar: "/Students/supervisor.png" },
                                { label: "السائق", name: "أبو محمد", avatar: "/Students/driver.png" },
                            ].map((p, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Avatar src={p.avatar} sx={{ width: 50, height: 50, ml: 1 }} />
                                    <Box>
                                        <Typography sx={{ color: "#308A9F" }}>{p.label}</Typography>
                                        <Typography sx={{ color: "#22385F", fontWeight: "bold" }}>{p.name}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    <Paper sx={{ border: "1px solid #308A9F", borderRadius: 2 }}>
                        <Box sx={{ backgroundColor: "#e0e0e0", p: 2 }}>
                            <Typography fontWeight="bold" sx={{ textAlign: "center", color: "#308A9F" }}>
                                تفاصيل النقل
                            </Typography>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>موعد الانطلاق</Typography>
                                    <Typography sx={{ color: "#308A9F", fontWeight: "bold" }}>7:15 صباحاً</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: "#586E75" }}>موعد العودة</Typography>
                                    <Typography sx={{ color: "#308A9F", fontWeight: "bold" }}>2:45 ظهراً</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: "#586E75" }}>الملاحظات</Typography>
                                    {[
                                        "يجب على الطلاب الحضور إلى نقطة التجمع قبل 7:10 صباحاً",
                                        "في حال تغييرات طارئة يتم التواصل مع المشرفة مباشرة",
                                    ].map((note, i) => (
                                        <Box key={i} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                            <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 20, mr: 1, ml: 1 }} />
                                            <Typography sx={{ color: "#308A9F" }}>{note}</Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <ChatCommentsStudentDetails studentId={String(id)} />
                </Grid>
            </Grid>
        </Box>
    );
}
