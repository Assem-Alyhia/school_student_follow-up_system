import React, { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Modal } from '@mui/material';

const PaymentModal = ({ open, handleClose, student, updateStudentStatus }) => {
    const [paymentStatus, setPaymentStatus] = useState(student?.status === 'active' ? 'مدفوع' : 'غير مدفوع'); 

    const handleStatusChange = () => {
        const newStatus = paymentStatus === 'غير مدفوع' ? 'مدفوع' : 'غير مدفوع';
        setPaymentStatus(newStatus);
        updateStudentStatus(student.id, newStatus === 'مدفوع' ? 'active' : 'inactive'); // تحديث حالة الطالب
    };

    const statusColor = paymentStatus === 'مدفوع' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'; // أخضر أو أحمر مع شفافية

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%', 
                height: '80%', 
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: 'auto', 
            }}>
                <Typography variant="h6" sx={{ mb: 5, color: '#308A9F', textAlign: 'right' }}>
                    إضافة رسوم للطالب: ({student?.id})
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="الاسم الكامل"
                        variant="outlined"
                        value={student?.name || ''}
                        disabled
                    />
                    <TextField
                        fullWidth
                        label="التاريخ"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="الكمية"
                        variant="outlined"
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="الحالة"
                        variant="outlined"
                        value={paymentStatus}
                        disabled
                        sx={{
                            '& .MuiInputBase-root': {
                                color: '#fff', 
                                backgroundColor: statusColor, 
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: statusColor, 
                                },
                            },
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
                    <TextField
                        fullWidth
                        label="نوع الرسوم"
                        variant="outlined"
                        select
                    >
                        <MenuItem value="رسوم دراسية">رسوم دراسية</MenuItem>
                        <MenuItem value="رسوم أنشطة">رسوم أنشطة</MenuItem>
                        <MenuItem value="رسوم أخرى">رسوم أخرى</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="الكمية"
                        variant="outlined"
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="تاريخ الدفع"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="رقم الوصل"
                        variant="outlined"
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}> 
                    <Button
                        variant="contained"
                        onClick={handleStatusChange} 
                        sx={{
                            background: statusColor, 
                            '&:hover': { backgroundColor: statusColor },
                            fontSize: '14px',
                            padding: '6px 12px',
                        }}
                    >
                        {paymentStatus === 'غير مدفوع' ? 'تم الدفع' : 'إلغاء الدفع'}
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    label="ملاحظات"
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderColor: '#308A9F',
                            color: '#308A9F',
                            '&:hover': { borderColor: '#22385F' },
                        }}
                        onClick={handleClose}
                    >
                        إلغاء
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            background: 'linear-gradient(90deg, #308A9F,#22385F)',
                            '&:hover': { backgroundColor: '#308A9F' },
                        }}
                    >
                        دفع الرسوم
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PaymentModal;