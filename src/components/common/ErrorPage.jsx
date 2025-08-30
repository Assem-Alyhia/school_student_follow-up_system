// src/components/common/ErrorPage.jsx
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";

const COLORS = {
    c1: "#35AFBC",
    c2: "#308A9F",
    c3: "#22385F",
    textLight: "#7A8899",
};

const BOY_IMG = "/NotFound/404-boy.svg";

const getHomeFromLocal = () => {
    try {
        const raw = localStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        const roles = Array.isArray(u?.roles) ? u.roles.map(r => r?.name?.toLowerCase()) : [];
        if (roles.includes("admin")) return "/dashboard";
        if (roles.includes("teacher")) return "/teacherDashboard";
        if (roles.includes("parent")) return "/parentDashboard";
        if (roles.includes("supervisor")) return "/supervisorDashboard";
    } catch { console.log() }
    return "/login";
};

export default function ErrorPage() {
    const err = useRouteError();
    const navigate = useNavigate();

    const isRR = isRouteErrorResponse(err);
    const status = isRR ? err.status : 500;
    const is404 = status === 404;

    const title = is404 ? "عفوًا!" : "حدث خطأ!";
    const description =
        (isRR ? (err.data?.message || err.statusText) : (err?.message || "")) ||
        (is404 ? "لا يمكننا العثور على الصفحة التي تبحث عنها." : "عذرًا! حصل شيء غير متوقع أثناء عرض هذه الصفحة.");

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                direction: "rtl",
                background: `
          radial-gradient(1200px 600px at 15% 20%, ${COLORS.c1}11, transparent 60%),
          radial-gradient(800px 500px at 90% 80%, ${COLORS.c2}10, transparent 60%),
          linear-gradient(180deg, #ffffff 0%, #ffffff 100%)
        `,
                display: "grid",
                placeItems: "center",
                px: { xs: 2, sm: 4 },
                py: { xs: 4, md: 6 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "70%",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
                    alignItems: "center",
                    gap: { xs: 3, md: 0 },
                }}
            >
                <Stack spacing={2} sx={{ order: { xs: 2, md: 1 } }}>
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: "56px", sm: "84px", md: "112px", lg: "128px" },
                            lineHeight: 1,
                            letterSpacing: "-1px",
                            background: `linear-gradient(90deg, ${COLORS.c1}, ${COLORS.c2}, ${COLORS.c3})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: { xs: 1, md: 2 },
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography sx={{ color: COLORS.c3, fontSize: { xs: 18, md: 22 }, fontWeight: 800 }}>
                        لا يمكننا العثور على الصفحة التي تبحث عنها.
                    </Typography>

                    <Typography sx={{ color: COLORS.textLight, maxWidth: 650, fontSize: { xs: 15, md: 16 } }}>
                        {description}
                    </Typography>

                    <Chip
                        label={`رمز الخطأ: ${status}`}
                        sx={{
                            alignSelf: "start",
                            fontWeight: 700,
                            color: COLORS.c3,
                            borderColor: COLORS.c2,
                            borderWidth: 2,
                            borderStyle: "solid",
                            bgcolor: "transparent",
                            mt: 1,
                        }}
                        variant="outlined"
                    />

                    <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" ,gap:3}}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 3,
                                py: 1.25,
                                fontWeight: 700,
                                background: `linear-gradient(90deg, ${COLORS.c1}, ${COLORS.c2}, ${COLORS.c3})`,
                                boxShadow: "0 6px 20px rgba(34,56,95,0.25)",
                                "&:hover": {
                                    background: `linear-gradient(90deg, ${COLORS.c1}, ${COLORS.c2}, ${COLORS.c3})`,
                                    filter: "brightness(0.95)",
                                },
                            }}
                        >
                            رجوع
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate(getHomeFromLocal())}
                            sx={{
                                px: 3,
                                py: 1.25,
                                fontWeight: 700,
                                color: COLORS.c2,
                                borderColor: COLORS.c2,
                                "&:hover": { borderColor: COLORS.c3, color: COLORS.c3, backgroundColor: "rgba(48,138,159,0.06)" },
                            }}
                        >
                            الذهاب للوحة التحكم
                        </Button>
                    </Stack>
                </Stack>


                <Box
                    sx={{
                        order: { xs: 1, md: 2 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: { xs: 2, md: 0 },
                    }}
                >
                    <Box
                        component="img"
                        src={BOY_IMG}
                        alt="لا يوجد صفحة"
                        sx={{
                            width: { xs: "70%", sm: "60%", md: "100%" },
                            maxWidth: 700,
                            height: "auto",
                            objectFit: "contain",
                            filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.10))",
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
