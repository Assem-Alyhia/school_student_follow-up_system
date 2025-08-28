// pages/financials/PaymentDetails.jsx
import React from "react";
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Divider,
    Grid,
    Chip,
    Tooltip,
    Stack,
    Avatar,
    useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const FREQ_AR = { monthly: "شهري", yearly: "سنوي", weekly: "أسبوعي", once: "مرة" };
const STATUS_AR = { pending: "غير مدفوع", completed: "مدفوع", partial: "مدفوع جزئياً" };

const STATUS_STYLE = {
    completed: { bg: "rgba(18,128,92,.12)", color: "#12805C" },
    pending: { bg: "rgba(198,40,40,.12)", color: "#C62828" },
    partial: { bg: "rgba(255,193,7,.18)", color: "#806500" },
};

export default function PaymentDetails({ open, onClose, payment }) {
    const theme = useTheme();
    const p = payment || {};
    const parent = p.parent || {};
    const student = p.student || {};
    const fee = p.schoolFee || {};

    const statusKey = p.status || "pending";
    const statusCfg = STATUS_STYLE[statusKey] || STATUS_STYLE.pending;

    const fmtCurrency = (v) =>
        v == null || v === "" ? "—" : Number(v).toLocaleString("ar-EG", { minimumFractionDigits: 2 });

    const fmtDate = (v) =>
        v ? new Date(v).toLocaleDateString("ar-EG", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";

    const fmtDateTime = (v) =>
        v
            ? new Date(v).toLocaleString("ar-EG", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "—";

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: 820,
                    maxWidth: "96vw",
                    borderRadius: 3,
                    overflow: "hidden",
                    direction: "rtl",
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 2.2,
                        px: 3,
                        background: "linear-gradient(90deg,#35AFBC,#308A9F)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: "rgba(255,255,255,.18)",
                                fontWeight: 800,
                            }}
                        >
                            ﷼
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                تفاصيل الدفعة{" "}
                                {p.payment_number ? (
                                    <Typography component="span" sx={{ opacity: 0.95 }}>
                                        ({p.payment_number})
                                    </Typography>
                                ) : null}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                عرض جميع بيانات الدفعة المختارة
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                            label={STATUS_AR[statusKey] || statusKey}
                            size="small"
                            sx={{
                                bgcolor: statusCfg.bg,
                                color: statusCfg.color,
                                fontWeight: 700,
                                px: 1,
                            }}
                        />
                        <Tooltip title="إغلاق">
                            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                {/* Sections */}
                <Box sx={{ p: 3 }}>
                    {/* Parent & Student */}
                    <SectionTitle>البيانات الأساسية</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="وليّ الأمر"
                                items={[
                                    ["الاسم", `${parent.name || "—"} (${parent.prefix || "—"})`],
                                    ["الهاتف", parent.phone || "—", "ltr"],
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="الطالب"
                                items={[
                                    ["الاسم", `${student.name || "—"} (${student.prefix || "—"})`],
                                    ["الصف", student?.classroom?.name || "—"],
                                ]}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Fee & Status */}
                    <SectionTitle>بيانات الرسم</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="الرسم"
                                items={[
                                    ["اسم الرسم", fee?.name || "—"],
                                    ["الدورية", FREQ_AR[fee?.frequency] || "—"],
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="المبالغ"
                                items={[
                                    ["المبلغ الكلي", fmtCurrency(fee?.amount)],
                                    ["المَدفوع", fmtCurrency(p?.amount)],
                                    ["المتبقّي", fmtCurrency(p?.remaining_amount)],
                                ]}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Dates & Discounts */}
                    <SectionTitle>التواريخ والخصومات</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="التواريخ"
                                items={[
                                    ["تاريخ الدفع", fmtDateTime(p?.paid_at)],
                                    ["الموعد النهائي", fmtDate(fee?.deadline)],
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="الخصم"
                                items={[
                                    ["الخصم", fmtCurrency(p?.discount || 0)],
                                    ["نوع الخصم", p?.discount_status || "none"],
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Modal>
    );
}

/* ---------- صغحات UI مساعدة ---------- */
function SectionTitle({ children }) {
    return (
        <Typography
            variant="subtitle2"
            sx={{ mb: 1.2, color: "#308A9F", fontWeight: 800, letterSpacing: ".2px" }}
        >
            {children}
        </Typography>
    );
}

function InfoCard({ title, items = [] }) {
    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FAFBFC" : "background.paper"),
            }}
        >
            <Typography sx={{ fontWeight: 800, color: "#22385F", mb: 1 }}>{title}</Typography>
            <Grid container spacing={1}>
                {items.map(([label, value, dir], idx) => (
                    <Grid item xs={12} key={idx}>
                        <Field label={label} value={value} dir={dir} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function Field({ label, value, dir }) {
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
            <Typography sx={{ color: "#308A9F", fontWeight: 800, minWidth: 120 }}>{label}:</Typography>
            <Typography sx={{ fontWeight: 700, direction: dir || "rtl" }}>{value}</Typography>
        </Box>
    );
}
