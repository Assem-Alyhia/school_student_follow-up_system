// src/components/common/NotFound.jsx
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, bgcolor: "#f5f6fa", direction: "rtl" }}>
            <Paper sx={{ p: 4, border: "1px solid #308A9F", borderRadius: 3 }}>
                <Typography variant="h4" sx={{ color: "#22385F", fontWeight: 900, mb: 1 }}>الصفحة غير موجودة (404)</Typography>
                <Typography sx={{ color: "#7A8899", mb: 2 }}>تأكد من رابط الصفحة أو ارجع للوحة التحكم.</Typography>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ bgcolor: "#308A9F" }}>رجوع</Button>
            </Paper>
        </Box>
    );
}
