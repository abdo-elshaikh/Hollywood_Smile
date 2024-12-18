import React, { useState, useEffect } from "react";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import {
    Box,
    Button,
    FormControl,
    Typography,
    Container,
    Card,
    Divider,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Tooltip,
    TextField,
    IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { motion } from "framer-motion";

// Main Customization Panel Component
const CustomizationPanel = () => {
    // Access theme context values and functions
    const { mode, toggleMode, updateColors, colors, resetTheme } = useCustomTheme();
    const showSnackbar = useSnackbar();

    // Local states for color inputs
    const [primaryColor, setPrimaryColor] = useState(colors.primary);
    const [secondaryColor, setSecondaryColor] = useState(colors.secondary);
    const [textColor, setTextColor] = useState(colors.text);
    const [titleColor, setTitleColor] = useState(colors.title);
    const [backgroundColor, setBackgroundColor] = useState(colors.background);
    const [borderColor, setBorderColor] = useState(colors.border);
    const [shadowColor, setShadowColor] = useState(colors.shadow);
    const [subtitleColor, setSubtitleColor] = useState(colors.subtitle);
    const [backgroundPaperColor, setBackgroundPaperColor] = useState(colors.paper);

    // Sync local states with the current theme context colors
    useEffect(() => {
        setPrimaryColor(colors.primary);
        setSecondaryColor(colors.secondary);
        setTextColor(colors.text);
        setTitleColor(colors.title);
        setBackgroundColor(colors.background);
        setBorderColor(colors.border);
        setShadowColor(colors.shadow);
        setSubtitleColor(colors.subtitle);
        setBackgroundPaperColor(colors.paper);
    }, [colors, mode]);

    // Handle changes for color pickers
    const handleColorChange = (setter) => (e) => {
        setter(e.target.value);
    };

    // Apply changes to theme
    const applyThemeColors = async () => {
        try {
            await updateColors({
                primary: primaryColor,
                secondary: secondaryColor,
                text: textColor,
                title: titleColor,
                background: backgroundColor,
                border: borderColor,
                shadow: shadowColor,
                subtitle: subtitleColor,
                default: backgroundPaperColor,
                paper: backgroundPaperColor,
            });
            showSnackbar("Theme colors applied successfully", "success");
        } catch (error) {
            showSnackbar("Failed to apply theme colors", "error");
        }
    };

    // Reset the theme to default colors based on the mode
    const resetThemeColors = () => {
        resetTheme();
        showSnackbar("Theme colors reset successfully", "success");
    };

    // Color inputs data
    const colorInputs = [
        { label: "Primary Color", value: primaryColor, setter: setPrimaryColor },
        { label: "Secondary Color", value: secondaryColor, setter: setSecondaryColor },
        { label: "Text Color", value: textColor, setter: setTextColor },
        { label: "Title Color", value: titleColor, setter: setTitleColor },
        { label: "Background Color", value: backgroundColor, setter: setBackgroundColor },
        { label: "Border Color", value: borderColor, setter: setBorderColor },
        { label: "Shadow Color", value: shadowColor, setter: setShadowColor },
        { label: "Subtitle Color", value: subtitleColor, setter: setSubtitleColor },
        { label: "Background Paper Color", value: backgroundPaperColor, setter: setBackgroundPaperColor },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* Control Panel */}
                <Grid item md={6} sm={12}>
                    <Card sx={{ p: 4, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                            Customization Control Panel
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {/* Theme Mode Toggle */}
                        <Box sx={{ mb: 3 }}>
                            <FormControl component="fieldset">
                                <Typography variant="subtitle1" gutterBottom>
                                    Select Theme Mode:
                                </Typography>
                                <RadioGroup row value={mode} onChange={toggleMode}>
                                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* Color Inputs */}
                        <Grid container spacing={2}>
                            {colorInputs.map((colorInput, index) => (
                                <Grid item xs={6} key={index}>
                                    <TextField
                                        type="color"
                                        label={colorInput.label}
                                        variant="outlined"
                                        fullWidth
                                        value={colorInput.value}
                                        onChange={handleColorChange(colorInput.setter)}
                                        inputProps={{
                                            startAdornment: (
                                                <IconButton sx={{ p: 0 }}>
                                                    <ColorLensIcon />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                            <Tooltip title="Save Theme">
                                <Button variant="contained" color="success" onClick={applyThemeColors} startIcon={<SaveIcon />}>
                                    Save
                                </Button>
                            </Tooltip>
                            <Tooltip title="Reset Theme">
                                <Button variant="contained" color="error" onClick={resetThemeColors} startIcon={<RestoreIcon />}>
                                    Reset
                                </Button>
                            </Tooltip>
                        </Box>
                    </Card>
                </Grid>

                {/* Preview Section */}
                <Grid item md={6} sm={12}>
                    <Card
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            p: 4,
                            boxShadow: `0 4px 10px ${shadowColor}`,
                            border: `2px solid ${borderColor}`,
                            backgroundColor: backgroundColor,
                            color: textColor,
                            borderRadius: "12px",
                            height: "100%",
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ color: primaryColor, textAlign: "center" }}>
                            Live Theme Preview
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <Typography variant="h4" sx={{ color: titleColor }} gutterBottom>
                                Welcome to Theme Preview
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: subtitleColor }} gutterBottom>
                                This section dynamically reflects your customizations in real-time.
                            </Typography>
                            <Typography variant="body1" sx={{ color: textColor }} gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer
                                malesuada, nisl nec interdum aliquet, turpis orci ullamcorper nunc, id
                                sollicitudin sapien nunc vel metus.
                            </Typography>

                            <Divider sx={{ mt: 2, mb: 3, color: borderColor }} />

                            <Button variant="contained" sx={{ mt: 3, backgroundColor: primaryColor, color: "white" }}>
                                Primary Button
                            </Button>
                            <Button variant="contained" sx={{ mt: 3, ml: 2, backgroundColor: secondaryColor, color: "white" }}>
                                Secondary Button
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                textAlign: "center",
                                backgroundColor: backgroundPaperColor,
                                py: 3, border: `1px solid ${borderColor}`
                            }}
                        >
                            <Typography variant="h5" sx={{ color: secondaryColor }} gutterBottom>
                                Enjoy the Customization!
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CustomizationPanel;
