// src/components/TeacherRole/Schedules/WeeklyCalendar/NavigationWeeklySchedule.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Typography, Paper, Grid,
    IconButton, Select, MenuItem, FormControl,
    useMediaQuery, useTheme, Popover, CircularProgress, Alert
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today, SettingsRounded, ChevronRight as RTLPrev } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { getStudentSchedules } from "../../../../api/Student/Schedules/getStudentSchedules";

const arabicDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const TYPE_COLORS = {
    daily: "#90CAF9",  
    event: "#A5D6A7",  
    exam: "#F48FB1",  
    default: "#CE93D8",  
};

const LEGEND = [
    { key: "daily", label: "درس يومي", color: TYPE_COLORS.daily },
    { key: "event", label: "فعالية", color: TYPE_COLORS.event },
    { key: "exam", label: "اختبار", color: TYPE_COLORS.exam },
];

const typeLabel = (t) => (t === "daily" ? "درس يومي" : t === "event" ? "فعالية" : t === "exam" ? "اختبار" : "—");

// وقت 12 ساعة عربي
const formatTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? "ص" : "م"}`;
};

// بداية الأسبوع (الأحد = 0)
const startOfWeekSunday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0..6
    const diff = d.getDate() - day + 0;
    return new Date(d.setDate(diff));
};

export default function NavigationWeeklySchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const today = new Date();
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeekSunday(today));
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

    // حالة الجلب المباشر
    const [rawEvents, setRawEvents] = useState([]);
    const [schedLoading, setSchedLoading] = useState(false);
    const [schedErr, setSchedErr] = useState("");

    // Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // ✅ جلب جدول الطالب مباشرة (يمكنك تمرير week_start إذا كان الـ API يدعم)
    useEffect(() => {
        (async () => {
            try {
                setSchedLoading(true);
                setSchedErr("");
                // مثال لو أردت تمرير بداية الأسبوع:
                // const res = await getStudentSchedules({ week_start: currentWeekStart.toISOString().slice(0,10) });
                const res = await getStudentSchedules();
                const list =
                    Array.isArray(res?.data) ? res.data :
                        Array.isArray(res) ? res :
                            res?.data ? [res.data] : [];
                setRawEvents(list);
            } catch (e) {
                setSchedErr(e?.message || "تعذّر جلب الجدول");
                setRawEvents([]);
            } finally {
                setSchedLoading(false);
            }
        })();
        // لو أردت إعادة الجلب عند تغيير الأسبوع فعّل التالي:
        // }, [currentWeekStart]);
    }, []);

    // توحيد الحدث + الألوان
    const events = useMemo(() => {
        return (rawEvents || []).map((item) => {
            const startISO = item.start_time ?? item.start ?? item.date_start ?? item.date;
            const endISO = item.end_time ?? item.end ?? item.date_end ?? null;
            const d = new Date(startISO);
            const type = String(item.type || item.kind || item.category || "daily").toLowerCase();
            const color = TYPE_COLORS[type] || TYPE_COLORS.default;
            return {
                id: item.id,
                title: item.title || item.name || item.subject?.name || "حدث",
                start: startISO,
                end: endISO,
                dateObj: d,
                y: d.getFullYear(),
                m: d.getMonth(),
                day: d.getDate(),
                wd: d.getDay(),
                type,
                color,
            };
        });
    }, [rawEvents]);

    // أيام الأسبوع الحالي
    const weekDays = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            arr.push(day);
        }
        return arr;
    }, [currentWeekStart]);

    // أحداث الأسبوع الحالي فقط
    const weekEvents = useMemo(() => {
        const start = startOfWeekSunday(currentWeekStart);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return events.filter(e => e.dateObj >= start && e.dateObj < end);
    }, [events, currentWeekStart]);

    // تنقّل
    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
        setSelectedMonth(prev.getMonth());
    };
    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
        setSelectedMonth(next.getMonth());
    };
    const handleToday = () => {
        const now = new Date();
        setCurrentWeekStart(startOfWeekSunday(now));
        setSelectedMonth(now.getMonth());
    };
    const handleMonthChange = (m) => {
        const base = new Date(currentWeekStart);
        base.setMonth(m);
        base.setDate(1);
        setSelectedMonth(m);
        setCurrentWeekStart(startOfWeekSunday(base));
    };

    return (
        <Box sx={{ width: "100%", p: isMobile ? 1 : 3, bgcolor: "#f5f7fa" }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: "#fff", direction: "rtl" }}>
                {/* شريط علوي: تنقّل أسبوع/شهر + أسطورة + اليوم */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={5} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={handlePrevWeek}><RTLPrev /></IconButton>
                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
                                {arabicMonths.map((m, idx) => (
                                    <MenuItem key={idx} value={idx}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography sx={{ mx: 1, fontWeight: 700, color: "#22385F" }}>
                            {currentWeekStart.getFullYear()}
                        </Typography>
                        <IconButton onClick={handleNextWeek}><ChevronLeft /></IconButton>
                    </Grid>

                    <Grid item xs={12} md={7} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 2, flexWrap: "wrap" }}>
                        {LEGEND.map((it) => (
                            <Box key={it.key} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: it.color, boxShadow: "0 0 0 2px rgba(0,0,0,0.05)" }} />
                                <Typography variant="caption" sx={{ color: "#6b7a90", fontWeight: 700 }}>{it.label}</Typography>
                            </Box>
                        ))}
                        <IconButton onClick={handleToday}><Today /></IconButton>
                    </Grid>
                </Grid>

                {schedErr && <Alert severity="warning" sx={{ mb: 1.5 }}>{schedErr}</Alert>}

                {/* شبكة الأسبوع */}
                {schedLoading ? (
                    <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={1} columns={7}>
                        {weekDays.map((date, i) => {
                            const dayEvents = weekEvents.filter(
                                e => e.day === date.getDate() && e.m === date.getMonth() && e.y === date.getFullYear()
                            );
                            const count = dayEvents.length;

                            return (
                                <Grid item xs={7} sm={7} md={1} lg={1} key={i}>
                                    <Box sx={{ border: "1px solid #ddd", minHeight: isMobile ? "16vh" : "18vh", bgcolor: "#fff", p: 1, borderRadius: 1 }}>
                                        {/* رأس الخلية: عدّاد + اليوم/التاريخ */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            {count > 0 && (
                                                <Box sx={{ px: 1, py: 0.2, borderRadius: 2, fontSize: 12, fontWeight: 700, backgroundColor: "#308A9F", color: "#fff", lineHeight: 1.6 }}>
                                                    {count}
                                                </Box>
                                            )}
                                            <Typography fontWeight="bold" color="#22385F">
                                                {arabicDays[date.getDay()]} - {date.getDate()}
                                            </Typography>
                                        </Box>

                                        {/* أحداث اليوم */}
                                        <Box sx={{ mt: 1, maxHeight: "12vh", overflowY: "auto" }}>
                                            {dayEvents.map((event, idx) => (
                                                <Box
                                                    key={event.id ?? idx}
                                                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: event.color, p: 0.5, mb: 0.5, borderRadius: 1, cursor: "pointer" }}
                                                    onDoubleClick={() =>
                                                        navigate(`/teacherDashboard/calendarSchedule?y=${date.getFullYear()}&m=${date.getMonth() + 1}&d=${date.getDate()}`)
                                                    }
                                                >
                                                    <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }}>
                                                        {event.title}
                                                    </Typography>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenPopover(e, event); }}>
                                                        <SettingsRounded fontSize="small" sx={{ color: "#fff" }} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Paper>

            {/* Popover التفاصيل */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 260 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: "rtl" }}>
                        <Typography sx={{ color: "#22385F", fontWeight: 700, mb: .5 }}>
                            {selectedEvent.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", my: .5 }}>
                            نوع الحدث: {typeLabel(selectedEvent.type)}
                        </Typography>
                        {selectedEvent.dateObj && (
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                يوم {arabicDays[selectedEvent.dateObj.getDay()]} - {selectedEvent.dateObj.getDate()} {arabicMonths[selectedEvent.dateObj.getMonth()]}
                            </Typography>
                        )}
                        {(selectedEvent.start || selectedEvent.end) && (
                            <Typography variant="body2" sx={{ color: "text.secondary", mt: .5 }}>
                                {formatTime(selectedEvent.start)}{selectedEvent.end ? ` - ${formatTime(selectedEvent.end)}` : ""}
                            </Typography>
                        )}
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
