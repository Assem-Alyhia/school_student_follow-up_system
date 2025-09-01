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
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import LayersIcon from '@mui/icons-material/Layers';
import ClassIcon from '@mui/icons-material/Class';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GradingIcon from '@mui/icons-material/Grading';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState, useEffect } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Collapse } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { clearToken } from '../../api/authApi/tokenManager';
import { getUserById } from '../../api/Admin/Users/getUserById';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import GradeIcon from '@mui/icons-material/Grade';


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
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#35AFBC',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
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
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#35AFBC',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
            },
        }),
    })
);

const menuItems = [
    { text: 'لوحة التحكم', icon: <DashboardIcon />, url: '/dashboard' },

    {
        text: 'المستخدمون',
        icon: <PeopleAltIcon />,
        url: '/dashboard/users',
        children: [
            { text: 'الأدوار', icon: <AdminPanelSettingsIcon />, url: '/dashboard/users/roles' },
            { text: 'الصلاحيات', icon: <SecurityIcon />, url: '/dashboard/users/permissions' },
            { text: 'القوائم', icon: <ListAltIcon />, url: '/dashboard/users' },
        ]
    },
    { text: 'الطلاب', icon: <GroupsIcon />, url: '/dashboard/students' },
    { text: 'المعلمون', icon: <SchoolIcon />, url: '/dashboard/teachers' },
    { text: 'المشرفون', icon: <SchoolIcon />, url: '/dashboard/supervisor' },
    { text: 'أولياء الأمور', icon: <FamilyRestroomIcon />, url: '/dashboard/guardian' },
    { text: 'موظفي المالية', icon: <FamilyRestroomIcon />, url: '/dashboard/financials' },
    { text: 'المراحل الدراسية', icon: <LayersIcon />, url: '/dashboard/academicStages' },
    { text: 'الصفوف الدراسية', icon: <ClassIcon />, url: '/dashboard/classes' },
    { text: 'الدروس', icon: <MenuBookIcon />, url: '/dashboard/lessons' },
    { text: 'الأقساط', icon: <MenuBookIcon />, url: '/dashboard/installment' },
    {
        text: 'الامتحانات',
        icon: <AssignmentIcon />,
        url: '/teacherDashboard/exams',
        children: [
            { text: 'قوائم الصفوف', icon: <ListAltIcon />, url: '/dashboard/exam/classesLists' },
            { text: 'قوائم الامتحانات', icon: <ListAltIcon />, url: '/dashboard/exam/examlists' },
            { text: 'أنواع الامتحانات', icon: <CategoryIcon />, url: '/dashboard/exam/typesExams' },
            { text: 'درجات الامتحانات', icon: <GradeIcon />, url: '/dashboard/exam/resultsExams' },
        ]
    },
    { text: 'الدرجات', icon: <GradingIcon />, url: '/dashboard/grades' },
    { text: 'النقل المدرسي', icon: <DirectionsBusIcon />, url: '/dashboard/schoolTransportation' },
    { text: 'الشؤون المالية', icon: <RequestQuoteIcon />, url: '/dashboard/fees' },
    { text: 'التقارير', icon: <AssessmentIcon />, url: '/dashboard/reports' },
];

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

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

    const toggleReports = (index) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleLogout = () => {
        clearToken();
        handleProfileMenuClose();
        navigate("/login");
    };


    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem("UserId");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) return;
                const response = await getUserById(userId);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

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

                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <ChatIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#fff', marginRight: 2 }}>
                                <NotificationsIcon />
                            </IconButton>

                            <IconButton onClick={handleProfileMenuOpen} sx={{ color: '#fff' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={userData?.image || '/default-avatar.png'} />
                                    <Typography sx={{ marginLeft: 1, color: '#fff' }}>
                                        {userData?.name || 'المستخدم'}
                                    </Typography>
                                    <ExpandMoreIcon sx={{ color: '#fff', marginLeft: 1 }} />
                                </Box>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                                PaperProps={{
                                    sx: {
                                        width: 250,
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow: 4,
                                        mt: 1.5
                                    },
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 1 }}>
                                    <Avatar
                                        alt={userData?.name}
                                        src={userData?.image && userData.image !== '' ? userData.image : undefined}
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            margin: '0 auto 8px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            bgcolor: '#ccc',
                                        }}
                                    >
                                        {(!userData?.image || userData.image === '') && userData?.name?.charAt(0)}
                                    </Avatar>
                                    <Typography fontWeight="bold" fontSize="1rem">
                                        {userData?.name || 'اسم المستخدم'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {userData?.email || 'email@example.com'}
                                    </Typography>

                                </Box>

                                <Box sx={{ my: 1, borderTop: '1px solid #eee' }} />

                                <MenuItem onClick={handleProfileMenuClose} sx={{ px: 2 }}>
                                    <Link
                                        to={`/dashboard/users/usersProfile/${userId}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <PersonIcon sx={{ mr: 1 }} />
                                        الملف الشخصي
                                    </Link>
                                </MenuItem>

                                <MenuItem onClick={handleProfileMenuClose} sx={{ px: 2 }}>
                                    <Link
                                        to={`/dashboard/users/usersSettings/${userId}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <SettingsIcon sx={{ mr: 1 }} />
                                        الإعدادات
                                    </Link>
                                </MenuItem>

                                <Box sx={{ my: 1, borderTop: '1px solid #eee' }} />

                                <MenuItem onClick={handleLogout} sx={{ color: 'red', px: 2 }}>
                                    <ExitToAppIcon sx={{ mr: 1 }} />
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
                        <Box sx={{
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#35AFBC',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'transparent',
                            },
                        }}>
                            <List>
                                {menuItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.children ? (
                                            <>
                                                <ListItemButton
                                                    onClick={() => toggleReports(index)}
                                                    sx={{
                                                        width: '90%',
                                                        margin: 'auto',
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                        borderRadius: '8px',
                                                        backgroundColor: 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                            '& .MuiListItemIcon-root': {
                                                                color: '#A4A8B2',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            justifyContent: 'center',
                                                            mr: open ? 3 : 0,
                                                            '& svg': {
                                                                fontSize: '1.2rem',
                                                                color: '#A4A8B2'
                                                            },
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    {open && (
                                                        <ListItemText
                                                            primary={item.text}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.85rem',
                                                                fontWeight: '700',
                                                                color: '#A4A8B2'
                                                            }}
                                                        />
                                                    )}
                                                    {expandedItems[index] ?
                                                        <ExpandLessIcon sx={{ color: '#A4A8B2', ml: open ? 1 : 0 }} /> :
                                                        <ExpandMoreIcon sx={{ color: '#A4A8B2', ml: open ? 1 : 0 }} />
                                                    }
                                                </ListItemButton>
                                                <Collapse in={expandedItems[index]} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {item.children.map((child, childIndex) => (
                                                            <ListItemButton
                                                                key={childIndex}
                                                                component={Link}
                                                                to={child.url}
                                                                sx={{
                                                                    pl: open ? 5 : 3,
                                                                    textAlign: 'center',
                                                                    minHeight: 40,
                                                                    backgroundColor: location.pathname === child.url ? '#34b1b7' : 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor: location.pathname === child.url ? '#34b1b7' : 'rgba(0, 0, 0, 0.04)',
                                                                        color: location.pathname === child.url ? '#fff' : '#A4A8B2',
                                                                        '& .MuiListItemIcon-root': {
                                                                            color: location.pathname === child.url ? '#fff' : '#A4A8B2',
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <ListItemIcon
                                                                    sx={{
                                                                        minWidth: 0,
                                                                        mr: open ? 2 : 0,
                                                                        '& svg': {
                                                                            fontSize: '1rem',
                                                                            color: location.pathname === child.url ? '#fff' : '#A4A8B2'
                                                                        }
                                                                    }}
                                                                >
                                                                    {child.icon}
                                                                </ListItemIcon>
                                                                {open && (
                                                                    <ListItemText
                                                                        primary={child.text}
                                                                        primaryTypographyProps={{
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: '700',
                                                                            color: location.pathname === child.url ? '#fff' : '#A4A8B2'
                                                                        }}
                                                                    />
                                                                )}
                                                            </ListItemButton>
                                                        ))}
                                                    </List>
                                                </Collapse>
                                            </>
                                        ) : (
                                            <ListItem disablePadding sx={{ display: 'block' }}>
                                                <Link
                                                    to={item.url}
                                                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                                                >
                                                    <ListItemButton
                                                        sx={{
                                                            width: '90%',
                                                            margin: 'auto',
                                                            minHeight: 48,
                                                            justifyContent: open ? 'initial' : 'center',
                                                            px: 2.5,
                                                            borderRadius: '8px',
                                                            backgroundColor: location.pathname === item.url ? '#34b1b7' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: location.pathname === item.url ? '#34b1b7' : 'rgba(0, 0, 0, 0.04)',
                                                                color: location.pathname === item.url ? '#fff' : '#A4A8B2',
                                                                '& .MuiListItemIcon-root': {
                                                                    color: location.pathname === item.url ? '#fff' : '#A4A8B2',
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: 0,
                                                                justifyContent: 'center',
                                                                mr: open ? 3 : 'auto',
                                                                '& svg': {
                                                                    fontSize: '1.2rem',
                                                                    color: location.pathname === item.url ? '#fff' : '#A4A8B2'
                                                                },
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item.text}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.85rem',
                                                                fontWeight: '700',
                                                                color: location.pathname === item.url ? '#fff' : '#A4A8B2'
                                                            }}
                                                            sx={{
                                                                opacity: open ? 1 : 0,
                                                            }}
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