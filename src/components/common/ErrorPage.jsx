// src/components/common/ErrorPage.jsx
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";

const getHomeFromLocal = () => {
    try {
        const raw = localStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        const roles = Array.isArray(u?.roles) ? u.roles.map(r => r?.name?.toLowerCase()) : [];
        if (roles.includes("admin")) return "/dashboard";
        if (roles.includes("teacher")) return "/teacherDashboard";
        if (roles.includes("parent")) return "/parentDashboard";
        if (roles.includes("supervisor")) return "/supervisorDashboard";
    } catch { console.log()}
    return "/login";
};

export default function ErrorPage() {
    const err = useRouteError();
    const navigate = useNavigate();

    const isRR = isRouteErrorResponse(err);
    const status = isRR ? err.status : 500;
    const title = isRR
        ? (status === 404 ? "الصفحة غير موجودة" : "حدث خطأ غير متوقع")
        : "حدث خطأ غير متوقع";
    const description = isRR ? (err.data?.message || err.statusText) : (err?.message || "");

    return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, bgcolor: "#f5f6fa", direction: "rtl" }}>
            <Paper sx={{ p: 4, maxWidth: 560, width: "100%", border: "1px solid #308A9F", borderRadius: 3 }}>
                <Typography variant="h4" sx={{ color: "#22385F", fontWeight: 900, mb: 1 }}>
                    {title}
                </Typography>
                <Typography sx={{ color: "#7A8899", mb: 2 }}>
                    {description || "عذرًا! حصل شيء غير متوقع أثناء عرض هذه الصفحة."}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button variant="contained" sx={{ bgcolor: "#308A9F" }} onClick={() => navigate(-1)}>
                        رجوع
                    </Button>
                    <Button variant="outlined" sx={{ borderColor: "#308A9F", color: "#308A9F" }} onClick={() => navigate(getHomeFromLocal())}>
                        الذهاب للوحة التحكم
                    </Button>
                </Box>

                {/* للمطورين أثناء التطوير */}
                {/* {process.env.NODE_ENV !== "production" && err && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: "#fafafa", borderRadius: 2, border: "1px dashed #d8e2e7" }}>
                        <Typography variant="caption" sx={{ color: "#9aa6b2", whiteSpace: "pre-wrap" }}>
                            {typeof err === "object" ? (err.stack || JSON.stringify(err, null, 2)) : String(err)}
                        </Typography>
                    </Box>
                )} */}
            </Paper>
        </Box>
    );
}
