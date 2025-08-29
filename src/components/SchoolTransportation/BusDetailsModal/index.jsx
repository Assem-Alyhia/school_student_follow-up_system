
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
} from "@mui/material";
import {
    Close as CloseIcon,
    Email as EmailIcon,
    PhoneIphone as PhoneIcon,
    Wc as GenderIcon,
    CalendarMonth as CalendarIcon,
    Home as HomeIcon,
    Badge as BadgeIcon,
    Shield as ShieldIcon,
    Groups as RolesIcon,
    Person as PersonIcon,
    CreditCard as PrefixIcon,
    DirectionsBus as BusIcon,
    Category as CategoryIcon,
    ToggleOn as StatusIcon,
    Numbers as NumbersIcon,
    PeopleAlt as CapacityIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { getBusById } from "../../../api/Admin/Buses/getBusById";

const asArGender = (g) => (g === "male" ? "ذكر" : g === "female" ? "أنثى" : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

const asArBusType = (t) => {
    switch (String(t || "").toLowerCase()) {
        case "coach":
            return "حافلة (Coach)";
        case "mini":
        case "minibus":
            return "ميني باص";
        case "van":
            return "فان";
        default:
            return t || "—";
    }
};

const statusChipProps = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "active")
        return { label: "نشط", sx: { borderColor: "#2e7d32", color: "#2e7d32" } };
    if (s === "inactive")
        return { label: "غير نشط", sx: { borderColor: "#FF5C5C", color: "#FF5C5C" } };
    return { label: status || "—", sx: { borderColor: "#97A6B2", color: "#97A6B2" } };
};

export default function BusDetailsModal({ open, onClose, id }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["bus-by-id", id],
        queryFn: () => getBusById(id),
        enabled: open && !!id,
    });

    const raw = data?.data ?? data ?? {};
    const bus = raw || {};

    const busId = bus.id ?? "—";
    const driverName = bus.driver_name ?? "—";
    const driverNumber = bus.driver_number ?? "—";
    const capacity = Number.isFinite(Number(bus.capacity)) ? Number(bus.capacity) : "—";
    const busType = asArBusType(bus.bus_type);
    const status = bus.status;
    const createdAt = fmtDate(bus.created_at);

    const sup = bus.supervisor || {};
    const supName = sup.name || "—";
    const supPhone = sup.phone || "—";
    const supGender = asArGender(sup.gender);
    const supPrefix = sup.prefix || "—";
    const supDob = fmtDate(sup.dob);
    const supHiring = fmtDate(sup.hiring_date);
    const supAddress = (sup.address || "—").split("\n").join("، ");

    const statusProps = statusChipProps(status);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 780,
                    maxWidth: "95%",
                    p: "38px 28px 28px",
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    direction: "rtl",
                }}
            >
                {/* إغلاق */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 14,
                        left: 18,
                        color: "#308A9F",
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* بادجز يمين أعلى */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 18,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Chip
                        icon={<BusIcon />}
                        label={`باص #${busId}`}
                        size="small"
                        sx={{
                            border: "1px solid #308A9F",
                            color: "#308A9F",
                            fontWeight: "bold",
                        }}
                        variant="outlined"
                    />
                    <Chip
                        icon={<StatusIcon />}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: "bold", border: "1px solid", ...statusProps.sx }}
                        label={statusProps.label}
                    />
                </Box>

                {/* أعلى: أفاتار/أيقونة + تعريف سريع */}
                <Box sx={{ mt: 4.5, textAlign: "center" }}>
                    <Avatar
                        alt=""
                        sx={{
                            width: 84,
                            height: 84,
                            mx: "auto",
                            mb: 1,
                            border: "2px solid #308A9F",
                            bgcolor: "#E6EEF5",
                        }}
                        variant="rounded"
                    >
                        <BusIcon sx={{ color: "#308A9F", fontSize: 44 }} />
                    </Avatar>

                    <Typography variant="h6" sx={{ color: "#308A9F", fontWeight: "bold", mb: 0.6 }}>
                        تفاصيل الباص
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1.2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ color: "#7A8899" }}
                    >
                        <CalendarIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">تاريخ الإضافة: {createdAt}</Typography>
                    </Stack>
                </Box>

                {/* حالات التحميل/الخطأ */}
                {isLoading && (
                    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                        <CircularProgress size={28} />
                        <Typography sx={{ mt: 1.5, color: "#7A8899" }}>جاري تحميل البيانات…</Typography>
                    </Box>
                )}

                {isError && !isLoading && (
                    <Box sx={{ py: 3, textAlign: "center", color: "error.main" }}>
                        فشل الجلب: {error?.message || "حدث خطأ غير متوقع"}
                    </Box>
                )}

                {!isLoading && !isError && (
                    <>
                        {/* معلومات الباص */}
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={2.2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<NumbersIcon />} label="رقم الباص" value={busId} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<CategoryIcon />} label="نوع الباص" value={busType} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<CapacityIcon />} label="السعة" value={capacity} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<StatusIcon />} label="الحالة" value={statusProps.label} />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<PersonIcon />} label="اسم السائق" value={driverName} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<PhoneIcon />} label="هاتف السائق" value={driverNumber} dir="ltr" />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        <Typography variant="subtitle1" sx={{ color: "#308A9F", fontWeight: 900, mb: 1 }}>
                            المشرف المرتبط بالباص
                        </Typography>

                        <Grid container spacing={2.2}>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<PersonIcon />} label="الاسم" value={supName} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<PhoneIcon />} label="الهاتف" value={supPhone} dir="ltr" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* ✅ هنا كان الخطأ */}
                                <InfoRow icon={<GenderIcon />} label="الجنس" value={supGender} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<PrefixIcon />} label="رقم سجل المشرف" value={supPrefix} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<CalendarIcon />} label="تاريخ الميلاد" value={supDob} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<CalendarIcon />} label="تاريخ التوظيف" value={supHiring} />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoRow icon={<HomeIcon />} label="العنوان" value={supAddress} />
                            </Grid>
                        </Grid>

                    </>
                )}
            </Paper>
        </Modal>
    );
}

function InfoRow({ icon, label, value, dir }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ color: "#203656" }}>{icon}</Box>
            <Typography sx={{ color: "#308A9F", fontWeight: "bold", minWidth: 140 }}>
                {label}:
            </Typography>
            <Typography sx={{ color: "#203656", fontWeight: 700, direction: dir || "rtl" }}>
                {value ?? "—"}
            </Typography>
        </Box>
    );
}
