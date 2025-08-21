import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQueryClient } from "@tanstack/react-query";

import { getExamTypeById } from './../../../../api/Admin/examTypes/getExamTypeById';
import { updateExamType } from './../../../../api/Admin/examTypes/updateExamType';

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        margin: ".7rem",
        backgroundColor: "#F9FAFB",
        "& fieldset": { borderColor: "#E5E7EB" },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": { borderColor: "#1BB5C4", borderWidth: "2px" },
    },
    "& .MuiInputBase-input": { textAlign: "right", padding: "12px 14px" },
};
const labelSx = { color: "text.secondary", fontSize: 14, pr: 1, textAlign: "right", whiteSpace: "nowrap" };

export default function UpdateExamTypeModal({
    open,
    examTypeId,
    initialData = null,
    onClose,
    onUpdated,
    title = "تعديل نوع امتحان",
}) {
    const [values, setValues] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!open) return;
        let alive = true;

        const fill = (obj) => {
            setValues({
                name: obj?.name ?? "",
                description: obj?.description ?? "",
            });
        };

        (async () => {
            if (initialData) {
                fill(initialData);
                return;
            }
            if (!examTypeId) return;

            try {
                setLoading(true);
                const res = await getExamTypeById(examTypeId);
                const t = res?.data ?? res ?? {};
                if (!alive) return;
                fill(t);
            } catch (e) {
                console.error(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [open, examTypeId, initialData]);

    const canSave = useMemo(() => values.name.trim().length > 0 && !saving, [values.name, saving]);
    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const handleClose = () => {
        if (saving) return;
        onClose?.();
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = { name: values.name.trim(), description: values.description?.trim() || "" };
            const updated = await updateExamType(examTypeId, payload);

            await queryClient.invalidateQueries({ queryKey: ["admin-exam-types"] });

            onUpdated?.(updated);
            onClose?.();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 8 };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { direction: "rtl", borderRadius: 4 } }}>
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton onClick={handleClose} size="small" sx={{ position: "absolute", left: 8, top: 8 }} aria-label="إغلاق" disabled={saving}>
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>{title}</Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2.25} alignItems="center">
                        <Grid item {...fieldCols}>
                        <Grid item {...labelCols}><Typography sx={labelSx}>اسم النوع</Typography></Grid>
                            <TextField
                                value={values.name}
                                onChange={change("name")}
                                fullWidth
                                sx={fieldSx}
                                placeholder="مثال: اختبار فصلي"
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item {...fieldCols}>
                        <Grid item {...labelCols}><Typography sx={labelSx}>الوصف</Typography></Grid>
                            <TextField
                                value={values.description}
                                onChange={change("description")}
                                fullWidth
                                sx={fieldSx}
                                placeholder="وصف اختياري لنوع الامتحان"
                                multiline
                                minRows={3}
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSave || loading}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ التعديل"}
                </Button>
                <Button onClick={handleClose} disabled={saving} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, py: 1 }}>
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
