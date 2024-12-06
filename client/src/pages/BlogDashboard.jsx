import React, { useState, useEffect } from 'react';
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
import blogService from '../services/blogService';
import commentService from '../services/commentService';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const BlogDashboard = () => {
    document.body.dir = 'ltr';

    // Destructuring from context
    const { logout, user } = useAuth();
    const { mode, toggleMode } = useCustomTheme();
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State variables
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(!isMobile);
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [lastCode, setLastCode] = useState('');

    // Fetch blogs and comments when component mounts
    useEffect(() => {
        fetchBlogs();
        fetchComments();
    }, []);

    useEffect(() => {
        generateBlogCode();
    }, [blogs]);

    // Fetch blogs data
    const fetchBlogs = async () => {
        try {
            const data = await blogService.getBlogs();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBlogs(sortedData);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    // Fetch comments data
    const fetchComments = async () => {
        try {
            const data = await commentService.getComments();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComments(sortedData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Toggle the drawer open/close
    const handleDrawerToggle = () => {
        setMenuOpen(!menuOpen);
    };

    // Generate new blog code based on the last blog's code
    const generateBlogCode = () => {
        let lastCode = '0000';

        if (blogs && blogs.length > 0) {
            // Sort blogs by createdAt (most recent blog first)
            const lastBlogCode = blogs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].code;

            if (lastBlogCode) {
                const lastBlogCodeParts = lastBlogCode.split('-');
                lastCode = lastBlogCodeParts[1];
                console.log('lastCode: ', lastCode);
            }
        }

        // Generate new code by incrementing the last code
        const newCode = `B-${(parseInt(lastCode, 10) + 1).toString().padStart(4, '0')}`;
        console.log('newCode: ', newCode);
        setLastCode(newCode);
    };


    // Drawer items for the sidebar menu
    const drawerItems = [
        { text: 'Dashboard', icon: <Home />, path: '/blog-dashboard' },
        { text: 'All Blogs', icon: <PostAdd />, path: '/blog-dashboard/blogs' },
        { text: 'Create Blog', icon: <PostAdd />, path: '/blog-dashboard/add-blog' },
        { text: 'Comments', icon: <Comment />, path: '/blog-dashboard/comments' },
        { text: 'Notifications', icon: <Notifications />, path: '/blog-dashboard/notifications' },
        { text: 'Settings', icon: <Settings />, path: '/blog-dashboard/settings' },
        { text: 'Exit', icon: <ExitToApp />, path: '/' },
    ];

    // Drawer list UI
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
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} sx={{ typography: 'subtitle1', fontWeight: 'medium' }} />
                            </ListItemButton>
                        </Tooltip>
                    </motion.div>
                ))}
            </List>
        </Box>
    );

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
                            sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: { xs: 'none', sm: 'block' } }}
                        >
                            Blog Dashboard
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Search …"
                            sx={{ backgroundColor: theme.palette.background.paper, mr: 2, borderRadius: 1 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            }}
                        />
                        <NotificationPopupMenu source="blog-dashboard" />
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} color="inherit">
                            <Avatar alt={user?.name?.split(' ')[0]} src={user?.avatarUrl} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem onClick={() => navigate('/blog-dashboard/settings')}>
                                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Settings" />
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
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
                }}
            >
                {drawerList}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: menuOpen && !isMobile ? '240px' : 0 }}>
                <Toolbar />
                <Routes>
                    <Route path="/" element={<MainContentPage blogs={blogs} comments={comments} />} />
                    <Route path="/blogs" element={<ManageBlogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/add-blog" element={<BlogCreatePage newCode={lastCode} />} />
                    <Route path="/edit-blog/:id" element={<BlogEditPage />} />
                    <Route path="/view-blog/:id" element={<BlogDetailPage />} />
                    <Route path="/comments" element={<ManageComments comments={comments} />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </Box>
            <ScrollToTopButton />
        </Box>
    );
};

export default BlogDashboard;
