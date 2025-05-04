import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Typography, Avatar } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MapIcon from '@mui/icons-material/Map'; // أيقونة الخريطة
import MapDialog from '../../MapDialog';
const Section3 = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [openMapDialog, setOpenMapDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // ⭐ لحفظ بيانات الصف المختار

    const rows = [
        { id: '001', path: 'مسار 1', carNumber: '1234', carType: 'نوع 1', gatheringPoint: 'نقطة 1', supervisor: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, driver: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, status: 'نشط', gpsId: 'GPS78994' },
        { id: '002', path: 'مسار 2', carNumber: '5678', carType: 'نوع 2', gatheringPoint: 'نقطة 2', supervisor: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, driver: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, status: 'غير نشط', gpsId: 'GPS78995' },
        { id: '003', path: 'مسار 3', carNumber: '1234', carType: 'نوع 1', gatheringPoint: 'نقطة 1', supervisor: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, driver: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, status: 'نشط', gpsId: 'GPS78994' },
        { id: '004', path: 'مسار 4', carNumber: '5678', carType: 'نوع 2', gatheringPoint: 'نقطة 2', supervisor: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, driver: { name: 'Cody Fisher', number: '+1 64044 74890', avatar: 'https://via.placeholder.com/40' }, status: 'غير نشط', gpsId: 'GPS78995' },
    ];

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getStatusColor = (status) => {
        return status === 'نشط' ? 'green' : 'red';
    };

    const sortedRows = rows.sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    const handleOpenMap = (row) => {
        setSelectedRow(row);     // حفظ بيانات الصف
        setOpenMapDialog(true);  // فتح النافذة
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="قائمة المستخدمين">
                        <TableHead sx={{ backgroundColor: '#308A9F' }}>
                            <TableRow>
                                {['id', 'path', 'carNumber', 'carType', 'gatheringPoint', 'supervisor', 'driver', 'status', 'gpsId', 'actions'].map((headCell) => (
                                    <TableCell key={headCell} sx={{ fontSize: '0.75rem' }}>
                                        <TableSortLabel
                                            active={orderBy === headCell}
                                            direction={orderBy === headCell ? order : 'asc'}
                                            onClick={() => handleRequestSort(headCell)}
                                            sx={{ fontWeight: 'bold', color: '#fff', fontSize: '0.75rem' }}
                                        >
                                            {headCell === 'id' ? 'المعرف' :
                                                headCell === 'path' ? 'المسار' :
                                                    headCell === 'carNumber' ? 'رقم العربة' :
                                                        headCell === 'carType' ? 'نوع العربة' :
                                                            headCell === 'gatheringPoint' ? 'نقطة التجمع' :
                                                                headCell === 'supervisor' ? 'مشرف النقل' :
                                                                    headCell === 'driver' ? 'السائق' :
                                                                        headCell === 'status' ? 'الحالة' :
                                                                            headCell === 'gpsId' ? 'معرّف GPS' :
                                                                                'الإجراءات'}
                                            {orderBy === headCell ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.path}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.carNumber}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.carType}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.gatheringPoint}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.supervisor.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Box>
                                                <Typography sx={{ fontSize: '0.75rem' }}>{row.supervisor.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                    {row.supervisor.number}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.driver.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
                                            <Box>
                                                <Typography sx={{ fontSize: '0.75rem' }}>{row.driver.name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                    {row.driver.number}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        <Typography sx={{ color: getStatusColor(row.status), fontSize: '0.75rem' }}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.gpsId}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>
                                        <IconButton aria-label="edit" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="view" size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="map" size="small" onClick={() => handleOpenMap(row)}>
                                            <MapIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ⭐ عرض نافذة الخريطة مع بيانات الصف المحدد */}
            {selectedRow && (
                <MapDialog open={openMapDialog} handleClose={() => setOpenMapDialog(false)} data={selectedRow} />
            )}
        </Box>
    );
};

export default Section3;
