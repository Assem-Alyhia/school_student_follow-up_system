import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, MenuItem, Select, FormControl } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Section1 = () => {
    const [selectedYear, setSelectedYear] = useState('2025');

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const chartData = [
        { year: 2021, paid: 90, unpaid: 120 },
        { year: 2022, paid: 100, unpaid: 150 },
        { year: 2023, paid: 160, unpaid: 180 },
        { year: 2024, paid: 110, unpaid: 170 },
        { year: 2025, paid: 130, unpaid: 160 },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {/* حالة الرسوم */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: 2, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography fontWeight="bold" color="#22385F">حالة الرسوم</Typography>
                            <FormControl size="small">
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        color: '#308A9F',
                                        fontSize: '13px',
                                        px: 1,
                                        minWidth: 90,
                                        borderColor: '#308A9F',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#308A9F'
                                        }
                                    }}
                                >
                                    <MenuItem value="2025">2025</MenuItem>
                                    <MenuItem value="2024">2024</MenuItem>
                                    <MenuItem value="2023">2023</MenuItem>
                                    <MenuItem value="2022">2022</MenuItem>
                                    <MenuItem value="2021">2021</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ backgroundColor: '#DFF5E4', color: '#2E7D32', borderRadius: 1, px: 1, py: 0.5, fontSize: '14px' }}>
                                    ● مدفوع
                                </Typography>
                                <Typography fontWeight="bold" fontSize="18px" color="#22385F">
                                    1,335
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: 1, px: 1, py: 0.5, fontSize: '14px' }}>
                                    ● غير مدفوع
                                </Typography>
                                <Typography fontWeight="bold" fontSize="18px" color="#22385F">
                                    1,335
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* مخطط الرسوم */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ padding: 2, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography fontWeight="bold" color="#22385F">الرسوم</Typography>
                            <FormControl size="small">
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        color: '#308A9F',
                                        fontSize: '13px',
                                        px: 1,
                                        minWidth: 90,
                                        borderColor: '#308A9F',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#308A9F'
                                        }
                                    }}
                                >
                                    <MenuItem value="2025">2025</MenuItem>
                                    <MenuItem value="2024">2024</MenuItem>
                                    <MenuItem value="2023">2023</MenuItem>
                                    <MenuItem value="2022">2022</MenuItem>
                                    <MenuItem value="2021">2021</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis dataKey="year" reversed />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="unpaid" stroke="#FF7043" strokeWidth={3} name="المبالغ المستحقة" dot />
                                    <Line type="monotone" dataKey="paid" stroke="#5C6BC0" strokeWidth={3} name="المبالغ المسددة" dot />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Section1;
