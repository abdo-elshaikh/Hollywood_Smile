import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';

const ThemeToggleButton = () => {
    const { mode, toggleMode } = useCustomTheme();
    const isDarkMode = mode === 'dark';

    return (
        <Box
            component={motion.div}
            onClick={toggleMode}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.2 }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '80px',
                height: '35px',
                backgroundColor: 'background.default',
                borderRadius: '20px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isDarkMode ? 'gray' : 'black',
                marginRight: 2,
            }}
        >
            <motion.div
                animate={{ x: isDarkMode ? 22 : -22 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{
                    borderRadius: '50%',
                    position: 'absolute',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '32px',
                    height: '32px',
                }}
            >
                <Tooltip title={isDarkMode ? 'Light MOde' : 'Dark Mode'} arrow>
                    {isDarkMode ? '🌜' : '🌞'}
                </Tooltip>
            </motion.div>
        </Box>
    );
};

export default ThemeToggleButton;
