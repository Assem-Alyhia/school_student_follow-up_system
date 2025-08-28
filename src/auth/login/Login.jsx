import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    FormControlLabel,
    Checkbox,
    Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { login } from "../../api/authApi/LoginApi";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError("");
            const response = await login(email, password);
            console.log("تم تسجيل الدخول:", response);
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);
            }
            if (response?.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
            }
            const roles = Array.isArray(response?.user?.roles)
                ? response.user.roles.map((r) => r?.name?.toLowerCase()).filter(Boolean)
                : [];
            if (roles.includes("admin")) {
                navigate("/dashboard");
            } else if (roles.includes("teacher")) {
                navigate("/teacherDashboard");
            } else if (roles.includes("parent")) {
                navigate("/parentDashboard");
            } else if (roles.includes("supervisor")) {
                navigate("/supervisorDashboard");
            } else if (roles.includes("student")) {
                navigate("/studentDashboard");
            } else if (roles.includes("financial")) {
                navigate("/financialDashboard");
            } else {
                setError("لا يوجد صلاحية معروفة لهذا المستخدم.");
            }
        } catch (err) {
            setError(err.message || "فشل في تسجيل الدخول");
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

                <Typography variant="h5" fontWeight="bold" mb={2}>
                    تسجيل الدخول
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="اسم المستخدم"
                    placeholder="أدخل اسم المستخدم"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    inputProps={{
                        autoCorrect: "off",
                        autoCapitalize: "none",
                        spellCheck: "false",
                    }}
                />

                <TextField
                    label="كلمة المرور"
                    placeholder="أدخل كلمة المرور"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    inputProps={{
                        autoCorrect: "off",
                        autoCapitalize: "none",
                        spellCheck: "false",
                    }}
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

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="تذكرني"
                    />
                    <Link href="/forgot-password" underline="hover" sx={{ cursor: "pointer" }}>
                        هل نسيت كلمة المرور؟
                    </Link>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "#1976D2", color: "white", mb: 1 }}
                    onClick={handleLogin}
                >
                    تسجيل الدخول
                </Button>
            </Card>
        </Box>
    );
}

export default Login;
