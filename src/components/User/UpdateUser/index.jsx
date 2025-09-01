// src/pages/Admin/Users/UpdateUser.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    MenuItem,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUserById } from "../../../api/Admin/Users/getUserById";
import { updateUser } from "../../../api/Admin/Users/updateUser";
import { getAllRoles } from "../../../api/Admin/Roles/getAllRoles";
import SuccessAlert from "../../../layout/SuccessAlert";

const PLACEHOLDER = "/default-avatar.png";
const mainColor = "#2a8a89";

const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        name: "",
        email: "",
        image: null,
        role: "",
        password: "",
        password_confirmation: "",
    });

    // إظهار/إخفاء كلمة المرور
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    // تحكم بظهور الأيقونة فقط عند التركيز أو وجود قيمة
    const [pwdFocused, setPwdFocused] = useState(false);
    const [pwd2Focused, setPwd2Focused] = useState(false);

    const [pwdError, setPwdError] = useState("");

    const [preview, setPreview] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    const userQ = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });

    const rolesQ = useQuery({
        queryKey: ["roles:all"],
        queryFn: getAllRoles,
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const apiUser = userQ.data?.data ?? userQ.data ?? null;
    const roles = useMemo(() => {
        const raw = rolesQ.data;
        return Array.isArray(raw) ? raw : raw?.data || [];
    }, [rolesQ.data]);

    const roleNames = useMemo(() => roles.map((r) => r.name), [roles]);

    useEffect(() => {
        if (!apiUser) return;
        setForm((prev) => ({
            ...prev,
            name: apiUser.name || "",
            email: apiUser.email || "",
            role:
                apiUser.role ??
                (Array.isArray(apiUser.roles) ? apiUser.roles[0] : "") ??
                "",
            image: null,
            password: "",
            password_confirmation: "",
        }));
        setPreview(apiUser.image || "");
    }, [apiUser]);

    useEffect(() => {
        if (!apiUser || rolesQ.isLoading) return;
        const current = form.role;
        if (!current) return;

        const normalized = String(current).trim();

        if (!isNaN(Number(normalized))) {
            const byId = roles.find((r) => String(r.id) === normalized);
            if (byId && byId.name !== form.role) {
                setForm((prev) => ({ ...prev, role: byId.name }));
                return;
            }
        }

        const byName = roleNames.find(
            (n) => n.toLowerCase() === normalized.toLowerCase()
        );
        if (byName && byName !== form.role) {
            setForm((prev) => ({ ...prev, role: byName }));
        }
    }, [roles, roleNames, rolesQ.isLoading, apiUser, form.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "password" || name === "password_confirmation") {
            setPwdError("");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) setPreview(URL.createObjectURL(file));
    };

    const saveMut = useMutation({
        mutationFn: async () => {
            // تحقق محلي من تطابق كلمتي المرور إن تم تعبئة أي منهما
            if (
                (form.password || form.password_confirmation) &&
                form.password !== form.password_confirmation
            ) {
                const err = "كلمتا المرور غير متطابقتين";
                setPwdError(err);
                throw new Error(err);
            }
            return updateUser(id, form);
        },
        onSuccess: async () => {
            setAlertTitle("تم تحديث المستخدم بنجاح!");
            setAlertMsg("تم حفظ التغييرات.");
            setShowSuccess(true);
            await queryClient.invalidateQueries({ queryKey: ["users"] });
            await queryClient.invalidateQueries({ queryKey: ["user", id] });
            setTimeout(() => {
                setShowSuccess(false);
                navigate(-1);
            }, 1200);
        },
        onError: (error) => {
            setAlertTitle("فشل التحديث");
            setAlertMsg(
                error?.response?.data?.message || error?.message || "حدث خطأ أثناء التحديث."
            );
            setShowFail(true);
            setTimeout(() => setShowFail(false), 3000);
        },
    });

    const loading = saveMut.isPending;
    const userLoading = userQ.isLoading;
    const rolesLoading = rolesQ.isLoading;

    const needsTransientOption =
        form.role &&
        !roleNames.some(
            (n) => n.toLowerCase() === String(form.role).toLowerCase()
        );

    // متى تظهر أيقونة العين؟
    const showEye1 = pwdFocused || !!form.password;
    const showEye2 = pwd2Focused || !!form.password_confirmation;

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            <Paper
                sx={{ p: 3, borderRadius: 3, maxWidth: "80%", mx: "auto", position: "relative" }}
                elevation={2}
            >
                {showSuccess && (
                    <SuccessAlert
                        title={alertTitle || "تم العملية بنجاح"}
                        message={alertMsg || "تم تنفيذ العملية بنجاح."}
                        onClose={() => setShowSuccess(false)}
                        severity="success"
                    />
                )}
                {showFail && (
                    <SuccessAlert
                        title={alertTitle || "حدث خطأ"}
                        message={alertMsg || "تعذر تنفيذ العملية."}
                        onClose={() => setShowFail(false)}
                        severity="error"
                    />
                )}

                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.2rem">
                    تعديل بيانات المستخدم
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        src={preview || PLACEHOLDER}
                        alt="Avatar"
                        sx={{ width: 70, height: 70 }}
                        imgProps={{
                            onError: (e) => {
                                e.currentTarget.src = PLACEHOLDER;
                            },
                        }}
                    />
                    <Button variant="outlined" component="label" disabled={loading}>
                        تغيير الصورة
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <TextField
                    label="اسم المستخدم"
                    name="name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    disabled={loading || userLoading}
                />

                <TextField
                    label="البريد الإلكتروني"
                    name="email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    disabled={loading || userLoading}
                />

                {/* كلمة المرور وتأكيدها (اختياريتان) */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <TextField
                        label="كلمة المرور الجديدة (اختياري)"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setPwdFocused(true)}
                        onBlur={() => setPwdFocused(false)}
                        disabled={loading || userLoading}
                        error={Boolean(pwdError)}
                        helperText={pwdError || ""}
                        InputProps={{
                            endAdornment: showEye1 ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />

                    <TextField
                        label="تأكيد كلمة المرور (اختياري)"
                        name="password_confirmation"
                        type={showPassword2 ? "text" : "password"}
                        value={form.password_confirmation}
                        onChange={handleChange}
                        onFocus={() => setPwd2Focused(true)}
                        onBlur={() => setPwd2Focused(false)}
                        disabled={loading || userLoading}
                        error={Boolean(pwdError)}
                        helperText={pwdError || ""}
                        InputProps={{
                            endAdornment: showEye2 ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setShowPassword2((s) => !s)}
                                        aria-label={showPassword2 ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                    >
                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />
                </Box>

                <TextField
                    select
                    name="role"
                    label="دور المستخدم"
                    value={form.role || ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 3 }}
                    SelectProps={{ displayEmpty: true }}
                    helperText={rolesLoading ? "جاري تحميل الأدوار..." : ""}
                    disabled={loading || rolesLoading || userLoading}
                >
                    <MenuItem value="" disabled>
                        {rolesLoading || userLoading ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={16} /> جاري التحميل...
                            </Box>
                        ) : (
                            "اختر دور المستخدم"
                        )}
                    </MenuItem>

                    {needsTransientOption && <MenuItem value={form.role}>{form.role}</MenuItem>}

                    {roles.map((r) => (
                        <MenuItem key={r.id} value={r.name}>
                            {r.name}
                        </MenuItem>
                    ))}
                </TextField>

                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#2a8a89",
                            "&:hover": { backgroundColor: "#227472" },
                        }}
                        fullWidth
                        disabled={loading || userLoading}
                        onClick={() => saveMut.mutate()}
                    >
                        {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(-1)}
                        sx={{ color: "#2a8a89", borderColor: "#2a8a89" }}
                        disabled={loading}
                    >
                        رجوع
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UpdateUser;
