import { useState, useMemo } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    const [errorMsg, setErrorMsg] = useState("");
    const queryClient = useQueryClient();

    const canSave = useMemo(() => values.name.trim().length > 0, [values.name]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const handleClose = () => {
        if (createMut.isPending) return;
        setValues(INITIAL);
        setErrorMsg("");
        onClose?.();
    };

    // إدراج/تحديث عنصر جديد داخل الكاش (يدعم مصفوفتين أو استجابة {data:[]})
    const upsertIntoCache = (queryKey, createdItem) => {
        queryClient.setQueryData(queryKey, (old) => {
            if (!old) {
                return Array.isArray(createdItem) ? createdItem : [createdItem];
            }

            if (Array.isArray(old?.data)) {
                return {
                    ...old,
                    data: [createdItem, ...old.data],
                    meta: old.meta
                        ? { ...old.meta, total: (Number(old.meta.total) || old.data.length) + 1 }
                        : old.meta,
                };
            }

            if (Array.isArray(old)) {
                return [createdItem, ...old];
            }

            return old;
        });
    };

    // Mutation: إنشاء نوع امتحان
    const createMut = useMutation({
        mutationFn: async () => {
            const payload = {
                name: values.name.trim(),
                description: values.description?.trim() || "",
            };
            return createExamType(payload);
        },
        onSuccess: (created) => {
            const newItem = created?.data ?? created;

            if (newItem && typeof newItem === "object") {
                // تحديث الكاش مباشرة (أسرع تجربة)
                upsertIntoCache(["teacher-exam-types"], newItem);
                upsertIntoCache(["admin-exam-types"], newItem);
            }

            // ويمكن أيضًا إبطال الاستعلامات إن رغبت بدلاً من/بالإضافة إلى upsert:
            // queryClient.invalidateQueries({ queryKey: ["teacher-exam-types"] });
            // queryClient.invalidateQueries({ queryKey: ["admin-exam-types"] });

            setValues(INITIAL);
            setErrorMsg("");
            onCreated?.(created);
            handleClose();
        },
        onError: (e) => {
            const msg = e?.response?.data?.message || e?.message || "تعذر إنشاء نوع الامتحان.";
            setErrorMsg(msg);
        },
    });

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
                    disabled={createMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {errorMsg && (
                    <Typography sx={{ color: "error.main", mb: 1.5, textAlign: "right" }}>
                        {errorMsg}
                    </Typography>
                )}

                <Grid container spacing={2.25} alignItems="center">
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
                            disabled={createMut.isPending}
                        />
                    </Grid>

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
                            disabled={createMut.isPending}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={() => createMut.mutate()}
                    disabled={!canSave || createMut.isPending}
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
                    {createMut.isPending ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={createMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
