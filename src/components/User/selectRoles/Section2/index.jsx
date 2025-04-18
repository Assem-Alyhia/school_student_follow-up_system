import React from 'react';
import { Box, Paper, Typography, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';

const Section2 = () => {
    const roles = [
        'مدير النظام',
        'مدير المدرسة',
        'مشرف النقل',
        'معلم',
        'سائق',
        'ثاني المدير',
        'عامل',
    ];

    return (
        <Box sx={{ padding: 3 }}>

            <Paper elevation={1} sx={{ padding: 2, marginBottom: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 2,
                        backgroundColor: '#308A9F', 
                        color: '#fff', 
                        padding: 1, 
                        borderRadius: 1, 
                    }}
                >
                    الدور
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>الدور</TableCell>
                                <TableCell align="center">إضافة</TableCell>
                                <TableCell align="center">عرض</TableCell>
                                <TableCell align="center">تعديل</TableCell>
                                <TableCell align="center">حذف</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.map((role, index) => (
                                <TableRow key={index}>
                                    <TableCell>{role}</TableCell>
                                    <TableCell align="center">
                                        <Checkbox sx={{ color: '#35AFBC' }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox sx={{ color: '#35AFBC' }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox sx={{ color: '#35AFBC' }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox sx={{ color: '#35AFBC' }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* قسم الأزرار */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#35AFBC', '&:hover': { backgroundColor: '#30BA9F' } }}>
                    حفظ التغييرات
                </Button>
                <Button variant="outlined" sx={{ color: '#35AFBC', borderColor: '#35AFBC' }}>
                    إعادة تعيين
                </Button>
                <Button variant="outlined" sx={{ color: '#FF0000', borderColor: '#FF0000' }}>
                    حذف
                </Button>
            </Box>
        </Box>
    );
};

export default Section2;