// components/ConfirmDeleteModal.jsx
import React from 'react';
import {
    Dialog, DialogContent, DialogActions,
    Typography, Button, Box, IconButton
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmDeleteModal = ({
    open,
    onClose,
    onConfirm,
    title = 'هل أنت متأكد بأنك تريد حذف الطالب؟!',
    message = 'سيتم إزالة جميع البيانات المرتبطة به'
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 5 } // ✅ حواف أكثر ميلان
            }}
        >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ textAlign: 'center', pt: 5 }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 130, color: '#F44336', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                    {title}
                </Typography>
                <Typography sx={{ color: '#666', fontWeight: 500 }}>
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
                <Button
                    fullWidth
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: '#F44336',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#D32F2F' }
                    }}
                >
                    نعم، تأكيد
                </Button>
                <Button
                    fullWidth
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        fontWeight: 'bold',
                        borderRadius: 2,
                        color: '#333',
                        borderColor: '#aaa',
                        '&:hover': {
                            borderColor: '#888',
                            backgroundColor: '#f9f9f9'
                        }
                    }}
                >
                    إلغاء
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
