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
    Home, LocalOffer, BookOnline, Medication, Close,
    MedicalInformation, Handyman, DriveFileMove
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import EnglishIcon from '../../assets/flags/english.svg';
import ArabicIcon from '../../assets/flags/arabic.svg';
import darkIcon from '../../assets/dark-mode.png';
import lightIcon from '../../assets/light-mode.png';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TopbarSection from './TopbarSection';


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
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
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
        <Box>
            <TopbarSection clinicinfo={clinicInfo} />
            <AppBar
                position="fixed"
                elevation={3}
                color="transparent"
                className="header"
                sx={{
                    transition: 'background 0.3s ease',
                    bgcolor: isScrolled ? 'background.paper' : 'transparent',
                    color: 'text.primary',
                    boxShadow: isScrolled ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                    mt: { xs: 0, md: isScrolled ? 0 : 8 },
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Desktop Menu */}

                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', textDecoration: 'none' }}
                        component={Link}
                        href="/" // Navigate to the home page
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

                    {/* Language and Theme Toggle Buttons */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', flexShrink: 0 }}>
                        <Tooltip title={isArabic ? 'ترجم إلى الإنجليزية' : 'Translate to Arabic'}>
                            <IconButton sx={{ width: 30, height: 30 }} onClick={handleLanguageChange}>
                                <Avatar src={isArabic ? EnglishIcon : ArabicIcon} alt={isArabic ? 'en' : 'ar'} sx={{ width: 30, height: 30 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={isDark ? (isArabic ? 'الوضع النهاري' : 'Light Mode') : (isArabic ? 'الوضع الليلى' : 'Dark Mode')}>
                            <IconButton sx={{ width: 30, height: 30 }} onClick={handleThemeToggle} aria-label="Toggle theme">
                                <Avatar src={isDark ? lightIcon : darkIcon} alt={isDark ? 'light' : 'dark'} sx={{ width: 30, height: 30 }} />
                            </IconButton>
                        </Tooltip>

                        {user ? (
                            <Tooltip title={t('app.profile')}>
                                <IconButton sx={{ width: 30, height: 30 }} onClick={handleAdminMenuClick}>
                                    <Avatar src={user.avatarUrl} alt={user.username[0]} sx={{ width: 30, height: 30 }} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                {t('app.login')}
                            </Button>
                        )}

                    </Box>

                    {/* Mobile Menu Icon */}
                    <IconButton
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <Close sx={{ color: 'text.primary', width: 30, height: 30 }} /> : <MenuIcon sx={{ color: 'text.primary', width: 30, height: 30 }} />}
                    </IconButton>

                    {/* Mobile Menu Drawer */}
                    <Drawer
                        anchor="top"
                        open={mobileMenuOpen}
                        onClose={closeMobileMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            zIndex: 10,
                            animation: 'slide-down 0.8s ease',
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ padding: 2 }}>
                            <List>
                                {/* Menu Items */}
                                {items.map((item, index) => (
                                    <ListItem
                                        button='true'
                                        key={index}
                                        onClick={() => { navigate(item.href); closeMobileMenu(); }}
                                        sx={{
                                            cursor: 'pointer',
                                            paddingY: 1,
                                            transition: 'background-color 0.3s',
                                            '&:hover': {
                                                bgcolor: 'background.default',
                                                transition: 'background-color 0.3s',
                                                transform: 'translateX(5px)',
                                            },
                                        }}

                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            align={isArabic ? 'right' : 'left'}
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {item.label}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}

                                <Divider sx={{ my: 1 }} />

                                {/* Conditional Admin, Support, and Blog Items */}
                                {user?.role === 'admin' && (
                                    <ListItem button='true' onClick={() => navigate('/dashboard')}>
                                        <ListItemIcon>
                                            <SettingsApplications />
                                        </ListItemIcon>
                                        <ListItemText align={isArabic ? 'right' : 'left'}
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {t('app.adminDashboard')}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {user?.role === 'support' && (
                                    <ListItem button='true' onClick={() => navigate('/support-dashboard')}>
                                        <ListItemIcon>
                                            <SettingsApplications />
                                        </ListItemIcon>
                                        <ListItemText align={isArabic ? 'right' : 'left'}
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {t('app.supportDashboard')}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {(user?.role === 'author' || user?.role === 'editor') && (
                                    <ListItem button='true' onClick={() => navigate('/blog-dashboard')}>
                                        <ListItemIcon>
                                            <DriveFileMove />
                                        </ListItemIcon>
                                        <ListItemText align={isArabic ? 'right' : 'left'}
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {t('app.blogDashboard')}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {/* Profile and Settings */}
                                {user && (
                                    <ListItem button='true' onClick={() => navigate('/profile')}>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText align={isArabic ? 'right' : 'left'}
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {t('app.profile')}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {/* Language and Theme Settings */}
                                <ListItem button='true' onClick={handleLanguageChange}>
                                    <ListItemIcon>
                                        <Language />
                                    </ListItemIcon>
                                    <ListItemText align={isArabic ? 'right' : 'left'}
                                        primary={
                                            <Typography variant="body1" fontWeight="bold">
                                                {isArabic ? 'انجليزي' : 'Arabic'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem button='true' onClick={handleThemeToggle}>
                                    <ListItemIcon>
                                        {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
                                    </ListItemIcon>
                                    <ListItemText
                                        align={isArabic ? 'right' : 'left'}
                                        primary={
                                            <Typography variant="body1" fontWeight="bold">
                                                {isArabic ? (isDark ? 'الوضع النهاري' : 'الوضع الليلي') : (isDark ? 'Light Mode' : 'Dark Mode')}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                {/* Login/Logout Button */}
                                <ListItem button='true' onClick={user ? handleLogout : handleLogin}>
                                    <ListItemIcon>
                                        {user ? <Logout /> : <Login />}
                                    </ListItemIcon>
                                    <ListItemText align={isArabic ? 'right' : 'left'}
                                        primary={
                                            <Typography variant="body1" fontWeight="bold">
                                                {user ? t('app.logout') : t('app.login')}
                                            </Typography>
                                        } />
                                </ListItem>
                            </List>
                        </Box>
                    </Drawer>


                    {/* Admin Menu */}
                    <Menu
                        anchorEl={adminMenuAnchor}
                        open={adminMenuOpen}
                        onClose={closeAdminMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            style: {
                                minWidth: 180, // Adjusted to make the menu wider
                                borderRadius: 8, // Rounded corners for a modern look
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                            },
                        }}
                    >
                        {/* Role-based Dashboard Links */}
                        {user && user.role === 'admin' && (
                            <MenuItem
                                sx={{
                                    cursor: 'pointer',
                                    paddingY: 1,
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                                    fontWeight: 500, // Bold text for important links
                                }}
                                onClick={() => navigate('/dashboard')}
                            >
                                <Typography fontWeight='bold' variant="body1">{t('app.adminDashboard')}</Typography>
                            </MenuItem>
                        )}

                        {user && user.role === 'support' && (
                            <MenuItem
                                sx={{
                                    cursor: 'pointer',
                                    paddingY: 1,
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                                    fontWeight: 500,
                                }}
                                onClick={() => navigate('/support-dashboard')}
                            >
                                <Typography fontWeight='bold' variant="body1">
                                    {t('app.supportDashboard')}
                                </Typography>
                            </MenuItem>
                        )}

                        {(user && (user.role === 'author' || user.role === 'editor')) && (
                            <MenuItem
                                sx={{
                                    cursor: 'pointer',
                                    paddingY: 1,
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                                    fontWeight: 500,
                                }}
                                onClick={() => navigate('/blog-dashboard')}
                            >
                                <Typography fontWeight='bold' variant="body1">
                                    {t('app.blogDashboard')}
                                </Typography>
                            </MenuItem>
                        )}

                        {/* Divider for better grouping */}
                        {user && user.role !== 'visitor' && (
                            <Divider sx={{ my: 1 }} />
                        )}

                        {/* User Profile and Logout Options */}
                        <MenuItem
                            sx={{
                                cursor: 'pointer',
                                paddingY: 1,
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                            }}
                            onClick={() => navigate('/profile')}
                        >
                            {t('app.profile')}
                        </MenuItem>

                        <MenuItem
                            sx={{
                                cursor: 'pointer',
                                paddingY: 1,
                                color: 'red',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' }, // Red hover effect for logout
                            }}
                            onClick={handleLogout}
                        >
                            {t('app.logout')}
                        </MenuItem>
                    </Menu>

                </Toolbar>
            </AppBar>
        </Box>
    );
};

const MenuItems = ({ items }) => {
    const navigate = useNavigate();

    const onClick = (href) => {
        navigate(href);
    };

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 3, // Increased gap for better spacing
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'center',
            }}
        >
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                >
                    <Link
                        onClick={() => onClick(item.href)}
                        underline="none"
                        sx={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'text.primary',
                            position: 'relative',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontFamily: 'sans-serif ',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                width: '100%',
                                transform: 'scaleX(0)',
                                height: '5px',
                                bottom: -4,
                                left: 0,
                                zIndex: -1,
                                backgroundColor: 'secondary.main',
                                transformOrigin: 'bottom right',
                                transition: 'transform 0.3s ease-out',
                            },
                            '&:focus': {
                                outline: 'none',
                                borderBottom: '2px solid secondary.main',
                            },
                            '&:hover:after': {
                                transform: 'scaleX(1)',
                                transformOrigin: 'bottom left',
                            },
                            '&:hover': {
                                color: 'text.secondary',

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
