import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Grid,
    Divider,
    Alert,
} from '@mui/material';
import axiosInstance from '../../services/axiosInstance';

const ThemeCustomizationPage = () => {
    const [value, setValue] = useState(0); // 0 for Light Mode, 1 for Dark Mode
    const [alertMessage, setAlertMessage] = useState('');

    // Initialize theme settings with state
    const [lightModeSettings, setLightModeSettings] = useState({
        palette: {},
        typography: {},
        shadows: [],
        borderRadius: 0,
        spacing: 0,
    });
    
    const [darkModeSettings, setDarkModeSettings] = useState({
        palette: {},
        typography: {},
        shadows: [],
        borderRadius: 0,
        spacing: 0,
    });

    // Load existing theme settings (mocked API call)
    useEffect(() => {
        const fetchThemeSettings = async () => {
            try {
                const response = await axiosInstance.get('/theme-settings');
                const lightTheme = response.data.find(theme => theme.mode === 'light');
                const darkTheme = response.data.find(theme => theme.mode === 'dark');

                if (lightTheme) {
                    setLightModeSettings(lightTheme);
                }
                if (darkTheme) {
                    setDarkModeSettings(darkTheme);
                }
            } catch (error) {
                setAlertMessage('Failed to load theme settings.');
                console.error(error);
            }
        };

        fetchThemeSettings();
    }, []);

    // State to hold current mode's settings
    const currentSettings = value === 0 ? lightModeSettings : darkModeSettings;

    // Handle input changes for colors, typography, shadows, border radius, and spacing
    const handleColorChange = (event) => {
        const { name, value } = event.target;
        if (value === 0) {
            setLightModeSettings((prev) => ({
                ...prev,
                palette: { ...prev.palette, [name]: value }
            }));
        } else {
            setDarkModeSettings((prev) => ({
                ...prev,
                palette: { ...prev.palette, [name]: value }
            }));
        }
    };

    const handleTypographyChange = (event) => {
        const { name, value } = event.target;
        if (value === 0) {
            setLightModeSettings((prev) => ({
                ...prev,
                typography: { ...prev.typography, [name]: value }
            }));
        } else {
            setDarkModeSettings((prev) => ({
                ...prev,
                typography: { ...prev.typography, [name]: value }
            }));
        }
    };

    const handleShadowsChange = (event) => {
        const { value } = event.target;
        if (value === 0) {
            setLightModeSettings((prev) => ({
                ...prev,
                shadows: value.split(',')
            }));
        } else {
            setDarkModeSettings((prev) => ({
                ...prev,
                shadows: value.split(',')
            }));
        }
    };

    const handleBorderRadiusChange = (event) => {
        const value = event.target.value;
        if (value === 0) {
            setLightModeSettings((prev) => ({
                ...prev,
                borderRadius: value
            }));
        } else {
            setDarkModeSettings((prev) => ({
                ...prev,
                borderRadius: value
            }));
        }
    };

    const handleSpacingChange = (event) => {
        const value = event.target.value;
        if (value === 0) {
            setLightModeSettings((prev) => ({
                ...prev,
                spacing: value
            }));
        } else {
            setDarkModeSettings((prev) => ({
                ...prev,
                spacing: value
            }));
        }
    };

    // Save updated theme settings
    const handleSave = async () => {
        const mode = value === 0 ? 'light' : 'dark';
        const settingsToSave = mode === 'light' ? lightModeSettings : darkModeSettings;

        try {
            await axiosInstance.put(`/theme-settings/${mode}`, settingsToSave);
            setAlertMessage('Theme colors and settings saved successfully!');
        } catch (error) {
            setAlertMessage('Failed to save theme colors and settings.');
            console.error(error);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box p={3}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={6} p={4} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Customize Theme Colors and Settings
                    </Typography>
                    <Tabs value={value} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Light Mode" />
                        <Tab label="Dark Mode" />
                    </Tabs>
                    <Divider sx={{ my: 2 }} />

                    {alertMessage && (
                        <Alert severity={alertMessage.includes('successfully') ? 'success' : 'error'}>
                            {alertMessage}
                        </Alert>
                    )}

                    {/* Color Customization */}
                    {Object.keys(currentSettings.palette).map((colorKey) => (
                        <Box mt={2} key={colorKey}>
                            <Typography variant="h6" gutterBottom>
                                {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} Color
                            </Typography>
                            <TextField
                                name={colorKey}
                                type="color"
                                value={currentSettings.palette[colorKey]}
                                onChange={handleColorChange}
                                variant="outlined"
                                fullWidth
                                sx={{ backgroundColor: 'transparent' }}
                            />
                        </Box>
                    ))}

                    {/* Typography Customization */}
                    <Typography variant="h6" gutterBottom>
                        Typography
                    </Typography>
                    {Object.keys(currentSettings.typography).map((typographyKey) => (
                        <TextField
                            key={typographyKey}
                            name={typographyKey}
                            label={typographyKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            value={currentSettings.typography[typographyKey]}
                            onChange={handleTypographyChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                    ))}

                    {/* Shadows Customization */}
                    <Typography variant="h6" gutterBottom>
                        Shadows (comma separated)
                    </Typography>
                    <TextField
                        label="Shadows"
                        value={currentSettings.shadows.join(', ')}
                        onChange={handleShadowsChange}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    {/* Border Radius and Spacing Customization */}
                    <TextField
                        label="Border Radius"
                        type="number"
                        value={currentSettings.borderRadius}
                        onChange={handleBorderRadiusChange}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Spacing"
                        type="number"
                        value={currentSettings.spacing}
                        onChange={handleSpacingChange}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    {/* Save Button */}
                    <Button variant="contained" onClick={handleSave} fullWidth>
                        Save Changes
                    </Button>
                </Grid>

                {/* Preview Theme */}
                <Grid item xs={12} md={6} p={4} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Theme Preview
                    </Typography>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: currentSettings.borderRadius,
                            backgroundColor: currentSettings.palette.background.default,
                            color: currentSettings.palette.text.primary,
                            boxShadow: currentSettings.shadows[4],
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Heading 6
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Body 1
                        </Typography>
                        <Button variant="contained" color="primary">
                            Primary Button
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ThemeCustomizationPage;
