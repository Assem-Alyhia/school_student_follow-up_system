// components/Shared/MapDialogStudent.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Box, Button, Stack, Avatar, Chip
} from "@mui/material";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

// ⏱️ كل 10 ثوانٍ
const POLL_MS = 10_000;
const formatSec = (s) => `00:${String(s).padStart(2, "0")}`;

// يحرك الخريطة تلقائيًا عند تغيّر المركز
function ChangeView({ center, duration = 0.8 }) {
    const map = useMap();
    useEffect(() => {
        if (!center || !Number.isFinite(center[0]) || !Number.isFinite(center[1])) return;
        const zoom = map.getZoom() ?? 15;
        map.flyTo(center, zoom, { duration });
    }, [center, map, duration]);
    return null;
}

const MapDialogStudent = ({ open, onClose, supervisorId }) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [remaining, setRemaining] = useState(POLL_MS / 1000);
    const [lastUpdated, setLastUpdated] = useState(null);

    const cancelledRef = useRef(false);
    const timerRef = useRef(null);

    const fetchLocation = async () => {
        try {
            const res = await getParentStudentLocation(supervisorId);
            if (cancelledRef.current) return;

            const loc = res?.data || res;
            const lat = Number(loc?.latitude);
            const lon = Number(loc?.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                setError("لا يوجد موقع متاح لهذا المشرف.");
                return;
            }

            setError("");
            setLocation({ ...loc, latitude: lat, longitude: lon });
            setLastUpdated(loc?.created_at ? new Date(loc.created_at) : new Date());
            setRemaining(POLL_MS / 1000); // إعادة ضبط العدّاد بعد كل تحديث ناجح
        } catch (err) {
            if (cancelledRef.current) return;
            console.error("فشل في جلب موقع المشرف:", err);
            setError(err?.message || "حدث خطأ أثناء تحميل الموقع.");
        }
    };

    // المؤقّت/العدّاد + الجلب الدوري (فوري ثم كل 10 ثوانٍ)
    useEffect(() => {
        if (!open || !supervisorId) return;
        cancelledRef.current = false;
        setError("");
        setLocation(null);
        setRemaining(POLL_MS / 1000);
        fetchLocation(); // جلب فوري

        timerRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    fetchLocation();             // جلب فوري عند الصفر
                    return POLL_MS / 1000;       // إعادة الضبط
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            cancelledRef.current = true;
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, supervisorId]);

    const initialCenter = location
        ? [location.latitude, location.longitude]
        : [24.7136, 46.6753]; // مركز افتراضي

    const supervisorName = location?.supervisor?.name || `#${supervisorId}`;
    const supervisorImage = location?.supervisor?.image || "/images/avatars/default.png";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={supervisorImage} alt={supervisorName} sx={{ width: 32, height: 32 }} />
                        <Typography fontWeight="bold" color="#308A9F">
                            موقع المشرف — {supervisorName}
                        </Typography>
                    </Stack>
                    <Chip label={`تحديث خلال: ${formatSec(remaining)}`} variant="outlined" sx={{ fontWeight: "bold" }} />
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1 }}>
                <Box sx={{ height: 460, width: "100%", borderRadius: 2, overflow: "hidden" }}>
                    {error ? (
                        <Typography align="center" mt={12} color="text.secondary">
                            {error}
                        </Typography>
                    ) : location ? (
                        <>
                            <MapContainer
                                center={initialCenter}
                                zoom={15}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                {/* يحرك الخريطة فور تغير الإحداثيات */}
                                <ChangeView center={[location.latitude, location.longitude]} />
                                <Marker position={[location.latitude, location.longitude]} />
                            </MapContainer>

                            <Stack direction="row" justifyContent="center" sx={{ mt: 1.5 }}>
                                <Typography color="text.secondary" fontSize=".85rem">
                                    {lastUpdated ? `آخر تحديث: ${lastUpdated.toLocaleString("ar-EG")}` : null}
                                </Typography>
                            </Stack>
                        </>
                    ) : (
                        <Typography align="center" mt={12} color="text.secondary">
                            جارٍ تحميل الموقع...
                        </Typography>
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
    supervisorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MapDialogStudent;
