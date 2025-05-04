import React from 'react';
import {
    Box,
    Grid,
    TextField,
    Paper,
    Typography,
    Select,
    MenuItem,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FeesHeaderSection = () => {
    return (
        <Box sx={{ padding: 0, direction: 'ltr', backgroundColor: '#f5f5f5', p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Left Side - Controls */}
                <Grid item xs={8} sx={{ display: 'flex', gap: 2 }}>
                    {/* Search */}
                    <TextField
                        placeholder="بحث..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="#308A9F" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            '& .MuiInputBase-root': {
                                height: 40,
                                backgroundColor: 'white',
                                '& fieldset': {
                                    borderColor: '#308A9F'
                                }
                            }
                        }}
                    />
                    {/* Sort Dropdown */}
                    <Select
                        defaultValue=""
                        displayEmpty
                        sx={{
                            minWidth: 120,
                            height: 40,
                            backgroundColor: 'white',
                            '& .MuiSelect-select': {
                                padding: '8px 12px',
                                fontSize: '14px',
                                color: '#308A9F'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#308A9F'
                            }
                        }}
                    >
                        <MenuItem value="" disabled>ترتيب</MenuItem>
                        <MenuItem value="date_asc">تاريخ - من الأقدم</MenuItem>
                        <MenuItem value="date_desc">تاريخ - من الأحدث</MenuItem>
                    </Select>

                    {/* Filter Dropdown */}
                    <Select
                        defaultValue=""
                        displayEmpty
                        sx={{
                            minWidth: 120,
                            height: 40,
                            backgroundColor: 'white',
                            '& .MuiSelect-select': {
                                padding: '8px 12px',
                                fontSize: '14px',
                                color: '#308A9F'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#308A9F'
                            }
                        }}
                    >
                        <MenuItem value="" disabled>فلترة</MenuItem>
                        <MenuItem value="all">الكل</MenuItem>
                        <MenuItem value="paid">مدفوع</MenuItem>
                        <MenuItem value="unpaid">غير مدفوع</MenuItem>
                    </Select>


                </Grid>

                {/* Right Side - Title */}
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        color: '#308A9F',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        الرسوم
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FeesHeaderSection;