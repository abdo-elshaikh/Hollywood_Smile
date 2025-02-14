import * as React from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
    Box, Drawer, CssBaseline, AppBar as MuiAppBar,
    Toolbar, List, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, InputAdornment, TextField,
    Card, CardContent, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Tooltip,
    Chip, CircularProgress, LinearProgress
} from '@mui/material';
import {
    Menu as MenuIcon, ChevronLeft, ChevronRight,
    Home, Article, Add, Comment, Notifications, ExitToApp,
    Search, AccountCircle, DarkMode, LightMode, Logout,
    Edit, Delete, Visibility, CheckCircle, PendingActions,
    BarChart, DateRange, CloudUpload, Category, Close as Exit, PostAdd, Settings,
    ArrowUpward, ArrowDownward, MoreVert
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCustomTheme } from '../contexts/ThemeProvider';
import MainContentPage from '../components/blogDashboard/MainContentPage';
import BlogDetailPage from '../components/blogDashboard/BlogDetailPage';
import BlogEditPage from '../components/blogDashboard/BlogEditPage';
import ManageBlogs from '../components/blogDashboard/ManageBlogs';
import ManageComments from '../components/blogDashboard/ManageComments';
import BlogCreatePage from '../components/blogDashboard/BlogCreatePage';

const drawerWidth = 280;

// Styled Components
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(20px)',
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: 300,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
    }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        borderRight: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.paper, 0.75),
        backdropFilter: 'blur(15px)',
    },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
}));

// Main Component
export default function BlogDashboard() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { mode, toggleMode } = useCustomTheme();
    const [open, setOpen] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const drawerItems = [
        { text: 'Dashboard', icon: <Home />, path: '/blog-dashboard' },
        { text: 'All Blogs', icon: <PostAdd />, path: '/blog-dashboard/blogs' },
        { text: 'Create Blog', icon: <PostAdd />, path: '/blog-dashboard/add-blog' },
        { text: 'Comments', icon: <Comment />, path: '/blog-dashboard/comments' },
        { text: 'Notifications', icon: <Notifications />, path: '/blog-dashboard/notifications' },
        { text: 'Exit', icon: <ExitToApp />, path: '/' },
    ];

    const handleDrawerToggle = () => setOpen(!open);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={{
                                mr: 2,
                                ...(open && { display: { xs: 'none', sm: 'flex' } }),
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                display: { xs: 'none', md: 'block' },
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: -0.5
                            }}
                        >
                            Blog Dashboard
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TextField
                            size="small"
                            placeholder="Search content..."
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: 280,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    bgcolor: 'background.paper'
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={mode === 'dark' ? 'Light theme' : 'Dark theme'}>
                                <IconButton
                                    onClick={toggleMode}
                                    sx={{
                                        color: 'text.primary',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    {mode === 'dark' ? <LightMode /> : <DarkMode />}
                                </IconButton>
                            </Tooltip>

                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{ p: 0, '&:hover': { transform: 'scale(1.05)' } }}
                            >
                                <Avatar
                                    src={user?.avatarUrl}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: `2px solid ${theme.palette.primary.main}`
                                    }}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
                <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={75}
                    sx={{ height: 2, bgcolor: 'transparent' }}
                />
            </AppBar>

            {/* Navigation Drawer */}
            <StyledDrawer
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: 'text.secondary',
                                pl: 1.5
                            }}
                        >
                            Navigation
                        </Typography>
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{ color: 'text.secondary' }}
                        >
                            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Box>
                </Box>

                <List sx={{ px: 2, pt: 2 }}>
                    {drawerItems.map((item) => (
                        <motion.div
                            key={item.text}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    '&.Mui-selected': {
                                        bgcolor: 'action.selected',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {React.cloneElement(item.icon, {
                                        color: location.pathname === item.path ? 'primary' : 'inherit'
                                    })}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        fontWeight: 500
                                    }}
                                />
                            </ListItemButton>
                        </motion.div>
                    ))}
                </List>
            </StyledDrawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    ml: open ? `${drawerWidth}px` : 0,
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: 300,
                    }),
                }}
            >
                <Toolbar />
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Routes>
                            <Route path="/" element={<MainContentPage />} />
                            <Route path="/blogs" element={<ManageBlogs />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/add-blog" element={<BlogCreatePage />} />
                            <Route path="/edit-blog/:id" element={<BlogEditPage />} />
                            <Route path="/view-blog/:id" element={<BlogDetailPage />} />
                            <Route path="/comments" element={<ManageComments />} />
                            <Route path="/notifications" element={<Notifications />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 280,
                        borderRadius: 2,
                        boxShadow: 24,
                        mt: 1,
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    }
                }}
            >
                <MenuItem
                    onClick={() => navigate('/profile')}
                    sx={{ py: 1.5, '&:hover': { bgcolor: 'action.hover' } }}
                >
                    <ListItemIcon><AccountCircle /></ListItemIcon>
                    <ListItemText
                        primary="Profile"
                        secondary={user?.email}
                        secondaryTypographyProps={{ variant: 'caption' }}
                    />
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                    onClick={logout}
                    sx={{
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.light' }
                    }}
                >
                    <ListItemIcon><Logout color="error" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </Box>
    );
}

