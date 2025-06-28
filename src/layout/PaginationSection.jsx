import React from 'react';
import { Box, Paper, Select, MenuItem, Typography, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PaginationSection = ({
    page,
    rowsPerPage,
    total,
    lastPage,
    onPageChange,
    onRowsPerPageChange
}) => {
    const from = (page - 1) * rowsPerPage + 1;
    const to = Math.min(page * rowsPerPage, total);

    const getVisiblePageNumbers = () => {
        const visiblePages = 5;
        let start = Math.max(1, page - Math.floor(visiblePages / 2));
        let end = start + visiblePages - 1;

        if (end > lastPage) {
            end = lastPage;
            start = Math.max(1, end - visiblePages + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 16px',
                flexWrap: 'wrap'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ marginRight: 2 }}>
                        {`${from}-${to} من ${total}`}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            sx={{ color: '#35AFBC' }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>

                        {getVisiblePageNumbers().map((number) => (
                            <Button
                                key={number}
                                variant={page === number ? 'contained' : 'outlined'}
                                onClick={() => onPageChange(number)}
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
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === lastPage}
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
                            onChange={onRowsPerPageChange}
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
