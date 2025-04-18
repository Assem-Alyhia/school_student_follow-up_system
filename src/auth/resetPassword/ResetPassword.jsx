import { Box, Card, TextField, Button, Typography, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: '#308A9F' }}>
                    إعادة تعيين كلمة المرور
                </Typography>

                <Typography variant="body2" color="textSecondary" mb={3}>
                    الرجاء إدخال كلمة المرور الجديدة
                </Typography>

                <TextField
                    label="كلمة المرور الجديدة"
                    placeholder="أدخل كلمة المرور الجديدة"
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

                <TextField
                    label="تأكيد كلمة المرور"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    variant="outlined"
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        background: 'linear-gradient(to right, #186384E3, #186384)',
                        color: "white",
                        mb: 2,
                        '&:hover': {
                            background: 'linear-gradient(to right, #186384, #186384E3)',
                        }
                    }}
                >
                    تأكيد كلمة المرور الجديدة
                </Button>

                <Typography variant="body2" color="textSecondary">
                    <Button variant="text" sx={{ textTransform: "none", color: "#FF3939" }}>
                        العودة إلى تسجيل الدخول
                    </Button>
                </Typography>
            </Card>
        </Box>
    );
}

export default ResetPassword;