// src/components/Admin/Supervisors/Section1.jsx
import React, { useState } from 'react';
import {
    Box,
    Grid,
    Button,
    IconButton,
    TextField,
    Paper,
    InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQueryClient } from '@tanstack/react-query';

// تأكد من المسار حسب مكان الملف لديك
import SupervisorCreateModal from '../SupervisorCreateModal';

const Section1 = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const queryClient = useQueryClient();

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
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'action.active', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                height: 40,
                                '& .MuiInputBase-root': {
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
                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenCreate(true)}
                            sx={{
                                backgroundColor: '#35AFBC',
                                '&:hover': { backgroundColor: '#30BA9F' },
                                mr: 2,
                            }}
                        >
                            إضافة مشرف
                        </Button>

                        <IconButton sx={{ color: '#35AFBC' }}>
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            {/* موديول إنشاء مشرف */}
            <SupervisorCreateModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={() => {
                    // تحديث قائمة المشرفين بعد الإنشاء
                    queryClient.invalidateQueries(['supervisors']);
                }}
            />
        </Box>
    );
};

export default Section1;
