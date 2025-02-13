import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    useTheme,
} from '@mui/material';
import {
    DarkModeOutlined,
    LightModeOutlined,
    Menu as MenuIcon,
    Translate,
    AccountCircle,
    Close,
    Home,
    Info,
    MedicalInformation,
    People,
    PhotoLibrary,
    ContactMail,
    RssFeed,
    SettingsApplications,
    DriveFileMove,
    Logout,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useAuth } from '../../contexts/AuthContext';
import TopbarSection from './TopbarSection';

const HeaderSection = () => {
    const { clinicInfo } = useClinicContext();
    const { mode, toggleMode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: t('app.home'), href: '/', icon: <Home /> },
        { label: t('app.about'), href: '/about-us', icon: <Info /> },
        { label: t('app.services'), href: '/services', icon: <MedicalInformation /> },
        { label: t('app.doctors'), href: '/doctors', icon: <People /> },
        { label: t('app.gallery'), href: '/gallery', icon: <PhotoLibrary /> },
        { label: t('app.blog'), href: '/blog', icon: <RssFeed /> },
        { label: t('app.contactUs'), href: '/contact-us', icon: <ContactMail /> },
    ];

    const handleLanguageChange = () => {
        const newLang = isArabic ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        document.body.dir = isArabic ? 'ltr' : 'rtl';
        localStorage.setItem('language', newLang);
    };

    const handleAdminMenu = (event) => setAdminMenuAnchor(event.currentTarget);
    const closeAdminMenu = () => setAdminMenuAnchor(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Top Navigation */}
            <TopbarSection clinicinfo={clinicInfo} />

            <AppBar
                position="fixed"
                elevation={isScrolled ? 4 : 0}
                className="header"
                sx={{
                    bgcolor: isScrolled ? 'background.paper' : 'transparent',
                    color: isScrolled ? 'text.primary' : 'common.white',
                    transition: 'all 0.3s ease',
                    marginTop: { xs: 0, md: isScrolled ? 0 : 8 },
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
                    {/* Logo Section */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            textDecoration: 'none',
                            flexShrink: 0,
                        }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Avatar
                                src={isDark ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
                                alt="Clinic Logo"
                                sx={{ width: 56, height: 56, borderRadius: 2 }}
                            />
                        </motion.div>
                        <Box>
                            <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="800"
                                fontFamily="'Cairo Play', sans-serif"
                            >
                                {isArabic ? clinicInfo?.name.ar : clinicInfo?.name.en}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="600"
                                fontFamily="'Futura', sans-serif"
                            >
                                {isArabic ? clinicInfo?.subtitle.ar : clinicInfo?.subtitle.en}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mx: 4 }}>
                        {menuItems.map((item, index) => (
                            <NavItem key={index} item={item} isActive={location.pathname === item.href} />
                        ))}
                    </Box>

                    {/* Control Buttons */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <Tooltip title={t(isDark ? 'app.lightMode' : 'app.darkMode')}>
                            <IconButton onClick={toggleMode} color="inherit">
                                {isDark ? (
                                    <LightModeOutlined sx={{ color: 'text.primary' }} />
                                ) : (
                                    <DarkModeOutlined sx={{ color: 'text.primary' }} />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t(isArabic ? 'app.switchEnglish' : 'app.switchArabic')}>
                            <IconButton onClick={handleLanguageChange} color="inherit">
                                <Translate sx={{ color: 'text.primary' }} />
                            </IconButton>
                        </Tooltip>

                        {user ? (
                            <>
                                <IconButton onClick={handleAdminMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        src={user.avatar}
                                        sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                                    >
                                        {user.name[0]}
                                    </Avatar>
                                </IconButton>
                                <UserMenu
                                    anchorEl={adminMenuAnchor}
                                    open={Boolean(adminMenuAnchor)}
                                    onClose={closeAdminMenu}
                                    user={user}
                                    handleLogout={handleLogout}
                                    t={t}
                                    navigate={navigate}
                                />
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/auth/login')}
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                {isArabic ? 'تسجيل الدخول' : 'Login'}
                            </Button>
                        )}

                        <IconButton
                            sx={{ display: { md: 'none' } }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <Close sx={{ color: 'text.primary' }} />
                            ) : (
                                <MenuIcon sx={{ color: 'text.primary' }} />
                            )}
                        </IconButton>
                    </Box>

                    {/* Mobile Menu Icon */}
                    <IconButton
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <Close sx={{ color: 'text.primary', width: 30, height: 30 }} /> : <MenuIcon sx={{ color: 'text.primary', width: 30, height: 30 }} />}
                    </IconButton>

                    {/* Mobile Menu */}
                    <MobileMenu
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        items={menuItems}
                        user={user}
                        isArabic={isArabic}
                        navigate={navigate}
                        handleLanguageChange={handleLanguageChange}
                        toggleMode={toggleMode}
                        handleLogout={handleLogout}
                    />
                </Toolbar>
            </AppBar>
        </Box>
    );
};

const NavItem = ({ item, isActive }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <motion.div whileHover={{ scale: 1.05 }}>
            <Button
                onClick={() => navigate(item.href)}
                sx={{
                    color: isActive ? theme.palette.primary.main : 'text.primary',
                    textTransform: 'capitalize',
                    fontWeight: isActive ? 'bold' : 600,
                    position: 'relative',
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: 0,
                        width: isActive ? '100%' : 0,
                        height: '4px',
                        bgcolor: theme.palette.secondary.main,
                        transition: 'width 0.3s ease',
                    },
                    '&:hover:after': {
                        width: '100%',
                    }
                }}
            >
                {item.label}
            </Button>
        </motion.div>
    );
};

const UserMenu = ({ anchorEl, open, onClose, user, handleLogout, t, navigate }) => (
    <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                width: 240,
                borderRadius: 2,
                boxShadow: 3,
                mt: 1.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    mr: 1.5,
                },
            },
        }}
    >
        <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="600">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
        </Box>
        <Divider />

        <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            {t('app.profile')}
        </MenuItem>

        {['admin', 'support'].includes(user.role) && (
            <MenuItem onClick={() => navigate(`/${user.role}-dashboard`)}>
                <ListItemIcon><SettingsApplications /></ListItemIcon>
                {t(`app.${user.role}Dashboard`)}
            </MenuItem>
        )}

        {['author', 'editor'].includes(user.role) && (
            <MenuItem onClick={() => navigate('/blog-dashboard')}>
                <ListItemIcon><DriveFileMove /></ListItemIcon>
                {t('app.blogDashboard')}
            </MenuItem>
        )}

        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><Logout color="error" /></ListItemIcon>
            {t('app.logout')}
        </MenuItem>
    </Menu>
);

const MobileMenu = ({ open, onClose, items, user, isArabic, navigate, handleLanguageChange, toggleMode, handleLogout }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';

    return (
        <Drawer
            anchor="top"
            open={open}
            onClose={onClose}
            transitionDuration={300}
            sx={{
                '& .MuiDrawer-paper': {
                    backdropFilter: 'blur(16px)',
                    backgroundColor: theme.palette.background.default + 'ee',
                    boxShadow: 24,
                    zIndex: theme.zIndex.modal,
                    minHeight: '100vh',
                    pt: 8,
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <List sx={{ px: 2, pt: 4 }}>
                    {items.map((item) => (
                        <motion.div
                            key={item.href}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <ListItem
                                button
                                onClick={() => {
                                    navigate(item.href);
                                    onClose();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        boxShadow: 2,
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {React.cloneElement(item.icon, {
                                        sx: { color: 'primary.main' }
                                    })}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: 700,
                                        align: isArabic ? 'right' : 'left',
                                        variant: 'body1'
                                    }}
                                />
                            </ListItem>
                        </motion.div>
                    ))}

                    {/* Language and Theme Section */}
                    <Box sx={{ mt: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                        <ListItem
                            button
                            onClick={handleLanguageChange}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Translate color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t(isArabic ? 'app.switchEnglish' : 'app.switchArabic')}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    align: isArabic ? 'right' : 'left'
                                }}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={toggleMode}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {isDark ? (
                                    <LightModeOutlined color="primary" />
                                ) : (
                                    <DarkModeOutlined color="primary" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={t(isDark ? 'app.lightMode' : 'app.darkMode')}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    align: isArabic ? 'right' : 'left'
                                }}
                            />
                        </ListItem>
                    </Box>

                    {/* User Section */}
                    {user && (
                        <Box sx={{ mt: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                            <ListItem
                                button
                                onClick={() => {
                                    navigate('/profile');
                                    onClose();
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <AccountCircle color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('app.profile')}
                                    secondary={user.email}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        align: isArabic ? 'right' : 'left'
                                    }}
                                    secondaryTypographyProps={{
                                        align: isArabic ? 'right' : 'left'
                                    }}
                                />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => {
                                    handleLogout();
                                    onClose();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.light' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Logout color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('app.logout')}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        align: isArabic ? 'right' : 'left'
                                    }}
                                />
                            </ListItem>
                        </Box>
                    )}

                    {/* Login Section */}
                    {!user && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    navigate('/auth/login');
                                    onClose();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: '1.1rem'
                                }}
                            >
                                {t('app.login')}
                            </Button>
                        </Box>
                    )}
                </List>
            </motion.div>
        </Drawer>
    );
};

export default HeaderSection;