import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Avatar,
    IconButton,
    Select,
    MenuItem,
    Tabs,
    Tab,
    AppBar,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Switch,
    CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useClinicContext } from "../../contexts/ClinicContext";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { uploadFile } from "../../services/supabaseService";
import { motion } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";
import dayjs from 'dayjs';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EmojiEmotionsSharp,
    ThumbUpOffAltSharp,
    MedicalServices,
    Star,
    People,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    YouTube,
    X,
} from "@mui/icons-material";
const iconList = [
    { label: "Thumb Up", icon: <ThumbUpOffAltSharp /> },
    { label: "Happy", icon: <EmojiEmotionsSharp /> },
    { label: "Medical", icon: <MedicalServices /> },
    { label: "Star", icon: <Star /> },
    { label: "People", icon: <People /> },
];
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const ManageClinicPage = () => {
    const [clinicInfo, setClinicInfo] = useState({});
    const { clinicInfo: clinic } = useClinicContext();
    const [formData, setFormData] = useState(clinic);
    const [achievement, setAchievement] = useState({ label: { en: "", ar: "" }, description: { en: "", ar: "" }, number: "", icon: "" });
    const [openHours, setOpenHours] = useState({});
    const [onlineTimes, setOnlineTimes] = useState([]);
    const [selectedDay, setSelectedDay] = useState({ day: "", from: "", to: "" });
    const [socialLinks, setSocialLinks] = useState({
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
    });
    const [activeTab, setActiveTab] = useState(0);
    const showSnackBar = useSnackbar();
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {

        fetchClinicInfo();
    }, []);

    const fetchClinicInfo = async () => {
        try {
            const response = await axiosInstance.get("/clinics");
            const data = response.data;
            console.log('Clinic Info:', data);
            setClinicInfo(data);
            setFormData({
                ...data,
                openHours: data.openHours || {},
                achievements: data.achievements || [],
                socialLinks: data.socialLinks || {},
            });
            setOnlineTimes(data.onlineTimes || []);
            setSocialLinks(data.socialLinks || {});
            setOpenHours(data.openHours || {});
        } catch (error) {
            console.error("Error fetching clinic info:", error);
        }
    };

    const updateClinicInfo = async (data) => {
        formData.openHours = openHours;
        formData.onlineTimes = onlineTimes;
        formData.socialLinks = socialLinks;
        try {
            const response = await axiosInstance.put("/clinics", data);
            setClinicInfo(response.data);
        } catch (error) {
            console.error("Error updating clinic info:", error);
        }
    };

    const handleChange = (e, lang = '') => {
        const { name, value } = e.target;
        if (name === "name" || name === "subtitle" || name === "description" || name === "address") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: {
                    ...prevData[name],
                    [lang]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAchievementChange = (e, lang = "en") => {
        const { name, value } = e.target;
        if (name === "label") {
            setAchievement((prev) => ({
                ...prev,
                label: {
                    ...prev.label,
                    [lang]: value
                }
            }));
        } else {
            setAchievement({ ...achievement, [name]: value });
        }
    };

    const handleAddOrEditAchievement = async () => {
        if (!achievement.label.en || !achievement.label.ar || !achievement.description.en || !achievement.description.ar || !achievement.number || !achievement.icon) {
            showSnackBar("All fields are required!", "error");
            return;
        }

        const updatedAchievements = formData.achievements.filter((ach) => ach.label.en !== achievement.label.en);
        updatedAchievements.push(achievement);
        setFormData((prevData) => ({ ...prevData, achievements: updatedAchievements }));
        try {
            await updateClinicInfo({ ...formData, achievements: updatedAchievements });
            showSnackBar("Achievement added successfully!", "success");
        } catch (error) {
            showSnackBar("Failed to add achievement", "error");
        } finally {
            setAchievement({ label: { en: "", ar: "" }, description: { en: "", ar: "" }, number: "", icon: "" });
        }
    };


    const handleRemoveAchievement = (index) => {
        const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
        setFormData((prevData) => ({ ...prevData, achievements: updatedAchievements }));
        updateClinicInfo({ ...formData, achievements: updatedAchievements });
        showSnackBar("Achievement removed successfully!", "info");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClinicInfo(formData);
            showSnackBar("Clinic info updated successfully", "success");

        } catch (error) {
            showSnackBar(error.message, "error");
        }
    };

    const handleUploadImage = async (file, mode) => {
        setIsUploading(true);
        try {
            const data = await uploadFile(file, "images/clinic", `logo-${mode}`);
            setFormData((prevData) => ({
                ...prevData,
                logo: {
                    ...prevData.logo,
                    [mode]: data.fullUrl
                }
            }));
            showSnackBar("Image uploaded successfully", "success");
        } catch (error) {
            showSnackBar("Failed to upload image", "error");
        } finally {
            setIsUploading(false);
        }

    };

    const handleRemoveImage = () => {
        setFormData((prevData) => ({ ...prevData, logo: null }));
        updateClinicInfo({ ...formData, logo: null });
        showSnackBar("Image removed successfully", "info");
    };

    const handleOpenHourChange = (day, field, value) => {
        const updatedOpenHours = { ...formData.openHours, [day]: { ...formData.openHours[day], [field]: value } };
        setFormData((prevData) => ({ ...prevData, openHours: updatedOpenHours }));
    };

    const toggleDayOpen = (day) => {
        const updatedOpenHours = formData.openHours[day].isClosed
            ? { ...formData.openHours[day], isClosed: false }
            : { ...formData.openHours[day], isClosed: true };
        setFormData((prevData) => ({ ...prevData, openHours: { ...prevData.openHours, [day]: updatedOpenHours } }));
    };

    const handleAddOrEditOnlineTime = async () => {
        if (!selectedDay.day || !selectedDay.from || !selectedDay.to) {
            showSnackBar("All fields are required!", "error");
            return;
        }

        const updatedOnlineTimes = onlineTimes.filter((time) => time.day !== selectedDay.day);
        updatedOnlineTimes.push(selectedDay);
        setOnlineTimes(updatedOnlineTimes);
        setFormData((prevData) => ({ ...prevData, onlineTimes: updatedOnlineTimes }));
        try {
            await updateClinicInfo({ ...formData, onlineTimes: updatedOnlineTimes });
            showSnackBar("Online time added successfully!", "success");
        } catch (error) {
            showSnackBar("Failed to add online time", "error");
        } finally {
            setSelectedDay({ day: "", from: "", to: "" });
        }
    };

    const handleDeleteOnlineTime = async (time) => {
        const updatedOnlineTimes = onlineTimes.filter((t) => t.day !== time.day);
        setOnlineTimes(updatedOnlineTimes);
        setFormData((prevData) => ({ ...prevData, onlineTimes: updatedOnlineTimes }));
        try {
            await updateClinicInfo({ ...formData, onlineTimes: updatedOnlineTimes });
            showSnackBar("Online time deleted successfully!", "info");
        } catch (error) {
            showSnackBar("Failed to delete online time", "error");
        }
    };

    const inputFields = [
        { label: "Name", name: "name", value: formData.name?.en, onChange: (e) => handleChange(e, "en") },
        { label: "Name (Arabic)", name: "name", value: formData.name?.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Subtitle", name: "subtitle", value: formData.subtitle?.en, onChange: (e) => handleChange(e, "en") },
        { label: "Subtitle (Arabic)", name: "subtitle", value: formData.subtitle?.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Description", name: "description", value: formData.description?.en, onChange: (e) => handleChange(e, "en") },
        { label: "Description (Arabic)", name: "description", value: formData.description?.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Address", name: "address", value: formData.address?.en, onChange: (e) => handleChange(e, "en") },
        { label: "Address (Arabic)", name: "address", value: formData.address?.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Phone", name: "phone", value: formData.phone, onChange: handleChange },
        { label: "Email", name: "email", value: formData.email, onChange: handleChange },
        { label: "Zip Code", name: "zip", value: formData.zip, onChange: handleChange },
        { label: "Website", name: "website", value: formData.website, onChange: handleChange },
        { label: "Map Link", name: "mapLink", value: formData.mapLink, onChange: handleChange },
        { label: "Primary Contact", name: "primaryContact", value: formData.primaryContact, onChange: handleChange },
        { label: "Secondary Contact", name: "secondaryContact", value: formData.secondaryContact, onChange: handleChange },
        { label: "Emergency Contact", name: "emergencyContact", value: formData.emergencyContact, onChange: handleChange }
    ];

    const socialInput = [
        { label: "Facebook", name: "facebook", value: socialLinks.facebook, onChange: (e) => setSocialLinks({ ...socialLinks, facebook: e.target.value }), icon: <Facebook /> },
        { label: "Twitter", name: "twitter", value: socialLinks.twitter, onChange: (e) => setSocialLinks({ ...socialLinks, twitter: e.target.value }), icon: <Twitter /> },
        { label: "Instagram", name: "instagram", value: socialLinks.instagram, onChange: (e) => setSocialLinks({ ...socialLinks, instagram: e.target.value }), icon: <Instagram /> },
        { label: "LinkedIn", name: "linkedin", value: socialLinks.linkedin, onChange: (e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value }), icon: <LinkedIn /> },
        { label: "YouTube", name: "youtube", value: socialLinks.youtube, onChange: (e) => setSocialLinks({ ...socialLinks, youtube: e.target.value }), icon: <YouTube /> },
        { label: "TikTok", name: "tiktok", value: socialLinks.tiktok, onChange: (e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value }), icon: <X /> },
    ];

    return (
        <Box sx={{ p: 1 }}
        >
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ backgroundColor: "background.default", mb: 2 }}
            >
                <Tab label="Clinic Info" />
                <Tab label="Social Links" />
                <Tab label="Open Hours" />
                <Tab label="Online Times" />
                <Tab label="Achievements" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
                {/* clinic main informations */}
                {
                    activeTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    {/* Light Logo Section */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: { xs: 'center', sm: 'flex-start' },
                                                gap: 2,
                                                mb: 2,
                                                p: 2,
                                                bgcolor: 'background.default',
                                                borderRadius: 2,
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>Light Logo</Typography>
                                            {isUploading && <CircularProgress />}
                                            {!isUploading && (
                                                <Avatar
                                                    src={formData.logo?.light}
                                                    alt="clinic logo light"
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        bgcolor: "#f5f5f5",
                                                        border: '2px solid #333',
                                                        cursor: "pointer",
                                                        transition: 'transform 0.2s',
                                                        "&:hover": { transform: 'scale(1.1)' },
                                                    }}
                                                    onClick={() => document.getElementById("upload-logo-light").click()}
                                                />
                                            )}
                                            <IconButton onClick={() => handleRemoveImage('light')}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <input
                                                type="file"
                                                id="upload-logo-light"
                                                hidden
                                                accept="image/*"
                                                onChange={(event) => handleUploadImage(event.target.files[0], 'light')}
                                            />
                                        </Box>
                                    </Grid>
                                    {/* Dark Logo Section */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: { xs: 'center', sm: 'flex-start' },
                                                gap: 2,
                                                mb: 2,
                                                p: 2,
                                                bgcolor: 'background.default',
                                                borderRadius: 2,
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>Dark Logo</Typography>
                                            {isUploading && <CircularProgress />}
                                            {!isUploading && (
                                                <Avatar
                                                    src={formData.logo?.dark}
                                                    alt="clinic logo dark"
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        bgcolor: "#333",
                                                        border: '2px solid #f5f5f5',
                                                        cursor: "pointer",
                                                        transition: 'transform 0.2s',
                                                        "&:hover": { transform: 'scale(1.1)' },
                                                    }}
                                                    onClick={() => document.getElementById("upload-logo-dark").click()}
                                                />)}
                                            <IconButton onClick={() => handleRemoveImage('dark')}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <input
                                                type="file"
                                                id="upload-logo-dark"
                                                hidden
                                                accept="image/*"
                                                onChange={(event) => handleUploadImage(event.target.files[0], 'dark')}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Dynamic Input Fields */}
                            {inputFields.map((field, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        variant="outlined"
                                        InputProps={{
                                            style: { borderRadius: 8 },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1976d2",
                                            },
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )
                }
                {/* clinic social links */}
                {
                    activeTab === 1 && (
                        <Grid container spacing={2}>
                            {socialInput.map((field, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <Avatar sx={{ mr: 1, bgcolor: "background.paper" }}>{field.icon}</Avatar>
                                            ),
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )
                }

                {/* clinic open hours */}
                {
                    activeTab === 2 && (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {days.map((day) => (
                                <Grid item xs={12} sm={6} md={4} key={day}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            bgcolor: "background.default",
                                            border: "1px solid #ddd",

                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                                                {day}
                                            </Typography>
                                            <Switch
                                                checked={!formData.openHours[day]?.isClosed}
                                                onChange={() => toggleDayOpen(day)}
                                                color="primary"
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                flexDirection: { xs: "column", sm: "row" },
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                disabled={formData.openHours[day]?.isClosed}
                                                label="Open"
                                                value={formData.openHours[day]?.from}
                                                onChange={(e) => handleOpenHourChange(day, "from", e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                            />
                                            <TextField
                                                disabled={formData.openHours[day]?.isClosed}
                                                label="Close"
                                                value={formData.openHours[day]?.to}
                                                onChange={(e) => handleOpenHourChange(day, "to", e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )
                }

                {/* clinic online times */}
                {
                    activeTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {dayjs().format('dddd')} Online Time
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    mb: 2,
                                    borderBottom: "1px solid #ccc",
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: "background.paper",
                                    boxShadow: 1,
                                }}
                            >
                                <Grid item xs={12} sm={4}>
                                    <Select
                                        displayEmpty
                                        name="day"
                                        value={selectedDay.day}
                                        onChange={(e) => setSelectedDay({ ...selectedDay, day: e.target.value })}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Day</em>
                                        </MenuItem>
                                        {days.map((day, index) => (
                                            <MenuItem
                                                key={index}
                                                value={day}
                                                disabled={onlineTimes.some((time) => time.day === day)}
                                            >
                                                {day.charAt(0).toUpperCase() + day.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="From"
                                        name="from"
                                        value={selectedDay.from}
                                        onChange={(e) => setSelectedDay({ ...selectedDay, from: e.target.value })}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="To"
                                        name="to"
                                        value={selectedDay.to}
                                        onChange={(e) => setSelectedDay({ ...selectedDay, to: e.target.value })}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            flexDirection: { xs: "column", sm: "row" },
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddOrEditOnlineTime}
                                            sx={{
                                                py: 1,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {selectedDay.day ? "Edit Online Time" : "Add Online Time"}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => setSelectedDay({ day: "", from: "", to: "" })}
                                            sx={{
                                                py: 1,
                                                fontSize: "1rem",
                                            }}
                                            disabled={!selectedDay.day}
                                        >
                                            Clear
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                Online Times
                            </Typography>
                            <Grid container spacing={2}>
                                {formData.onlineTimes.map((time, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                flexDirection: { xs: "column", sm: "row" },
                                                border: "1px solid #ddd",
                                                borderRadius: 1,
                                                p: 2,
                                                backgroundColor: "background.default",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ mb: { xs: 1, sm: 0 } }}>
                                                <strong>{time.day.charAt(0).toUpperCase() + time.day.slice(1)}</strong>: {time.from} - {time.to}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    flexDirection: { xs: "column", sm: "row" },
                                                    width: { xs: "100%", sm: "auto" },
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteOnlineTime(time)}
                                                    fullWidth
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => setSelectedDay(time)}
                                                    fullWidth
                                                >
                                                    Edit
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )
                }

                {/* clinic achivements */}
                {
                    activeTab === 4 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Add Achievement
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: "background.paper",
                                    boxShadow: 1,
                                }}
                            >
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Label (English)"
                                        name="label"
                                        value={achievement.label.en}
                                        onChange={(e) => handleAchievementChange(e, "en")}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Label (Arabic)"
                                        name="label"
                                        value={achievement.label.ar}
                                        onChange={(e) => handleAchievementChange(e, "ar")}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Description (English)"
                                        name="description"
                                        value={achievement.description.en}
                                        onChange={(e) => handleAchievementChange(e, "en")}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Description (Arabic)"
                                        name="description"
                                        value={achievement.description.ar}
                                        onChange={(e) => handleAchievementChange(e, "ar")}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Number"
                                        name="number"
                                        type="number"
                                        value={achievement.number}
                                        onChange={handleAchievementChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        label="Icon"
                                        name="icon"
                                        value={achievement.icon}
                                        onChange={handleAchievementChange}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Select Icon</em>
                                        </MenuItem>
                                        {iconList.map((option, index) => (
                                            <MenuItem key={index} value={option.label}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Avatar>{option.icon}</Avatar>
                                                    {option.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            flexDirection: { xs: "column", sm: "row" },
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddOrEditAchievement}
                                            sx={{
                                                py: 1,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {achievement.label.en ? "Edit Achievement" : "Add Achievement"}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<ClearIcon />}
                                            onClick={() => setAchievement({ label: { en: "", ar: "" }, description: { en: "", ar: "" }, number: "", icon: "" })}
                                            sx={{
                                                py: 1,
                                                fontSize: "1rem",
                                            }}
                                            disabled={!achievement.label.en}
                                        >
                                            Clear
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 4 }}>
                                Achievements
                            </Typography>
                            <List
                                sx={{
                                    maxHeight: 300,
                                    overflowY: "auto",
                                    border: "1px solid #ddd",
                                    borderRadius: 1,
                                    p: 1,
                                    backgroundColor: "background.default",
                                }}
                            >
                                {formData.achievements.map((ach, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: "flex-start",
                                            gap: 2,
                                            p: 1,
                                            mb: 1,
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {ach.label.en} - {ach.label.ar}
                                                </Typography>
                                            }
                                            secondary={`Number: ${ach.number}`}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleRemoveAchievement(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="primary"
                                                onClick={() => setAchievement(ach)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )
                }

                <Box mt={4}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Save Changes
                    </Button>
                </Box>
            </Box >
        </Box >
    );
};

export default ManageClinicPage;
