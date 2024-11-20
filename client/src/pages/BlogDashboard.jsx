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
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Search, PostAdd, Comment, Notifications, Settings, Home, Menu as MenuIcon, Logout, LightMode, DarkMode, ExitToApp } from '@mui/icons-material';
import MainContentPage from '../components/blogDashboard/MainContentPage';
import ManageBlogs from '../components/blogDashboard/ManageBlogs';
import BlogEditPage from '../components/blogDashboard/BlogEditPage';
import BlogCreatePage from '../components/blogDashboard/BlogCreatePage';
import BlogDetailPage from '../components/blogDashboard/BlogDetailPage';
import ManageComments from '../components/blogDashboard/ManageComments';
import { useAuth } from '../contexts/AuthContext';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { motion } from 'framer-motion';
import commentService from '../services/commentService';
import blogService from '../services/blogService';
import NotificationPopupMenu from '../components/common/NotificationPopupMenu';

const BlogDashboard = () => {
    document.body.dir = 'ltr';
    const { logout, user } = useAuth();
    const { mode, toggleMode } = useCustomTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const drawerItems = [
        { text: 'Dashboard', icon: <Home />, path: '/blog-dashboard' },
        { text: 'All Blogs', icon: <PostAdd />, path: '/blog-dashboard/blogs' },
        { text: 'Comments', icon: <Comment />, path: '/blog-dashboard/comments' },
        { text: 'Notifications', icon: <Notifications />, path: '/blog-dashboard/notifications' },
        { text: 'Settings', icon: <Settings />, path: '/blog-dashboard/settings' },
        { text: 'Exit', icon: <ExitToApp />, path: '/' },
    ];



    const [blogs, setBlogs] = useState([]);
    const fetchBlogs = async () => {
        try {
            const data = await blogService.getBlogs();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const [comments, setComments] = useState([]);
    const fetchComments = async () => {
        try {
            const data = await commentService.getComments();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchBlogs();
        fetchComments();
    }, []);

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
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Blog Dashboard
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Search…"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                mr: 2,
                                borderRadius: 1,
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            }}
                        />
                        {/* Notification popup menu */}
                        {user?.role === 'admin' && <NotificationPopupMenu />}
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} color="inherit">
                            <Avatar alt={user?.name?.split(' ')[0]} src={''} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem onClick={() => { navigate('/blog-dashboard/settings'); setAnchorEl(null); }}>
                                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Settings" />
                            </MenuItem>
                            <MenuItem onClick={() => { toggleMode(); setAnchorEl(null); }}>
                                <ListItemIcon>{mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}</ListItemIcon>
                                <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
                            </MenuItem>
                            <MenuItem onClick={() => { logout(); setAnchorEl(null); }}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer content */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Drawer
                    variant={isMobile ? 'temporary' : 'persistent'}
                    open={menuOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box'
                        }
                    }}
                >
                    {drawerList}
                </Drawer>
            </Box>
            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, padding: 3, ml: isMobile ? 0 : menuOpen ? '240px' : 0, mr: { xs: 0, sm: 0, md: '280px' } }}>
                <Toolbar />
                <Routes>
                    <Route path="/" element={<MainContentPage blogs={blogs} comments={comments} />} />
                    <Route path="/blogs" element={<ManageBlogs blogs={blogs} />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/add-blog" element={<BlogCreatePage />} />
                    <Route path="/edit-blog/:id" element={<BlogEditPage />} />
                    <Route path="/view-blog/:id" element={<BlogDetailPage />} />
                    <Route path="/comments" element={<ManageComments comments={comments} />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </Box>
            <Box
                sx={{
                    display: { xs: 'none', sm: 'none', md: 'block' },
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    marginTop: 1,
                    marginRight: 1,
                    zIndex: 999,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 1,
                    padding: 1,
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                    }
                }}
            >
                <Drawer
                    variant="permanent"
                    anchor="right"
                    open
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 280,
                            boxSizing: 'border-box',
                            overflowY: 'scroll',
                            padding: 2,
                        },
                    }}
                >
                    <Toolbar title="Notifications" />
                    <motion.div
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h6">Recent Blogs</Typography>
                        {/* Render recent blogs here */}
                        {blogs.slice(0, 4).map((blog) => (
                            <motion.div
                                key={blog._id}
                                initial={{ x: 100 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box display="flex" alignItems="center" sx={{ my: 2 }}>
                                    <Avatar src={blog.imageUrl} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1">{blog.title.substring(0, 20)}</Typography>
                                        <Typography variant="body2" color="textSecondary">{blog.author?.name}</Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </motion.div>

                    <Divider sx={{ my: 2 }} />

                    <motion.div
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h6">Recent Comments</Typography>
                        {/* Render recent comments here */}
                        {comments.slice(0, 4).map((comment) => (
                            <motion.div
                                key={comment._id}
                                initial={{ x: 100 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Box display="flex" alignItems="center" sx={{ my: 2 }}>
                                    <Avatar src={comment.image} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1">{comment.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">{comment.content.substring(0, 20)}</Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </motion.div>

                    <Divider sx={{ my: 2 }} />

                    <motion.div
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Typography variant="h6">Notifications</Typography>
                        {/* Render notifications here */}
                        {notifications.slice(0, 4).map((notification) => (
                            <motion.div
                                key={notification._id}
                                initial={{ x: 100 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Box display="flex" alignItems="center" sx={{ my: 2 }}>
                                    <Avatar src={notification.image} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1">{notification.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">{notification.content.substring(0, 20)}</Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </motion.div>
                </Drawer>
            </Box>
        </Box>
    );
};

export default BlogDashboard;
