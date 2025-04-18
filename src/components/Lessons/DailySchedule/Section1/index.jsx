import React from 'react';
import { Box, Grid, Button, IconButton, TextField, Paper, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import PrintIcon from '@mui/icons-material/Print'; 
import SortIcon from '@mui/icons-material/Sort'; 
import FilterListIcon from '@mui/icons-material/FilterList'; 
import SearchIcon from '@mui/icons-material/Search'; 
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import TableChartIcon from '@mui/icons-material/TableChart'; 
import EditIcon from '@mui/icons-material/Edit'; 

const Section1 = () => {
    const [selectedClass, setSelectedClass] = React.useState(''); // حالة اختيار الصف

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* زر الترتيب */}
                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ marginRight: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            ترتيب
                        </Button>

                        {/* Select لاختيار الصف */}
                        <Select
                            value={selectedClass}
                            onChange={handleClassChange}
                            displayEmpty
                            sx={{ 
                                marginRight: 2, 
                                minWidth: 120, 
                                color: '#35AFBC', 
                                borderColor: '#35AFBC',
                                height: '40px', // تقليل الارتفاع
                                padding: '6px 12px', // تقليل البادينغ
                                fontSize: '14px', // تصغير حجم الخط
                                '& .MuiSelect-select': {
                                    padding: '6px 12px', // تقليل البادينغ الداخلي
                                },
                            }}
                        >
                            <MenuItem value="" disabled>
                                اختر الصف
                            </MenuItem>
                            <MenuItem value="الصف الأول">الصف الأول</MenuItem>
                            <MenuItem value="الصف الثاني">الصف الثاني</MenuItem>
                            <MenuItem value="الصف الثالث">الصف الثالث</MenuItem>
                        </Select>

                        {/* زر الفلترة */}
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ marginRight: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            فلترة
                        </Button>

                        {/* حقل البحث */}
                        <TextField
                            placeholder="بحث..."
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                            sx={{ 
                                flexGrow: 1,
                                height: '40px', // تقليل الارتفاع
                                '& .MuiInputBase-root': {
                                    height: '40px', // تقليل ارتفاع الحقل
                                    fontSize: '14px', // تصغير حجم الخط
                                    padding: '6px 12px', // تقليل البادينغ
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* زر إضافة جدول */}
                        <Button
                            variant="contained"
                            startIcon={<TableChartIcon />}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            إضافة جدول
                        </Button>

                        {/* زر تعديل الجدول */}
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            تعديل الجدول
                        </Button>

                        {/* زر تصدير بيانات */}
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            تصدير بيانات
                        </Button>

                        {/* زر الطباعة */}
                        <IconButton sx={{ color: '#35AFBC' }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Section1;