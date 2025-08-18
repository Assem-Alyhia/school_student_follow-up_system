import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, CssBaseline, Typography, Divider, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Menu, MenuItem, Avatar, Collapse
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupsIcon from '@mui/icons-material/Groups';
import LayersIcon from '@mui/icons-material/Layers';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import { clearToken } from '../../api/authApi/tokenManager';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    backgroundColor: '#fff',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                ...openedMixin(theme),
                backgroundColor: '#fff',
                color: '#A4A8B2',
                display: 'flex',
                flexDirection: 'column',
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                backgroundColor: '#fff',
                color: '#A4A8B2',
                display: 'flex',
                flexDirection: 'column',
            },
        }),
    })
);

/* ===================== helpers ===================== */
const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const hasRole = (user, role) => Array.isArray(user?.roles) && user.roles.some(r => r.name === role);

const teacherMenu = [
    { text: 'لوحة التحكم', icon: <DashboardIcon />, url: '/teacherDashboard' },

    { text: 'الطلاب', icon: <PersonIcon />, url: '/teacherDashboard/students' },
    { text: 'أولياء الأمور', icon: <GroupsIcon />, url: '/teacherDashboard/parents' },
    { text: 'المراحل الدراسية', icon: <LayersIcon />, url: '/teacherDashboard/levels' },
    { text: 'المواد الدراسية', icon: <MenuBookIcon />, url: '/teacherDashboard/subjects' },
    { text: 'الصفوف الدراسية', icon: <ClassIcon />, url: '/teacherDashboard/classrooms' },
    { text: 'الجداول', icon: <ScheduleIcon />, url: '/teacherDashboard/calendarSchedule' },

    {
        text: 'الامتحانات',
        icon: <AssignmentIcon />,
        url: '/teacherDashboard/exams',
        children: [
            { text: 'قوائم الصفوف', icon: <ListAltIcon />, url: '/teacherDashboard/exam/classesLists' },
            { text: 'قوائم الامتحانات', icon: <ListAltIcon />, url: '/teacherDashboard/exam/examlists' },
            { text: 'أنواع الامتحانات', icon: <CategoryIcon />, url: '/teacherDashboard/exam/typesExams' },
            { text: 'درجات الامتحانات', icon: <GradeIcon />, url: '/teacherDashboard/exams/grades' },
        ]
    },

    { text: 'الدرجات', icon: <GradeIcon />, url: '/teacherDashboard/grades' },
];


/* ===================== component ===================== */
export default function TeacherDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const [expandedItems, setExpandedItems] = React.useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const user = getStoredUser();
    const isTeacher = hasRole(user, 'teacher');

    const menuItems = React.useMemo(() => (teacherMenu), [isTeacher]);

    const hideDrawerRoutes = ['/some-other-route'];
    const shouldHideDrawer = hideDrawerRoutes.includes(location.pathname);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => { setOpen(false); setExpandedItems({}); };
    const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);
    const _toggleReports = (index) =>
        setExpandedItems((s) => ({ ...s, [index]: !s[index] }));
    const handleLogout = () => { clearToken(); handleProfileMenuClose(); navigate('/login'); };

    const userName = user?.name || 'المستخدم';
    const userEmail = user?.email || 'email@example.com';
    const userImage = user?.image && user.image !== '' ? user.image : undefined;

    return (
        <Box sx={{ display: 'flex', position: 'relative' }}>
            <CssBaseline />
            {!shouldHideDrawer && (
                <>
                    <AppBar position="fixed" open={open} sx={{ background: 'linear-gradient(45deg, #35AFBC, #30BA9F, #22385F)' }}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 5, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap sx={{ color: '#fff', flexGrow: 1 }}>
                                لوحة التحكم
                            </Typography>

                            <IconButton sx={{ color: '#fff', mr: 2 }}><SearchIcon /></IconButton>
                            <IconButton sx={{ color: '#fff', mr: 2 }}><ChatIcon /></IconButton>
                            <IconButton sx={{ color: '#fff', mr: 2 }}><NotificationsIcon /></IconButton>

                            <IconButton onClick={handleProfileMenuOpen} sx={{ color: '#fff' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={userImage}>{!userImage && userName?.charAt(0)}</Avatar>
                                    <Typography sx={{ ml: 1, color: '#fff' }}>
                                        {userName}
                                    </Typography>
                                    <ExpandMoreIcon sx={{ color: '#fff', ml: 1 }} />
                                </Box>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                                PaperProps={{ sx: { width: 260, borderRadius: 2, p: 2, boxShadow: 4, mt: 1.5 } }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 1 }}>
                                    <Avatar
                                        alt={userName}
                                        src={userImage}
                                        sx={{ width: 60, height: 60, m: '0 auto 8px', fontSize: '1rem', fontWeight: 'bold', bgcolor: '#ccc' }}
                                    >
                                        {!userImage && userName?.charAt(0)}
                                    </Avatar>
                                    <Typography fontWeight="bold" fontSize="1rem">{userName}</Typography>
                                    <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
                                </Box>

                                <Box sx={{ my: 1, borderTop: '1px solid #eee' }} />

                                <MenuItem onClick={handleProfileMenuClose} sx={{ px: 2 }}>
                                    <Link to="profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1 }} /> الملف الشخصي
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleProfileMenuClose} sx={{ px: 2 }}>
                                    <Link to="settings" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                        <SettingsIcon sx={{ mr: 1 }} /> الإعدادات
                                    </Link>
                                </MenuItem>

                                <Box sx={{ my: 1, borderTop: '1px solid #eee' }} />

                                <MenuItem onClick={handleLogout} sx={{ color: 'red', px: 2 }}>
                                    <ExitToAppIcon sx={{ mr: 1 }} /> تسجيل الخروج
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Drawer variant="permanent" open={open}>
                        <DrawerHeader>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, width: '9rem', m: 'auto' }}>
                                {open && <img src="/auth/1.png" alt="Logo Open" style={{ width: '100%', transition: 'width 0.3s' }} />}
                            </Box>
                            <IconButton onClick={handleDrawerClose} sx={{ color: '#308A9F' }}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />

                        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                            <List>
                                {menuItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.children ? (
                                            <>
                                                <ListItemButton
                                                    onClick={() => setExpandedItems(s => ({ ...s, [index]: !s[index] }))}
                                                    sx={{
                                                        width: '90%', m: 'auto', minHeight: 48, justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5, borderRadius: '8px', backgroundColor: 'transparent',
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 0, '& svg': { fontSize: '1.2rem', color: '#A4A8B2' } }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    {open && (
                                                        <ListItemText primary={item.text}
                                                            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700, color: '#A4A8B2' }} />
                                                    )}
                                                    {expandedItems[index] ? <ExpandLessIcon sx={{ color: '#A4A8B2', ml: open ? 1 : 0 }} />
                                                        : <ExpandMoreIcon sx={{ color: '#A4A8B2', ml: open ? 1 : 0 }} />}
                                                </ListItemButton>

                                                <Collapse in={expandedItems[index]} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {item.children.map((child, i2) => (
                                                            <ListItemButton
                                                                key={i2}
                                                                component={Link}
                                                                to={child.url}
                                                                sx={{
                                                                    pl: open ? 5 : 3, minHeight: 40,
                                                                    backgroundColor: location.pathname === child.url ? '#34b1b7' : 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor: location.pathname === child.url ? '#34b1b7' : 'rgba(0,0,0,0.04)',
                                                                        color: location.pathname === child.url ? '#fff' : '#A4A8B2',
                                                                        '& .MuiListItemIcon-root': { color: location.pathname === child.url ? '#fff' : '#A4A8B2' },
                                                                    },
                                                                }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, '& svg': { fontSize: '1rem', color: location.pathname === child.url ? '#fff' : '#A4A8B2' } }}>
                                                                    {child.icon}
                                                                </ListItemIcon>
                                                                {open && (
                                                                    <ListItemText primary={child.text}
                                                                        primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 700, color: location.pathname === child.url ? '#fff' : '#A4A8B2' }} />
                                                                )}
                                                            </ListItemButton>
                                                        ))}
                                                    </List>
                                                </Collapse>
                                            </>
                                        ) : (
                                            <ListItem disablePadding sx={{ display: 'block' }}>
                                                <Link to={item.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                                    <ListItemButton
                                                        sx={{
                                                            width: '90%', m: 'auto', minHeight: 48, justifyContent: open ? 'initial' : 'center',
                                                            px: 2.5, borderRadius: '8px',
                                                            backgroundColor: location.pathname === item.url ? '#34b1b7' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: location.pathname === item.url ? '#34b1b7' : 'rgba(0,0,0,0.04)',
                                                                color: location.pathname === item.url ? '#fff' : '#A4A8B2',
                                                                '& .MuiListItemIcon-root': { color: location.pathname === item.url ? '#fff' : '#A4A8B2' },
                                                            },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto', '& svg': { fontSize: '1.2rem', color: location.pathname === item.url ? '#fff' : '#A4A8B2' } }}>
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item.text}
                                                            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700, color: location.pathname === item.url ? '#fff' : '#A4A8B2' }}
                                                            sx={{ opacity: open ? 1 : 0 }}
                                                        />
                                                    </ListItemButton>
                                                </Link>
                                            </ListItem>
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </>
            )}

            <Box component="main" sx={{ flexGrow: 1 }}>
                {!shouldHideDrawer && <DrawerHeader />}
                <Outlet />
            </Box>
        </Box>
    );
}
