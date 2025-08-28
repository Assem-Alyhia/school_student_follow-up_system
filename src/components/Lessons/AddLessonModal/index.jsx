import { useEffect, useMemo, useState } from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem, CircularProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { format } from 'date-fns';

import { getAvailableClassrooms } from '../../../api/Admin/Classrooms/getAvailableClassrooms';
import { getAllAcademicYears } from '../../../api/Admin/AcademicYears/getAllAcademicYears';
import { createSchedule } from '../../../api/Admin/Schedules/createSchedule.js';

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

const labelSx = {
    color: 'text.secondary', fontSize: 14, pr: 1, textAlign: 'right', whiteSpace: 'nowrap',
};

const TYPE_OPTIONS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Exam', value: 'exam' },
    { label: 'Event', value: 'event' },
];

export default function AddLessonModal({ open, onClose, name }) {
    const [values, setValues] = useState({
        academic_year_id: '',
        classroom_id: '',
        type: 'daily',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    const [loadingClasses, setLoadingClasses] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loadingYears, setLoadingYears] = useState(false);
    const [years, setYears] = useState([]);

    useEffect(() => {
        if (!open) return;
        let mounted = true;
        (async () => {
            try {
                setLoadingClasses(true);
                const res = await getAvailableClassrooms();
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (mounted) setClasses(list);
            } catch {
                setClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        })();
        (async () => {
            try {
                setLoadingYears(true);
                const data = await getAllAcademicYears();
                const list = Array.isArray(data) ? data : [];
                if (mounted) setYears(list);
            } catch {
                setYears([]);
            } finally {
                setLoadingYears(false);
            }
        })();
        return () => { mounted = false; };
    }, [open]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));
    const changeDateLocal = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const canSubmit = useMemo(() => {
        return (
            values.academic_year_id &&
            values.classroom_id &&
            values.title.trim() &&
            values.type &&
            values.startDate &&
            values.endDate
        );
    }, [values]);

    const toSqlDateTime = (v) => {
        const d = v ? new Date(v) : null;
        return d && !isNaN(d) ? format(d, 'yyyy-MM-dd HH:mm:ss') : '';
    };

    const handleSave = async () => {
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
            await createSchedule(payload);
            onClose?.();
        } catch (e) {
            console.error(e);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 4 };
    const longFieldCols = { xs: 9, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { direction: 'rtl', borderRadius: 4, overflow: 'hidden', boxShadow: '0 14px 40px rgba(0,0,0,0.18)' } }}
        >
            <Box sx={{ position: 'relative', px: 2, pt: 1.25 }}>
                <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', left: 8, top: 8 }} aria-label="إغلاق">
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0C4A6E', textAlign: 'right', pr: 1 }}>
                    {name || 'أضف حدث جديد'}
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
                                <Select value={values.academic_year_id} onChange={change('academic_year_id')} displayEmpty>
                                    <MenuItem value="" disabled>اختر السنة الأكاديمية</MenuItem>
                                    {years.map((y) => (
                                        <MenuItem key={y.id} value={y.id}>
                                            {(y.name ?? y.title ?? y.label ?? `${y.start_year ?? ''}${y.end_year ? ` / ${y.end_year}` : ''}`) || `سنة #${y.id}`}
                                        </MenuItem>
                                    ))}
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
                                <Select value={values.classroom_id} onChange={change('classroom_id')} displayEmpty>
                                    <MenuItem value="" disabled>اختر الشعبة</MenuItem>
                                    {classes.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>
                                            {c.name ?? c.title ?? c.label ?? `شعبة #${c.id}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>نوع الجدول</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <FormControl fullWidth sx={fieldSx}>
                            <Select value={values.type} onChange={change('type')} displayEmpty>
                                {TYPE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>العنوان</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <TextField fullWidth placeholder="ادخل عنوان المناسبة" value={values.title} onChange={change('title')} sx={fieldSx} />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>الوصف</Typography></Grid>
                    <Grid item {...longFieldCols}>
                        <TextField fullWidth placeholder="(اختياري) اكتب الوصف" value={values.description} onChange={change('description')} sx={fieldSx} />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>تاريخ البداية</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <TextField
                            type="datetime-local"
                            value={values.startDate}
                            onChange={changeDateLocal('startDate')}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }} 
                            placeholder="yyyy-MM-ddTHH:mm"
                        />
                    </Grid>

                    <Grid item {...labelCols}><Typography sx={labelSx}>تاريخ النهاية</Typography></Grid>
                    <Grid item {...fieldCols}>
                        <TextField
                            type="datetime-local"
                            value={values.endDate}
                            onChange={changeDateLocal('endDate')}
                            fullWidth
                            sx={fieldSx}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                            placeholder="yyyy-MM-ddTHH:mm"
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSubmit}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: 'linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)',
                        boxShadow: 'none',
                        '&:hover': { background: 'linear-gradient(90deg, #23C6CD 0%, #193868 100%)' },
                    }}
                >
                    أضف نشاط
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1, borderColor: 'rgba(0,0,0,0.12)', bgcolor: '#fff' }}
                >
                    تجاهل
                </Button>
            </Box>
        </Dialog>
    );
}
