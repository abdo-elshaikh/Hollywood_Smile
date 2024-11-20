import React, { useEffect, useState } from 'react';
import { Box, Button, Menu, MenuItem, Tooltip, IconButton } from '@mui/material';
import { Language } from '@mui/icons-material';

const GoogleTranslate = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        // Load the Google Translate script
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        // Initialize Google Translate
        window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);

    const googleTranslateElementInit = () => {
        new google.translate.TranslateElement(
            {
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                includedLanguages: 'ar,en,fr,de,es',
            },
            'google_translate_element'
        );
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            selectElement.value = lang; // Set the selected language
            selectElement.dispatchEvent(new Event('change')); // Trigger the change event
        }
        handleMenuClose();
    };

    return (
        <Box>
            {/* <IconButton
                id="language-button"
                aria-controls={anchorEl ? 'language-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                onClick={handleMenuOpen}
            >
                <Tooltip title="Translate">
                    <Language />
                </Tooltip>
            </IconButton>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleLanguageChange('ar')}>عربي</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('fr')}>Français</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('de')}>Deutsch</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('es')}>Español</MenuItem>
            </Menu> */}
            {/* Hide the Google Translate element */}
            <div id="google_translate_element"></div>
        </Box>
    );
};

export default GoogleTranslate;
