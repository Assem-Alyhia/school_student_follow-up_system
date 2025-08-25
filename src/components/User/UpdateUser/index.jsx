import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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

    const [_userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        image: null,
        role: "",
    });

    const [preview, setPreview] = useState("");
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    // تنبيهات النجاح/الفشل
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserLoading(true);
                const res = await getUserById(id);
                setUserData(res.data);
                setForm((prev) => ({
                    ...prev,
                    name: res.data.name || "",
                    email: res.data.email || "",
                    role:
                        (res.data.role ??
                            (Array.isArray(res.data.roles) ? res.data.roles[0] : "")) || "",
                    image: null,
                }));
                // لو السيرفر يُعيد رابط كامل للصورة سيعمل مباشرة
                setPreview(res.data.image || "");
            } catch (err) {
                console.error("Error fetching user:", err);
                setAlertTitle("خطأ في جلب البيانات");
                setAlertMsg(err?.message || "تعذر تحميل بيانات المستخدم.");
                setShowFail(true);
                setTimeout(() => setShowFail(false), 3000);
            } finally {
                setUserLoading(false);
            }
        };

        const fetchRoles = async () => {
            try {
                setRolesLoading(true);
                const data = await getAllRoles();
                setRoles(data || []);
            } catch (err) {
                console.error("Error fetching roles:", err);
                setAlertTitle("خطأ في تحميل الأدوار");
                setAlertMsg(err?.message || "تعذر تحميل الأدوار.");
                setShowFail(true);
                setTimeout(() => setShowFail(false), 3000);
            } finally {
                setRolesLoading(false);
            }
        };

        if (id) fetchUser();
        fetchRoles();
    }, [id]);

    const roleNames = useMemo(() => roles.map((r) => r.name), [roles]);

    useEffect(() => {
        if (userLoading || rolesLoading) return;
        if (!_userData) return;

        const current = form.role;
        if (!current) return;

        let normalized = String(current).trim();

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
    }, [userLoading, rolesLoading, _userData, roleNames, roles, form.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await updateUser(id, form);

            setAlertTitle("تم تحديث المستخدم بنجاح!");
            setAlertMsg("تم حفظ التغييرات.");
            setShowSuccess(true);

            await queryClient.invalidateQueries({ queryKey: ["users"] });

            setTimeout(() => {
                setShowSuccess(false);
                navigate(-1);
            }, 1200);
        } catch (error) {
            setAlertTitle("فشل التحديث");
            setAlertMsg(error?.message || "حدث خطأ أثناء التحديث.");
            setShowFail(true);
            setTimeout(() => setShowFail(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const needsTransientOption =
        form.role &&
        !roleNames.some(
            (n) => n.toLowerCase() === String(form.role).toLowerCase()
        );

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            <Paper
                sx={{ p: 3, borderRadius: 3, maxWidth: "80%", mx: "auto", position: "relative" }}
                elevation={2}
            >
                {/* ✅ تنبيهات النجاح/الفشل */}
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
                    <Button variant="outlined" component="label">
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
                />

                <TextField
                    label="البريد الإلكتروني"
                    name="email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

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

                    {needsTransientOption && (
                        <MenuItem value={form.role}>{form.role}</MenuItem>
                    )}

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
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(-1)}
                        sx={{ color: "#2a8a89", borderColor: "#2a8a89" }}
                    >
                        رجوع
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UpdateUser;
