import React from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const DocumentsCard = () => {
    return (
        <Box sx={{ padding: 0, maxWidth: "100%", margin: '1rem auto' }}>
            <Paper elevation={3} sx={{
                borderRadius: 2,
                border: '1px solid #308A9F',
                overflow: 'hidden'
            }}>
                {/* العنوان */}
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#308A9F',
                    padding: "1.5rem ",
                    textAlign: 'center'
                }}>
                    المستندات
                </Typography>

                {/* محتوى المستند */}
                <Box sx={{ padding:"1rem " }}>
                    <Box sx={{
                        backgroundColor: '#e0e0e0',
                        padding: "1rem 1rem",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius:".5rem"

                    }}>
                        {/* زر التنزيل */}
                        <Button
                            variant="outlined"
                            startIcon={<CloudDownloadIcon />}
                            sx={{
                                background: 'linear-gradient(to right, #35AFBC, #1F4C5C)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 2,
                                px: 2,
                                '&:hover': {
                                    background: 'linear-gradient(to right, #1F4C5C, #35AFBC)'
                                }
                            }}
                        >
                            تنزيل
                        </Button>

                        {/* اسم الملف ونوعه */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', color: '#308A9F' }}>
                                Resume.pdf
                            </Typography>
                            <Chip label="PDF" sx={{
                                backgroundColor: '#F44336',
                                color: '#fff',
                                fontWeight: 'bold',
                                borderRadius: "15%"
                            }} />
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default DocumentsCard;
