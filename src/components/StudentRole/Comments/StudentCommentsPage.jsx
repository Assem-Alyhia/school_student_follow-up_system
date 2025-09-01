// src/components/Student/Comments/StudentCommentsPage.jsx
import React, { useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Stack,
    Divider,
    Avatar,
    Tooltip,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useQuery } from "@tanstack/react-query";

import { getStudentComments } from "../../../api/Student/Comments/getStudentComments";

const normalizeArabic = (str = "") =>
    String(str)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ء/g, "")
        .replace(/\s+/g, " ")
        .trim();

const arTime = (d) =>
    d?.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) ?? "—";

const gDate = (d) =>
    d?.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }) ?? "—";

const hDate = (d) =>
    d?.toLocaleDateString("ar-SA-u-ca-islamic", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }) ?? "—";

function CommentItem({ item, onCopy }) {
    const who = item?.user?.name || "—";
    const note = item?.note || "";
    const dt = item?.created_at ? new Date(item.created_at) : null;

    return (
        <Box
            sx={{
                px: { xs: 2, md: 3 },
                py: 2.25,
                "&:hover": { backgroundColor: "#FAFCFD" },
            }}
        >
            {/* السطر العلوي: اسم الكاتب + التاريخ/الوقت */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
            >
                {/* صورة + اسم — بدون حروف داخل الصورة، ومسافة أوضح */}
                <Stack direction="row" spacing={2.5} alignItems="center">
                    <Avatar
                        src={item?.user?.image || undefined}
                        variant="circular"
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "#F2F6FA",
                            color: "#22385F",
                            border: "1px solid #DCE6EE",
                        }}
                    >
                        {/* أيقونة افتراضية فقط عند غياب الصورة */}
                        {!item?.user?.image && (
                            <PersonRoundedIcon sx={{ fontSize: 22, color: "#6B7A90" }} />
                        )}
                    </Avatar>

                    <Typography sx={{ fontWeight: 800, color: "#0F2C4B" }}>
                        {who}
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ color: "#5D6B7C", flexWrap: "wrap" }}
                >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                            م {gDate(dt)} • {arTime(dt)}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#8A98A9" }}>
                        •
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{ color: "#5D6B7C" }}
                    >
                        <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">هـ {hDate(dt)}</Typography>
                    </Stack>

                    <Tooltip title="نسخ التعليق">
                        <IconButton size="small" onClick={() => onCopy(note)}>
                            <ContentCopyRoundedIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* نص التعليق */}
            <Typography sx={{ color: "#2C3E50", lineHeight: 1.9 }}>{note}</Typography>
        </Box>
    );
}

export default function StudentCommentsPage() {
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-comments"],
        // الدالة تجلب كل التعليقات (بدون باجينيشن)
        queryFn: () => getStudentComments(),
        staleTime: 60_000,
    });

    const list = useMemo(() => {
        const raw = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
                ? data
                : [];
        if (!search) return raw;
        const q = normalizeArabic(search);
        return raw.filter(
            (c) =>
                normalizeArabic(c?.note).includes(q) ||
                normalizeArabic(c?.user?.name).includes(q)
        );
    }, [data, search]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text || "");
            setCopied(true);
        } catch {
            setCopied(true); // حتى لو فشل، نبيّن للمستخدم محاولة النسخ
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, direction: "rtl" }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #E7EEF5",
                    background: "#fff",
                }}
            >
                {/* العنوان + البحث */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                    justifyContent="space-between"
                    sx={{ mb: 2.5 }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 900,
                            background: "linear-gradient(90deg,#35AFBC,#22385F)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        تعليقات الطالب
                    </Typography>

                    <TextField
                        placeholder="ابحث باسم المعلّم أو نص التعليق…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 420 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "action.active" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                {/* المحتوى */}
                {isLoading ? (
                    <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
                            جارِ تحميل التعليقات…
                        </Typography>
                    </Box>
                ) : isError ? (
                    <Alert severity="error">
                        فشل الجلب: {error?.message || "حدث خطأ غير متوقع"}
                    </Alert>
                ) : list.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                        لا توجد تعليقات مطابقة حالياً.
                    </Box>
                ) : (
                    <Box>
                        {list.map((item, idx) => (
                            <React.Fragment key={item.id ?? idx}>
                                <CommentItem item={item} onCopy={handleCopy} />
                                {idx < list.length - 1 && (
                                    <Divider
                                        sx={{ mx: { xs: 1, md: 2 }, borderStyle: "dashed" }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                )}
            </Paper>

            {/* إشعار نسخ */}
            <Snackbar
                open={copied}
                autoHideDuration={1500}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled" sx={{ direction: "rtl" }}>
                    تم نسخ التعليق إلى الحافظة
                </Alert>
            </Snackbar>
        </Box>
    );
}
