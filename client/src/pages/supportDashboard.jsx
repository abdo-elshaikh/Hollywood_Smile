import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomTheme} from '../contexts/ThemeProvider';
import {Box, Typography, Button, Container} from '@mui/material';
import {motion} from 'framer-motion';



const supportDashboard = () => {
    const {t, i18n} = useTranslation();
    const {mode} = useCustomTheme();
    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';

}

export default supportDashboard;