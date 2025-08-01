import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, CircularProgress, Grid, Paper
} from '@mui/material';
import Select from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllPermissions } from '../../../../api/Admin/Permissions/getAllPermissions';
import { getRoleById } from '../../../../api/Admin/Roles/getRoleById';
import { updateRole } from '../../../../api/Admin/Roles/updateRole';
import SuccessAlert from '../../../../layout/SuccessAlert';

const UpdateRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // جلب كل الصلاحيات
    const {
        data: allPermissionsData,
        isLoading: permissionsLoading,
        isError: permissionsError,
        error: permissionsErrorObj
    } = useQuery({
        queryKey: ['permissions'],
        queryFn: () => getAllPermissions(1, 100),
    });

    // جلب بيانات الدور بالـ ID
    const {
        data: roleData,
        isLoading: roleLoading,
        isSuccess: roleSuccess
    } = useQuery({
        queryKey: ['role', id],
        queryFn: () => getRoleById(id),
        enabled: !!id,
    });

    // تعبئة النموذج عند تحميل بيانات الدور
    useEffect(() => {
        if (roleSuccess && roleData?.data) {
            const role = roleData.data;
            setRoleName(role.name);
            setSelectedPermissions(role.permissions.map(p => ({
                label: p.name,
                value: p.id
            })));
        }
    }, [roleSuccess, roleData]);

    // التعديل
    const mutation = useMutation({
        mutationFn: ({ id, payload }) => updateRole(id, payload),
        onSuccess: () => {
            setShowSuccess(true);
            setErrorMessage('');
            queryClient.invalidateQueries(['roles']);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/dashboard/users/roles');
            }, 2000);
        },
        onError: (err) => {
            setErrorMessage(err?.response?.data?.message || 'حدث خطأ أثناء تعديل الدور');
            setShowSuccess(true);
        },
    });

    const handleSubmit = () => {
        if (!roleName || selectedPermissions.length === 0) return;

        const payload = {
            name: roleName,
            permissions: selectedPermissions.map(p => p.label), // فقط أسماء الصلاحيات
        };

        mutation.mutate({ id, payload });
    };

    const handleClearSelections = () => {
        setSelectedPermissions([]);
    };

    const permissionOptions = (allPermissionsData?.data || []).map(p => ({
        label: p.name,
        value: p.id,
    }));

    return (
        <Box sx={{ px: 5, py: 8 }}>
            <Paper elevation={3} sx={{ maxWidth: "90%", mx: 'auto', p: 5 }}>
                <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                    تعديل الدور
                </Typography>

                {(permissionsLoading || roleLoading) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="اسم الدور"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {permissionsError ? (
                                <Typography color="error">
                                    فشل تحميل الصلاحيات: {permissionsErrorObj.message}
                                </Typography>
                            ) : (
                                <>
                                    <Select
                                        isMulti
                                        name="permissions"
                                        options={permissionOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="اختر الصلاحيات"
                                        value={selectedPermissions}
                                        onChange={setSelectedPermissions}
                                    />
                                    <Button
                                        onClick={handleClearSelections}
                                        variant="text"
                                        sx={{ mt: 1, color: 'red' }}
                                    >
                                        مسح التحديدات
                                    </Button>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    margin: "2rem 0",
                                    backgroundColor: '#2fb7ad',
                                    '&:hover': { backgroundColor: '#00716aff' },
                                    height: 50,
                                    fontWeight: 'bold',
                                }}
                                onClick={handleSubmit}
                                disabled={mutation.isLoading || !roleName || selectedPermissions.length === 0}
                            >
                                {mutation.isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>

            {showSuccess && (
                <SuccessAlert
                    title={errorMessage ? 'فشل التعديل' : 'تم حفظ التعديلات بنجاح!'}
                    message={errorMessage || 'تم تعديل بيانات الدور بنجاح.'}
                    onClose={() => {
                        setShowSuccess(false);
                        setErrorMessage('');
                    }}
                    severity={errorMessage ? 'error' : 'success'}
                />
            )}
        </Box>
    );
};

export default UpdateRole;
