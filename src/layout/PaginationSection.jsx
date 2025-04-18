import React, { useState } from 'react';
import { Box, Paper, Select, MenuItem, Typography, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PaginationSection = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(1); // Reset to the first page when changing rows per page
    };

    return (
        <Box sx={{ padding: 3}}>
            <Paper elevation={0} sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ marginRight: 2 }}>
                        10-1 من 50
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => handleChangePage(page - 1)}
                            disabled={page === 1}
                            sx={{ color: '#35AFBC' }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>

                        {[1, 2, 3, 4, 5].map((number) => (
                            <Button
                                key={number}
                                variant={page === number ? 'contained' : 'outlined'}
                                onClick={() => handleChangePage(number)}
                                sx={{
                                    minWidth: '32px',
                                    padding: '6px 12px',
                                    backgroundColor: page === number ? '#35AFBC' : 'transparent',
                                    color: page === number ? '#fff' : '#35AFBC',
                                    borderColor: '#35AFBC',
                                    '&:hover': {
                                        backgroundColor: page === number ? '#30BA9F' : '#f5f5f5',
                                    },
                                }}
                            >
                                {number}
                            </Button>
                        ))}

                        <IconButton
                            onClick={() => handleChangePage(page + 1)}
                            disabled={page === 5}
                            sx={{ color: '#35AFBC' }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ marginRight: 1 }}>عرض</Typography>
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="rows-per-page-label">كل صفحة</InputLabel>
                        <Select
                            labelId="rows-per-page-label"
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            label="كل صفحة"
                            sx={{ width: '100px' }}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaginationSection;