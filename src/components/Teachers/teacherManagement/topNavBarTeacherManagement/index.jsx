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

const TopNavBarTeacherManagement = () => {
    return (
        <Box sx={{ padding: ".5rem 0" }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                        {/* زر تعديل الجدول */}
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon/>}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            تفاصيل تسجيل الدخول
                        </Button>

                        {/* زر تصدير بيانات */}
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            تعديل المعلم
                        </Button>

                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default TopNavBarTeacherManagement;