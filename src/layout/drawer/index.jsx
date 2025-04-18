import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useLocation, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'; 
import ChatIcon from '@mui/icons-material/Chat'; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
            '& .MuiDrawer-paper': { ...openedMixin(theme), backgroundColor: '#fff', color: '#fff' },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': { ...closedMixin(theme), backgroundColor: '#fff', color: '#fff' },
        }),
    })
);

const menuItems = [
    { text: 'لوحة التحكم', icon: <DashboardIcon />, url: '/dashboard' },
    { text: 'المستخدمون', icon: <PeopleIcon />, url: '/dashboard/users' },
    { text: 'الطلاب', icon: <SchoolIcon />, url: '/dashboard/students' },
    { text: 'المعلمون', icon: <PersonIcon />, url: '/dashboard/teachers' },
    { text: 'أولياء الأمور', icon: <FamilyRestroomIcon />, url: '/dashboard/guardian' },
    { text: 'المراحل الدراسية', icon: <CalendarTodayIcon />, url: '/dashboard/academicStages' },
    { text: 'الدروس', icon: <AssignmentIcon />, url: '/dashboard/lessons' },
    { text: 'الدرجات', icon: <GradeIcon />, url: '/dashboard/grades' },
    { text: 'الحضور والغياب', icon: <EventAvailableIcon />, url: '/dashboard/studentsAttending' },
    { text: 'النقل المدرسي', icon: <ReportIcon />, url: '/dashboard/schoolTransportation' },
    { text: 'الشؤون المالية', icon: <AttachMoneyIcon />, url: '/dashboard/finance' },
    { text: 'الإعدادات', icon: <SettingsIcon />, url: '/dashboard/settings' },
];

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

    const hideDrawerRoutes = ['/some-other-route'];
    const shouldHideDrawer = hideDrawerRoutes.includes(location.pathname);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setExpandedItems({});
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const [expandedItems, setExpandedItems] = useState({});
    const toggleReports = (index) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleLogout = () => {
        window.location.href = '/login';
    };

    const [userData, setUserData] = useState({
        userFirstName: 'عاصم',
        userLastName: 'اليحيى',
        userImage: '/userDashboard/Profile/Profile.png',
    });

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
                                sx={{
                                    marginRight: 5,
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', flexGrow: 1 }}>
                                لوحة التحكم
                            </Typography>

                            {/* إضافة أيقونات البحث والشات والاشعارات */}
                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <ChatIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <NotificationsIcon />
                            </IconButton>

                            {/* الصورة الشخصية والقائمة */}
                            <IconButton onClick={handleProfileMenuOpen} sx={{ color: '#fff' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={userData.userImage} />
                                    <Typography sx={{ marginLeft: 1, color: '#fff' }}>
                                        {`${userData.userFirstName} ${userData.userLastName}`}
                                    </Typography>
                                    <ExpandMoreIcon sx={{ color: '#fff', marginLeft: 1 }} />
                                </Box>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                            >
                                <MenuItem onClick={handleProfileMenuClose} sx={{ width: '12rem', opacity: '.7' }}>
                                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <PersonIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                        الملف الشخصي
                                    </Link>
                                </MenuItem>
                                <hr style={{ width: '85%', margin: 'auto', opacity: '.6', border: '1.2px solid #ccc' }} />
                                <MenuItem onClick={handleLogout} sx={{ width: '12rem', opacity: '.7' }}>
                                    <ExitToAppIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                    تسجيل الخروج
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Drawer variant="permanent" open={open} sx={{ position: 'relative !important' }}>
                        <DrawerHeader>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    width: '9rem',
                                    margin: 'auto'
                                }}
                            >
                                {open && (
                                    <img
                                        src="/auth/1.png"
                                        alt="Logo Open"
                                        style={{
                                            width: '100%',
                                            transition: 'width 0.3s',
                                        }}
                                    />
                                )}
                            </Box>
                            <IconButton onClick={handleDrawerClose} sx={{ color: '#308A9F' }}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List>
                            {menuItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        <Link
                                            to={item.url}
                                            style={{ textDecoration: 'none', color: '#A4A8B2', width: '100%' }}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    width: '90%',
                                                    margin: 'auto',
                                                    minHeight: 30,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                    borderRadius: '8px',
                                                    backgroundColor: expandedItems[index] ? '#635bff' : 'transparent',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #35AFBC, #30BA9F, #22385F)',
                                                        color: '#fff',
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#fff',
                                                        },
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        justifyContent: 'center',
                                                        color: '#A4A8B2',
                                                        mr: open ? 3 : 'auto',
                                                        '& svg': { fontSize: '1.2rem' },
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                    }}
                                                    sx={{
                                                        opacity: open ? 1 : 0,
                                                    }}
                                                />
                                            </ListItemButton>
                                        </Link>
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
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