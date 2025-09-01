import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, Autocomplete,
    MenuItem, Select, InputLabel, FormControl,
    CircularProgress, Alert, Box
} from "@mui/material";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllStudentsNoPaginate } from "../../../api/Admin/Students/getAllStudentsNoPaginate";
import { getAllAcademicYears } from "../../../api/Admin/AcademicYears/getAllAcademicYears";
import { createPayment } from "./../../../api/Admin/Payments/createPayment";
import { getAllParentsNoPaginate } from "./../../../api/Admin/Parents/getAllParentsNoPaginate";
import { getAllSchoolFeesNoPaginate } from "./../../../api/Admin/SchoolFees/getAllSchoolFeesNoPaginate";
import { getStudentById } from "../../../api/Admin/Students/getStudentById";

const defaultForm = {
    parent_id: "",
    student_id: "",
    academic_year_id: "",
    school_fee_id: "",
    amount: "",
    status: "pending",
    paid_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    discount: "",
    discount_status: "none",
};

const statuses = [
    { value: "pending", label: "غير مدفوع" },
    { value: "completed", label: "مدفوع" },
    { value: "failed", label: "فشل" },
];

const discountStatuses = [
    { value: "none", label: "بدون" },
    { value: "orphans", label: "أيتام" },
    { value: "siblings", label: "أشقاء" },
    { value: "employee_child", label: "ابن موظف" },
];

const AddPaymentDialog = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState(defaultForm);
    const [errorMsg, setErrorMsg] = useState("");
    const [autoParentText, setAutoParentText] = useState("");
    const queryClient = useQueryClient();

    const parentsQ = useQuery({
        queryKey: ["parents:nopage"],
        queryFn: getAllParentsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });
    const studentsQ = useQuery({
        queryKey: ["students:nopage"],
        queryFn: getAllStudentsNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });
    const yearsQ = useQuery({
        queryKey: ["academic-years"],
        queryFn: getAllAcademicYears,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });
    const feesQ = useQuery({
        queryKey: ["school-fees:nopage"],
        queryFn: getAllSchoolFeesNoPaginate,
        enabled: !!open,
        staleTime: 5 * 60 * 1000,
    });

    const parents = useMemo(
        () => (Array.isArray(parentsQ.data) ? parentsQ.data : parentsQ.data?.data) || [],
        [parentsQ.data]
    );
    const students = useMemo(
        () => (Array.isArray(studentsQ.data) ? studentsQ.data : studentsQ.data?.data) || [],
        [studentsQ.data]
    );
    const years = useMemo(
        () => (Array.isArray(yearsQ.data) ? yearsQ.data : yearsQ.data?.data) || [],
        [yearsQ.data]
    );
    const fees = useMemo(
        () => (Array.isArray(feesQ.data) ? feesQ.data : feesQ.data?.data) || [],
        [feesQ.data]
    );

    useEffect(() => {
        if (!open) return;
        setForm(defaultForm);
        setErrorMsg("");
        setAutoParentText("");
    }, [open]);

    const filteredStudents = useMemo(() => {
        if (!form.parent_id) return students;
        const hasParentId = students.some((s) => s?.parent_id != null);
        return hasParentId
            ? students.filter((s) => String(s.parent_id) === String(form.parent_id))
            : students;
    }, [students, form.parent_id]);

    const filteredFees = useMemo(() => {
        if (!form.student_id) return fees;
        const student = students.find(s => String(s.id) === String(form.student_id));
        const levelId = student?.classroom?.level?.id;
        if (!levelId) return fees;
        return fees.filter(fee => fee?.level?.id === levelId);
    }, [fees, students, form.student_id]);

    const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const isValid = useMemo(() => {
        return (
            form.parent_id &&
            form.student_id &&
            form.academic_year_id &&
            form.school_fee_id &&
            form.amount !== "" &&
            form.paid_at &&
            form.status
        );
    }, [form]);

    const createMut = useMutation({
        mutationFn: async () => {
            const payload = {
                parent_id: Number(form.parent_id),
                student_id: Number(form.student_id),
                academic_year_id: Number(form.academic_year_id),
                school_fee_id: Number(form.school_fee_id),
                amount: Number(form.amount),
                status: form.status,
                paid_at: form.paid_at,
                discount: form.discount === "" ? 0 : Number(form.discount),
                discount_status: form.discount_status || "none",
            };
            return createPayment(payload);
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: ["payments"] });
            onCreated?.(res);
            onClose?.();
        },
        onError: (e) => {
            setErrorMsg(e?.response?.data?.message || e?.message || "فشل في إضافة دفعة جديدة");
        },
    });

    const handleClose = () => {
        if (createMut.isPending) return;
        setForm(defaultForm);
        setErrorMsg("");
        setAutoParentText("");
        onClose?.();
    };

    const loadingLists =
        parentsQ.isLoading || studentsQ.isLoading || yearsQ.isLoading || feesQ.isLoading;

    const parentValue = useMemo(
        () => parents.find((p) => String(p.id) === String(form.parent_id)) || null,
        [parents, form.parent_id]
    );
    const studentValue = useMemo(
        () => students.find((s) => String(s.id) === String(form.student_id)) || null,
        [students, form.student_id]
    );
    const yearValue = useMemo(
        () => years.find((y) => String(y.id) === String(form.academic_year_id)) || null,
        [years, form.academic_year_id]
    );
    const feeValue = useMemo(
        () => fees.find((f) => String(f.id) === String(form.school_fee_id)) || null,
        [fees, form.school_fee_id]
    );

    const norm = (s) => String(s || "").trim();

    const fastMatchParentFromStudentObj = (stu) => {
        if (!stu) return null;
        const guessId = stu?.parent_id ?? stu?.parent?.id ?? null;
        const guessName = stu?.parent?.name || stu?.parent?.user?.name;
        return (
            parents.find((p) => String(p?.id) === String(guessId)) ||
            parents.find(
                (p) => norm(p?.name) === norm(guessName) || norm(p?.user?.name) === norm(guessName)
            ) ||
            null
        );
    };

    const handleStudentChange = async (_e, stu) => {
        const sid = stu?.id || "";
        setField("student_id", sid);
        setAutoParentText("");

        const instant = fastMatchParentFromStudentObj(stu);
        if (instant) {
            setForm((prev) => ({ ...prev, parent_id: String(instant.id) }));
            setAutoParentText(`تم ربط وليّ الأمر: ${instant?.name || instant?.user?.name || `#${instant.id}`}`);
        }

        if (!sid) return;

        try {
            const details = await getStudentById(sid);
            const respParentId = details?.parent?.id;
            const respParentName = details?.parent?.name || details?.parent?.user?.name;
            const matchedParent =
                parents.find((p) => String(p?.id) === String(respParentId)) ||
                parents.find(
                    (p) => norm(p?.name) === norm(respParentName) || norm(p?.user?.name) === norm(respParentName)
                ) ||
                null;

            if (matchedParent) {
                setForm((prev) => ({ ...prev, parent_id: String(matchedParent.id) }));
                setAutoParentText(`تم ربط وليّ الأمر: ${matchedParent?.name || matchedParent?.user?.name || `#${matchedParent.id}`}`);
            } else if (!instant) {
                setForm((prev) => ({ ...prev, parent_id: "" }));
                setAutoParentText("تعذّر إيجاد وليّ الأمر في القائمة بناءً على الطالب المختار");
            }
        } catch {
            if (!instant) setAutoParentText("تعذّر جلب بيانات الطالب لاختيار وليّ الأمر تلقائيًا");
        }
    };

    const handleParentChange = (_e, v) => {
        setField("parent_id", v?.id || "");
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth dir="rtl" keepMounted>
            <DialogTitle sx={{ fontWeight: 700, color: "#308A9F" }}>
                أضف دفعة مالية
            </DialogTitle>

            <DialogContent dividers>
                {errorMsg ? <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert> : null}

                {loadingLists ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {/* الطالب على اليمين (في RTL أول عنصر يظهر يمين) */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={filteredStudents}
                                value={studentValue}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                getOptionLabel={(o) =>
                                    o?.name || o?.user?.name || o?.full_name || (o?.id ? `#${o.id}` : "") || ""
                                }
                                onChange={handleStudentChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="الطالب"
                                        margin="dense"
                                        required
                                        helperText="عند اختيار الطالب سيتم اختيار وليّ أمره تلقائيًا من القائمة"
                                    />
                                )}
                            />
                        </Grid>

                        {/* وليّ الأمر على اليسار */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={parents}
                                value={parentValue}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                getOptionLabel={(o) =>
                                    o?.name || o?.full_name || o?.user?.name || (o?.id ? `#${o.id}` : "") || ""
                                }
                                onChange={handleParentChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="ولي الأمر"
                                        margin="dense"
                                        required
                                        helperText={autoParentText || ""}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={years}
                                value={yearValue}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                getOptionLabel={(o) =>
                                    o?.name ||
                                    o?.label ||
                                    (o?.start && o?.end ? `${o.start} - ${o.end}` : "") ||
                                    (o?.id ? `#${o.id}` : "")
                                }
                                onChange={(_e, v) => setField("academic_year_id", v?.id || "")}
                                renderInput={(params) => (
                                    <TextField {...params} label="السنة الدراسية" margin="dense" required />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={filteredFees}
                                value={feeValue}
                                isOptionEqualToValue={(opt, val) => String(opt?.id) === String(val?.id)}
                                getOptionLabel={(o) => {
                                    const title = o?.title || o?.name || (o?.id ? `#${o.id}` : "");
                                    const amt = o?.amount ? ` - ${Number(o.amount).toFixed(2)}$` : "";
                                    return `${title}${amt}`;
                                }}
                                onChange={(_e, v) => setField("school_fee_id", v?.id || "")}
                                renderInput={(params) => (
                                    <TextField {...params} label="نوع الرسوم" margin="dense" required />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="المبلغ"
                                type="number"
                                margin="dense"
                                fullWidth
                                value={form.amount}
                                onChange={(e) => setField("amount", e.target.value)}
                                required
                                inputProps={{ step: "0.01", min: "0" }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="status-label">حالة الدفع</InputLabel>
                                <Select
                                    labelId="status-label"
                                    label="حالة الدفع"
                                    value={form.status}
                                    onChange={(e) => setField("status", e.target.value)}
                                    required
                                >
                                    {statuses.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>
                                            {s.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="تاريخ الدفع"
                                type="datetime-local"
                                margin="dense"
                                fullWidth
                                value={dayjs(form.paid_at).format("YYYY-MM-DDTHH:mm")}
                                onChange={(e) =>
                                    setField("paid_at", dayjs(e.target.value).format("YYYY-MM-DD HH:mm:ss"))
                                }
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="قيمة الخصم"
                                type="number"
                                margin="dense"
                                fullWidth
                                value={form.discount}
                                onChange={(e) => setField("discount", e.target.value)}
                                inputProps={{ step: "0.01", min: "0" }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="discount-status-label">سبب/حالة الخصم</InputLabel>
                                <Select
                                    labelId="discount-status-label"
                                    label="سبب/حالة الخصم"
                                    value={form.discount_status}
                                    onChange={(e) => setField("discount_status", e.target.value)}
                                >
                                    {discountStatuses.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>
                                            {s.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} variant="outlined" disabled={createMut.isPending} sx={{ ml: 3 }}>
                    إلغاء
                </Button>
                <Button
                    onClick={() => createMut.mutate()}
                    variant="contained"
                    sx={{ backgroundColor: "#35AFBC" }}
                    disabled={!isValid || createMut.isPending || loadingLists}
                >
                    {createMut.isPending ? <CircularProgress size={20} sx={{ color: "white" }} /> : "أضف دفعة جديدة"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPaymentDialog;
