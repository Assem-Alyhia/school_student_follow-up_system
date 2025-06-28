import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi/passwordApi";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            setError("الرابط غير صالح أو مفقود.");
        }
    }, [token, email]);

    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");
        setLoading(true);
        try {
            await resetPassword(token, email, password, passwordConfirmation);
            setSuccessMessage("تم تغيير كلمة المرور بنجاح. سيتم توجيهك لتسجيل الدخول...");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                    width: "30%",
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
                    تعيين كلمة المرور الجديدة
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
                    label="كلمة المرور الجديدة"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                    }}
                />

                <TextField
                    label="تأكيد كلمة المرور الجديدة"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                    disabled={loading || !password || !passwordConfirmation}
                >
                    {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
            </Card>
        </Box>
    );
}

export default ResetPassword;
