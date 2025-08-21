import { useState, useMemo } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQueryClient } from "@tanstack/react-query";

import { createExamType } from "../../../../api/Admin/ExamTypes/createExamType";

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

const INITIAL = { name: "", description: "" };

export default function AddExamTypeModal({ open, onClose, onCreated, title = "إضافة نوع امتحان" }) {
    const [values, setValues] = useState(INITIAL);
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();

    const canSave = useMemo(() => values.name.trim().length > 0 && !saving, [values.name, saving]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const handleClose = () => {
        if (saving) return;
        setValues(INITIAL);
        onClose?.();
    };

    // دالة مساعدة لتحديث الكاش فورًا (تضيف العنصر الجديد إلى البداية)
    const upsertIntoCache = (queryKey, createdItem) => {
        queryClient.setQueryData(queryKey, (old) => {
            if (!old) {
                // في حال لم يكن هناك بيانات سابقة
                return Array.isArray(createdItem) ? createdItem : [createdItem];
            }

            // إذا كان الشكل: { data: [] , meta? }
            if (Array.isArray(old?.data)) {
                return {
                    ...old,
                    data: [createdItem, ...old.data],
                    meta: old.meta
                        ? { ...old.meta, total: (Number(old.meta.total) || old.data.length) + 1 }
                        : old.meta,
                };
            }

            // إذا كان مصفوفة مباشرة
            if (Array.isArray(old)) {
                return [createdItem, ...old];
            }

            // أشكال أخرى نادرة: أعدها كما هي
            return old;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                name: values.name.trim(),
                description: values.description?.trim() || "",
            };

            const created = await createExamType(payload);
            const newItem = created?.data ?? created; // بعض الـ APIs تعيد {data: {...}} وأخرى تعيد الكائن مباشرة

            if (newItem && typeof newItem === "object") {
                // حدّث القوائم المعروضة فورًا بدون انتظار refetch
                upsertIntoCache(["teacher-exam-types"], newItem);
                upsertIntoCache(["admin-exam-types"], newItem);
            }

            setValues(INITIAL);
            onCreated?.(created);
            handleClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 12, md: 10 };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { direction: "rtl", borderRadius: 4 } }}
        >
            <Box sx={{ position: "relative", px: 2, pt: 1.25 }}>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ position: "absolute", left: 8, top: 8 }}
                    aria-label="إغلاق"
                    disabled={saving}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                <Grid container spacing={2.25} alignItems="center">
                    {/* اسم النوع */}
                    <Grid item {...labelCols}>
                        <Typography sx={labelSx}>اسم النوع</Typography>
                    </Grid>
                    <Grid item {...fieldCols}>
                        <TextField
                            value={values.name}
                            onChange={change("name")}
                            fullWidth
                            sx={fieldSx}
                            placeholder="مثال: اختبار فصلي"
                            disabled={saving}
                        />
                    </Grid>

                    {/* الوصف */}
                    <Grid item {...labelCols}>
                        <Typography sx={labelSx}>الوصف</Typography>
                    </Grid>
                    <Grid item {...fieldCols}>
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
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleSave}
                    disabled={!canSave}
                    variant="contained"
                    sx={{
                        minWidth: 180,
                        borderRadius: 2,
                        py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {saving ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
