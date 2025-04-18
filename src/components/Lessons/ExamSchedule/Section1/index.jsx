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

const ExamScheduleSection1 = () => {
    const [selectedClass, setSelectedClass] = React.useState(''); 

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            sx={{ marginRight: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            ترتيب
                        </Button>

                        <Select
                            value={selectedClass}
                            onChange={handleClassChange}
                            displayEmpty
                            sx={{ 
                                marginRight: 2, 
                                minWidth: 120, 
                                color: '#35AFBC', 
                                borderColor: '#35AFBC',
                                height: '40px', 
                                padding: '6px 12px', 
                                fontSize: '14px', 
                                '& .MuiSelect-select': {
                                    padding: '6px 12px', 
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

                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ marginRight: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            فلترة
                        </Button>

                        <TextField
                            placeholder="بحث..."
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                            sx={{ 
                                flexGrow: 1,
                                height: '40px', 
                                '& .MuiInputBase-root': {
                                    height: '40px', 
                                    fontSize: '14px',
                                    padding: '6px 12px', 
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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

                        <IconButton sx={{ color: '#35AFBC' }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ExamScheduleSection1;