// components/Shared/MapDialogStudent.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Box, Button, Stack, Avatar
} from "@mui/material";

import {
    MapContainer, TileLayer, Marker
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getParentStudentLocation } from "../../../../api/Parent/Locations/getParentStudentLocation";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapDialogStudent = ({ open, onClose, student }) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open || !student?.id) return;

        setError("");
        setLocation(null);

        getParentStudentLocation(student.id)
            .then((res) => {
                const loc = res?.data || res;
                if (!loc?.latitude || !loc?.longitude) {
                    setError("لا يوجد موقع متاح لهذا الطالب.");
                    return;
                }
                setLocation(loc);
            })
            .catch((err) => {
                console.error("فشل في جلب موقع الطالب:", err);
                setError("حدث خطأ أثناء تحميل الموقع.");
            });
    }, [open, student]);

    const center = location
        ? [location.latitude, location.longitude]
        : [24.7136, 46.6753]; // مركز افتراضي (الرياض) — عدّله لو تحب

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                        src={student?.user?.image || "/images/avatars/default.png"}
                        alt={student?.name || student?.user?.name || "Student"}
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography fontWeight="bold" color="#308A9F">
                        موقع الطالب — {student?.name || student?.user?.name || "—"}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1 }}>
                <Box sx={{ height: 460, width: "100%", borderRadius: 2, overflow: "hidden" }}>
                    {error ? (
                        <Typography align="center" mt={12} color="text.secondary">{error}</Typography>
                    ) : location ? (
                        <>
                            <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker position={[location.latitude, location.longitude]} />
                            </MapContainer>
                            <Typography sx={{ mt: 1.5 }} align="center" color="text.secondary" fontSize=".85rem">
                                آخر تحديث: {new Date(location.created_at).toLocaleString("ar-EG")}
                            </Typography>
                        </>
                    ) : (
                        <Typography align="center" mt={12} color="text.secondary">جارٍ تحميل الموقع...</Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#308A9F", minWidth: 140 }}>
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MapDialogStudent.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    student: PropTypes.object, // يحوي على id و name إلخ
};

export default MapDialogStudent;
