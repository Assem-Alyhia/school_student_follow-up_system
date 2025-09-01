"use client";

import { useEffect, useMemo, useState } from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem, CircularProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { format } from 'date-fns';

import { getAvailableClassrooms } from '../../../api/Admin/Classrooms/getAvailableClassrooms';
import { getAllAcademicYears } from '../../../api/Admin/AcademicYears/getAllAcademicYears';
import { updateSchedule } from '../../../api/Admin/Schedules/updateSchedule';
import SuccessAlert from '../../../layout/SuccessAlert';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        margin: '.7rem',
        backgroundColor: '#F9FAFB',
        '& fieldset': { borderColor: '#E5E7EB' },
        '&:hover fieldset': { borderColor: '#D1D5DB' },
        '&.Mui-focused fieldset': { borderColor: '#1BB5C4', borderWidth: '2px' },
    },
    '& .MuiInputBase-input': { textAlign: 'right', padding: '12px 14px' },
};

const labelSx = { color: 'text.secondary', fontSize: 14, pr: 1, textAlign: 'right', whiteSpace: 'nowrap' };

const TYPE_OPTIONS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Exam', value: 'exam' },
    { label: 'Event', value: 'event' },
];

const toDatetimeLocalInput = (value) => {
    if (!value) return '';
    try {
        const normalized = typeof value === 'string' && value.includes(' ') ? value.replace(' ', 'T') : value;
        const d = new Date(normalized);
        if (isNaN(d)) return '';
        return format(d, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return '';
    }
};

const toSqlDateTime = (v) => {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d) ? format(d, 'yyyy-MM-dd HH:mm:ss') : '';
};

const ensureOptionInList = (list, id, label, key = 'id') => {
    if (!id) return list;
    const exists = list.some((x) => String(x?.[key]) === String(id));
    if (exists) return list;
    const synthetic = { [key]: id, id, name: label || `#${id}`, title: label, label };
    return [synthetic, ...list];
};

const findYearIdByDate = (years, dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const hit = years.find((y) => {
        const s = new Date(y.start_date ?? y.start ?? y.start_at ?? y.startYear ?? y.start_year);
        const e = new Date(y.end_date ?? y.end ?? y.end_at ?? y.endYear ?? y.end_year);
        return !isNaN(s) && !isNaN(e) && d >= s && d <= e;
    });
    return hit?.id ? String(hit.id) : '';
};

export default function UpdateScheduleModal({
    open,
    onClose,
    schedule,
    name = 'تعديل الحدث',
    onUpdated,
    selectedClassroomId,
    selectedYearId,
}) {
    const [values, setValues] = useState({
        academic_year_id: '',
        classroom_id: '',
        type: 'daily',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    const [saving, setSaving] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loadingYears, setLoadingYears] = useState(false);
    const [years, setYears] = useState([]);

    // تنبيه النجاح/الخطأ
    const [alert, setAlert] = useState({
        show: false,
        title: '',
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        if (!open) return;
        let mounted = true;

        (async () => {
            try {
                setLoadingClasses(true);
                const res = await getAvailableClassrooms();
                const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                if (mounted) setClasses(list);
            } finally {
                setLoadingClasses(false);
            }
        })();

        (async () => {
            try {
                setLoadingYears(true);
                const data = await getAllAcademicYears();
                const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                if (mounted) setYears(list);
            } finally {
                setLoadingYears(false);
            }
        })();

        return () => { mounted = false; };
    }, [open]);

    useEffect(() => {
        if (!open || !schedule) return;

        const rawYearId =
            schedule.academic_year_id ??
            schedule.academic_year?.id ??
            schedule.academicYearId ??
            '';

        const rawClassId =
            schedule.classroom_id ??
            schedule.classroom?.id ??
            schedule.classroomId ??
            '';

        setValues({
            academic_year_id: rawYearId !== '' && rawYearId != null ? String(rawYearId) : '',
            classroom_id: rawClassId !== '' && rawClassId != null ? String(rawClassId) : '',
            type: schedule.type ?? 'daily',
            title: schedule.title ?? '',
            description: schedule.description ?? '',
            startDate: toDatetimeLocalInput(schedule.start_time),
            endDate: toDatetimeLocalInput(schedule.end_time),
        });
    }, [open, schedule]);

    useEffect(() => {
        if (!open) return;

        let yearId = values.academic_year_id;
        if (!yearId && years.length) {
            yearId = findYearIdByDate(years, schedule?.start_time) || (selectedYearId ? String(selectedYearId) : '');
        }

        let classId = values.classroom_id || (selectedClassroomId ? String(selectedClassroomId) : '');

        setValues((s) => ({
            ...s,
            academic_year_id: yearId || s.academic_year_id,
            classroom_id: classId || s.classroom_id,
        }));

        setYears((prev) => {
            const label =
                schedule?.academic_year?.name ??
                schedule?.academic_year?.title ??
                schedule?.academic_year?.label ??
                undefined;
            return ensureOptionInList(prev, yearId, label, 'id');
        });

        setClasses((prev) => {
            const label =
                schedule?.classroom?.name ??
                schedule?.classroom?.title ??
                schedule?.classroom?.label ??
                undefined;
            return ensureOptionInList(prev, classId, label, 'id');
        });
    }, [open, years, classes, selectedYearId, selectedClassroomId, schedule, values.academic_year_id, values.classroom_id]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const canSubmit = useMemo(() => {
        const ok =
            schedule?.id &&
            values.academic_year_id &&
            values.classroom_id &&
            values.title.trim() &&
            values.type &&
            values.startDate &&
            values.endDate;
        if (!ok) return false;
        const start = new Date(values.startDate);
        const end = new Date(values.endDate);
        return !isNaN(start) && !isNaN(end) && end >= start;
    }, [values, schedule?.id]);

    const handleSave = async () => {
        if (!schedule?.id) return;
        const payload = {
            academic_year_id: Number(values.academic_year_id),
            classroom_id: Number(values.classroom_id),
            type: values.type,
            title: values.title,
            start_time: toSqlDateTime(values.startDate),
            end_time: toSqlDateTime(values.endDate),
            description: values.description || '',
        };
        try {
            setSaving(true);
            const updated = await updateSchedule(schedule.id, payload);

            setAlert({
                show: true,
                title: 'تم التعديل',
                message: 'تم حفظ التعديلات بنجاح.',
                severity: 'success',
            });

            onUpdated?.(updated);

            setTimeout(() => {
                setAlert((a) => ({ ...a, show: false }));
                onClose?.();
            }, 1000);
        } catch (e) {
            const apiMsg =
                e?.response?.data?.message ||
                e?.message ||
                'حدث خطأ أثناء حفظ التعديلات.';
            setAlert({
                show: true,
                title: 'فشل التعديل',
                message: apiMsg,
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { direction: 'rtl', borderRadius: 4, overflow: 'hidden', boxShadow: '0 14px 40px rgba(0,0,0,0.18)' } }}
        >
            {alert.show && (
                <SuccessAlert
                    title={alert.title}
                    message={alert.message}
                    severity={alert.severity}
                    onClose={() => setAlert((a) => ({ ...a, show: false }))}
                />
            )}

            <Box sx={{ position: 'relative', px: 2, pt: 1.25 }}>
                <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', left: 8, top: 8 }} aria-label="إغلاق" disabled={saving}>
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0C4A6E', textAlign: 'right', pr: 1 }}>
                    {name}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                <Grid container spacing={2.25} alignItems="center">
                    <Grid item {...labelCols}><Typography sx={labelSx}>السنة الأكاديمية</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <FormControl fullWidth sx={fieldSx}>
                            {loadingYears ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, mx: 2 }}>
                                    <CircularProgress size={22} />
                                </Box>
                            ) : (
                                <Select value={values.academic_year_id} onChange={change('academic_year_id')} displayEmpty disabled={saving}>
                                    <MenuItem value="" disabled>اختر السنة الأكاديمية</MenuItem>
                                    {years.map((y) => {
                                        const label =
                                            (y?.name ??
                                                y?.title ??
                                                y?.label ??
                                                `${y?.start_year ?? ''}${y?.end_year ? ` / ${y.end_year}` : ''}`) ||
                                            `سنة #${y?.id}`;
                                        return (
                                            <MenuItem key={y.id} value={String(y.id)}>
                                                {label}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <FormControl fullWidth sx={fieldSx}>
                            {loadingClasses ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, mx: 2 }}>
                                    <CircularProgress size={22} />
                                </Box>
                            ) : (
                                <Select value={values.classroom_id} onChange={change('classroom_id')} displayEmpty disabled={saving}>
                                    <MenuItem value="" disabled>اختر الشعبة</MenuItem>
                                    {classes.map((c) => (
                                        <MenuItem key={c.id} value={String(c.id)}>
                                            {c?.name ?? c?.title ?? c?.label ?? `شعبة #${c?.id}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>نوع الجدول</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <FormControl fullWidth sx={fieldSx}>
                            <Select value={values.type} onChange={change('type')} displayEmpty disabled={saving}>
                                {TYPE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>العنوان</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <TextField fullWidth placeholder="عنوان المناسبة" value={values.title} onChange={change('title')} sx={fieldSx} disabled={saving} />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>الوصف</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <TextField fullWidth placeholder="(اختياري) الوصف" value={values.description} onChange={change('description')} sx={fieldSx} disabled={saving} />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>تاريخ البداية</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <TextField
                            type="datetime-local"
                            value={values.startDate}
                            onChange={change('startDate')}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                            placeholder="yyyy-MM-ddTHH:mm"
                            disabled={saving}
                        />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>تاريخ النهاية</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <TextField
                            type="datetime-local"
                            value={values.endDate}
                            onChange={change('endDate')}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                            placeholder="yyyy-MM-ddTHH:mm"
                            disabled={saving}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit || saving}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: 'linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)',
                        boxShadow: 'none',
                        '&:hover': { background: 'linear-gradient(90deg, #23C6CD 0%, #193868 100%)' },
                    }}
                >
                    {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={saving}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1, borderColor: 'rgba(0,0,0,0.12)', bgcolor: '#fff' }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
