import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    CssBaseline,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    ListItemButton,
    Tooltip,
    TextField,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Search,
    PostAdd,
    Comment,
    Notifications,
    Settings,
    Home,
    Menu as MenuIcon,
    Logout,
    LightMode,
    DarkMode,
    ExitToApp,
    AccountCircle,
} from '@mui/icons-material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainContentPage from '../components/blogDashboard/MainContentPage';
import ManageBlogs from '../components/blogDashboard/ManageBlogs';
import BlogEditPage from '../components/blogDashboard/BlogEditPage';
import BlogCreatePage from '../components/blogDashboard/BlogCreatePage';
import BlogDetailPage from '../components/blogDashboard/BlogDetailPage';
import ManageComments from '../components/blogDashboard/ManageComments';
import NotificationPopupMenu from '../components/common/NotificationPopupMenu';
import { useAuth } from '../contexts/AuthContext';
import { useCustomTheme } from '../contexts/ThemeProvider';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const BlogDashboard = () => {
    const { logout, user } = useAuth();
    const { mode, toggleMode } = useCustomTheme();
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(!isMobile);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


    const handleDrawerToggle = useCallback(() => {
        setMenuOpen((prev) => !prev);
    }, []);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const drawerItems = [
        { text: 'Dashboard', icon: <Home />, path: '/blog-dashboard' },
        { text: 'All Blogs', icon: <PostAdd />, path: '/blog-dashboard/blogs' },
        { text: 'Create Blog', icon: <PostAdd />, path: '/blog-dashboard/add-blog' },
        { text: 'Comments', icon: <Comment />, path: '/blog-dashboard/comments' },
        { text: 'Notifications', icon: <Notifications />, path: '/blog-dashboard/notifications' },
        { text: 'Exit', icon: <ExitToApp />, path: '/' },
    ];

    const drawerList = (
        <Box>
            <Toolbar />
            <Divider />
            <List>
                {drawerItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Tooltip title={item.text} placement="right" arrow>
                            <ListItemButton
                                selected={window.location.pathname === item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) handleDrawerToggle();
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} sx={{ typography: 'subtitle1', fontWeight: 'medium' }} />
                            </ListItemButton>
                        </Tooltip>
                    </motion.div>
                ))}
            </List>
        </Box>
    );

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                display: { xs: 'none', sm: 'block' },
                                color: theme.palette.primary.main,
                            }}
                        >
                            Blog Dashboard
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            aria-label="Search blogs"
                            size="small"
                            placeholder="Search …"
                            sx={{ backgroundColor: theme.palette.background.paper, mr: 2, borderRadius: 1 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            }}
                        />
                        <NotificationPopupMenu source="blog-dashboard" />
                        <IconButton onClick={handleMenuOpen} color="inherit">
                            <Avatar alt={user?.name?.split(' ')[0]} src={user?.avatarUrl} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => navigate('/profile')}>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText primary="Profile" />
                            </MenuItem>
                            <MenuItem onClick={toggleMode}>
                                <ListItemIcon>{mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}</ListItemIcon>
                                <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={menuOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', backgroundColor: theme.palette.background.paper },
                }}
            >
                {drawerList}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                <Toolbar />
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
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
            >
                <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Scroll to Top Button */}
            <ScrollToTopButton />
        </Box>
    );
};

export default BlogDashboard;
