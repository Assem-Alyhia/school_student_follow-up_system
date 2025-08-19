import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Divider, Typography } from '@mui/material';

const yearLabel = (y, id) => {
    if (!y && !id) return '-';
    if (y?.name) return y.name;
    if (y?.title) return y.title;
    if (y?.label) return y.label;
    const sy = y?.start_year ?? y?.startYear;
    const ey = y?.end_year ?? y?.endYear;
    if (sy || ey) return [sy, ey].filter(Boolean).join(' / ');
    return `#${id}`;
};

export default function GradeDetailsModal({ open, onClose, grade }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { direction: 'rtl' } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>تفاصيل الدرجة</DialogTitle>
            <Divider />
            <DialogContent sx={{ mt: 2 }}>
                {grade ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1.25 }}>
                        <Typography color="text.secondary">المعرف:</Typography><Typography>{grade.id}</Typography>
                        <Typography color="text.secondary">الطالب:</Typography><Typography>{grade.student?.name ?? `#${grade.student_id}`}</Typography>
                        <Typography color="text.secondary">السنة الأكاديمية:</Typography><Typography>{yearLabel(grade.academic_year, grade.academic_year_id)}</Typography>
                        <Typography color="text.secondary">الشعبة:</Typography><Typography>{grade.classroom?.name ?? `#${grade.classroom_id}`}</Typography>
                        <Typography color="text.secondary">المادة:</Typography><Typography>{grade.subject?.name ?? `#${grade.subject_id}`}</Typography>
                        <Typography color="text.secondary">الفصل:</Typography><Typography>{grade.term}</Typography>
                        <Typography color="text.secondary">العلامة:</Typography><Typography>{grade.final_score}</Typography>
                        {grade.note ? (<><Typography color="text.secondary">ملاحظة:</Typography><Typography>{grade.note}</Typography></>) : null}
                    </Box>
                ) : (
                    <Typography>لا توجد بيانات.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}
