import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    AccountCircle as AccountIcon,
    Brightness4 as DarkModeIcon,
    ExitToApp as LogoutIcon,
    LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useAuth } from '../../contexts/AuthContext';

const SettingsMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { mode, toggleMode } = useCustomTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isDarkMode = mode === 'dark';

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const onToggleDarkMode = () => {
        toggleMode();
        handleCloseMenu();
    }

    const onProfileClick = () => {
        navigate('/dashboard/profile');
        handleCloseMenu();
    }

    const onLogout = () => {
        logout();
        handleCloseMenu();
    }

    return (
        <>
            <Tooltip title="Settings" arrow>
                <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleOpenMenu}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                    elevation: 3,
                    sx: { mt: 1, width: 200 },
                }}
            >
                {/* Profile Option */}
                <MenuItem onClick={onProfileClick}>
                    <ListItemIcon>
                        <AccountIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </MenuItem>

                {/* Dark Mode Option */}
                <MenuItem onClick={onToggleDarkMode}>
                    <ListItemIcon>
                        {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
                </MenuItem>
                {/* Logout Option */}
                <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default SettingsMenu;
