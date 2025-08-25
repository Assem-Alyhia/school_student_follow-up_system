import React, { useState } from "react";
import {
    Box, Paper, Typography, Button, Grid, IconButton, Menu, MenuItem, Avatar
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeacher } from "../../../api/Admin/Teachers/deleteTeacher";
import ConfirmDeleteModal from "../../../layout/ConfirmDeleteModal";
import SuccessAlert from "../../../layout/SuccessAlert";
import TeacherDetailsModal from "../TeacherDetailsModal";

const Section2 = ({ teachers = [], page, rowsPerPage }) => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuTeacherId, setMenuTeacherId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsId, setDetailsId] = useState(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleMenuClick = (event, teacherId) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuTeacherId(teacherId);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuTeacherId(null);
    };

    const handleDelete = (id) => {
        setSelectedTeacher(id);
        setOpenDeleteModal(true);
    };

    const openDetails = (id) => {
        setDetailsId(id);
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setDetailsId(null);
    };

    const deleteMutation = useMutation({
        mutationFn: deleteTeacher,
        onMutate: async (teacherId) => {
            setIsDeleting(true);

            const qk = ["teachers", page, rowsPerPage];
            await queryClient.cancelQueries({ queryKey: qk });
            const previous = queryClient.getQueryData(qk);

            if (previous?.data) {
                const optimistic = {
                    ...previous,
                    data: previous.data.filter((t) => t.id !== teacherId),
                    meta: previous.meta
                        ? { ...previous.meta, total: Math.max((previous.meta.total || 1) - 1, 0) }
                        : previous.meta,
                };
                queryClient.setQueryData(qk, optimistic);
            }
            return { previous, qk };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) queryClient.setQueryData(context.qk, context.previous);
        },
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        },
        onSettled: (_data, _error, _variables, context) => {
            if (context?.qk) queryClient.invalidateQueries({ queryKey: context.qk });
            setIsDeleting(false);
        },
    });

    const confirmDelete = () => {
        deleteMutation.mutate(selectedTeacher);
        setOpenDeleteModal(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {teachers.map((teacher) => {
                    const user = teacher?.user ?? {};
                    const name = teacher?.name ?? user?.name ?? "—";
                    const email = user?.email ?? "—";
                    const imageRaw = user?.image || "";                // قد يكون رابطًا كاملاً أو فارغًا
                    const hasImage = Boolean(String(imageRaw).trim()); // هل لدينا صورة؟

                    return (
                        <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 2,
                                    height: "100%",
                                    textAlign: "center",
                                    backgroundColor: "#F5F5F5",
                                    border: "1px solid #308A9F",
                                    maxWidth: "90%",
                                    margin: "auto",
                                }}
                            >
                                {/* الشريط العلوي */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <IconButton onClick={(e) => handleMenuClick(e, teacher.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl) && menuTeacherId === teacher.id}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    openDetails(teacher.id);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <VisibilityIcon fontSize="small" sx={{ color: "primary.main", mr: 1 }} />
                                                <Typography sx={{ color: "primary.main" }}>عرض التفاصيل</Typography>
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    navigate(`/dashboard/teacher/updateTeacher/${teacher.id}`);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <EditIcon fontSize="small" sx={{ color: "#FB8C00", mr: 1 }} />
                                                <Typography sx={{ color: "#FB8C00" }}>تعديل</Typography>
                                            </MenuItem>

                                            <MenuItem onClick={() => { handleDelete(teacher.id); handleMenuClose(); }} disabled={isDeleting}>
                                                <DeleteIcon fontSize="small" sx={{ color: "error.main", mr: 1 }} />
                                                <Typography sx={{ color: "error.main" }}>حذف</Typography>
                                            </MenuItem>
                                        </Menu>

                                        <Typography variant="body2" sx={{ color: "text.secondary", opacity: 0.7 }}>
                                            {teacher.id || "---"}
                                        </Typography>
                                    </Box>
                                    <IconButton>
                                        <PersonIcon sx={{ color: "#22385F" }} />
                                    </IconButton>
                                </Box>

                                {/* الصورة — نفس أسلوب المشرفين/الطلاب */}
                                <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mb: 2 }}>
                                    <Avatar
                                        src={hasImage ? imageRaw : undefined}
                                        alt=""
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: "#fff",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 14px rgba(34,56,95,0.12)",
                                        }}
                                    >
                                        {!hasImage && <PersonIcon sx={{ color: "#9aa6b2", fontSize: 42 }} />}
                                    </Avatar>

                                    {/* مؤشر الحالة (إن كنت تستخدمه) */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: teacher.status === "active" ? "#4CAF50" : "#F44336",
                                            border: "2px solid #F5F5F5",
                                        }}
                                    />
                                </Box>

                                {/* الاسم */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        m: "1rem 0 2rem",
                                        color: "#308A9F",
                                        textShadow: "0 1px 5px rgb(155,155,155)",
                                    }}
                                >
                                    {name}
                                </Typography>

                                {/* البريد */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: "#586E75", mb: 1 }}>
                                        <strong>البريد الإلكتروني:</strong>
                                    </Typography>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)",
                                            p: ".6rem 1rem",
                                            borderRadius: 1,
                                            m: "0 auto",
                                            width: "100%",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <EmailIcon sx={{ color: "#fff", mr: 1, fontSize: "16px" }} />
                                            <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                                                {email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* الهاتف */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: "#586E75", mb: 1 }}>
                                        <strong>رقم الهاتف:</strong>
                                    </Typography>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(90deg,#35AFBC,#308A9F,#22385F)",
                                            p: ".6rem 1rem",
                                            borderRadius: 1,
                                            m: "0 auto",
                                            width: "100%",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <PhoneIcon sx={{ color: "#fff", mr: 1, fontSize: "16px" }} />
                                            <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                                                {teacher.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* أسفل البطاقة */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#F44336", backgroundColor: "#FFCDD2", p: ".4rem 1rem", borderRadius: "4px" }}
                                    >
                                        {teacher.subject || "---"}
                                    </Typography>

                                    <Button
                                        onClick={() => openDetails(teacher.id)}
                                        variant="outlined"
                                        sx={{
                                            borderColor: "#308A9F",
                                            color: "#308A9F",
                                            "&:hover": { borderColor: "#22385F", backgroundColor: "#308A9F", color: "#fff" },
                                            fontSize: "14px",
                                            p: "6px 12px",
                                            textDecoration: "none",
                                        }}
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <TeacherDetailsModal open={detailsOpen} teacherId={detailsId} onClose={closeDetails} />

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDelete}
                title="هل أنت متأكد من حذف المعلم؟"
                message="سيتم حذف بيانات المعلم من النظام."
                isLoading={isDeleting}
            />

            {showSuccess && (
                <SuccessAlert
                    title="تم حذف المعلم بنجاح!"
                    message="تمت إزالة بيانات المعلم من النظام."
                    severity="error"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Box>
    );
};

export default Section2;
