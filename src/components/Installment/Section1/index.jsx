// src/components/TeacherRole/Fees/Section1.jsx
import { useState, useEffect } from "react";
import {
    Box, Grid, Button, IconButton, TextField, Paper, InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useQueryClient } from "@tanstack/react-query";
import SuccessAlert from "../../../layout/SuccessAlert";
import AddInstallmentModal from "../AddInstallmentModal";

const Section1 = ({ searchTerm, onSearchChange }) => {
    const [openAdd, setOpenAdd] = useState(false);
    const [showAddSuccess, setShowAddSuccess] = useState(false);
    const qc = useQueryClient();

    // إخفاء البالون بعد قليل (اختياري)
    useEffect(() => {
        if (!showAddSuccess) return;
        const t = setTimeout(() => setShowAddSuccess(false), 2500);
        return () => clearTimeout(t);
    }, [showAddSuccess]);

    const handleCreated = () => {
        // أغلق المودال + حدّث القائمة + اعرض نجاح
        setOpenAdd(false);
        qc.invalidateQueries({ queryKey: ["teacher-school-fees"] });
        setShowAddSuccess(true);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ mr: 2, color: "#35AFBC", borderColor: "#35AFBC" }}
                        >
                            ترتيب
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ mr: 2, color: "#35AFBC", borderColor: "#35AFBC" }}
                        >
                            فلترة
                        </Button>

                        <TextField
                            placeholder="بحث بالاسم..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "action.active", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                height: 40,
                                "& .MuiInputBase-root": {
                                    height: 40,
                                    fontSize: 14,
                                    px: 1.5,
                                },
                            }}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAdd(true)}
                            sx={{
                                backgroundColor: "#35AFBC",
                                "&:hover": { backgroundColor: "#30BA9F" },
                                mr: 2,
                            }}
                        >
                            إضافة رسم دراسي
                        </Button>

                        <IconButton sx={{ color: "#35AFBC" }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <AddInstallmentModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onCreated={handleCreated}     
                title="إضافة رسم دراسي"
            />

            {showAddSuccess && (
                <SuccessAlert
                    title="تمت الإضافة!"
                    message="تم إنشاء الرسم الدراسي بنجاح."
                    severity="success"
                    onClose={() => setShowAddSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section1;
