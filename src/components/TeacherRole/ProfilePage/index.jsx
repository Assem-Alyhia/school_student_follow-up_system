import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Divider,
    Switch,
    Avatar,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Stack,
} from "@mui/material";
import { Edit as EditIcon, Save, Close } from "@mui/icons-material";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";

import { updateTeacherProfile } from "../../../api/Teacher/Profile/updateTeacher";
import { getTeacherProfile } from "../../../api/Teacher/Profile/getTeacherProfile";

const mainColor = "#2ea394";

const TeacherProfile = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    // الحقول القابلة للتعديل حسب النهاية: image, email, password(+confirm), phone, address
    const [form, setForm] = useState({
        image: null,
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: "",
        // أدناه للعرض فقط
        name: "",
        gender: "",
        dob: "",
        specialization: "",
        hiring_date: "",
    });

    // تحكم بالتحرير للحقول القابلة للتعديل فقط
    const [editing, setEditing] = useState({
        email: false,
        password: false,
        phone: false,
        address: false,
    });
    const [draft, setDraft] = useState({});
    const [preview, setPreview] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getTeacherProfile();
                const t = res?.data || {};
                const u = t?.user || {};

                setTeacher(t);

                setForm((s) => ({
                    ...s,
                    email: u.email || "",
                    phone: t.phone || "",
                    address: t.address || "",
                    // عرض فقط
                    name: t.name || u.name || "",
                    gender: t.gender || "",
                    dob: t.dob ? new Date(t.dob).toISOString().slice(0, 10) : "",
                    specialization: t.specialization || "",
                    hiring_date: t.hiring_date
                        ? new Date(t.hiring_date).toISOString().slice(0, 10)
                        : "",
                }));

                setPreview(u.image || "/avatar.jpg");
            } catch (err) {
                console.error("Error fetching teacher profile:", err);
                setTeacher(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const teacherId = useMemo(() => teacher?.id, [teacher]);

    // حفظ جزئي لحقل واحد
    const { mutate: savePartial, isLoading: saving } = useMutation({
        mutationFn: async (payload) => {
            if (!teacherId) throw new Error("لا يوجد معرّف معلّم.");
            return updateTeacherProfile(teacherId, payload);
        },
        onSuccess: (data) => {
            const t = data?.data || teacher;
            setTeacher(t);

            const u = t?.user || {};
            setForm((prev) => ({
                ...prev,
                email: u.email ?? prev.email,
                phone: t.phone ?? prev.phone,
                address: t.address ?? prev.address,
                image: null,
                password: "",
                password_confirmation: "",
            }));
            if (u.image) setPreview(u.image);

            setEditing({ email: false, password: false, phone: false, address: false });
            setDraft({});
        },
        onError: (e) => alert(e.message || "تعذّر حفظ التعديلات"),
    });

    const fmt = (d) => {
        if (!d) return "—";
        const dt = new Date(d);
        return isNaN(dt) ? "—" : format(dt, "dd/MM/yyyy", { locale: arSA });
    };

    const genderLabel = (g) => {
        if (!g) return "—";
        const v = String(g).toLowerCase();
        if (v === "male" || v === "m" || v === "ذكر") return "ذكر";
        if (v === "female" || v === "f" || v === "أنثى") return "أنثى";
        return g;
    };

    const t = teacher || {};
    const u = t.user || {};

    const profileData = {
        image: preview || "/avatar.jpg",
        fullName: u.name || t.name || "—",
        email: u.email || "—",
        userPrefix: u.prefix || "—",
        teacherPrefix: t.prefix || "—",
        name: t.name || u.name || "—",
        gender: genderLabel(t.gender),
        phone: t.phone || "—",
        address: t.address || "",
        dob: fmt(t.dob),
        specialization: t.specialization || "—",
        hiringDate: fmt(t.hiring_date),
    };

    // أدوات التحرير للحقول المسموحة فقط
    const startEdit = (field) => {
        setDraft((d) => ({ ...d, [field]: form[field] ?? "" }));
        setEditing((e) => ({ ...e, [field]: true }));
    };
    const cancelEdit = (field) => {
        setForm((f) => ({ ...f, [field]: draft[field] ?? f[field] }));
        setEditing((e) => ({ ...e, [field]: false }));
        setDraft((d) => {
            const { [field]: _, ...rest } = d;
            return rest;
        });
    };
    const saveField = (field) => {
        const payload = {};
        if (field === "password") {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
        } else if (field === "image") {
            if (!form.image) return;
            payload.image = form.image;
        } else {
            payload[field] = form[field];
        }
        savePartial(payload);
    };

    const handleChange = (key) => (e) =>
        setForm((s) => ({ ...s, [key]: e.target.value }));

    // الصورة: اختيار + زر حفظ
    const handlePickImage = () => fileInputRef.current?.click();
    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setForm((s) => ({ ...s, image: file }));
        setPreview(URL.createObjectURL(file));
    };
    const saveImage = () => {
        if (!form.image) return;
        saveField("image");
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                    <Typography>جارِ تحميل بروفايل المعلم…</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    المعلومات الشخصية
                </Typography>

                {/* الصورة + أزرار الاختيار/الحفظ */}
                <Box display="flex" alignItems="center" mb={1.5}>
                    <Avatar
                        alt={profileData.fullName}
                        src={profileData.image || undefined}
                        sx={{
                            width: 80,
                            height: 80,
                            ml: 2,
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            bgcolor: "#ccc",
                        }}
                    >
                        {!profileData.image && profileData.fullName?.charAt(0)}
                    </Avatar>

                    <Box>
                        <Typography variant="h5" color="text.secondary" display="block">
                            {profileData.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="block">
                            {profileData.email}
                        </Typography>

                        <Stack direction="row" spacing={1} mt={1}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImage}
                            />
                            <Button
                                variant="outlined"
                                onClick={handlePickImage}
                                sx={{ borderColor: mainColor, color: mainColor }}
                            >
                                اختيار صورة
                            </Button>
                            <Button
                                variant="contained"
                                onClick={saveImage}
                                disabled={!form.image || saving}
                                sx={{ bgcolor: mainColor }}
                                startIcon={saving ? <CircularProgress size={16} /> : <Save sx={{ margin:" 0  0 0 1rem"  }}/>}
                            >
                                حفظ الصورة
                            </Button>
                        </Stack>

                        {form.image && (
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                تم اختيار: {form.image.name}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* للعرض فقط - لا أزرار */}
                <DisplayRow label="الاسم" value={profileData.name} />
                <DisplayRow label="الجنس" value={profileData.gender} />
                <DisplayRow label="تاريخ الميلاد" value={profileData.dob} />
                <DisplayRow label="التخصص" value={profileData.specialization} />
                <DisplayRow label="تاريخ التعيين" value={profileData.hiringDate} hideDivider />
            </Paper>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={1}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.1rem">
                    معلومات الحساب (قابلة للتعديل)
                </Typography>

                {/* قابلة للتعديل فقط: email, phone, address, password */}
                <EditableRow
                    label="البريد الإلكتروني"
                    value={form.email}
                    displayValue={profileData.email}
                    editing={editing.email}
                    onStart={() => startEdit("email")}
                    onCancel={() => cancelEdit("email")}
                    onSave={() => saveField("email")}
                    onChange={handleChange("email")}
                    saving={saving}
                    type="email"
                />

                <EditableRow
                    label="الهاتف"
                    value={form.phone}
                    displayValue={profileData.phone}
                    editing={editing.phone}
                    onStart={() => startEdit("phone")}
                    onCancel={() => cancelEdit("phone")}
                    onSave={() => saveField("phone")}
                    onChange={handleChange("phone")}
                    saving={saving}
                />

                <EditableRow
                    label="العنوان"
                    value={form.address}
                    displayValue={profileData.address || "—"}
                    editing={editing.address}
                    onStart={() => startEdit("address")}
                    onCancel={() => cancelEdit("address")}
                    onSave={() => saveField("address")}
                    onChange={handleChange("address")}
                    saving={saving}
                />

                <EditableRow
                    label="كلمة المرور الجديدة"
                    value={form.password}
                    displayValue={"••••••••"}
                    editing={editing.password}
                    onStart={() => startEdit("password")}
                    onCancel={() => {
                        setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
                        cancelEdit("password");
                    }}
                    onSave={() => saveField("password")}
                    onChange={handleChange("password")}
                    saving={saving}
                    type="password"
                    extraInput={{
                        label: "تأكيد كلمة المرور",
                        value: form.password_confirmation,
                        onChange: handleChange("password_confirmation"),
                    }}
                    hideDivider
                />
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }} elevation={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold" fontSize="1.1rem" color={mainColor}>
                        العمل
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={isAvailable}
                            onChange={() => setIsAvailable(!isAvailable)}
                            color="success"
                        />
                        <Typography fontSize="0.9rem" fontWeight="medium">
                            Available now
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2">
                    الحالة: {isAvailable ? "متاح" : "غير متاح"}
                </Typography>
            </Paper>
        </Box>
    );
};

/* صف عرض فقط */
const DisplayRow = ({ label, value, hideDivider = false }) => (
    <>
        <Box display="flex" justifyContent="space-between" alignItems="center" py={1.5} px={1}>
            <Box>
                {label && <Typography variant="body2" color="text.secondary" mb={0.5}>{label}</Typography>}
                <Typography variant="body2">{value || "—"}</Typography>
            </Box>
        </Box>
        {!hideDivider && <Divider sx={{ my: 1 }} />}
    </>
);

/* صف قابل للتحرير للحقول المدعومة فقط */
const EditableRow = ({
    label,
    value,
    displayValue,
    editing,
    onStart,
    onCancel,
    onSave,
    onChange,
    saving,
    type = "text",
    extraInput,
    hideDivider = false,
}) => (
    <>
        <Box display="flex" justifyContent="space-between" alignItems="center" py={1.5} px={1}>
            <Box flex={1} mr={2}>
                {label && <Typography variant="body2" color="text.secondary" mb={0.5}>{label}</Typography>}
                {!editing ? (
                    <Typography variant="body2">{displayValue || "—"}</Typography>
                ) : (
                    <>
                        <TextField size="small" fullWidth type={type} value={value ?? ""} onChange={onChange} />
                        {extraInput && (
                            <TextField
                                sx={{ mt: 1 }}
                                size="small"
                                fullWidth
                                type="password"
                                label={extraInput.label}
                                value={extraInput.value ?? ""}
                                onChange={extraInput.onChange}
                            />
                        )}
                    </>
                )}
            </Box>

            {!editing ? (
                <IconButton size="small" sx={{ color: mainColor }} onClick={onStart}>
                    <EditIcon fontSize="small" />
                </IconButton>
            ) : (
                <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" color="success" onClick={onSave} disabled={saving}>
                        {saving ? <CircularProgress size={18} /> : <Save fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" color="inherit" onClick={onCancel}>
                        <Close fontSize="small" />
                    </IconButton>
                </Stack>
            )}
        </Box>

        {!hideDivider && <Divider sx={{ my: 1 }} />}
    </>
);

export default TeacherProfile;
