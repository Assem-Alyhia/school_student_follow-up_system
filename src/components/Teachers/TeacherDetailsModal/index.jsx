import React from "react";
import {
    Dialog, DialogTitle, DialogContent, IconButton, Box, Grid, Typography,
    Avatar, Chip, Divider, CircularProgress, Stack, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useQuery } from "@tanstack/react-query";
import { getTeacherById } from "../../../api/Admin/Teachers/getTeacherById"; 

const toDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default function TeacherDetailsModal({ open, teacherId, onClose }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher", teacherId],
        queryFn: () => getTeacherById(teacherId),
        enabled: open && !!teacherId,
    });

    const t = data?.data; 

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
            <DialogTitle sx={{ pr: 6 }}>
                تفاصيل المعلّم
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", left: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Typography color="error">خطأ: {error?.message}</Typography>
                ) : !t ? (
                    <Typography>لا توجد بيانات متاحة.</Typography>
                ) : (
                    <Box>
                        {/* رأس البطاقة */}
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md="auto">
                                <Avatar
                                    src={t.user?.image || "/Teachers/default.jpg"}
                                    alt={t.name}
                                    sx={{ width: 96, height: 96, border: "2px solid #308A9F" }}
                                />
                            </Grid>
                            <Grid item xs={12} md>
                                <Typography variant="h6" sx={{ color: "#22385F", fontWeight: "bold" }}>
                                    {t.name}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                    <Chip icon={<BadgeIcon />} label={`المعرف: ${t.prefix || t.id}`} />
                                    {t.user?.prefix && <Chip label={`مستخدم: ${t.user.prefix}`} />}
                                    <Chip
                                        label={t.gender === "male" ? "ذكر" : t.gender === "female" ? "أنثى" : "غير محدد"}
                                        color="info"
                                        variant="outlined"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* معلومات أساسية */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1.2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EmailIcon fontSize="small" />
                                        <Typography variant="body2">{t.user?.email || "—"}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PhoneIcon fontSize="small" />
                                        <Typography variant="body2">{t.phone || "—"}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <AccountCircleIcon fontSize="small" />
                                        <Typography variant="body2">{t.address || "—"}</Typography>
                                    </Stack>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Stack spacing={1.2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CalendarMonthIcon fontSize="small" />
                                        <Typography variant="body2">تاريخ الميلاد: {toDate(t.dob)}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CalendarMonthIcon fontSize="small" />
                                        <Typography variant="body2">تاريخ التوظيف: {toDate(t.hiring_date)}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SchoolIcon fontSize="small" />
                                        <Typography variant="body2">التخصص: {t.specialization || "—"}</Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* المواد والفصول */}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#308A9F" }}>
                                    المواد
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {(t.subjects || []).length ? (
                                        t.subjects.map((s) => (
                                            <Chip key={s.id || s.name} label={s.name} variant="outlined" />
                                        ))
                                    ) : (
                                        <Typography variant="body2">—</Typography>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#308A9F" }}>
                                    الفصول
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {(t.classrooms || []).length ? (
                                        t.classrooms.map((c) => (
                                            <Chip key={c.id || c.name} label={c.name} variant="outlined" />
                                        ))
                                    ) : (
                                        <Typography variant="body2">—</Typography>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* صلاحيات/أدوار المستخدم (اختياري) */}
                        {!!t.user?.roles?.length && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#308A9F" }}>
                                    الأدوار
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {t.user.roles.map((r) => (
                                        <Chip key={r} label={r} size="small" />
                                    ))}
                                </Stack>
                            </>
                        )}

                        {!!t.user?.permissions?.length && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#308A9F" }}>
                                    الصلاحيات
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {t.user.permissions.slice(0, 15).map((p) => (
                                        <Tooltip title={p} key={p}>
                                            <Chip label={p} size="small" variant="outlined" />
                                        </Tooltip>
                                    ))}
                                    {t.user.permissions.length > 15 && (
                                        <Chip label={`+${t.user.permissions.length - 15}`} size="small" />
                                    )}
                                </Stack>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
