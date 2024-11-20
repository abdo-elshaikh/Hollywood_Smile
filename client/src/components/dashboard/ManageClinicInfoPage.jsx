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
    Switch
} from "@mui/material";
import { useClinicContext } from "../../contexts/ClinicContext";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import fileService from "../../services/fileService";
import { motion } from "framer-motion";
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
    const { clinicInfo, updateClinicInfo } = useClinicContext();
    const [formData, setFormData] = useState({
        ...clinicInfo,
        openHours: clinicInfo.openHours || {},
        achievements: clinicInfo.achievements || [],
        socialLinks: clinicInfo.socialLinks || {},
    });
    const [achievement, setAchievement] = useState({ label: { en: "", ar: "" }, description: { en: "", ar: "" }, number: "", icon: "" });
    const [openHours, setOpenHours] = useState({});
    const [onlineTimes, setOnlineTimes] = useState([]);
    const [selectedDay, setSelectedDay] = useState("");
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
        setFormData({ ...clinicInfo });
        setOpenHours(clinicInfo.openHours || {});
        setOnlineTimes(clinicInfo.onlineTimes || []);
        setAchievement({ label: { en: "", ar: "" }, description: { en: "", ar: "" }, number: "", icon: "" });
    }, [clinicInfo]);

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

    const handleAddAchievement = () => {
        if (!achievement.label.en || !achievement.label.ar || !achievement.number || !achievement.icon) {
            showSnackBar("All fields are required!", "error");
            return;
        }

        const updatedAchievements = [...formData.achievements, achievement];
        setFormData((prevData) => ({ ...prevData, achievements: updatedAchievements }));
        updateClinicInfo({ ...formData, achievements: updatedAchievements });
        setAchievement({ label: { en: "", ar: "" }, number: "", icon: "" });
        showSnackBar("Achievement added successfully!", "success");
    };

    const handleEditAchievement = () => {
        const updatedAchievements = formData.achievements.map((ach) => {
            if (ach.label.en === achievement.label.en) {
                return achievement;
            }
            return ach;
        });
        setFormData((prevData) => ({ ...prevData, achievements: updatedAchievements }));
        updateClinicInfo({ ...formData, achievements: updatedAchievements });
        setAchievement({ label: { en: "", ar: "" }, number: "", icon: "" });
        showSnackBar("Achievement updated successfully!", "info");
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
            const data = await updateClinicInfo(formData);
            if (data.success) {
                showSnackBar("Clinic info updated successfully", "success");
            } else {
                showSnackBar(data.message, "error");
            }
        } catch (error) {
            showSnackBar(error.message, "error");
        }
    };

    const handleUploadImage = (file, mode) => {
        setIsUploading(true);
        fileService.uploadFile(file, "images/clinics/logo")
            .then((data) => {
                setFormData((prevData) => ({ ...prevData, logo: { ...prevData.logo, [mode]: data.url } }));
                updateClinicInfo({ ...formData, logo: { ...formData.logo, [mode]: data.url } });
                showSnackBar("Image uploaded successfully", "success");
            })
            .catch((error) => showSnackBar(error.message, "error"))
            .finally(() => setIsUploading(false));
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

    const handleOnlineTimeChange = (e) => {
        const { name, value } = e.target;
        setOnlineTimes((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrEditOnlineTime = () => {
        if (!onlineTimes.day || !onlineTimes.from || !onlineTimes.to) {
            showSnackBar("All fields are required!", "error");
            return;
        }

        const updatedOnlineTimes = formData.onlineTimes.map((time) => {
            if (time.day === onlineTimes.day) {
                return onlineTimes;
            }
            return time;
        });

        if (!formData.onlineTimes.some((time) => time.day === onlineTimes.day)) {
            updatedOnlineTimes.push(onlineTimes);
        }

        setFormData((prevData) => ({ ...prevData, onlineTimes: updatedOnlineTimes }));
        updateClinicInfo({ ...formData, onlineTimes: updatedOnlineTimes });
        setOnlineTimes({ day: "", from: "", to: "" });
        showSnackBar("Online time added successfully!", "success");
    };

    const handleDeleteOnlineTime = (day) => {
        const updatedOnlineTimes = formData.onlineTimes.filter((time) => time.day !== day);
        setFormData((prevData) => ({ ...prevData, onlineTimes: updatedOnlineTimes }));
        updateClinicInfo({ ...formData, onlineTimes: updatedOnlineTimes });
        showSnackBar("Online time removed successfully!", "info");
    };

    const handleEditOnlineTime = (time) => {
        setOnlineTimes(time);
        setSelectedDay(time.day);
    };

    const inputFields = [
        { label: "Name", name: "name", value: formData.name.en, onChange: (e) => handleChange(e, "en") },
        { label: "Name (Arabic)", name: "name", value: formData.name.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Subtitle", name: "subtitle", value: formData.subtitle.en, onChange: (e) => handleChange(e, "en") },
        { label: "Subtitle (Arabic)", name: "subtitle", value: formData.subtitle.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Description", name: "description", value: formData.description.en, onChange: (e) => handleChange(e, "en") },
        { label: "Description (Arabic)", name: "description", value: formData.description.ar, onChange: (e) => handleChange(e, "ar") },
        { label: "Address", name: "address", value: formData.address.en, onChange: (e) => handleChange(e, "en") },
        { label: "Address (Arabic)", name: "address", value: formData.address.ar, onChange: (e) => handleChange(e, "ar") },
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
        { label: "Facebook", name: "facebook", icon: <Facebook color={'primary'} />, value: socialLinks.facebook, onChange: (e) => setSocialLinks({ ...socialLinks, facebook: e.target.value }) },
        { label: "Twitter", name: "twitter", icon: <Twitter color={'primary'} />, value: socialLinks.twitter, onChange: (e) => setSocialLinks({ ...socialLinks, twitter: e.target.value }) },
        { label: "Instagram", name: "instagram", icon: <Instagram color={'primary'} />, value: socialLinks.instagram, onChange: (e) => setSocialLinks({ ...socialLinks, instagram: e.target.value }) },
        { label: "LinkedIn", name: "linkedin", icon: <LinkedIn color={'primary'} />, value: socialLinks.linkedin, onChange: (e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value }) },
        { label: "YouTube", name: "youtube", icon: <YouTube color={'primary'} />, value: socialLinks.youtube, onChange: (e) => setSocialLinks({ ...socialLinks, youtube: e.target.value }) },
        { label: "TikTok", name: "tiktok", icon: <X color={'primary'} />, value: socialLinks.tiktok, onChange: (e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value }) }
    ];

    return (
        <Box sx={{ p: 4 }}
        >
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
                Manage Clinic Information
            </Typography>

            <AppBar component="div" position="static" sx={{ mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    variant="fullWidth"
                    sx={{ backgroundColor: "background.default" }}
                >
                    <Tab label="Clinic Info" />
                    <Tab label="Social Links" />
                    <Tab label="Open Hours" />
                    <Tab label="Online Times" />
                    <Tab label="Achievements" />
                </Tabs>
            </AppBar>

            <form onSubmit={handleSubmit}>
                {/* upload Logo */}

                {/* clinic main informations */}
                {
                    activeTab === 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ mr: 2 }}>Light Logo</Typography>
                                    <Avatar
                                        src={formData.logo.light}
                                        alt="clinic logo light"
                                        sx={{ width: 100, height: 100, bgcolor: "#ffff", border: '2px solid #333', mb: 2, cursor: "pointer" }}
                                        htmlFor="upload-logo-light"
                                        onClick={() => document.getElementById("upload-logo-light").click()}
                                    />
                                    <IconButton onClick={handleRemoveImage} sx={{ ml: 2 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <input
                                        type="file"
                                        id="upload-logo-light"
                                        hidden
                                        accept="image/*"
                                        onChange={(event) => handleUploadImage(event.target.files[0], 'light')}
                                        style={{ display: "none" }}
                                    />
                                </Box>

                                <Box style={{ border: "1px solid #ccc", width: 0, height: 100 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ mr: 2 }}>Dark Logo</Typography>
                                    <Avatar
                                        src={formData.logo.dark}
                                        alt="clinic logo dark"
                                        sx={{ width: 100, height: 100, bgcolor: "#333", border: '2px solid #f5f5f5', mb: 2, cursor: "pointer" }}
                                        htmlFor="upload-logo-dark"
                                        onClick={() => document.getElementById("upload-logo-dark").click()}
                                    />
                                    <IconButton onClick={handleRemoveImage} sx={{ ml: 2 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <input
                                        type="file"
                                        id="upload-logo-dark"
                                        hidden
                                        accept="image/*"
                                        onChange={(event) => handleUploadImage(event.target.files[0], 'dark')}
                                        style={{ display: "none" }}
                                    />
                                </Box>
                            </Grid>
                            {inputFields.map((field, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        variant="outlined"
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
                        <List>
                            {days.map((day) => (
                                <ListItem key={day}>
                                    <ListItemText primary={day.charAt(0).toUpperCase() + day.slice(1)} />
                                    <Switch
                                        checked={!formData.openHours[day]?.isClosed}
                                        onChange={() => toggleDayOpen(day)}
                                    />
                                    <TextField
                                        disabled={formData.openHours[day]?.isClosed}
                                        label="Open"
                                        // type="time"
                                        value={formData.openHours[day]?.from || ""}
                                        onChange={(e) => handleOpenHourChange(day, "from", e.target.value)}
                                    />
                                    <TextField
                                        disabled={formData.openHours[day]?.isClosed}
                                        label="Close"
                                        // type="time"
                                        value={formData.openHours[day]?.to || ""}
                                        onChange={(e) => handleOpenHourChange(day, "to", e.target.value)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )
                }

                {/* clinic online times */}
                {
                    activeTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Add Online Time
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 2, borderBottom: "1px solid #ccc", p: 2, backgroundColor: "background.paper" }}>
                                <Grid item xs={12} sm={4}>
                                    <Select
                                        label="Day"
                                        displayEmpty
                                        name="day"
                                        value={onlineTimes.day}
                                        onChange={handleOnlineTimeChange}
                                        fullWidth
                                    >
                                        <MenuItem value=""><em>Select Day</em></MenuItem>
                                        {days.map((day, index) => (
                                            <MenuItem key={index} value={day}>
                                                {day.charAt(0).toUpperCase() + day.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="From"
                                        name="from"
                                        value={onlineTimes.from}
                                        onChange={handleOnlineTimeChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="To"
                                        name="to"
                                        value={onlineTimes.to}
                                        onChange={handleOnlineTimeChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddOrEditOnlineTime}
                                        fullWidth
                                    >
                                        Add Online Time
                                    </Button>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                                Online Times
                            </Typography>
                            <Grid container spacing={2}>
                                {formData.onlineTimes.map((time, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography>
                                                {time.day.charAt(0).toUpperCase() + time.day.slice(1)}: {time.from} - {time.to}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteOnlineTime(time.day)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditOnlineTime(time)}
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
                            <Grid container spacing={2}>
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
                                    >
                                        {iconList.map((option, index) => (
                                            <MenuItem key={index} value={option.label}>
                                                <Avatar sx={{ mr: 1 }}>{option.icon}</Avatar> | {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddAchievement}
                                        fullWidth
                                    >
                                        Add Achievement
                                    </Button>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 4 }}>
                                Achievements
                            </Typography>
                            <List>
                                {formData.achievements.map((ach, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`${ach.label.en} - ${ach.label.ar}`} secondary={ach.number} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleRemoveAchievement(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton edge="end" onClick={() => setAchievement(ach)}>
                                                <EditIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
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
            </form >
        </Box >
    );
};

export default ManageClinicPage;
