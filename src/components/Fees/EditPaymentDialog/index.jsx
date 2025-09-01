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
import { getAllParentsNoPaginate } from "../../../api/Admin/Parents/getAllParentsNoPaginate";
import { getAllSchoolFeesNoPaginate } from "../../../api/Admin/SchoolFees/getAllSchoolFeesNoPaginate";
import { getPaymentById } from "../../../api/Admin/Payments/getPaymentById";
import { updatePayment } from "../../../api/Admin/Payments/updatePayment";

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

const emptyForm = {
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

// ===== helpers =====
const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";
const norm = (s) => String(s || "").trim();

function findParentForStudent(student, parents) {
    if (!student || !Array.isArray(parents) || parents.length === 0) return null;

    const candidateIds = [
        student?.parent_id,
        student?.parent?.id,
        student?.guardian_id,
    ].filter(Boolean);

    for (const cid of candidateIds) {
        const hit = parents.find((p) => String(p?.id) === String(cid));
        if (hit) return hit.id;
    }

    const parentUserId = student?.parent?.user?.id || student?.parent_user_id;
    if (parentUserId) {
        const hit = parents.find((p) => String(p?.user?.id) === String(parentUserId));
        if (hit) return hit.id;
    }

    const parentName = student?.parent?.name || student?.parent?.user?.name;
    if (parentName) {
        const hit = parents.find(
            (p) => norm(p?.name) === norm(parentName) || norm(p?.user?.name) === norm(parentName)
        );
        if (hit) return hit.id;
    }

    return null;
}

function pickFeeForStudent(fees, student) {
    if (!Array.isArray(fees) || fees.length === 0) return null;
    const levelId = student?.classroom?.level?.id || student?.level?.id;
    const gradeLevel = student?.classroom?.level?.grade_level || student?.level?.grade_level;

    // 1) exact level id
    const byLevelId = fees.find(
        (f) => String(f?.level?.id ?? f?.level_id ?? f?.class_level_id) === String(levelId)
    );
    if (byLevelId) return byLevelId;

    // 2) grade-based heuristic
    const byGrade = fees.find(
        (f) =>
            Number(f?.grade_level) === Number(gradeLevel) ||
            (/صف|grade|level|مرحلة/i.test(String(f?.name || f?.title || "")) &&
                String(f?.name || f?.title || "").includes(String(gradeLevel)))
    );
    if (byGrade) return byGrade;

    // 3) explicit default/active
    const flagged = fees.find((f) => isTruthy(f?.is_default) || isTruthy(f?.active));
    if (flagged) return flagged;

    // 4) fallback
    return fees[0] || null;
}
// ==================

const EditPaymentDialog = ({ open, onClose, paymentId, onUpdated }) => {
    const [form, setForm] = useState(emptyForm);
    const [errorMsg, setErrorMsg] = useState("");
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
    const paymentQ = useQuery({
        queryKey: ["payment", paymentId],
        queryFn: () => getPaymentById(paymentId),
        enabled: !!open && !!paymentId,
    });

    // hydrate form from fetched payment
    useEffect(() => {
        if (!open || !paymentId) return;
        if (paymentQ.data) {
            const payment = paymentQ.data?.data ?? paymentQ.data;

            const parentId = payment?.parent?.id ?? payment?.parent_id ?? "";
            const studentId = payment?.student?.id ?? payment?.student_id ?? "";
            const yearId =
                payment?.academicYear?.id ?? payment?.academic_year_id ?? payment?.year_id ?? "";
            const feeId = payment?.schoolFee?.id ?? payment?.school_fee_id ?? "";
            const amount = payment?.amount ?? payment?.schoolFee?.amount ?? "";
            const status = payment?.status ?? "pending";
            const paidAtRaw = payment?.paid_at || payment?.paidAt || null;
            const paid_at = paidAtRaw
                ? dayjs(paidAtRaw).format("YYYY-MM-DD HH:mm:ss")
                : dayjs().format("YYYY-MM-DD HH:mm:ss");
            const discount = payment?.discount ?? "";
            const discount_status = payment?.discount_status ?? "none";

            setForm({
                parent_id: String(parentId || ""),
                student_id: String(studentId || ""),
                academic_year_id: String(yearId || ""),
                school_fee_id: String(feeId || ""),
                amount: amount === "" || amount == null ? "" : String(amount),
                status,
                paid_at,
                discount: discount === "" || discount == null ? "" : String(discount),
                discount_status,
            });
        }
    }, [open, paymentId, paymentQ.data]);

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

    const filteredStudents = useMemo(() => {
        if (!form.parent_id) return students;
        const hasParentId = students.some((s) => s?.parent_id != null);
        return hasParentId
            ? students.filter((s) => String(s.parent_id) === String(form.parent_id))
            : students;
    }, [students, form.parent_id]);

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

    const updateMut = useMutation({
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
            return updatePayment(paymentId, payload);
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: ["payments"] });
            onUpdated?.(res);
            onClose?.();
        },
        onError: (e) => {
            setErrorMsg(e?.response?.data?.message || e?.message || "فشل في تعديل بيانات الدفعة");
        },
    });

    const handleClose = () => {
        if (updateMut.isPending) return;
        setErrorMsg("");
        onClose?.();
    };

    // current selected values
    const parentValue = useMemo(
        () => parents.find((p) => String(p.id) === String(form.parent_id)) || null,
        [parents, form.parent_id]
    );
    const studentValue = useMemo(
        () => filteredStudents.find((s) => String(s.id) === String(form.student_id)) || null,
        [filteredStudents, form.student_id]
    );
    const yearValue = useMemo(
        () => years.find((y) => String(y.id) === String(form.academic_year_id)) || null,
        [years, form.academic_year_id]
    );
    const feeValue = useMemo(
        () => fees.find((f) => String(f.id) === String(form.school_fee_id)) || null,
        [fees, form.school_fee_id]
    );

    // ====== fees filtered by the student's level (like previous "Add" dialog) ======
    const selectedStudent = studentValue;
    const selectedLevelId =
        selectedStudent?.classroom?.level?.id || selectedStudent?.level?.id || null;

    const feesFiltered = useMemo(() => {
        if (!selectedLevelId) return fees;
        const byLevel = fees.filter(
            (f) => String(f?.level?.id ?? f?.level_id ?? f?.class_level_id) === String(selectedLevelId)
        );
        return byLevel.length ? byLevel : fees;
    }, [fees, selectedLevelId]);

    // Ensure chosen fee matches student's level; if not, auto pick & maybe set amount
    useEffect(() => {
        if (!open || fees.length === 0) return;

        const current = fees.find((f) => String(f?.id) === String(form.school_fee_id));
        const currentFeeLevel = current?.level?.id ?? current?.level_id ?? current?.class_level_id;

        if (selectedLevelId && String(currentFeeLevel) !== String(selectedLevelId)) {
            const better = pickFeeForStudent(feesFiltered, selectedStudent);
            if (better?.id) {
                setForm((prev) => ({
                    ...prev,
                    school_fee_id: String(better.id),
                    ...(prev.amount === "" || Number(prev.amount) === 0
                        ? { amount: String(better?.amount ?? better?.value ?? "") }
                        : {}),
                }));
            }
        }
    }, [
        open,
        fees,
        feesFiltered,
        selectedLevelId,
        selectedStudent,
        form.school_fee_id,
        form.amount,
    ]);

    // When student changes manually, sync parent & align fee
    const onStudentChange = (_e, v) => {
        setField("student_id", v?.id || "");

        const pid = findParentForStudent(v, parents);
        if (pid) setField("parent_id", String(pid));

        const fee = pickFeeForStudent(fees, v);
        if (fee?.id) {
            setForm((prev) => ({
                ...prev,
                school_fee_id: String(fee.id),
                ...(prev.amount === "" || Number(prev.amount) === 0
                    ? { amount: String(fee?.amount ?? fee?.value ?? "") }
                    : {}),
            }));
        }
    };

    const loadingLists = parentsQ.isLoading || studentsQ.isLoading || yearsQ.isLoading || feesQ.isLoading;
    const loadingPayment = paymentQ.isLoading;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth dir="rtl" keepMounted>
            <DialogTitle sx={{ fontWeight: 700, color: "#308A9F" }}>
                عدّل دفعة مالية
            </DialogTitle>

            <DialogContent dividers>
                {errorMsg ? <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert> : null}

                {loadingLists || loadingPayment ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {/* وليّ الأمر — عرض الاسم فقط */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={parents}
                                value={parentValue}
                                isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
                                getOptionLabel={(o) => o?.name || o?.full_name || o?.user?.name || ""}
                                onChange={(e, v) => setField("parent_id", v?.id || "")}
                                renderInput={(params) => (
                                    <TextField {...params} label="ولي الأمر" margin="dense" required />
                                )}
                            />
                        </Grid>

                        {/* الطالب — عند تغييره نُحدّث الولي ونوع القسط تلقائيًا */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={filteredStudents}
                                value={studentValue}
                                isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
                                getOptionLabel={(o) => o?.name || o?.user?.name || o?.full_name || ""}
                                onChange={onStudentChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="الطالب" margin="dense" required />
                                )}
                            />
                        </Grid>

                        {/* السنة الدراسية */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={years}
                                value={yearValue}
                                isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
                                getOptionLabel={(o) =>
                                    o?.name ||
                                    o?.label ||
                                    (o?.start && o?.end ? `${o.start} - ${o.end}` : "") ||
                                    ""
                                }
                                onChange={(e, v) => setField("academic_year_id", v?.id || "")}
                                renderInput={(params) => (
                                    <TextField {...params} label="السنة الدراسية" margin="dense" required />
                                )}
                            />
                        </Grid>

                        {/* نوع الرسوم — مُرشَّحة بحسب مستوى الطالب، مع عرض الاسم والمبلغ فقط */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={feesFiltered}
                                value={
                                    feeValue && feesFiltered.find((f) => String(f.id) === String(feeValue.id))
                                        ? feeValue
                                        : null
                                }
                                isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
                                getOptionLabel={(o) => {
                                    const title = o?.title || o?.name || "";
                                    const amt = o?.amount != null ? ` - ${Number(o.amount).toFixed(2)}` : "";
                                    return `${title}${amt}`;
                                }}
                                onChange={(e, v) => {
                                    setField("school_fee_id", v?.id || "");
                                    const feeAmount = v?.amount ?? v?.value;
                                    if (feeAmount && (!form.amount || Number(form.amount) === 0)) {
                                        setField("amount", String(feeAmount));
                                    }
                                }}
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
                <Button onClick={handleClose} variant="outlined" disabled={updateMut.isPending} sx={{ ml: 3 }}>
                    إلغاء
                </Button>
                <Button
                    onClick={() => updateMut.mutate()}
                    variant="contained"
                    sx={{ backgroundColor: "#35AFBC" }}
                    disabled={!isValid || updateMut.isPending || loadingLists || loadingPayment}
                >
                    {updateMut.isPending ? <CircularProgress size={20} sx={{ color: "white" }} /> : "حفظ التعديلات"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPaymentDialog;
