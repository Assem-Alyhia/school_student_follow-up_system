import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const BasicInfoCard = () => {
    return (
        <Box sx={{ padding: 0, maxWidth: "100%", margin: '1.5rem auto', direction: 'rtl' }}>
            <Paper elevation={3} sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #308A9F',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
            }}>

                {/* عنوان القسم */}
                <Box sx={{
                    backgroundColor: '#E8E8E8',
                    padding: 2,
                    textAlign: 'center',
                    borderBottom: '1px solid #ccc'
                }}>
                    <Typography variant="h6" sx={{
                        color: '#007C92',
                        fontWeight: 'bold'
                    }}>
                        المعلومات الأساسية
                    </Typography>
                </Box>

                {/* المعلومات */}
                <Box sx={{ padding: 3 }}>
                    {[
                        { label: 'المعرف:', value: 'T9892433' },
                        { label: 'المادة:', value: 'فيزياء' },
                        { label: 'الجنس:', value: 'ذكر' },
                        { label: 'المدينة:', value: 'اعزاز' },
                        {
                            label: 'العنوان:',
                            value: <>
                                حي النهضة، شارع المدارس،<br />
                                قرب المركز الثقافي
                            </>
                        }
                    ].map((item, index) => (
                        <Grid container spacing={1} key={index} sx={{ marginBottom: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{
                                    fontWeight: 'bold',
                                    color: '#444',
                                    textAlign: 'right'
                                }}>
                                    {item.label}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    textAlign: 'right',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {item.value}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default BasicInfoCard;
