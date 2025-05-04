// MapDialog.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, Divider, Stack, MenuItem, Select, Avatar } from '@mui/material';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapDialog = ({ open, handleClose }) => {
    const centerPosition = [22.5726, 88.3639]; // المركز الافتراضي للخريطة

    const handleReset = () => {
        console.log('تم الضغط على إعادة تعيين');
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" sx={{ '& .MuiDialog-paper': { borderRadius: 4 } }}>
            {/* رأس النافذة */}
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    {/* كود المسار */}
                    <Button variant="contained" size="small" sx={{ bgcolor: '#308A9F', borderRadius: '8px', fontWeight: 'bold', fontSize: 14 }}>
                        GPS78994
                    </Button>

                    {/* حالة التسليم */}
                    <Select
                        size="small"
                        defaultValue="delivered"
                        sx={{ minWidth: 150, fontSize: 14, bgcolor: '#f5f5f5', borderRadius: 2 }}
                    >
                        <MenuItem value="delivered">تم التسليم</MenuItem>
                        <MenuItem value="not_delivered">لم يتم التسليم</MenuItem>
                    </Select>
                </Stack>
            </DialogTitle>

            {/* معلومات المسار */}
            <DialogContent dividers sx={{ pt: 0 }}>
                <Box mb={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Typography variant="body1" sx={{ color: '#308A9F', fontWeight: 'bold' }}>
                            المسار: R123456 | الساعة: 06:15 ص | التاريخ: 10/03/2025
                        </Typography>
                    </Stack>

                    {/* معلومات السائق والمشرف */}
                    <Stack direction="row" spacing={4} alignItems="center" mt={2}>
                        {/* السائق */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar alt="السائق" src="/driver-avatar.png" sx={{ width: 32, height: 32 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">السائق</Typography>
                                <Typography variant="body2" fontWeight="bold">Cody Fisher</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>+1 6404 748904</Typography>
                            </Box>
                        </Stack>

                        {/* المشرف */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar alt="المشرف" src="/supervisor-avatar.png" sx={{ width: 32, height: 32 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">المشرف</Typography>
                                <Typography variant="body2" fontWeight="bold">Cody Fisher</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>+1 6404 748904</Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    {/* معلومات نقطة الانطلاق وعدد الطلاب */}
                    <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                        <Typography variant="body2" fontWeight="bold">
                            8930 - مجمع الفرقان
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2" fontWeight="bold">
                            20 طالب
                        </Typography>
                    </Stack>
                </Box>

                {/* الخريطة */}
                <Box sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden', mt: 2 }}>
                    <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={centerPosition} />
                    </MapContainer>
                </Box>
            </DialogContent>

            {/* الأزرار السفلية */}
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button variant="outlined" color="error" onClick={handleClose} sx={{ width: '150px' }}>
                    إلغاء
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#308A9F', width: '150px' }} onClick={handleReset}>
                    إعادة تعيين
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MapDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default MapDialog;
