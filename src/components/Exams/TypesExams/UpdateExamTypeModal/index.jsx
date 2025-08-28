import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogContent, IconButton, Box, Typography, Grid,
    TextField, Button, Divider, CircularProgress
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getExamTypeById } from "./../../../../api/Admin/examTypes/getExamTypeById";
import { updateExamType } from "./../../../../api/Admin/examTypes/updateExamType";

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
    const queryClient = useQueryClient();

    const [values, setValues] = useState({ name: "", description: "" });
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!open) return;
        setErrorMsg("");
        if (initialData) {
            setValues({
                name: initialData?.name ?? "",
                description: initialData?.description ?? "",
            });
        } else {
            setValues({ name: "", description: "" });
        }
    }, [open, initialData]);

    const typeQ = useQuery({
        queryKey: ["exam-type", String(examTypeId || "")],
        queryFn: () => getExamTypeById(examTypeId),
        enabled: !!open && !!examTypeId && !initialData,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (initialData) return;
        if (typeQ.data) {
            const t = typeQ.data?.data ?? typeQ.data ?? {};
            setValues({
                name: t?.name ?? "",
                description: t?.description ?? "",
            });
        }
    }, [typeQ.data, initialData]);

    const canSave = useMemo(() => values.name.trim().length > 0, [values.name]);

    const change = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

    const handleClose = () => {
        if (updateMut.isPending) return;
        onClose?.();
    };

    const updateMut = useMutation({
        mutationFn: async () => {
            const payload = {
                name: values.name.trim(),
                description: values.description?.trim() || "",
            };
            return updateExamType(examTypeId, payload);
        },
        onSuccess: async (updated) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["admin-exam-types"] }),
                queryClient.invalidateQueries({ queryKey: ["teacher-exam-types"] }),
                queryClient.invalidateQueries({ queryKey: ["exam-type", String(examTypeId || "")] }),
            ]);

            onUpdated?.(updated);
            onClose?.();
        },
        onError: (e) => {
            const msg = e?.response?.data?.message || e?.message || "تعذر تحديث نوع الامتحان.";
            setErrorMsg(msg);
        },
    });

    const labelCols = { xs: 3, md: 2 };
    const fieldCols = { xs: 9, md: 8 };

    const anyLoading = typeQ.isLoading; // تحميل فقط إذا كنا نجلب من السيرفر
    const anyError = typeQ.isError;
    const firstErrorMsg = typeQ.error?.message;

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
                    disabled={updateMut.isPending}
                >
                    <CloseRoundedIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "right", pr: 1 }}>
                    {title}
                </Typography>
                <Divider sx={{ mt: 1.25, mx: 1.5 }} />
            </Box>

            <DialogContent sx={{ pt: 3, pb: 2.5 }}>
                {anyLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : anyError ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error" sx={{ mb: 1.5 }}>
                            {firstErrorMsg || "تعذّر تحميل بيانات النوع"}
                        </Typography>
                        <Button variant="outlined" onClick={() => typeQ.refetch()}>
                            إعادة المحاولة
                        </Button>
                    </Box>
                ) : (
                    <>
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
                                    disabled={updateMut.isPending}
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
                                    disabled={updateMut.isPending}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <Box sx={{ px: 3, pb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={() => updateMut.mutate()}
                    disabled={!canSave || updateMut.isPending || anyLoading || anyError}
                    variant="contained"
                    sx={{
                        minWidth: 180, borderRadius: 2, py: 1,
                        background: "linear-gradient(90deg, #1CB7BE 0%, #122E57 100%)",
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(90deg, #23C6CD 0%, #193868 100%)" },
                    }}
                >
                    {updateMut.isPending ? "جارٍ الحفظ..." : "حفظ التعديل"}
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={updateMut.isPending}
                    variant="outlined"
                    sx={{ minWidth: 140, borderRadius: 2, py: 1 }}
                >
                    إلغاء
                </Button>
            </Box>
        </Dialog>
    );
}
