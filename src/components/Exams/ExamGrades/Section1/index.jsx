// src/components/TeacherRole/ExamResults/Section1.jsx
import { useState } from "react";
import {
    Box, Grid, Button, IconButton, TextField, Paper, InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

import AddExamResultsModal from "../AddExamResultsModal";
import SuccessAlert from "../../../../layout/SuccessAlert";

const Section1 = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    return (
        <Box sx={{ padding: 3 }} dir="ltr">
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                        <Button variant="outlined" startIcon={<SortIcon />} sx={{ mr: 2, color: "#35AFBC", borderColor: "#35AFBC" }}>
                            ترتيب
                        </Button>

                        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ mr: 2, color: "#35AFBC", borderColor: "#35AFBC" }}>
                            فلترة
                        </Button>

                        <TextField
                            placeholder="بحث..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "action.active", mr: 1, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                height: 40,
                                "& .MuiInputBase-root": { height: 40, fontSize: 14, px: 1.5 },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAdd(true)}
                            sx={{ backgroundColor: "#35AFBC", "&:hover": { backgroundColor: "#30BA9F" }, mr: 2 }}
                        >
                            أضف درجة
                        </Button>

                        <IconButton sx={{ color: "#35AFBC" }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <AddExamResultsModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onCreated={() => {
                    setOpenAdd(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2500);
                }}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تمت إضافة الدرجات بنجاح!"
                    message="تم حفظ نتائج الامتحان."
                    severity="success"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section1;
