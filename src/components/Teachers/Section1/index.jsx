import { Box, Grid, Button, IconButton, TextField, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom'; 

const Section1 = () => {
    const navigate = useNavigate(); 

    const handleAddTeacher = () => {
        navigate('/dashboard/teachers/teacherFormAdd'); 
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
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: '20px' }} />
                                ),
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

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddTeacher} 
                            sx={{
                                backgroundColor: '#35AFBC',
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2,
                            }}
                        >
                            إضافة معلم
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

export default Section1;
