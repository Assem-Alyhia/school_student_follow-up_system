import React from 'react';
import {
    Alert, AlertTitle, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const iconMap = {
    success: <SentimentSatisfiedAltIcon fontSize="large" />,
    error: <ErrorOutlineIcon fontSize="large" />,
    warning: <WarningAmberIcon fontSize="large" />,
    info: <InfoOutlinedIcon fontSize="large" />,
};

const colorStyles = {
    success: {
        backgroundColor: '#e6f4ea',
        color: '#1e4620',
        borderLeft: '6px solid #1e4620',
    },
    error: {
        backgroundColor: '#fdecea',
        color: '#611a15',
        borderLeft: '6px solid #611a15',
    },
    warning: {
        backgroundColor: '#fff4e5',
        color: '#663c00',
        borderLeft: '6px solid #663c00',
    },
    info: {
        backgroundColor: '#e8f4fd',
        color: '#0c5460',
        borderLeft: '6px solid #0c5460',
    },
};

const SuccessAlert = ({ title, message, onClose, severity = 'success' }) => {
    const icon = iconMap[severity] || <SentimentSatisfiedAltIcon fontSize="large" />;
    const colors = colorStyles[severity] || colorStyles.success;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 20,
                left: 20,
                zIndex: 1300,
                minWidth: 320,
                maxWidth: 450,
                direction: 'rtl',
            }}
        >
            <Alert
                variant="filled"
                icon={icon}
                severity={severity}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                }
                sx={{
                    alignItems: 'center',
                    borderRadius: 3,
                    boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
                    px: 3,
                    py: 2,
                    gap: 1,
                    fontWeight: 'bold',
                    ...colors,
                }}
            >
                <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
                {message}
            </Alert>
        </Box>
    );
};

export default SuccessAlert;
