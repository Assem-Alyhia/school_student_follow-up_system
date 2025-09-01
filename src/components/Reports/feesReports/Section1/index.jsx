// Section1.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Button, Grid, IconButton, Paper, TextField, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, MenuItem, Select, CircularProgress, Chip
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

const normalizeArabic = (str = "") =>
    String(str)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ء/g, "")
        .replace(/\s+/g, " ")
        .trim();

const extractSubjects = (students = []) => {
    const seen = new Set();
    const ordered = [];
    students.forEach((st) => {
        const grades = Array.isArray(st?.grades) ? st.grades : [];
        grades.forEach((g) => {
            const name = g?.subject?.name?.trim();
            if (name && !seen.has(name)) {
                seen.add(name);
                ordered.push(name);
            }
        });
    });
    return ordered;
};

const getGradeFor = (grades, subjectName) => {
    if (!Array.isArray(grades)) return "-";
    const g = grades.find((x) => x?.subject?.name?.trim() === subjectName);
    if (!g) return "-";
    const v = [g.final_score, g.grade, g.score, g.value, g.mark].find(
        (val) => val !== undefined && val !== null && val !== ""
    );
    return v ?? "-";
};

const average = (arr) => {
    const nums = arr.map((v) => Number(v)).filter((n) => Number.isFinite(n));
    if (nums.length === 0) return null;
    return nums.reduce((s, n) => s + n, 0) / nums.length;
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
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: reportsResp,
        isLoading: loadingReports,
        isError: errorReports,
        error,
    } = useQuery({
        queryKey: ["grades-reports", selectedClassId, page, rowsPerPage, debouncedSearch],
        queryFn: () =>
            getStudentsGradesReports(selectedClassId, page, rowsPerPage, debouncedSearch),
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    const reports = Array.isArray(reportsResp?.data) ? reportsResp.data : [];
    const total = Number(reportsResp?.meta?.total ?? reports.length);
    const lastPage = Number(
        reportsResp?.meta?.last_page ?? Math.max(1, Math.ceil(total / rowsPerPage))
    );

    const visibleReports = useMemo(() => {
        const q = normalizeArabic(debouncedSearch);
        if (!q) return reports;
        return reports.filter((s) => {
            const name = normalizeArabic(s?.name);
            const pref = normalizeArabic(s?.prefix);
            return name.includes(q) || pref.includes(q);
        });
    }, [reports, debouncedSearch]);

    // ✅ ترتيب تصاعدي بحسب id
    const sortedReports = useMemo(() => {
        const numId = (x) => {
            const n = Number(x?.id);
            return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
        };
        return [...visibleReports].sort((a, b) => numId(a) - numId(b));
    }, [visibleReports]);

    // اعتمد المواد من البيانات بعد الفرز (ترتيب الصفوف لا يؤثر على الأعمدة لكن لتناسق المنطق)
    const subjects = useMemo(() => extractSubjects(sortedReports), [sortedReports]);

    return (
        <Box sx={{ padding: 3, direction: "rtl" }}>
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

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}
                    >
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
                            sx={{
                                backgroundColor: "#35AFBC",
                                "&:hover": { backgroundColor: "#30BA9F" },
                                minHeight: 36,
                            }}
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
                        <Typography color="error">
                            تعذّر تحميل التقارير{error?.message ? `: ${error.message}` : "."}
                        </Typography>
                    </Box>
                ) : sortedReports.length === 0 ? (
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
                                        {subjects.map((name) => (
                                            <TableCell key={name} sx={{ color: "white", textAlign: "center" }}>
                                                {name}
                                            </TableCell>
                                        ))}
                                        <TableCell sx={{ color: "white", textAlign: "center" }}>النتيجة</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {sortedReports.map((student) => {
                                        const rowGrades = subjects.map((subj) => getGradeFor(student.grades, subj));
                                        const avg = average(rowGrades);
                                        const result = avg === null ? "—" : avg >= 60 ? "ناجح" : "راسب";

                                        return (
                                            <TableRow key={student.id ?? `${student.name}-${student.prefix}`}>
                                                <TableCell align="center">{student.id ?? "—"}</TableCell>

                                                <TableCell align="center">
                                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                        <Avatar src={"/images/avatar.png"} sx={{ width: 30, height: 30, ml: 1 }} />
                                                        <Box sx={{ textAlign: "right" }}>
                                                            <Typography sx={{ fontWeight: 600 }}>
                                                                {student.name || "—"}
                                                            </Typography>

                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    gap: 0.75,
                                                                    justifyContent: "center",
                                                                    mt: 0.25,
                                                                    flexWrap: "wrap",
                                                                }}
                                                            >
                                                                {student.prefix && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {`رقم التسجيل: ${student.prefix}`}
                                                                    </Typography>
                                                                )}
                                                                {student?.classroom?.name && (
                                                                    <Chip size="small" label={student.classroom.name} sx={{ height: 20 }} />
                                                                )}
                                                                {student?.classroom?.level?.name && (
                                                                    <Chip
                                                                        size="small"
                                                                        variant="outlined"
                                                                        label={student.classroom.level.name}
                                                                        sx={{ height: 20 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {rowGrades.map((g, idx) => {
                                                    const n = Number(g);
                                                    const isLow = Number.isFinite(n) && n < 60;
                                                    return (
                                                        <TableCell
                                                            key={`${student.id}-${subjects[idx]}`}
                                                            align="center"
                                                            sx={isLow ? { color: "red", fontWeight: 600 } : {}}
                                                        >
                                                            {g ?? "-"}
                                                        </TableCell>
                                                    );
                                                })}

                                                <TableCell align="center">
                                                    <Typography
                                                        sx={{
                                                            backgroundColor:
                                                                result === "ناجح" ? "#DFF5E4" : result === "راسب" ? "#FFEBEE" : "#EEE",
                                                            color:
                                                                result === "ناجح" ? "#2E7D32" : result === "راسب" ? "#C62828" : "#555",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: "14px",
                                                            width: "fit-content",
                                                            margin: "auto",
                                                        }}
                                                    >
                                                        {result}
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
