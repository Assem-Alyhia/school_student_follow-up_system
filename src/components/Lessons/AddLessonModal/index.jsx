import { useEffect, useMemo, useState } from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, FormControl, Select, MenuItem, CircularProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import arLocale from 'date-fns/locale/ar-SA';
import { format } from 'date-fns';

import { getAvailableClassrooms } from '../../../api/Admin/Classrooms/getAvailableClassrooms';
import { createSchedule } from '../../../api/Admin/Schedules/createSchedule.JS';

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

export default function AddLessonModal({ open, onClose, name, academicYearId }) {
    const [values, setValues] = useState({
        title: '',
        description: '',
        type: 'daily',          
        classroom_id: '',       
        startDate: null,
        endDate: null,
    });

    const [loadingClasses, setLoadingClasses] = useState(false);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        if (!open) return;
        let mounted = true;
        (async () => {
            try {
                setLoadingClasses(true);
                const res = await getAvailableClassrooms();
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (mounted) setClasses(list);
            } catch (e) {
                console.error('فشل جلب الشُّعب:', e);
                setClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        })();
        return () => { mounted = false; };
    }, [open]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));
    const changeDate = (k) => (v) => setValues((s) => ({ ...s, [k]: v }));

    const canSubmit = useMemo(() => {
        return (
            values.title.trim() &&
            values.classroom_id &&
            values.startDate &&
            values.endDate &&
            values.type
        );
    }, [values]);

    const handleSave = async () => {
        const payload = {
            academic_year_id: Number(academicYearId),
            classroom_id: Number(values.classroom_id),
            type: values.type, 
            title: values.title,
            start_time: format(values.startDate, 'yyyy-MM-dd'),
            end_time: format(values.endDate, 'yyyy-MM-dd'),
            description: values.description || '',
        };
        try {
            await createSchedule(payload);
            onClose?.();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { direction: 'rtl', borderRadius: 4, overflow: 'hidden', boxShadow: '0 14px 40px rgba(0,0,0,0.18)' },
            }}
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
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arLocale}>
                    <Grid container spacing={2.25} alignItems="center">
                        {/* العنوان */}
                        <Grid item xs={12} md={2}><Typography sx={labelSx}>العنوان</Typography></Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                fullWidth placeholder="ادخل عنوان المناسبة"
                                value={values.title} onChange={change('title')} sx={fieldSx}
                            />
                        </Grid>

                        {/* الوصف */}
                        <Grid item xs={12} md={2}><Typography sx={labelSx}>الوصف</Typography></Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                fullWidth placeholder="(اختياري) اكتب الوصف"
                                value={values.description} onChange={change('description')} sx={fieldSx}
                            />
                        </Grid>

                        {/* الشُّعبة */}
                        <Grid item xs={12} md={2}><Typography sx={labelSx}>الشعبة</Typography></Grid>
                        <Grid item xs={12} md={4}>
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

                        {/* نوع الجدول */}
                        <Grid item xs={12} md={2}><Typography sx={labelSx}>نوع الجدول</Typography></Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth sx={fieldSx}>
                                <Select value={values.type} onChange={change('type')} displayEmpty>
                                    {TYPE_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* التواريخ */}
                        <Grid item xs={12} md={2}><Typography sx={labelSx}>تاريخ البداية</Typography></Grid>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                value={values.startDate} onChange={changeDate('startDate')}
                                slotProps={{ textField: { fullWidth: true, placeholder: 'يوم/شهر/سنة', sx: fieldSx } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}><Typography sx={labelSx}>تاريخ النهاية</Typography></Grid>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                value={values.endDate} onChange={changeDate('endDate')}
                                slotProps={{ textField: { fullWidth: true, placeholder: 'يوم/شهر/سنة', sx: fieldSx } }}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
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
