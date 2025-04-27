import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Avatar, 
  Box, 
  IconButton,
  Divider,
  Chip,
  Button,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ParentChildrenModal = ({ open, onClose, parent }) => {
    if (!parent) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                padding: '16px 24px',
                borderBottom: '1px solid #E0E0E0'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                        تقاصيل الأبناء
                    </Typography>
                    <Chip 
                        label="ناشط" 
                        sx={{ 
                            backgroundColor: '#308A9F', 
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }} 
                    />
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#8F929C' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ padding: '24px' }}>
                {/* Parent Information */}
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 3,
                    marginBottom: 3
                }}>
                    <Avatar 
                        src="/path/to/parent/avatar.jpg" 
                        sx={{ 
                            width: 80, 
                            height: 80,
                            border: '2px solid #308A9F',
                            marginTop: 1
                        }} 
                    />
                    
                    <Grid container spacing={3} sx={{ width: '100%' }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ borderRight: { md: '1px solid #E0E0E0' }, paddingRight: { md: 3 } }}>
                                <Typography variant="body2" sx={{ 
                                    color: '#8F929C',
                                    fontWeight: 'bold',
                                    marginBottom: 1
                                }}>
                                    الاسم
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    Joann Michael
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ borderRight: { md: '1px solid #E0E0E0' }, paddingRight: { md: 3 } }}>
                                <Typography variant="body2" sx={{ 
                                    color: '#8F929C',
                                    fontWeight: 'bold',
                                    marginBottom: 1
                                }}>
                                    رقم الهاتف
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#22385F' }}>
                                    +123 456 789 123
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ borderRight: { md: '1px solid #E0E0E0' }, paddingRight: { md: 3 } }}>
                                <Typography variant="body2" sx={{ 
                                    color: '#8F929C',
                                    fontWeight: 'bold',
                                    marginBottom: 1
                                }}>
                                    البريد الإلكتروني
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#22385F' }}>
                                    Pateiprinee9585@gmail.com
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Box>
                                <Typography variant="body2" sx={{ 
                                    color: '#8F929C',
                                    fontWeight: 'bold',
                                    marginBottom: 1
                                }}>
                                    تاريخ الإضافة
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#22385F' }}>
                                    20/02/2025
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: '#8F929C',
                                    fontWeight: 'bold',
                                    marginTop: 1
                                }}>
                                    تمت الإعالمة
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider sx={{ 
                    my: 3,
                    backgroundColor: '#E0E0E0',
                    height: '1px'
                }} />
                
                {/* Children Information */}
                <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    marginBottom: 3,
                    color: '#22385F'
                }}>
                    تقاصيل الأبناء
                </Typography>
                
                {/* First Child */}
                <Box sx={{ 
                    display: 'flex',
                    gap: 3,
                    marginBottom: 3,
                    backgroundColor: '#FAFAFA',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <Avatar 
                        src="/path/to/child1/avatar.jpg" 
                        sx={{ 
                            width: 80, 
                            height: 80,
                            border: '2px solid #35AFBC',
                            marginTop: 1
                        }} 
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    تاريخ الأنشطة:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    10/05/2025
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الجنس:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    ذكر
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    رقم التسجيل:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    #12345
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الاسم:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    Joann Michael
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الصف:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    الصف الخامس، الشعبية الأولى
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginTop: { xs: 2, md: 0 }
                                }}>
                                    <Chip 
                                        label="ناشط" 
                                        sx={{ 
                                            backgroundColor: '#308A9F', 
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem'
                                        }} 
                                    />
                                    <Button 
                                        variant="text" 
                                        startIcon={<VisibilityIcon sx={{ fontSize: '1rem' }} />}
                                        sx={{ 
                                            color: '#308A9F', 
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                
                <Divider sx={{ 
                    my: 3,
                    backgroundColor: '#E0E0E0',
                    height: '1px'
                }} />
                
                {/* Second Child */}
                <Box sx={{ 
                    display: 'flex',
                    gap: 3,
                    marginBottom: 3,
                    backgroundColor: '#FAFAFA',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <Avatar 
                        src="/path/to/child2/avatar.jpg" 
                        sx={{ 
                            width: 80, 
                            height: 80,
                            border: '2px solid #35AFBC',
                            marginTop: 1
                        }} 
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    تاريخ الأنشطة:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    10/05/2025
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الجنس:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    ذكر
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    رقم التسجيل:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    #12345
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الاسم:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    Joann Michael
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                                <Typography variant="body2" sx={{ color: '#8F929C', marginBottom: 1 }}>
                                    الصف:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#22385F' }}>
                                    الصف الخامس، الشعبية الأولى
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginTop: { xs: 2, md: 0 }
                                }}>
                                    <Chip 
                                        label="ناشط" 
                                        sx={{ 
                                            backgroundColor: '#308A9F', 
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem'
                                        }} 
                                    />
                                    <Button 
                                        variant="text" 
                                        startIcon={<VisibilityIcon sx={{ fontSize: '1rem' }} />}
                                        sx={{ 
                                            color: '#308A9F', 
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ParentChildrenModal;