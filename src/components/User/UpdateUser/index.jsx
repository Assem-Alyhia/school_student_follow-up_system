import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../api/Admin/Users/getUserById";
import { updateUser } from "../../../api/Admin/Users/updateUser";

const UpdateUser = () => {
    const { id } = useParams();
    const [_userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        image: null,
    });
    const [preview, setPreview] = useState("");

    const mainColor = "#2a8a89";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id);
                setUserData(res.data);
                setForm({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    image: null,
                });
                setPreview(res.data.image || "");
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        if (id) fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        try {
            await updateUser(id, form);
            alert("تم تحديث المستخدم بنجاح");
        } catch (error) {
            alert("حدث خطأ أثناء التحديث: " + error.message);
        }
    };

    return (
        <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f8f9fa" }}>
            <Paper sx={{ p: 3, borderRadius: 3, maxWidth: "80%", mx: "auto" }} elevation={2}>
                <Typography fontWeight="bold" mb={3} color={mainColor} fontSize="1.2rem">
                    تعديل بيانات المستخدم
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        src={preview || "/default-avatar.png"}
                        alt="Avatar"
                        sx={{ width: 70, height: 70 }}
                    />
                    <Button variant="outlined" component="label">
                        تغيير الصورة
                        <input type="file" hidden onChange={handleImageChange} />
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

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#2a8a89',
                        '&:hover': {
                            backgroundColor: '#227472',
                        },
                    }}
                    fullWidth
                    onClick={handleSubmit}
                >
                    حفظ التعديلات
                </Button>

            </Paper>
        </Box>
    );
};

export default UpdateUser;
