// src/pages/auth/changePassword/index.jsx
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { changePassword } from "../../api/authApi/changePassword";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!currentPassword) return "الرجاء إدخال كلمة المرور الحالية.";
        if (!password) return "الرجاء إدخال كلمة المرور الجديدة.";
        if (password.length < 6) return "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.";
        if (password !== passwordConfirmation) return "كلمتا المرور غير متطابقتين.";
        if (password === currentPassword) return "كلمة المرور الجديدة يجب أن تختلف عن الحالية.";
        return "";
    };

    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            await changePassword(currentPassword, password, passwordConfirmation);
            setSuccessMessage("تم تغيير كلمة المرور بنجاح.");
            setCurrentPassword("");
            setPassword("");
            setPasswordConfirmation("");
        } catch (err) {
            setError(err?.message || "حدث خطأ أثناء تغيير كلمة المرور");
        } finally {
            setLoading(false);
        }
    };

    const disabled =
        loading ||
        !currentPassword ||
        !password ||
        !passwordConfirmation ||
        password !== passwordConfirmation ||
        password.length < 6;

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
                    تغيير كلمة المرور
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
                    label="كلمة المرور الحالية"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                    }}
                />

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
                    helperText={password && password.length < 6 ? "6 أحرف على الأقل" : " "}
                    FormHelperTextProps={{ sx: { minHeight: 20 } }}
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
                    helperText={
                        passwordConfirmation && password !== passwordConfirmation
                            ? "التأكيد لا يطابق كلمة المرور"
                            : " "
                    }
                    FormHelperTextProps={{ sx: { minHeight: 20 } }}
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
                    {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
            </Card>
        </Box>
    );
}

export default ChangePassword;
