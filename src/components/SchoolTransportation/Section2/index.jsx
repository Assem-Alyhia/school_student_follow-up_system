import React, { useState } from 'react';
import {
    Box, Paper, Grid, Button, IconButton, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddBusDialog from '../AddBus';

const Section2 = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleOpen = () => {
        console.log('فتح الموديول'); 
        setOpenAddDialog(true);
    };

    const handleClose = () => setOpenAddDialog(false);

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

                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ mr: 2, color: '#35AFBC', borderColor: '#35AFBC' }}
                        >
                            فلترة
                        </Button>

                        <TextField
                            placeholder="بحث..."
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                '& .MuiInputBase-root': { height: 40, fontSize: 14, px: 1.5 },
                            }}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#35AFBC',
                                '&:hover': { backgroundColor: '#30BA9F' },
                                mr: 2,
                            }}
                            onClick={handleOpen} // ✅ هذا يفتح الموديول
                        >
                            أضف مسار
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            sx={{
                                backgroundColor: '#35AFBC',
                                '&:hover': { backgroundColor: '#30BA9F' },
                                mr: 2,
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

            <AddBusDialog
                open={openAddDialog}    
                onClose={handleClose}   
                onCreated={() => {
                    handleClose();
                }}
            />
        </Box>
    );
};

export default Section2;
