// src/components/TeacherRole/Students/StudentCardsGrid.jsx
import React from "react";
import { Box, Grid, Card, Typography, Avatar } from "@mui/material";

const GRADIENT = "linear-gradient(135deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";

const students = [
    { code: "AD298403", name: "Joann Michael", grade: "الصف الأول", avatar: "/images/avatars/1.png" },
    { code: "AD298413", name: "Joann Michael", grade: "الصف الثاني", avatar: "/images/avatars/2.png" },
    { code: "AD298423", name: "Joann Michael", grade: "الصف الخامس", avatar: "/images/avatars/3.png" },
];

export default function StudentCardsGrid() {
    return (
        <Box sx={{ direction: "rtl", px: { xs: 2, sm: 3, md: 5 }, py: { xs: 2, md: 3 }, width: "100%" }}>
            <Grid container spacing={3} columns={12} sx={{ m: 0 }}>
                {students.map((s) => (
                    <Grid item key={s.code} xs={12} sm={6} md={4} lg={4} sx={{ display: "flex" }}>
                        <Card
                            sx={{
                                width: "100%",                 
                                position: "relative",
                                p: 2.2,
                                borderRadius: 2,
                                border: "2px solid #308A9F",
                                boxShadow: "0 10px 24px rgba(34,56,95,.15)",
                                transition: "transform .18s ease, box-shadow .18s ease",
                                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 28px rgba(34,56,95,.22)" },
                            }}
                        >
                            <Box sx={{ position: "absolute", top: 10, left: 12, fontSize: 12, color: "#8F929C" }}>
                                {s.code}
                            </Box>


                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: "auto",
                                    mt: 1.5,
                                    mb: 1.5,
                                    borderRadius: 3,
                                    background: "#fff",
                                    display: "grid",
                                    placeItems: "center",
                                    boxShadow: "inset 0 1px 0 rgba(0,0,0,.04), 0 8px 16px rgba(0,0,0,.08)",
                                }}
                            >
                                <Avatar
                                    src={s.avatar}
                                    alt={s.name}
                                    variant="rounded"
                                    sx={{ width: 96, height: 96, borderRadius: 3 }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: 22,
                                    lineHeight: 1.2,
                                    mt: 3,
                                    mb: 2,
                                    textAlign: "center",
                                    background: GRADIENT,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {s.name}
                            </Typography>

                            <Typography sx={{ color: "#8A8F99", fontSize: 16, fontWeight: 700, textAlign: "center", mb: 0.2 }}>
                                {s.grade}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
