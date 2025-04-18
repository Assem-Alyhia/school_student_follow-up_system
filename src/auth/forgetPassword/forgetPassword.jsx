import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

function ForgetPassword() {
    const [email, setEmail] = useState("");

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
                    أدخل بريدك الإلكتروني لاستعادة كلمة المرور الخاصة بك
                </Typography>

                <TextField
                    label="البريد الإلكتروني"
                    placeholder="example@gmail.com"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ 
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }
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
                    متابعة
                </Button>


                <Typography variant="body2" color="textSecondary">
                    <Button 
                        variant="text" 
                        sx={{ 
                            textTransform: "none", 
                            color: "#FF3939",
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                    >
                        العودة إلى تسجيل الدخول
                    </Button>
                </Typography>
            </Card>
        </Box>
    );
}

export default ForgetPassword;