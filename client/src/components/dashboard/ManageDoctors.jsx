import { useEffect, useState } from 'react';
import {
    Paper, Button, Dialog, Box, Container,
    DialogActions, DialogContent, DialogTitle,
    TextField, CircularProgress, Typography, IconButton,
    Grid, Switch, Tooltip, List, ListItem, ListItemText, ListItemAvatar,
    useTheme, useMediaQuery, Avatar, ListItemSecondaryAction,
    Tabs, Tab, AppBar, Select, MenuItem, FormControl, InputLabel, Rating
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import doctorService from '../../services/doctorService';
import { uploadFile, replaceFile, deleteFile } from '../../services/supabaseService';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import ConfirmationDialog from "../common/ConfirmationDialog";

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [doctorData, setDoctorData] = useState({
        name: { ar: '', en: '' },
        position: { ar: '', en: '' },
        description: { ar: '', en: '' },
        imageUrl: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
        },
        email: '',
        phone: '',
        address: '',
        isActive: true,
        workingHours: [
            { day: 'Sunday', startTime: '', endTime: '' },
            { day: 'Monday', startTime: '', endTime: '' },
            { day: 'Tuesday', startTime: '', endTime: '' },
            { day: 'Wednesday', startTime: '', endTime: '' },
            { day: 'Thursday', startTime: '', endTime: '' },
            { day: 'Friday', startTime: '', endTime: '' },
            { day: 'Saturday', startTime: '', endTime: '' },
        ],
        rating: [],
    });
    const [newWorkingHour, setNewWorkingHour] = useState({ day: '', startTime: '', endTime: '' });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [uploading, setUploading] = useState(false);
    const showSnackbar = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchDoctors();
    }, []);

    const ratingNames = {
        'work skills': { ar: 'مهارات العمل', en: 'Work Skills' },
        'communication skills': { ar: 'مهارات الاتصال', en: 'Communication Skills' },
        'punctuality': { ar: 'الانضباط', en: 'Punctuality' },
        'cleanliness': { ar: 'النظافة', en: 'Cleanliness' },
        'professionalism': { ar: 'الاحترافية', en: 'Professionalism' },
        'overall experience': { ar: 'التجربة العامة', en: 'Overall Experience' },
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const doctors = await doctorService.fetchDoctors();
            console.log('doctors:', doctors);
            setDoctors(doctors);
        } catch (error) {
            console.error(error);
            showSnackbar(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = () => {
        setOpen(true);
        setDoctorId(null);
        setDoctorData({
            name: { ar: '', en: '' },
            position: { ar: '', en: '' },
            description: { ar: '', en: '' },
            imageUrl: '',
            email: '',
            phone: '',
            address: '',
            socialLinks: {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: '',
            },
            workingHours: [],
            isActive: true,
            rating: [],
        });
    };

    const createOrUpdateDoctor = async () => {
        if (!doctorData) {
            showSnackbar('Doctor data is missing', 'error');
            return;
        }

        setLoading(true);
        try {
            if (doctorId) {
                if (!doctorData.rating) {
                    doctorData.rating = [];
                }
                if (doctorData.rating.length !== Object.keys(ratingNames).length) {
                    Object.keys(ratingNames).forEach((name) => {
                        if (!doctorData.rating.some((rating) => rating.name === name)) {
                            doctorData.rating.push({ name, stars: 0 });
                        }
                    });
                }
                await doctorService.updateDoctor(doctorId, doctorData);
                showSnackbar('Doctor updated successfully', 'success');
            } else {
                doctorData.rating = Object.keys(ratingNames).map((key) => ({ name: key, stars: 0 }));
                await doctorService.createDoctor(doctorData);
                showSnackbar('Doctor created successfully', 'success');
            }
            fetchDoctors();
            setOpen(false);
        } catch (error) {
            console.error(error);
            showSnackbar(error?.message || 'An unexpected error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedDoctor(doctors.find((doctor) => doctor._id === id));
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        deleteFile(selectedDoctor.imageUrl)
            .then((data) => console.log('Image deleted successfully'))
            .catch((error) => console.error(error));

        doctorService.deleteDoctor(selectedDoctor._id).then((data) => {
            showSnackbar('Doctor deleted successfully', 'success');
            fetchDoctors();
        }).catch((error) => {
            console.error(error);
            showSnackbar(error?.message || 'An unexpected error occurred', 'error');
        }).finally(() => {
            setLoading(false);
            setConfirmOpen(false);
        })
    };

    const handleImageChange = async (event, action) => {
        const file = event.target.files[0];
        if (doctorData.name.en === '') {
            showSnackbar('Please enter the name of the doctor first', 'error');
            return;
        }
        const fileName = doctorData.name.en.replace(/\s+/g, '-').toLowerCase();
        const directoryPath = 'images/doctors';
        setUploading(true);
        if (file) {
            const data = action === 'upload' ?
                await uploadFile(file, directoryPath, fileName) :
                await replaceFile(file, directoryPath, fileName);
            setDoctorData((prev) => ({ ...prev, imageUrl: data.fullUrl }));
            showSnackbar('Image uploaded successfully', 'success');
        } else {
            showSnackbar('Please select an image', 'error');
        }
        setUploading(false);
    };

    const columns = [
        {
            field: 'imageUrl',
            headerName: 'Photo',
            flex: 1,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt={params.row.name.en}
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                />
            ),
        },
        {
            field: 'name',
            headerName: 'Name (English)',
            flex: 1,
            renderCell: (params) => params.row.name.en,
        },
        {
            field: 'position',
            headerName: 'Position (English)',
            flex: 1,
            renderCell: (params) => params.row.position.en,
        },
        {
            field: 'rating',
            headerName: 'Range',
            flex: 1,
            renderCell: (params) => {
                const totalRating = params.row.rating.reduce((acc, rating) => acc + rating.stars, 0);
                const averageRating = totalRating / params.row.rating.length;
                return <Rating name="read-only" value={averageRating.toFixed(1)} readOnly />;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => { setDoctorId(params.row._id); setDoctorData(params.row); setOpen(true); }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClick(params.row._id)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Manage Doctors</Typography>
                <Button variant="contained" onClick={handleDialogOpen}>
                    <Add sx={{ mr: 1 }} /> Add
                </Button>
            </Box>

            <Paper elevation={3} style={{ height: '60vh', overflow: 'auto' }}>
                {isMobile ? (
                    <List>
                        {doctors.map((doctor) => (
                            <ListItem key={doctor._id}>
                                <ListItemAvatar>
                                    <Avatar src={doctor.imageUrl} alt={doctor.name.en[0]} />
                                </ListItemAvatar>
                                <ListItemText primary={doctor.name.en} secondary={
                                    <Box display="flex" flexDirection="column">
                                        <Typography variant="body2" color="textSecondary" ml={1}>
                                            {doctor.position.en}
                                        </Typography>
                                        <Rating name="read-only" value={(doctor.rating.reduce((acc, item) => acc + item.stars, 0) / doctor.rating.length) || 0} readOnly size="small" />
                                    </Box>
                                } />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => { setDoctorId(doctor._id); setDoctorData(doctor); setOpen(true); }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(doctor._id)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <DataGrid rows={doctors} columns={columns} pageSize={10} getRowId={(row) => row._id} loading={loading} />
                )}
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{doctorId ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
                <DialogContent>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={activeTab}
                            onChange={(e, val) => setActiveTab(val)}
                            indicatorColor="primary"
                            textColor="primary"
                            scrollButtons="auto"
                            variant="scrollable"
                        >
                            <Tab label="Required Information" />
                            <Tab label="Optional Information" />
                            <Tab label="Working Hours" />
                        </Tabs>
                    </AppBar>

                    {activeTab === 0 && (
                        <Grid container spacing={2} mt={2}>
                            {/* Name Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name (English)"
                                    value={doctorData.name.en}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        name: { ...prev.name, en: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name (Arabic)"
                                    value={doctorData.name.ar}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        name: { ...prev.name, ar: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* Position Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Position (English)"
                                    value={doctorData.position.en}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        position: { ...prev.position, en: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Position (Arabic)"
                                    value={doctorData.position.ar}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        position: { ...prev.position, ar: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* Description Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description (English)"
                                    value={doctorData.description.en}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        description: { ...prev.description, en: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description (Arabic)"
                                    value={doctorData.description.ar}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        description: { ...prev.description, ar: e.target.value },
                                    }))}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            {/* Active  */}
                            <Grid item xs={12} md={6}>
                                <InputLabel>Active</InputLabel>
                                <FormControl >
                                    <Switch
                                        checked={doctorData.isActive}
                                        onChange={(e) => setDoctorData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Image Upload */}
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center">
                                    {uploading && <CircularProgress size={20} />}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 2, textTransform: 'none', fontSize: 14, width: 150 }}
                                        onClick={() => document.getElementById('image-upload').click()}
                                    >
                                        Upload Image
                                    </Button>
                                    <input
                                        id='image-upload'
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, doctorId ? 'replace' : 'upload')}
                                        style={{ display: 'none' }}
                                    />
                                    {doctorData.imageUrl && (
                                        <Box mt={2}>
                                            <img
                                                src={doctorData.imageUrl}
                                                alt="Doctor"
                                                style={{ width: 100, height: 100, borderRadius: '50%' }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 1 && (
                        <Grid container spacing={2} mt={2}>
                            {/* Contact Information */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    value={doctorData.phone}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))}
                                    fullWidth
                                />
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    value={doctorData.address}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))}
                                    fullWidth
                                    multiline
                                />
                            </Grid>

                            {/* Social Media Links */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Facebook URL"
                                    value={doctorData.socialLinks.facebook}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                                    }))}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Twitter URL"
                                    value={doctorData.socialLinks.twitter}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                                    }))}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Instagram URL"
                                    value={doctorData.socialLinks.instagram}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                                    }))}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="LinkedIn URL"
                                    value={doctorData.socialLinks.linkedin}
                                    onChange={(e) => setDoctorData((prev) => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                                    }))}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 2 && (
                        <Grid container spacing={3} mt={2}>
                            {/* Add New Working Hours */}
                            <Grid item xs={12} lg={6}>
                                <Typography variant="h6" gutterBottom>
                                    Add Working Hours
                                </Typography>
                                <Grid container spacing={2}>
                                    {/* Day Selector */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Day</InputLabel>
                                            <Select
                                                value={newWorkingHour.day}
                                                onChange={(e) =>
                                                    setNewWorkingHour((prev) => ({ ...prev, day: e.target.value }))
                                                }
                                            >
                                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                                                    .filter(
                                                        (day) =>
                                                            !doctorData.workingHours?.some(
                                                                (existingDay) => existingDay.day === day
                                                            )
                                                    )
                                                    .map((day) => (
                                                        <MenuItem key={day} value={day}>
                                                            {day}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {/* Start Time */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            size="small"
                                            type="time"
                                            label="Start Time"
                                            value={newWorkingHour.startTime}
                                            onChange={(e) =>
                                                setNewWorkingHour((prev) => ({ ...prev, startTime: e.target.value }))
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* End Time */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            size="small"
                                            type="time"
                                            label="End Time"
                                            value={newWorkingHour.endTime}
                                            onChange={(e) =>
                                                setNewWorkingHour((prev) => ({ ...prev, endTime: e.target.value }))
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* Add Button */}
                                    <Grid item xs={12} sm={6} md={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={!newWorkingHour.day || !newWorkingHour.startTime || !newWorkingHour.endTime}
                                            onClick={() => {
                                                setDoctorData((prev) => ({
                                                    ...prev,
                                                    workingHours: [...prev.workingHours, newWorkingHour],
                                                }));
                                                setNewWorkingHour({ day: "", startTime: "", endTime: "" });
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* List Existing Working Hours */}
                            <Grid item xs={12} lg={6}>
                                <Typography variant="h6" gutterBottom>
                                    Existing Working Hours
                                </Typography>
                                <List>
                                    {doctorData.workingHours.map((workingHour, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                bgcolor: index % 2 === 0 ? "grey.100" : "transparent",
                                                borderRadius: 1,
                                            }}
                                        >
                                            <ListItemText
                                                primary={workingHour.day}
                                                secondary={`${workingHour.startTime} - ${workingHour.endTime}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() =>
                                                            setDoctorData((prev) => ({
                                                                ...prev,
                                                                workingHours: prev.workingHours.filter(
                                                                    (day) => day.day !== workingHour.day
                                                                ),
                                                            }))
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    )}

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={createOrUpdateDoctor}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={confirmOpen}
                title="Delete Doctor"
                description="Are you sure you want to delete this doctor?"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </Box>
    );
};

export default ManageDoctors;
