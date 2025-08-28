// src/components/Students/StudentStats.jsx
import React from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { getStudentById } from "../../../../../api/Admin/Students/getStudentById";

const gradeFromPercent = (p = 0) => {
    if (p >= 90) return "ممتاز";
    if (p >= 80) return "جيد جدًا";
    if (p >= 70) return "جيد";
    if (p >= 60) return "مقبول";
    return "ضعيف";
};

const StatCard = ({ title, children }) => (
    <Paper
        elevation={3}
        sx={{
            borderRadius: 3,
            textAlign: "center",
            p: 2,
            border: "1px solid #308A9F",
            height: "100%",
        }}
    >
        <Typography
            variant="subtitle1"
            sx={{ backgroundColor: "#e0e0e0", py: 1, mb: 2, borderRadius: 1 }}
        >
            {title}
        </Typography>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "70%",
            }}
        >
            {children}
        </Box>
    </Paper>
);

export default function StudentStats({ studentId }) {
    const {
        data: studentData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["student", String(studentId)],
        queryFn: () => getStudentById(studentId),
        enabled: Boolean(studentId),
        staleTime: 5 * 60 * 1000,
    });

    const performancePercent =
        Number(
            studentData?.performance?.percent ??
            studentData?.metrics?.performance_percent
        ) || 95;

    const performanceLabel =
        studentData?.performance?.label ||
        gradeFromPercent(performancePercent) ||
        "—";

    const examsTaken =
        Number(studentData?.exams_summary?.taken ?? studentData?.exams_taken) || 6;
    const examsTotal =
        Number(studentData?.exams_summary?.total ?? studentData?.exams_total) || 7;
    const examsProgress = examsTotal ? (examsTaken / examsTotal) * 100 : 0;

    const rank =
        Number(studentData?.rank ?? studentData?.class_rank ?? studentData?.order) ||
        3;

    return (
        <Box sx={{ padding: 2, direction: "rtl", backgroundColor: "#f5f6fa" }}>
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    تعذر تحميل إحصائيات الطالب: {error?.message || "خطأ غير متوقع"}
                </Alert>
            )}

            <Grid container spacing={2} justifyContent="center">
                {/* أداء الطالب */}
                <Grid item xs={12} md={4}>
                    <StatCard title="أداء الطالب">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "inline-flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={Math.min(Math.max(performancePercent, 0), 100)}
                                        size={80}
                                        thickness={4}
                                        sx={{ color: "#308A9F" }}
                                    />
                                    <Box sx={{ position: "absolute" }}>
                                        <Typography variant="h6" sx={{ color: "#22385F" }}>
                                            {Math.round(performancePercent)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ color: "#308A9F", fontWeight: "bold", mt: 2 }}>
                                    التقدير: {performanceLabel}
                                </Typography>
                            </>
                        )}
                    </StatCard>
                </Grid>

                {/* عدد الامتحانات */}
                <Grid item xs={12} md={4}>
                    <StatCard title="عدد الامتحانات">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "inline-flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={Math.min(Math.max(examsProgress, 0), 100)}
                                        size={80}
                                        thickness={4}
                                        sx={{ color: "#35AFBC" }}
                                    />
                                    <Box sx={{ position: "absolute" }}>
                                        <Typography variant="h6" sx={{ color: "#22385F" }}>
                                            {examsTaken}/{examsTotal}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ color: "#308A9F", fontWeight: "bold", mt: 2 }}>
                                    تم تقديم {examsTaken} امتحانات هذا الفصل
                                </Typography>
                            </>
                        )}
                    </StatCard>
                </Grid>

                {/* ترتيب الطالب */}
                <Grid item xs={12} md={4}>
                    <StatCard title="ترتيب الطالب">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <img
                                        src="/Students/rank.png"
                                        alt="Student Rank"
                                        style={{ width: "7rem", borderRadius: "50px" }}
                                    />
                                </Box>
                                <Typography sx={{ color: "#308A9F", fontWeight: "bold", mt: 2 }}>
                                    الترتيب: {rank === 0 ? "—" : rank}
                                </Typography>
                            </>
                        )}
                    </StatCard>
                </Grid>
            </Grid>
        </Box>
    );
}
