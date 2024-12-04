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
    Container,
    Link,
    Tooltip,
    Avatar,
    MenuItem,
    Menu,
    Divider,
    ListItemIcon,
} from '@mui/material';
import {
    DarkModeOutlined, LightModeOutlined, Menu as MenuIcon,
    Settings, Language, Logout, Login,
    SettingsApplications, AccountCircle, RssFeed,
    Info, People, PhotoLibrary, ContactMail, Call,
    Home, LocalOffer, BookOnline, Medication,
    MedicalInformation, Handyman, DriveFileMove
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import EnglishIcon from '../../assets/flags/english.svg';
import ArabicIcon from '../../assets/flags/arabic.svg';
import darkIcon from '../../assets/dark-mode.png';
import lightIcon from '../../assets/light-mode.png';
import settingsIcon from '../../assets/settings.png';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const languageIcons = {
    en: EnglishIcon,
    ar: ArabicIcon,
};

// Header Section
const HeaderSection = () => {
    const { clinicInfo } = useClinicContext();
    const { mode, toggleMode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);
    const handleLanguageChange = () => {
        const newLanguage = isArabic ? 'en' : 'ar';
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        document.body.dir = isArabic ? 'ltr' : 'rtl';
        closeMobileMenu();
    };
    const handleThemeToggle = () => toggleMode();

    const handleAdminMenuClick = (event) => {
        setAdminMenuAnchor(event.currentTarget);
        setAdminMenuOpen(true);
    };
    const closeAdminMenu = () => setAdminMenuOpen(false);

    const items = [
        { label: t('app.home'), href: '/', icon: <Home /> },
        { label: t('app.about'), href: '/about-us', icon: <Info /> },
        { label: t('app.services'), href: '/services', icon: <MedicalInformation /> },
        { label: t('app.doctors'), href: '/doctors', icon: <People /> },
        { label: t('app.gallery'), href: '/gallery', icon: <PhotoLibrary /> },
        { label: t('app.blog'), href: '/blog', icon: <RssFeed /> },
        { label: t('app.contactUs'), href: '/contact-us', icon: <ContactMail /> },
    ];

    const handleLogin = () => {
        navigate('/auth/login');
        closeMobileMenu();
    };

    const handleLogout = () => {
        logout();
        // navigate('/auth/login');
        closeMobileMenu();
        closeAdminMenu();
        setAdminMenuAnchor(null);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            color="transparent"
            className="header"
            sx={{
                transition: 'background 0.3s ease',
                bgcolor: isScrolled ? 'background.paper' : 'transparent',
                color: 'text.primary',
                boxShadow: isScrolled ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Desktop Menu */}
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Box
                        onClick={() => navigate('/')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                    >
                        <Avatar
                            src={isDark ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
                            alt={clinicInfo?.name.en}
                            sx={{ width: 50, height: 50 }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography
                                color='primary'
                                fontWeight="bold"
                                sx={{ fontSize: 18, lineHeight: 1.2, letterSpacing: 1 }}
                            >
                                {isArabic ? clinicInfo?.name.ar : clinicInfo?.name.en}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" >
                                {isArabic ? clinicInfo?.subtitle.ar : clinicInfo?.subtitle.en}
                            </Typography>
                        </Box>
                    </Box>
                    <MenuItems items={items} />
                </Box>

                {/* Language and Theme Toggle Buttons */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', flexShrink: 0 }}>
                    <Tooltip title={isArabic ? 'ترجم إلى الإنجليزية' : 'Translate to Arabic'}>
                        <IconButton onClick={handleLanguageChange}>
                            <img src={isArabic ? EnglishIcon : ArabicIcon} alt={isArabic ? 'en' : 'ar'} style={{ width: 28, height: 28 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isDark ? (isArabic ? 'الوضع النهاري' : 'Light Mode') : (isArabic ? 'الوضع الليلى' : 'Dark Mode')}>
                        <IconButton onClick={handleThemeToggle} aria-label="Toggle theme">
                            <img src={isDark ? lightIcon : darkIcon} alt={isDark ? 'light' : 'dark'} style={{ width: 28, height: 28 }} />
                        </IconButton>
                    </Tooltip>
                    {/* Login/Logout Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Button
                            onClick={handleLogin}
                            variant="contained"
                            color="primary"
                            sx={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                padding: '10px',
                                display: user ? 'none' : 'block',
                            }}
                        >
                            {t('app.login')}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            color="error"
                            sx={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                padding: '10px',
                                display: user && user?.role === 'visitor' ? 'block' : 'none',
                            }}
                        >
                            {t('app.logout')}
                        </Button>
                    </motion.div>
                    {/* user admin show dashboard and blog dashboard */}
                    {user && user?.role !== 'visitor' && (
                        <Tooltip title={t('app.adminMenu')}>
                            <IconButton onClick={handleAdminMenuClick}>
                                <img src={settingsIcon} alt="admin" style={{ width: 28, height: 28 }} />
                            </IconButton>
                        </Tooltip>
                    )}

                </Box>

                {/* Mobile Menu */}
                <IconButton
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    onClick={toggleMobileMenu}
                >
                    <MenuIcon />
                </IconButton>
                {/* Mobile Drawer */}
                <Drawer
                    anchor={isArabic ? 'right' : 'left'}
                    variant="temporary"
                    open={mobileMenuOpen}
                    onClose={closeMobileMenu}
                >
                    <Box sx={{ width: 250 }}>
                        <List>
                            {items.map((item, index) => (
                                <ListItem button="true" key={index} onClick={() => { navigate(item.href); closeMobileMenu(); }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText align={isArabic ? 'right' : 'left'} primary={item.label} />
                                </ListItem>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <ListItem
                                button="true"
                                sx={{ cursor: 'pointer', display: user && user?.role === 'admin' ? 'flex' : 'none' }}
                                onClick={() => navigate('/dashboard')}
                            >
                                <ListItemIcon>
                                    <SettingsApplications />
                                </ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={t('app.adminDashboard')} />
                            </ListItem>

                            <ListItem
                                button="true"
                                sx={{ cursor: 'pointer', display: user && user?.role === 'support' ? 'flex' : 'none' }}
                                onClick={() => navigate('/support-dashboard')}
                            >
                                <ListItemIcon>
                                    <SettingsApplications />
                                </ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={t('app.supportDashboard')} />
                            </ListItem>

                            <ListItem
                                button="true"
                                sx={{ cursor: 'pointer', display: user && user?.role === 'author' || user?.role === 'editor' ? 'flex' : 'none' }}
                                onClick={() => navigate('/blog-dashboard')}
                            >
                                <ListItemIcon>
                                    <DriveFileMove />
                                </ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={t('app.blogDashboard')} />
                            </ListItem>

                            <ListItem button="true" onClick={() => navigate('/profile')}>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={t('app.profile')} />
                            </ListItem>

                            <ListItem button="true" onClick={handleLanguageChange}>
                                <ListItemIcon><Language /></ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={isArabic ? 'انجليزي' : 'Arabic'} />
                            </ListItem>

                            <ListItem button="true" onClick={handleThemeToggle}>
                                <ListItemIcon>{isDark ? <LightModeOutlined /> : <DarkModeOutlined />}</ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={
                                    isArabic && isDark ? 'الوضع النهاري' : isArabic && !isDark ? 'الوضع الليلي' : !isArabic && isDark ? 'Light Mode' : 'Dark Mode'
                                } />
                            </ListItem>

                            <ListItem button="true" onClick={user ? handleLogout : handleLogin}>
                                <ListItemIcon>{user ? <Logout /> : <Login />}</ListItemIcon>
                                <ListItemText align={isArabic ? 'right' : 'left'} primary={user ? t('app.logout') : t('app.login')} />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>

                {/* admin menu */}
                <Menu
                    anchorEl={adminMenuAnchor}
                    open={adminMenuOpen}
                    onClose={closeAdminMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        style: {
                            minWidth: 150,
                        },
                    }}
                >
                    {user && user?.role === 'admin' && (
                        <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>{t('app.adminDashboard')}</MenuItem>
                    )}
                    {user && user?.role === 'support' && (
                        <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/support-dashboard')}>{t('app.supportDashboard')}</MenuItem>
                    )}
                    {user && user?.role === 'author' || user?.role === 'editor' && (
                        <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/blog-dashboard')}>{t('app.blogDashboard')}</MenuItem>
                    )}
                    <Divider />
                    <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>{t('app.profile')}</MenuItem>
                    <MenuItem sx={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }} onClick={handleLogout}>{t('app.logout')}</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

const MenuItems = ({ items }) => {
    const navigate = useNavigate();

    const onClick = (href) => {
        navigate(href);
    };

    return (
        <Box sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'space-between'
        }}
        >
            {items.map((item, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                    <Link
                        onClick={() => onClick(item.href)}
                        underline="none"
                        sx={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'inherit',
                            position: 'relative',
                            cursor: 'pointer',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                width: '100%',
                                transform: 'scaleX(0)',
                                height: '5px',
                                bottom: -5,
                                left: 0,
                                zIndex: -1,
                                backgroundColor: 'secondary.dark',
                                transformOrigin: 'bottom right',
                                transition: 'transform 0.25s ease-out',
                            },
                            '&:hover:after': {
                                transform: 'scaleX(1)',
                                transformOrigin: 'bottom left',
                            },
                        }}
                    >
                        {item.label}
                    </Link>
                </motion.div>
            ))}
        </Box>
    );
};


export default HeaderSection;
