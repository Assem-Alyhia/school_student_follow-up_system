// ========================
// src/pages/auth/forgetPassword/index.jsx
// ========================
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "./../../api/authApi/forgetPasswordApi";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // بسيط لاستخراج التوكن من أي URL قد يعيده السيرفر
    const extractFromUrl = (url) => {
        try {
            const u = new URL(url);
            const qsToken = u.searchParams.get("token");
            const qsEmail = u.searchParams.get("email");
            const parts = u.pathname.split("/").filter(Boolean);
            const idx = parts.findIndex((p) =>
                p.toLowerCase().includes("reset-password")
            );
            const pathToken = idx >= 0 ? parts[idx + 1] : null;
            return {
                token: qsToken || pathToken || null,
                email: qsEmail || null,
            };
        } catch {
            return { token: null, email: null };
        }
    };

    const isValidEmail = (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");

        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError("من فضلك أدخل البريد الإلكتروني");
            return;
        }
        if (!isValidEmail(cleanEmail)) {
            setError("صيغة البريد الإلكتروني غير صحيحة");
            return;
        }

        setLoading(true);
        try {
            // استدعاء API
            const res = await forgotPassword(cleanEmail);

            // رسالة نجاح للمستخدم
            setSuccessMessage(
                "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني."
            );

            // محاولة جلب التوكن/الإيميل من استجابة الـAPI
            let token = res?.token || res?.data?.token || null;
            let emailFromApi = res?.email || cleanEmail;
            const resetUrl =
                res?.reset_url || res?.url || res?.data?.reset_url || null;

            if (!token && resetUrl) {
                const parsed = extractFromUrl(resetUrl);
                token = parsed.token;
                emailFromApi = parsed.email || emailFromApi;
            }

            // إن توفر التوكن وجّه المستخدم مباشرةً لصفحة إعادة التعيين
            if (token) {
                setTimeout(() => {
                    navigate(
                        `/auth/reset-password?token=${encodeURIComponent(
                            token
                        )}&email=${encodeURIComponent(emailFromApi)}`
                    );
                }, 900);
            }
        } catch (err) {
            // تجميع أخطاء 4xx من الباك (Laravel validation)
            const apiErrors = err?.response?.data?.errors;
            if (apiErrors && typeof apiErrors === "object") {
                const msgs = Object.values(apiErrors)
                    .flat()
                    .filter(Boolean)
                    .join(" / ");
                setError(
                    msgs ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "حدث خطأ غير متوقع"
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "حدث خطأ غير متوقع"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const disabled = loading || !email.trim() || !isValidEmail(email);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "url('/auth/2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Card
                sx={{
                    width: { xs: "92%", sm: "75%", md: "50%", lg: "30%" },
                    p: 4,
                    textAlign: "center",
                    boxShadow: 5,
                    borderRadius: "16px",
                    backgroundImage: "url('/auth/3.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <img src="/auth/1.png" alt="شعار المدرسة" style={{ width: 140 }} />
                </Box>

                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#308A9F" }}>
                    إعادة تعيين كلمة المرور
                </Typography>

                <Typography variant="body2" color="textSecondary" mb={3}>
                    أدخل بريدك الإلكتروني لاستعادة كلمة المرور الخاصة بك
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <TextField
                    label="البريد الإلكتروني"
                    placeholder="example@gmail.com"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !disabled) handleSubmit();
                    }}
                    error={!!email && !isValidEmail(email)}
                    helperText={
                        !!email && !isValidEmail(email) ? "صيغة البريد الإلكتروني غير صحيحة" : " "
                    }
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        background: "linear-gradient(to right, #186384E3, #186384)",
                        color: "white",
                        mb: 2,
                        "&:hover": {
                            background: "linear-gradient(to right, #186384, #186384E3)",
                        },
                    }}
                    onClick={handleSubmit}
                    disabled={disabled}
                >
                    {loading ? "جاري الإرسال..." : "متابعة"}
                </Button>

                <Typography variant="body2" color="textSecondary">
                    <Link href="/login" underline="none" sx={{ color: "#FF3939" }}>
                        العودة إلى تسجيل الدخول
                    </Link>
                </Typography>
            </Card>
        </Box>
    );
}

export default ForgetPassword;
