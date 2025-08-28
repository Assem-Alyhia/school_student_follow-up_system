// Section1.jsx
import React, { useState, useEffect } from "react";
import {
    Box, Button, Grid, IconButton, Paper, TextField, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, MenuItem, Select, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import { useQuery } from "@tanstack/react-query";
import { getStudentsGradesReports } from "../../../../api/Admin/Students/getStudentsGradesReports";
import { getAllClassroomsNoPaginate } from "../../../../api/Admin/Classrooms/getAllClassroomsNoPaginate";
import PaginationSection from "./../../../../layout/PaginationSection";

const pickGrade = (grades, key) => {
    if (!Array.isArray(grades)) return "-";
    for (const g of grades) {
        const k = g?.subject?.key || g?.key || g?.slug || g?.name;
        if (k && String(k).toLowerCase().includes(String(key).toLowerCase())) {
            return g?.grade ?? g?.score ?? g?.value ?? g?.mark ?? "-";
        }
    }
    return "-";
};

const Section1 = () => {
    const [selectedClassId, setSelectedClassId] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const {
        data: classrooms = [],
        isLoading: loadingClassrooms,
        isError: errorClassrooms,
    } = useQuery({
        queryKey: ["classrooms"],
        queryFn: getAllClassroomsNoPaginate,
    });

    const {
        data: reportsResp,
        isLoading: loadingReports,
        isError: errorReports,
    } = useQuery({
        queryKey: ["grades-reports", selectedClassId, page, rowsPerPage, debouncedSearch],
        queryFn: () =>
            getStudentsGradesReports(selectedClassId, page, rowsPerPage, debouncedSearch),
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    const reports = Array.isArray(reportsResp?.data) ? reportsResp.data : [];
    const total = reportsResp?.meta?.total || 0;
    const lastPage = reportsResp?.meta?.last_page || 1;

    const norm = (v) => String(v || "").toLowerCase();
    const visibleReports =
        debouncedSearch.trim() === ""
            ? reports
            : reports.filter(
                (s) =>
                    norm(s.name).includes(norm(debouncedSearch)) ||
                    norm(s.prefix).includes(norm(debouncedSearch))
            );

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 1.5, mb: 2 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            placeholder="ابحث هنا..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                                sx: { height: 36 },
                            }}
                            sx={{
                                flexGrow: 1,
                                "& .MuiInputBase-root": { minHeight: 36, fontSize: "14px", px: 1 },
                            }}
                        />
                        <Button size="small" variant="outlined" startIcon={<FilterListIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}>
                            فلترة
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<SortIcon />}
                            sx={{ color: "#35AFBC", borderColor: "#35AFBC", minHeight: 36 }}>
                            ترتيب
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6}
                        sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        <Select
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(String(e.target.value));
                                setPage(1);
                            }}
                            displayEmpty
                            size="small"
                            sx={{ minWidth: 220, height: 36 }}
                        >
                            <MenuItem value="">
                                {loadingClassrooms ? "جارِ تحميل الصفوف..." : "عرض كل التقارير"}
                            </MenuItem>
                            {!loadingClassrooms &&
                                !errorClassrooms &&
                                classrooms.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        {cls.name || cls.title || `صف #${cls.id}`}
                                    </MenuItem>
                                ))}
                        </Select>

                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            sx={{ backgroundColor: "#35AFBC", "&:hover": { backgroundColor: "#30BA9F" }, minHeight: 36 }}
                            disabled={loadingReports}
                        >
                            تصدير البيانات
                        </Button>
                        <IconButton sx={{ color: "#35AFBC", height: 36, width: 36 }}>
                            <PrintIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3}>
                {loadingReports ? (
                    <Box sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography>جارِ تحميل تقارير الدرجات...</Typography>
                    </Box>
                ) : errorReports ? (
                    <Box sx={{ p: 3 }}>
                        <Typography color="error">تعذّر تحميل التقارير.</Typography>
                    </Box>
                ) : visibleReports.length === 0 ? (
                    <Box sx={{ p: 3 }}>
                        <Typography color="text.secondary">لا توجد تقارير متاحة.</Typography>
                    </Box>
                ) : (
                    <>
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
                                    {visibleReports.map((student, idx) => {
                                        const physics = pickGrade(student.grades, "physics");
                                        const chemistry = pickGrade(student.grades, "chemistry");
                                        const science = pickGrade(student.grades, "science");
                                        const arabic = pickGrade(student.grades, "arabic");
                                        const english = pickGrade(student.grades, "english");
                                        const islamic = pickGrade(student.grades, "islamic");
                                        const math = pickGrade(student.grades, "math");
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell align="center">{student.id}</TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                        <Avatar src={"/images/avatar.png"} sx={{ width: 30, height: 30, ml: 1 }} />
                                                        <Box>
                                                            <Typography>{student.name}</Typography>
                                                            {student.prefix && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {`رقم التسجيل: ${student.prefix}`}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{physics}</TableCell>
                                                <TableCell align="center">{chemistry}</TableCell>
                                                <TableCell align="center">{science}</TableCell>
                                                <TableCell align="center" sx={{ color: Number(arabic) < 60 ? "red" : "inherit" }}>
                                                    {arabic}
                                                </TableCell>
                                                <TableCell align="center">{english}</TableCell>
                                                <TableCell align="center">{islamic}</TableCell>
                                                <TableCell align="center">{math}</TableCell>
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
                                                            margin: "auto",
                                                        }}
                                                    >
                                                        {student.result ?? "-"}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <PaginationSection
                            page={page}
                            rowsPerPage={rowsPerPage}
                            total={total}
                            lastPage={lastPage}
                            onPageChange={(newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Section1;
