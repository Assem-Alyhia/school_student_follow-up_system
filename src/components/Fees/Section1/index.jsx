import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, MenuItem, Select, FormControl
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getAllPaymentsNoPaginate } from '../../../api/Admin/Payments/getAllPaymentsNoPaginate';

const Section1 = () => {
    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['allPayments'],
        queryFn: getAllPaymentsNoPaginate,
    });

    const statistics = useMemo(() => {
        const stats = {};

        payments.forEach(payment => {
            const paidAt = payment?.paid_at;
            const status = payment?.status;

            if (!paidAt || !status) return;

            const year = new Date(paidAt).getFullYear();
            const isPaid = status === 'completed';

            if (!stats[year]) {
                stats[year] = { paid: 0, unpaid: 0 };
            }

            if (isPaid) {
                stats[year].paid += 1;
            } else {
                stats[year].unpaid += 1;
            }
        });

        return stats;
    }, [payments]);

    const years = Object.keys(statistics).sort((a, b) => b - a);
    const [selectedYear, setSelectedYear] = useState(years[0] || new Date().getFullYear());

    // Sync selected year with available data
    useEffect(() => {
        if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(years[0]);
        }
    }, [years]);

    const chartData = years.map(year => ({
        year: Number(year),
        ...statistics[year]
    }));

    const selectedYearStats = statistics[selectedYear] || { paid: 0, unpaid: 0 };

    if (isLoading) {
        return <Typography sx={{ p: 3 }}>جاري تحميل البيانات...</Typography>;
    }

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
                                    onChange={(e) => setSelectedYear(e.target.value)}
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
                                    {years.map(year => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ backgroundColor: '#DFF5E4', color: '#2E7D32', borderRadius: 1, px: 1, py: 0.5, fontSize: '14px' }}>
                                    ● مدفوع
                                </Typography>
                                <Typography fontWeight="bold" fontSize="18px" color="#22385F">
                                    {selectedYearStats.paid}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: 1, px: 1, py: 0.5, fontSize: '14px' }}>
                                    ● غير مدفوع
                                </Typography>
                                <Typography fontWeight="bold" fontSize="18px" color="#22385F">
                                    {selectedYearStats.unpaid}
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
                        </Box>

                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis dataKey="year" reversed />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="unpaid" stroke="#FF7043" strokeWidth={3} name="غير مدفوع" dot />
                                    <Line type="monotone" dataKey="paid" stroke="#5C6BC0" strokeWidth={3} name="مدفوع" dot />
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
