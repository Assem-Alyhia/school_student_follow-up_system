
import { Box, Card, TextField, Button, Typography, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

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

                <Typography variant="h5" fontWeight="bold" mb={2}>
                    تسجيل الدخول
                </Typography>

                <TextField
                    label="البريد الإلكتروني"
                    placeholder="أدخل بريدك الإلكتروني"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="كلمة المرور"
                    placeholder="أدخل كلمة المرور"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button variant="contained" fullWidth sx={{ bgcolor: "#1976D2", color: "white", mb: 1 }}>
                    تسجيل الدخول
                </Button>

                <Typography variant="body2" color="textSecondary">
                    <Button variant="text" sx={{ textTransform: "none", color: "#FF3939" }}>
                        قم بإنشاء حساب
                    </Button>
                    {" "}  هل لديك حساب مسبقًا؟

                </Typography>
            </Card>
        </Box>
    );
}

export default Login;
