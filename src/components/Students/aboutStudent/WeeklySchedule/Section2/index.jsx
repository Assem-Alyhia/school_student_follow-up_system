// src/components/Students/Schedule/WeeklySchedule1.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Typography, Paper, Grid,
    IconButton, useMediaQuery, useTheme,
    Select, MenuItem, FormControl, Popover,
    CircularProgress, Alert
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today, SettingsRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getStudentById } from "./../../../../../api/Admin/Students/getStudentById";

const arabicDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const colors = ["#B39DDB", "#81D4FA", "#AED581", "#FFAB91", "#F06292", "#BA68C8", "#4DD0E1"];

const formatTime = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const am = h < 12;
    h = h % 12 || 12;
    return `${h}:${m} ${am ? "ص" : "م"}`;
};

export default function WeeklySchedule1({ studentId }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    // Popover state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const handleOpenPopover = (ev, event) => { setAnchorEl(ev.currentTarget); setSelectedEvent(event); };
    const handleClosePopover = () => { setAnchorEl(null); setSelectedEvent(null); };

    // ===== React Query: fetch student (and schedules) =====
    const { data: studentData, isLoading, isError, error } = useQuery({
        queryKey: ["student", String(studentId)],
        queryFn: () => getStudentById(studentId),
        enabled: Boolean(studentId),
        staleTime: 5 * 60 * 1000,
    });

    // Parse schedules -> events
    const events = useMemo(() => {
        const schedules = studentData?.classroom?.schedules || [];
        return schedules.map((item, i) => {
            const start = new Date(item.start_time);
            return {
                id: item.id,
                title: item.title,
                date: start, // Date object
                color: colors[i % colors.length],
                startTime: item.start_time,
                endTime: item.end_time || item.start_time,
                dayIndex: start.getDay(),
            };
        });
    }, [studentData]);

    // Sync week start when month/year changes
    useEffect(() => {
        setCurrentWeekStart(new Date(selectedYear, selectedMonth, 1));
    }, [selectedMonth, selectedYear]);

    const getWeekDays = (startDate) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const getWeekNumberInMonth = (date) => {
        const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const diffInDays = Math.floor((date - firstOfMonth) / (1000 * 60 * 60 * 24));
        return Math.floor(diffInDays / 7) + 1;
    };

    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
        if (prev < firstDayOfMonth) return;
        setCurrentWeekStart(prev);
    };

    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        if (next > lastDayOfMonth) return;
        setCurrentWeekStart(next);
    };

    const handleToday = () => {
        const now = new Date();
        setSelectedMonth(now.getMonth());
        setSelectedYear(now.getFullYear());
        setCurrentWeekStart(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const weekDays = getWeekDays(currentWeekStart);

    return (
        <Box sx={{ width: "100%", p: isMobile ? 1 : 3, bgcolor: "#f5f7fa" }}>
            <Paper sx={{ p: isMobile ? 1 : 3, bgcolor: "white", direction: "rtl" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Typography fontWeight="bold" color="#22385F">
                        الأسبوع رقم {getWeekNumberInMonth(currentWeekStart)} من {arabicMonths[selectedMonth]}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={handlePrevWeek}><ChevronRight /></IconButton>

                        <FormControl variant="standard" size="small">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {arabicMonths.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleNextWeek}><ChevronLeft /></IconButton>
                    </Box>

                    <IconButton onClick={handleToday}><Today /></IconButton>
                </Box>

                {/* Loading & Error */}
                {isLoading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <CircularProgress size={20} /> جاري تحميل الجدول الأسبوعي...
                    </Box>
                )}
                {isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        فشل في جلب الجدول: {error?.message || "حدث خطأ غير متوقع"}
                    </Alert>
                )}

                <Grid container spacing={1}>
                    {weekDays.map((date, i) => {
                        if (date.getMonth() !== selectedMonth) return null;

                        const dayEvents = events.filter(
                            (e) =>
                                e.date.getDate() === date.getDate() &&
                                e.date.getMonth() === date.getMonth() &&
                                e.date.getFullYear() === date.getFullYear()
                        );

                        return (
                            <Grid item xs={12} sm={6} md={3} lg={1.71} key={i}>
                                <Box sx={{
                                    border: "1px solid #ddd",
                                    minHeight: "18vh",
                                    bgcolor: "#fff",
                                    p: 1,
                                    borderRadius: 1
                                }}>
                                    <Typography fontWeight="bold" textAlign="end" color="#22385F">
                                        {arabicDays[date.getDay()]} - {date.getDate()}
                                    </Typography>
                                    <Box sx={{ mt: 1, maxHeight: "12vh", overflowY: "auto" }}>
                                        {dayEvents.map((event) => (
                                            <Box
                                                key={event.id}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    bgcolor: event.color,
                                                    p: 0.5,
                                                    mb: 0.5,
                                                    borderRadius: 1,
                                                    cursor: "pointer",
                                                    transition: "0.2s",
                                                    "&:hover": { opacity: 0.9 },
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/student-schedule-details/${studentId}/${event.date.getFullYear()}/${event.date.getMonth() + 1}/${event.date.getDate()}`
                                                    )
                                                }
                                            >
                                                <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }}>
                                                    {event.title}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); handleOpenPopover(e, event); }}
                                                >
                                                    <SettingsRounded fontSize="small" sx={{ color: "#fff" }} />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        {!isLoading && !isError && dayEvents.length === 0 && (
                                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                لا توجد عناصر
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>

            {/* Popover لعرض تفاصيل الحدث */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { p: 2, borderRadius: 3, width: 260 } }}
            >
                {selectedEvent && (
                    <Box sx={{ direction: "rtl" }}>
                        <Typography sx={{ color: "#22385F", fontWeight: 700, mb: 0.5 }}>
                            {selectedEvent.title || "—"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            التاريخ: {selectedEvent.date.getFullYear()}/{String(selectedEvent.date.getMonth() + 1).padStart(2, "0")}/{String(selectedEvent.date.getDate()).padStart(2, "0")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            اليوم: {arabicDays[selectedEvent.dayIndex ?? selectedEvent.date.getDay()]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                            الوقت: {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                        </Typography>
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
