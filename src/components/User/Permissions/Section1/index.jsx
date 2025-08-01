import React from 'react';
import { Box, Grid, Button, IconButton, TextField, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 

const Section1 = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ 
                                backgroundColor: '#35AFBC', 
                                '&:hover': { backgroundColor: '#30BA9F' },
                                marginRight: 2
                            }}
                        >
                            إضافة دور جديد
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Section1;