import React from 'react';
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Avatar,
    TextField,
    InputAdornment,
    IconButton as MuiIconButton
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';

const UserDetails = ({ open, onClose, user }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 400,
                    maxWidth: '95%',
                    padding: '40px 30px 30px 30px',
                    borderRadius: '15px',
                    position: 'relative',
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 15,
                        left: 20,
                        color: '#308A9F'
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 15,
                        right: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        userSelect: 'none',
                    }}
                >
                    <Typography
                        sx={{
                            color: '#308A9F',
                            border:'1px solid #308A9F',
                            padding: '4px 14px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            minWidth: '5rem',
                            textAlign: 'center',
                            fontFamily: 'Arial, sans-serif',
                        }}
                    >
                        {user?.roles?.[0] || 'admin'}
                    </Typography>
                    <Typography
                        sx={{
                            border:'1px solid #FF5C5C',
                            color: '#FF5C5C',
                            padding: '4px 14px',
                            borderRadius: '9px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            minWidth: '5rem',
                            textAlign: 'center',
                            fontFamily: 'Arial, sans-serif',
                        }}
                    >
                        معلم
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, mb: 2 }}>
                    <Avatar
                        src={user?.image || 'https://via.placeholder.com/80'}
                        alt={user?.name}
                        sx={{
                            width: 80,
                            height: 80,
                            margin: 'auto',
                            mb: 1,
                            border: '2px solid #308A9F',
                            bgcolor: '#B0B0B0',
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            color: 'white',
                        }}
                    >
                        {!user?.image && user?.name ? user.name.charAt(0) : ''}
                    </Avatar>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#308A9F',
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        {user?.name || 'Yasin'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: '#A1A1A1', fontFamily: 'Arial, sans-serif', mt: 0.5 }}
                    >
                        {user?.email || 'yasin@vision.com'}
                    </Typography>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Typography
                        sx={{
                            color: '#308A9F',
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                            mb: 1
                        }}
                    >
                        كلمة المرور:
                    </Typography>
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        fullWidth
                        defaultValue={user?.password || '**********'}
                        sx={{
                            mb: 2,
                            borderRadius: '15px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '15px',
                                backgroundColor: '#E6F0FF',
                                '& fieldset': {
                                    borderColor: '#ccc',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <MuiIconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </MuiIconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Typography
                        sx={{
                            color: '#308A9F',
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                            mb: 1
                        }}
                    >
                        تأكيد كلمة المرور:
                    </Typography>
                    <TextField
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        fullWidth
                        defaultValue={user?.confirmPassword || '**********'}
                        sx={{
                            borderRadius: '15px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '15px',
                                backgroundColor: '#E6F0FF',
                                '& fieldset': {
                                    borderColor: '#ccc',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <MuiIconButton
                                        onClick={handleClickShowConfirmPassword}
                                        edge="end"
                                        size="small"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </MuiIconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Paper>
        </Modal>
    );
};

export default UserDetails;
