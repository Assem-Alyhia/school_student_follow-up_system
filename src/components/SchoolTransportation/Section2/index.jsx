// src/components/SchoolTransportation/Section2.jsx
import React, { useState } from 'react';
import {
    Box, Paper, Grid, Button, IconButton, TextField, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddBusDialog from '../AddBus';

const Section2 = ({ searchTerm, onSearchChange, onCreated }) => {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleOpen = () => setOpenAddDialog(true);
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
                            placeholder="بحث عن مسار/سائق..."
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
                                '& .MuiInputBase-root': { height: 40, fontSize: 14, px: 1.5 },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#35AFBC',
                                '&:hover': { backgroundColor: '#30BA9F' },
                                mr: 2,
                            }}
                            onClick={handleOpen}
                        >
                            أضف مسار
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
                    onCreated?.(); // يخلي الأب يحدث القائمة
                }}
            />
        </Box>
    );
};

export default Section2;
