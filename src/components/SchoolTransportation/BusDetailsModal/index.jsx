// src/components/Admin/Buses/BusDetailsModal.jsx
import React from "react";
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Avatar,
    Chip,
    Divider,
    Grid,
    CircularProgress,
    Stack,
    Toolbar,
} from "@mui/material";
import {
    Close as CloseIcon,
    PhoneIphone as PhoneIcon,
    Wc as GenderIcon,
    CalendarMonth as CalendarIcon,
    Home as HomeIcon,
    CreditCard as PrefixIcon,
    DirectionsBus as BusIcon,
    Category as CategoryIcon,
    ToggleOn as StatusIcon,
    Numbers as NumbersIcon,
    PeopleAlt as CapacityIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getBusById } from "../../../api/Admin/Buses/getBusById";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");
const asArBusType = (t) => {
    switch (String(t || "").toLowerCase()) {
        case "coach": return "حافلة (Coach)";
        case "mini":
        case "minibus": return "ميني باص";
        case "van": return "فان";
        default: return t || "—";
    }
};
const statusChipProps = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "active") return { label: "نشط", sx: { borderColor: "#2e7d32", color: "#2e7d32" } };
    if (s === "inactive") return { label: "غير نشط", sx: { borderColor: "#FF5C5C", color: "#FF5C5C" } };
    return { label: status || "—", sx: { borderColor: "#97A6B2", color: "#97A6B2" } };
};

export default function BusDetailsModal({ open, onClose, id }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["bus-by-id", id],
        queryFn: () => getBusById(id),
        enabled: open && !!id,
    });

    const bus = (data?.data ?? data) || {};
    const busId = bus.id ?? "—";
    const driverName = bus.driver_name ?? "—";
    const driverNumber = bus.driver_number ?? "—";
    const capacity = Number.isFinite(Number(bus.capacity)) ? Number(bus.capacity) : "—";
    const busType = asArBusType(bus.bus_type);
    const statusProps = statusChipProps(bus.status);
    const createdAt = fmtDate(bus.created_at);

    const sup = bus.supervisor || {};
    const supName = sup.name || "—";
    const supPhone = sup.phone || "—";
    const supGender = asArGender(sup.gender);
    const supPrefix = sup.prefix || "—";
    const supDob = fmtDate(sup.dob);
    const supHiring = fmtDate(sup.hiring_date);
    const supAddress = (sup.address || "—").split("\n").join("، ");

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="bus-details-title"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backdropFilter: "blur(3px)",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: { xs: "96%", sm: 720, md: 820 },
                    maxWidth: "96%",
                    direction: "rtl",
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "85vh",
                    bgcolor: "#fff",
                }}
            >
                <Box sx={{ position: "sticky", top: 0, zIndex: 3, bgcolor: "#fff", borderBottom: "1px solid #eef3f7" }}>
                    <Toolbar sx={{ minHeight: 60, px: 2 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ ml: "auto", alignItems: "center" }}
                        >
                            <Chip
                                icon={<BusIcon />}
                                label={`باص #${busId}`}
                                variant="outlined"
                                sx={{
                                    border: "1px solid #308A9F",
                                    color: "#308A9F",
                                    fontWeight: 700,
                                    borderRadius: 1.2,    
                                    px: 1.6,               
                                    height: 36,             
                                }}
                            />
                            <Chip
                                icon={<StatusIcon />}
                                variant="outlined"
                                sx={{
                                    fontWeight: 700,
                                    border: "1px solid",
                                    borderRadius: 1.2,
                                    px: 1.6,
                                    height: 36,
                                    ...statusProps.sx,
                                }}
                                label={statusProps.label}
                            />
                        </Stack>

                        <IconButton onClick={onClose} edge="start" sx={{ mr: "auto", color: "#308A9F" }} aria-label="إغلاق">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>

                    <Box sx={{ textAlign: "center", px: 2, pb: 1 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 60,
                                height: 60,
                                mx: "auto",
                                mb: 0.6,
                                border: "2px solid #308A9F",
                                bgcolor: "#E6EEF5",
                            }}
                        >
                            <BusIcon sx={{ color: "#308A9F", fontSize: 34 }} />
                        </Avatar>

                        <Typography id="bus-details-title" variant="h6" sx={{ color: "#2b5b72", fontWeight: 900, fontSize: 18 }}>
                            تفاصيل الباص
                        </Typography>

                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: "#7A8899", mb: 1 }}>
                            <CalendarIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2">تاريخ الإضافة: {createdAt}</Typography>
                        </Stack>
                    </Box>
                </Box>

                {/* Body قابل للتمرير */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: { xs: 1.5, sm: 2 },
                        py: 2,
                        "&::-webkit-scrollbar": { width: 8 },
                        "&::-webkit-scrollbar-thumb": { background: "#c7d3df", borderRadius: 8 },
                        "&::-webkit-scrollbar-track": { background: "#f3f6fa" },
                    }}
                >
                    {isLoading && (
                        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                            <CircularProgress size={24} />
                            <Typography sx={{ mt: 1, color: "#7A8899" }} variant="body2">
                                جاري تحميل البيانات…
                            </Typography>
                        </Box>
                    )}

                    {isError && !isLoading && (
                        <Box sx={{ py: 3, textAlign: "center", color: "error.main" }}>
                            فشل الجلب: {error?.message || "حدث خطأ غير متوقع"}
                        </Box>
                    )}

                    {!isLoading && !isError && (
                        <>
                            <SectionTitle title="معلومات الباص" />

                            <Grid container spacing={2} columns={12} alignItems="stretch">
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<NumbersIcon />} label="رقم الباص" value={busId} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<CategoryIcon />} label="نوع الباص" value={busType} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<CapacityIcon />} label="السعة" value={capacity} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<StatusIcon />} label="الحالة" value={statusProps.label} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<PersonIcon />} label="اسم السائق" value={driverName} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<PhoneIcon />} label="هاتف السائق" value={driverNumber} dir="ltr" />
                                </Grid>
                            </Grid>

                            <Box sx={{ my: 2.5 }}>
                                <Divider sx={{ my: 1.5 }} />
                            </Box>

                            <SectionTitle title="المشرف المرتبط بالباص" />

                            <Grid container spacing={2} columns={12} alignItems="stretch">
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<PersonIcon />} label="الاسم" value={supName} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<PhoneIcon />} label="الهاتف" value={supPhone} dir="ltr" />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<GenderIcon />} label="الجنس" value={supGender} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<PrefixIcon />} label="رقم سجل المشرف" value={supPrefix} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<CalendarIcon />} label="تاريخ الميلاد" value={supDob} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InfoItem icon={<CalendarIcon />} label="تاريخ التوظيف" value={supHiring} />
                                </Grid>

                                <Grid item xs={12}>
                                    <InfoItem icon={<HomeIcon />} label="العنوان" value={supAddress} />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            </Paper>
        </Modal>
    );
}


function SectionTitle({ title }) {
    return (
        <Typography
            variant="subtitle1"
            sx={{
                color: "#2b5b72",
                fontWeight: 900,
                mb: 1,
                px: 0.5,
                textAlign: "right",      
            }}
        >
            {title}
        </Typography>
    );
}

function InfoItem({ icon, label, value, dir }) {
    return (
        <Box
            sx={{
                p: 1.25,
                border: "1px solid #edf2f7",
                borderRadius: 2,
                bgcolor: "#fbfdff",
                height: "100%",             
                display: "flex",
                alignItems: "right",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(140px,180px) 1fr", 
                    columnGap: 1.25,
                    alignItems: "right",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "right",
                        gap: 0.8,
                        justifyContent: "flex-end",
                        pr: 0.5,
                    }}
                >
                    <Box sx={{ color: "#4c6b7f", display: "flex", alignItems: "center" }}>{icon}</Box>
                    <Typography sx={{ color: "#2b5b72", fontWeight: 800, fontSize: 14 }}>{label}:</Typography>
                </Box>

                <Typography
                    sx={{
                        color: "#203656",
                        fontWeight: 700,
                        fontSize: 15,
                        lineHeight: 1.6,
                        direction: dir || "rtl",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        textAlign: "right",       
                    }}
                >
                    {value ?? "—"}
                </Typography>
            </Box>
        </Box>
    );
}
