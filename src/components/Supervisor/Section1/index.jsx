// src/components/Admin/Supervisors/Section1.jsx
import React, { useState } from 'react';
import {
    Box, Grid, Button, IconButton, TextField, Paper, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useQueryClient } from '@tanstack/react-query';
import SupervisorCreateModal from '../SupervisorCreateModal';
import SuccessAlert from '../../../layout/SuccessAlert';

const Section1 = ({ searchTerm, onSearchChange }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [success, setSuccess] = useState({
        show: false,
        title: '',
        message: '',
        severity: 'success',
    });
    const queryClient = useQueryClient();

    const handleCreated = () => {
        queryClient.invalidateQueries({ queryKey: ['supervisors'] });
        setOpenCreate(false);
        setSuccess({
            show: true,
            title: 'تمت الإضافة',
            message: 'تم إضافة المشرف بنجاح.',
            severity: 'success',
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            {success.show && (
                <SuccessAlert
                    title={success.title}
                    message={success.message}
                    severity={success.severity}
                    onClose={() => setSuccess((s) => ({ ...s, show: false }))}
                />
            )}

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
                            placeholder="بحث بالاسم..."
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

            <SupervisorCreateModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={handleCreated}
            />
        </Box>
    );
};

export default Section1;
