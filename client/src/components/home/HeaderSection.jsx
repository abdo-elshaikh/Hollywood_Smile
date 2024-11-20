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
} from '@mui/material';
import { DarkModeOutlined, LightModeOutlined, Menu as MenuIcon, Settings } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import EnglishIcon from '../../assets/flags/english.svg';
import ArabicIcon from '../../assets/flags/arabic.svg';
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
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null); // State for menu anchor
    const [isScrolled, setIsScrolled] = useState(false);

    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';

    // Handle scroll event to adjust header styles
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);
    const handleLanguageChange = (newLanguage) => {
        i18n.changeLanguage(newLanguage);
        closeMobileMenu();
    };
    const handleThemeToggle = () => toggleMode();

    const handleAdminMenuClick = (event) => {
        setAdminMenuAnchor(event.currentTarget);
        setAdminMenuOpen(true);
    };
    const closeAdminMenu = () => setAdminMenuOpen(false);

    const menuItems = [
        { label: t('app.home'), href: '/' },
        { label: t('app.about'), href: '/about-us' },
        { label: t('app.services'), href: '/services' },
        { label: t('app.doctors'), href: '/doctors' },
        { label: t('app.gallery'), href: '/gallery' },
        { label: t('app.blog'), href: '/blog' },
        { label: t('app.contactUs'), href: '/contact-us' },
    ];

    const handleLogin = () => {
        navigate('/auth/login');
        closeMobileMenu();
    };

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
        closeMobileMenu();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                sx={{
                    transition: 'background 0.3s ease',
                    bgcolor: isScrolled ? 'background.paper' : 'transparent',
                    color: 'text.primary',
                    boxShadow: isScrolled ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link href="/" underline="none" sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                            {clinicInfo.logo && (
                                <Avatar
                                    src={isDark ? clinicInfo.logo.dark : clinicInfo.logo.light}
                                    alt={clinicInfo?.name.en}
                                    sx={{ width: 60, height: 60, objectFit: 'contain' }}
                                />
                            )}
                            <Box sx={{ ml: 1, display: { md: 'none', lg: 'block' } }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'Segoe UI' }}>
                                    {isArabic ? clinicInfo.name.ar : clinicInfo.name.en}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Poppins', color: 'subtitle.main' }}>
                                    {isArabic ? clinicInfo.subtitle.ar : clinicInfo.subtitle.en}
                                </Typography>
                            </Box>
                        </Link>

                        {/* Desktop Menu */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                            {menuItems.map((item, index) => (
                                <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                                    <Link
                                        onClick={() => navigate(item.href)}
                                        underline="none"
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: isDark ? '#fff' : '#000',
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
                            {/* Language and Theme Toggle Buttons */}
                            <Tooltip title={isArabic ? 'ترجم إلى الإنجليزية' : 'Translate to Arabic'}>
                                <IconButton onClick={() => handleLanguageChange(isArabic ? 'en' : 'ar')}>
                                    <img src={isArabic ? EnglishIcon : ArabicIcon} alt={isArabic ? 'en' : 'ar'} style={{ width: 24, height: 24 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={isDark ? (isArabic ? 'الوضع النهاري' : 'Light Mode') : (isArabic ? 'الوضع الليلى' : 'Dark Mode')}>
                                <IconButton onClick={handleThemeToggle} aria-label="Toggle theme">
                                    {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
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
                                        <Settings />
                                    </IconButton>
                                </Tooltip>
                            )}
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
                                {user && user.role === 'admin' && (
                                    <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>{t('app.adminDashboard')}</MenuItem>
                                )}
                                <MenuItem sx={{ cursor: 'pointer' }} onClick={() => navigate('/blog-dashboard')}>{t('app.blogDashboard')}</MenuItem>
                                <MenuItem sx={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }} onClick={handleLogout}>{t('app.logout')}</MenuItem>
                            </Menu>
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
                            anchor="right"
                            open={mobileMenuOpen}
                            onClose={closeMobileMenu}
                        >
                            <Box sx={{ width: 250 }}>
                                <List>
                                    {menuItems.map((item, index) => (
                                        <ListItem button key={index} onClick={() => { navigate(item.href); closeMobileMenu(); }}>
                                            <ListItemText primary={item.label} />
                                        </ListItem>
                                    ))}

                                    <ListItem
                                        button
                                        sx={{ cursor: 'pointer', display: user?.role === 'admin' ? 'block' : 'none' }}
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <ListItemText primary={t('app.adminDashboard')} />
                                    </ListItem>

                                    <ListItem
                                        button
                                        sx={{ cursor: 'pointer', display: user?.role !== 'visitor' ? 'block' : 'none' }}
                                        onClick={() => navigate('/blog-dashboard')}
                                    >
                                        <ListItemText primary={t('app.blogDashboard')} />
                                    </ListItem>

                                    <ListItem button onClick={() => { handleLanguageChange(isArabic ? 'en' : 'ar'); }}>
                                        <ListItemText primary={isArabic ? 'English' : 'عربى'} />
                                    </ListItem>

                                    <ListItem button onClick={handleThemeToggle}>
                                        <ListItemText primary={isDark ? 'Light Mode' : 'Dark Mode'} />
                                    </ListItem>

                                    <ListItem button onClick={user ? handleLogout : handleLogin}>
                                        <ListItemText primary={user ? t('app.logout') : t('app.login')} />
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default HeaderSection;
