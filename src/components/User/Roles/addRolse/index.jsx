import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, CircularProgress, Grid, Paper
} from '@mui/material';
import Select from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllPermissions } from '../../../../api/Admin/Permissions/getAllPermissions';
import { createRole } from '../../../../api/Admin/Roles/createRole';
import SuccessAlert from '../../../../layout/SuccessAlert';

const AddRoles = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['permissions'],
        queryFn: () => getAllPermissions(1, 100),
    });

    const mutation = useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            setRoleName('');
            setSelectedPermissions([]);
            setShowSuccess(true);
            setErrorMessage('');
            queryClient.invalidateQueries(['roles']);

            setTimeout(() => {
                setShowSuccess(false);
                navigate('/dashboard/users/roles'); 
            }, 2000);
        },
        onError: (err) => {
            setErrorMessage(err?.response?.data?.message || 'حدث خطأ أثناء إنشاء الدور');
            setShowSuccess(true);
        },
    });

    const handleSubmit = () => {
        if (!roleName || selectedPermissions.length === 0) return;

        const payload = {
            name: roleName,
            permissions: selectedPermissions.map(p => p.label), 
        };
        mutation.mutate(payload);
    };

    const handleClearSelections = () => {
        setSelectedPermissions([]);
    };

    const permissionOptions = (data?.data || []).map(p => ({
        label: p.name,
        value: p.id,
    }));

    return (
        <Box sx={{ px: 5, py: 8 }}>
            <Paper elevation={3} sx={{ maxWidth: "90%", mx: 'auto', p: 5 }}>
                <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                    إنشاء دور جديد
                </Typography>

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
                        {isLoading ? (
                            <CircularProgress />
                        ) : isError ? (
                            <Typography color="error">فشل تحميل الصلاحيات: {error.message}</Typography>
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
                            {mutation.isLoading ? 'جاري الإرسال...' : 'إنشاء الدور'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {showSuccess && (
                <SuccessAlert
                    title={errorMessage ? 'فشل الإنشاء' : 'تم إنشاء الدور بنجاح!'}
                    message={errorMessage || 'تم حفظ الدور الجديد مع صلاحياته.'}
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

export default AddRoles;
