import React from "react";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    MenuItem,
    Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";

const Section1 = () => {
    const feesData = [
        {
            id: "AD9892433",
            registrationNumber: "8930",
            name: "Cody Fisher",
            email: "Cody@gmail.com",
            level: "الأول",
            class: "الأولى",
            amount: "800$",
            date: "2025/02/17",
            status: "مدفوع",
        },
        {
            id: "AD9892433",
            registrationNumber: "8930",
            name: "Cody Fisher",
            email: "Cody@gmail.com",
            level: "الثاني",
            class: "الأولى",
            amount: "800$",
            date: "2025/02/17",
            status: "غير مدفوع",
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            {/* الفلترة */}
            <Paper elevation={3} sx={{ padding: 1.5, mb: 2 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            placeholder="ابحث هنا..."
                            size="small"
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                                sx: { height: 36 },
                            }}
                            sx={{
                                flexGrow: 1,
                                "& .MuiInputBase-root": {
                                    minHeight: 36,
                                    fontSize: "14px",
                                    px: 1,
                                },
                            }}
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}
                        >
                            فلترة
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}
                        >
                            ترتيب
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        <Select
                            defaultValue=""
                            displayEmpty
                            size="small"
                            sx={{ minWidth: 130, height: 36 }}
                        >
                            <MenuItem value="">اختر الصف</MenuItem>
                            <MenuItem value="الأول">الأول</MenuItem>
                            <MenuItem value="الثاني">الثاني</MenuItem>
                            <MenuItem value="الثالث">الثالث</MenuItem>
                        </Select>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            sx={{
                                backgroundColor: "#35AFBC",
                                "&:hover": { backgroundColor: "#30BA9F" },
                                minHeight: 36,
                            }}
                        >
                            تصدير البيانات
                        </Button>
                        <IconButton sx={{ color: "#35AFBC", height: 36, width: 36 }}>
                            <PrintIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            {/* الجدول */}
            <Paper elevation={3}>
                <TableContainer>
                    <Table dir="rtl">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#308A9F" }}>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>المعرف</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>رقم التسجيل</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الطالب</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الصف</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الشعبة</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>المبلغ</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>آخر تاريخ</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الحالة</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {feesData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.registrationNumber}</TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Avatar
                                                src="/avatars/user.png"
                                                sx={{ width: 30, height: 30, ml: 1 }}
                                            />
                                            <Box>
                                                <Typography>{row.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {row.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{row.level}</TableCell>
                                    <TableCell align="center">{row.class}</TableCell>
                                    <TableCell align="center">{row.amount}</TableCell>
                                    <TableCell align="center">{row.date}</TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                backgroundColor: row.status === "مدفوع" ? "#DFF5E4" : "#FFEBEE",
                                                color: row.status === "مدفوع" ? "#2E7D32" : "#C62828",
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: "inline-block",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {row.status}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Section1;
