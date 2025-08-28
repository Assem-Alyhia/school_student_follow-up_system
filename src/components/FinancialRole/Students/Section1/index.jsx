// src/components/SupervisorRole/Parents/ParentsList.jsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationSection from "../../../../layout/PaginationSection";
import {
    Box, Grid, Card, Typography, Avatar, Skeleton, Alert, Chip, Stack, Tooltip, Paper
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import { getFinancialStudents } from "../../../../api/Financial/Students/getFinancialStudents";

const GRADIENT = "linear-gradient(180deg,#35AFBC 0%,#308A9F 45%,#22385F 100%)";
const COLORS = {
    brand1: "#35AFBC",
    brand2: "#308A9F",
    brand3: "#22385F",
    softBg: "#F6FAFB",
    softChip: "#E8F6F7",
    fieldBg: "#FFFFFF",
    textMain: "#22385F",
    textSub: "#6B7A90",
    border: "1px solid rgba(53,175,188,0.28)",
};

const getName = (s) => s?.name || s?.user?.name || "—";
const getImg = (s) => s?.user?.image || "/images/avatars/default.png";
const getLevel = (s) => s?.classroom?.level?.name || "—";
const getClass = (s) => s?.classroom?.name || "—";
const getGender = (s) => s?.gender || "";
const getEmail = (s) => s?.user?.email || "—";
const getPhone = (s) => s?.phone || "—";
const getStatus = (s) => s?.status || "—";
const getDob = (s) => s?.dob || "";
const getEnroll = (s) => s?.enrollment_date || "";
const getAddr = (s) => s?.address || "—";
const getCode = (s) => s?.prefix || "—";
const getMed = (s) => s?.medical_info || "";

const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("ar-EG");
};

export default function Section1() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["financial-students", page, rowsPerPage],
        queryFn: () => getFinancialStudents({ page, per_page: rowsPerPage }),
        keepPreviousData: true,
        staleTime: 60_000,
    });

    const rows = useMemo(() => {
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr;
    }, [data]);

    const total = Number(data?.meta?.total ?? rows.length);
    const lastPage = Number(
        data?.meta?.last_page ??
        Math.max(1, Math.ceil(total / (Number(data?.meta?.per_page ?? rowsPerPage) || 1)))
    );

    return (
        <Box sx={{ direction: "rtl", bgcolor: COLORS.softBg, p: { xs: 2.5, md: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        background: GRADIENT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: 18, md: 20 }
                    }}
                >
                    طلاب المالي
                </Typography>
                <Chip
                    label={`${total} طالب`}
                    sx={{ bgcolor: COLORS.brand2, color: "#fff", fontWeight: 800, px: 1.25, height: 28, borderRadius: 2 }}
                />
            </Stack>

            {isLoading && (
                <Grid container spacing={3} columns={12}>
                    {Array.from({ length: rowsPerPage }).map((_, i) => (
                        <Grid item key={i} xs={12}>
                            <Card sx={{ p: 3, borderRadius: 3, border: COLORS.border }}>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="rounded" height={120} sx={{ my: 2 }} />
                                <Skeleton variant="text" width={260} height={24} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {isError && <Alert severity="error" sx={{ mb: 2 }}>خطأ: {error?.message}</Alert>}

            {!isLoading && !isError && (
                <>
                    <Grid container spacing={3} columns={12}>
                        {rows.map((s) => (
                            <Grid item key={s.id ?? getCode(s)} xs={12}>
                                <StudentCard student={s} />
                            </Grid>
                        ))}
                    </Grid>

                    <PaginationSection
                        page={page}
                        rowsPerPage={rowsPerPage}
                        total={total}
                        lastPage={lastPage}
                        onPageChange={(newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(Number(event.target.value));
                            setPage(1);
                        }}
                    />
                </>
            )}
        </Box>
    );
}

function StudentCard({ student }) {
    const name = getName(student);
    const code = getCode(student);
    const genderLabel =
        getGender(student) === "male" ? "ذكر" :
            getGender(student) === "female" ? "أنثى" : "—";
    const status = getStatus(student);

    return (
        <Card
            sx={{
                width: "100%",
                minHeight: 420,
                borderRadius: 4,
                border: COLORS.border,
                boxShadow: "0 12px 28px rgba(34,56,95,0.14)",
                overflow: "hidden",
                transition: "transform .18s ease, box-shadow .18s ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 18px 36px rgba(34,56,95,0.22)" },
            }}
        >
            <Box sx={{ height: 10, background: GRADIENT }} />

            <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 3.5 }} alignItems="stretch">
                    <Stack direction="column" spacing={1.5} sx={{ flex: 1, minWidth: 280, textAlign: "right" }}>
                        <Avatar
                            src={getImg(student)}
                            alt={name}
                            variant="rounded"
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: 4,
                                border: `3px solid ${COLORS.brand1}`,
                                bgcolor: "#fff",
                                boxShadow: "0 8px 18px rgba(53,175,188,.25)",
                                alignSelf: "flex-start"
                            }}
                        />

                        <Typography sx={{ fontWeight: 900, color: COLORS.textMain, fontSize: 22, lineHeight: 1.25 }}>
                            {name}
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
                            <Chip
                                size="medium"
                                label={getLevel(student)}
                                icon={<SchoolRoundedIcon sx={{ mr: -.5, color: COLORS.brand2 }} />}
                                sx={{ bgcolor: COLORS.softChip, fontWeight: 700 }}
                            />
                            <Chip size="medium" label={getClass(student)} variant="outlined" sx={{ fontWeight: 700 }} />
                            {code !== "—" && (
                                <Chip
                                    size="medium"
                                    color="info"
                                    label={code}
                                    icon={<BadgeRoundedIcon />}
                                    sx={{ bgcolor: COLORS.brand2, color: "#fff", fontWeight: 800, width: "8rem" }}
                                />
                            )}
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={{ xs: 2, md: 2.5 }} sx={{ flex: 2, minWidth: 340, flexWrap: "wrap" }}>
                        <InfoItem icon={<EmailRoundedIcon />} label="البريد" value={getEmail(student)} wide />
                        <InfoItem icon={<PhoneIphoneRoundedIcon />} label="الهاتف" value={getPhone(student)} />
                        <InfoItem icon={<CalendarMonthRoundedIcon />} label="الميلاد" value={fmtDate(getDob(student))} />
                        <InfoItem icon={<CalendarMonthRoundedIcon />} label="التحاق" value={fmtDate(getEnroll(student))} />
                    </Stack>

                    <Stack spacing={1.75} sx={{ flex: 2, minWidth: 360 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                                size="medium"
                                label={
                                    status === "active"
                                        ? "في المدرسة"
                                        : status === "at_home"
                                            ? "في المنزل"
                                            : status === "on_way"
                                                ? "على الطريق"
                                                : status
                                }
                                sx={{ bgcolor: COLORS.softChip, color: COLORS.brand2, fontWeight: 800, px: 0.75 }}
                            />
                            <Chip
                                size="medium"
                                label={genderLabel}
                                icon={<WcRoundedIcon sx={{ mr: -.5, color: COLORS.brand2, width: "3rem" }} />}
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>

                        <TinyLabel>العنوان</TinyLabel>
                        <Typography sx={{ color: "#425466", fontSize: 15.5, whiteSpace: "pre-line", lineHeight: 1.95 }}>
                            <LocationOnRoundedIcon sx={{ fontSize: 19, verticalAlign: "middle", ml: 0.85, color: COLORS.brand2 }} />
                            {getAddr(student)}
                        </Typography>

                        {getMed(student) && (
                            <>
                                <TinyLabel>معلومة طبية</TinyLabel>
                                <Typography
                                    sx={{
                                        color: COLORS.textSub,
                                        fontSize: 14.5,
                                        lineHeight: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                    title={getMed(student)}
                                >
                                    <MedicalServicesRoundedIcon sx={{ fontSize: 19, verticalAlign: "middle", ml: 0.85, color: COLORS.brand2 }} />
                                    {getMed(student)}
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
}

function InfoItem({ icon, label, value, wide = false }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.25,
                px: 1.75,
                borderRadius: 2.5,
                bgcolor: "#fff",
                minWidth: wide ? 320 : 240,
                flexGrow: 1,
            }}
        >
            <Stack spacing={0.75}>
                <TinyLabel>{label}</TinyLabel>
                <Tooltip title={value || "—"}>
                    <Typography
                        sx={{
                            color: COLORS.textMain,
                            fontWeight: 800,
                            fontSize: 15.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            maxWidth: 380,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                            {React.cloneElement(icon, { sx: { fontSize: 19, color: COLORS.brand2 } })}
                        </Box>
                        {value || "—"}
                    </Typography>
                </Tooltip>
            </Stack>
        </Paper>
    );
}

function TinyLabel({ children }) {
    return (
        <Typography
            variant="caption"
            sx={{ color: COLORS.textSub, fontWeight: 900, letterSpacing: 0.35, fontSize: 12.5 }}
        >
            {children}
        </Typography>
    );
}
