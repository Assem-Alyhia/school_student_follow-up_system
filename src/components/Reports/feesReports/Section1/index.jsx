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

const data = [
    {
        id: "AD9892433",
        name: "Cody Fisher",
        email: "35013",
        avatar: "/images/avatar.png",
        grades: {
            physics: 90,
            chemistry: 100,
            science: 95,
            arabic: 90,
            english: 100,
            islamic: 95,
            math: 99,
        },
        result: "ناجح",
    },
    {
        id: "AD9892433",
        name: "Cody Fisher",
        email: "35013",
        avatar: "/images/avatar.png",
        grades: {
            physics: 77,
            chemistry: 80,
            science: 80,
            arabic: 59,
            english: 84,
            islamic: 85,
            math: 77,
        },
        result: "راسب",
    },
];

const Section1 = () => {
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
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#308A9F" }}>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>المعرف</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>اسم الطالب</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الفيزياء</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الكيمياء</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>العلوم</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>اللغة العربية</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>اللغة الإنجليزية</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>التربية الإسلامية</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>الرياضيات</TableCell>
                                <TableCell sx={{ color: "white", textAlign: "center" }}>النتيجة</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{student.id}</TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Avatar src={student.avatar} sx={{ width: 30, height: 30, ml: 1 }} />
                                            <Box>
                                                <Typography>{student.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {`رقم التسجيل: ${student.email}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{student.grades.physics}</TableCell>
                                    <TableCell align="center">{student.grades.chemistry}</TableCell>
                                    <TableCell align="center">{student.grades.science}</TableCell>
                                    <TableCell align="center" sx={{ color: student.grades.arabic < 60 ? "red" : "inherit" }}>
                                        {student.grades.arabic}
                                    </TableCell>
                                    <TableCell align="center">{student.grades.english}</TableCell>
                                    <TableCell align="center">{student.grades.islamic}</TableCell>
                                    <TableCell align="center">{student.grades.math}</TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                backgroundColor: student.result === "ناجح" ? "#DFF5E4" : "#FFEBEE",
                                                color: student.result === "ناجح" ? "#2E7D32" : "#C62828",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: "14px",
                                                width: "fit-content",
                                                margin: "auto"
                                            }}
                                        >
                                            {student.result}
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
