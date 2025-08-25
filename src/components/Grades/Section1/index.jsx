// src/features/Grades/Section1.jsx
import React from 'react';
import {
    Box, Grid, Button, IconButton, TextField, Paper, Select, MenuItem, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AddGradeModal from '../AddGradeModal';

const Section1 = ({
    searchTerm,
    onSearchChange,
    selectedClass,
    onClassChange,
}) => {
    const [openAddModal, setOpenAddModal] = React.useState(false);

    const handleOpenAdd = () => setOpenAddModal(true);
    const handleCloseAdd = () => setOpenAddModal(false);

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ mr: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            ترتيب
                        </Button>

                        <Select
                            value={selectedClass}
                            onChange={(e) => onClassChange(e.target.value)}
                            displayEmpty
                            sx={{
                                mr: 2,
                                minWidth: 140,
                                height: 40,
                                '& .MuiSelect-select': { py: '6px', px: '12px', fontSize: 14 },
                            }}
                        >
                            <MenuItem value="">
                                <em>كل الصفوف</em>
                            </MenuItem>
                            <MenuItem value="الصف الأول">الصف الأول</MenuItem>
                            <MenuItem value="الصف الثاني">الصف الثاني</MenuItem>
                            <MenuItem value="الصف الثالث">الصف الثالث</MenuItem>
                            {/* أضف بقية الصفوف من مصدر بياناتك إن وُجد */}
                        </Select>

                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ mr: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            فلترة
                        </Button>

                        <TextField
                            placeholder="بحث باسم الطالب..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'action.active', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                height: 40,
                                '& .MuiInputBase-root': { height: 40, fontSize: 14, px: 1.5 },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAdd}
                            sx={{ backgroundColor: '#35AFBC', '&:hover': { backgroundColor: '#30BA9F' }, mr: 2 }}
                        >
                            اضافة درجة
                        </Button>

                        <IconButton sx={{ color: '#35AFBC' }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <AddGradeModal open={openAddModal} onClose={handleCloseAdd} title="إنشاء نتيجة" />
        </Box>
    );
};

export default Section1;
