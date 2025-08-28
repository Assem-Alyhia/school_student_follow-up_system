// ========================
// src/pages/auth/ResetPassword/index.jsx
// ========================
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi/resetPassword";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // قواعد التحقق (عدّل الـREGEX لو الباك يتطلب رقم أيضًا)
    const PWD_MIN = 8;
    const PWD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    // لو مطلوب رقم أيضًا:
    // const PWD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    useEffect(() => {
        if (!token || !email) {
            setError("الرابط غير صالح أو مفقود.");
        }
    }, [token, email]);

    // المتطلبات غير المستوفاة (لعرضها كملاحظات حيّة)
    const unmet = useMemo(() => {
        const list = [];
        if (password.length < PWD_MIN)
            list.push(`على الأقل ${PWD_MIN} أحرف`);
        if (!/[a-z]/.test(password)) list.push("حرف صغير واحد على الأقل");
        if (!/[A-Z]/.test(password)) list.push("حرف كبير واحد على الأقل");
        // إن كان مطلوب رقمًا:
        // if (!/\d/.test(password)) list.push("رقم واحد على الأقل");
        if (password && passwordConfirmation && password !== passwordConfirmation)
            list.push("التأكيد غير مطابق");
        return list;
    }, [password, passwordConfirmation]);

    const validatePassword = (pwd, pwdConfirm) => {
        if (!pwd || !pwdConfirm) {
            return "الرجاء كتابة كلمة المرور الجديدة وتأكيدها.";
        }
        if (pwd !== pwdConfirm) {
            return "كلمتا المرور غير متطابقتين.";
        }
        if (pwd.length < PWD_MIN) {
            return `كلمة المرور يجب أن تكون ${PWD_MIN} أحرف على الأقل.`;
        }
        if (!PWD_PATTERN.test(pwd)) {
            // عدّل النص لو أضفت شرط الرقم
            return "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير.";
        }
        return null;
    };

    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");

        if (!token || !email) {
            setError("الرابط غير صالح أو مفقود.");
            return;
        }

        const validationMsg = validatePassword(password, passwordConfirmation);
        if (validationMsg) {
            setError(validationMsg);
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, email, password, passwordConfirmation);
            setSuccessMessage(
                "تم تغيير كلمة المرور بنجاح. سيتم توجيهك لتسجيل الدخول..."
            );
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            // عرض رسائل Laravel بالعربية
            const apiErrors = err?.response?.data?.errors;
            if (apiErrors) {
                const msgs = Object.values(apiErrors)
                    .flat()
                    .map((msg) => {
                        if (msg.includes("uppercase") || msg.includes("lowercase")) {
                            return "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير.";
                        }
                        if (msg.includes("at least") || msg.includes("characters")) {
                            return `كلمة المرور يجب أن تكون ${PWD_MIN} أحرف على الأقل.`;
                        }
                        if (msg.includes("confirmed")) {
                            return "كلمتا المرور غير متطابقتين.";
                        }
                        if (msg.includes("number")) {
                            return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.";
                        }
                        return msg;
                    })
                    .join(" / ");
                setError(msgs);
            } else {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "فشل في إعادة التعيين"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const disabled =
        loading ||
        !password ||
        !passwordConfirmation ||
        password !== passwordConfirmation ||
        password.length < PWD_MIN ||
        !PWD_PATTERN.test(password);

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

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                    sx={{ color: "#308A9F" }}
                >
                    تعيين كلمة المرور الجديدة
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <TextField
                    label="كلمة المرور الجديدة"
                    variant="outlined"
                    fullWidth
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPwd((s) => !s)}
                                    edge="end"
                                >
                                    {showPwd ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    helperText={
                        unmet.length
                            ? "يجب أن تحتوي كلمة المرور على: " + unmet.join("، ")
                            : " "
                    }
                    sx={{
                        mb: 1.5,
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
                    type={showPwd2 ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    autoComplete="new-password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPwd2((s) => !s)}
                                    edge="end"
                                >
                                    {showPwd2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    helperText={
                        password && passwordConfirmation && password !== passwordConfirmation
                            ? "التأكيد غير مطابق"
                            : " "
                    }
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !disabled) handleSubmit();
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
                    {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
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

export default ResetPassword;
