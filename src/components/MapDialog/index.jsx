// components/Shared/MapDialog.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Box, Button, Divider, Stack, MenuItem, Select, Avatar, Chip
} from "@mui/material";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getSupervisorLocation } from "./../../api/Admin/SupervisorLocation/getSupervisorLocation";
import { getSupervisorById } from "./../../api/Admin/Supervisors/getSupervisorById";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const POLL_MS = 10_000;
const formatSec = (s) => `00:${String(s).padStart(2, "0")}`;

function ChangeView({ center, duration = 0.8 }) {
    const map = useMap();
    useEffect(() => {
        if (!center || !Number.isFinite(center[0]) || !Number.isFinite(center[1])) return;
        const zoom = map.getZoom() ?? 15;
        map.flyTo(center, zoom, { duration });
    }, [center, map, duration]);
    return null;
}

const MapDialog = ({ open, handleClose, supervisorId }) => {
    const [location, setLocation] = useState(null);
    const [supervisor, setSupervisor] = useState(null);
    const [error, setError] = useState(null);
    const [remaining, setRemaining] = useState(POLL_MS / 1000);
    const [lastUpdated, setLastUpdated] = useState(null);

    const cancelledRef = useRef(false);
    const timerRef = useRef(null);

    const fetchLocation = async () => {
        try {
            const response = await getSupervisorLocation(supervisorId);
            if (cancelledRef.current) return;

            const loc = response?.data || response;
            const lat = Number(loc?.latitude);
            const lon = Number(loc?.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                setError("لا يوجد موقع متاح لهذا المشرف.");
                return;
            }

            setError(null);
            setLocation({ ...loc, latitude: lat, longitude: lon });
            setLastUpdated(loc?.created_at ? new Date(loc.created_at) : new Date());
            setRemaining(POLL_MS / 1000);
        } catch (err) {
            if (cancelledRef.current) return;
            console.error("فشل في جلب موقع المشرف:", err);
            setError("حدث خطأ أثناء تحميل الموقع.");
        }
    };

    useEffect(() => {
        if (!supervisorId || !open) return;
        cancelledRef.current = false;
        setError(null);
        setLocation(null);
        setSupervisor(null);
        setRemaining(POLL_MS / 1000);

        // جلب فوري
        fetchLocation();
        getSupervisorById(supervisorId).then((res) => {
            if (!cancelledRef.current) setSupervisor(res?.data || res);
        });

        // مؤقّت العدّاد والتحديث كل 10 ثواني
        timerRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    fetchLocation();
                    return POLL_MS / 1000;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            cancelledRef.current = true;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [open, supervisorId]);

    const centerPosition = location
        ? [location.latitude, location.longitude]
        : [24.7136, 46.6753]; // افتراضي

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Button variant="contained" size="small" sx={{ bgcolor: "#308A9F", borderRadius: "8px", fontWeight: "bold", fontSize: 14 }}>
                        GPS إشارات الموقع
                    </Button>
                    <Chip label={`تحديث خلال: ${formatSec(remaining)}`} variant="outlined" sx={{ fontWeight: "bold" }} />
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 0 }}>
                <Box mb={2}>
                    <Stack direction="row" spacing={4} alignItems="center" mt={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar alt="المشرف" src="/supervisor-avatar.png" sx={{ width: 32, height: 32 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">المشرف</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {supervisor?.name || "جارٍ التحميل..."}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                                    {supervisor?.phone || ""}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>

                <Box sx={{ height: 500, width: "100%", borderRadius: 2, overflow: "hidden", mt: 2 }}>
                    {error ? (
                        <Typography sx={{ textAlign: "center", mt: 10, color: "gray" }}>{error}</Typography>
                    ) : location ? (
                        <>
                            <MapContainer center={centerPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <ChangeView center={[location.latitude, location.longitude]} />
                                <Marker position={[location.latitude, location.longitude]} />
                            </MapContainer>
                            <Typography sx={{ mt: 2, textAlign: "center", color: "#666", fontSize: "0.85rem" }}>
                                آخر تحديث: {lastUpdated?.toLocaleString("ar-EG")}
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{ textAlign: "center", mt: 10, color: "gray" }}>جارٍ تحميل الموقع...</Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button variant="outlined" color="error" onClick={handleClose} sx={{ width: "150px" }}>
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MapDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    supervisorId: PropTypes.number.isRequired,
};

export default MapDialog;
