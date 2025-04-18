import { Box, Card, Button, Typography } from "@mui/material";

function PasswordResetSuccess() {
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

                <Box sx={{ mb: 1 }}>
                    <img
                        src="/auth/4.png"
                        alt="نجاح تغيير كلمة المرور"
                        style={{
                            width: '10rem',
                            objectFit: 'contain'
                        }}
                    />
                </Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                    sx={{ color: '#308A9F' }}
                >
                    تم تغيير كلمة المرور الخاصة بك بنجاح
                </Typography>

                <Typography
                    variant="body1"
                    color="textSecondary"
                    mb={4}
                    sx={{ fontSize: '1rem' }}
                >
                    تم تحديث كلمة المرور الخاصة بك بنجاح
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        background: 'linear-gradient(to right, #186384E3, #186384)',
                        color: "white",
                        py: 1.5,
                        borderRadius: "8px",
                        '&:hover': {
                            background: 'linear-gradient(to right, #186384, #186384E3)',
                        }
                    }}
                >
                    تسجيل الدخول
                </Button>
            </Card>
        </Box>
    );
}

export default PasswordResetSuccess;