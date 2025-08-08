import React from 'react';
import {
    Box,
    Modal,
    Paper,
    Typography,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const UserDetails = ({ open, onClose, user }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(3px)'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #308A9F',
                    position: 'relative'
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        color: '#308A9F'
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ color: '#308A9F', fontWeight: 'bold' }}>
                        {user.name || 'Cody Fisher'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#586E75' }}>
                        {user.email || 'cody.fisher@gmail.com'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: '#308A9F' }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#308A9F', mb: 1 }}>
                        المزيد:
                    </Typography>

                    <Box sx={{ pl: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#308A9F' }}>
                            المرور:
                        </Typography>
                        <Box sx={{ pl: 2, mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#586E75' }}>15/0</Typography>
                            <Typography variant="body2" sx={{ color: '#586E75' }}>15/1</Typography>
                            <Typography variant="body2" sx={{ color: '#586E75' }}>15/2</Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: '#308A9F' }} />

                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#308A9F', mb: 1 }}>
                        تأكيد كلمة المرور:
                    </Typography>
                    <TextField
                        type="password"
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#308A9F' },
                                '&:hover fieldset': { borderColor: '#308A9F' }
                            }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#308A9F',
                            '&:hover': { backgroundColor: '#2a7a8c' },
                            mr: 1
                        }}
                    >
                        حفظ
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            borderColor: '#308A9F',
                            color: '#308A9F',
                            '&:hover': { borderColor: '#2a7a8c' }
                        }}
                    >
                        إلغاء
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default UserDetails;