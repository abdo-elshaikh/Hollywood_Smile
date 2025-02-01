import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    Grid,
    Switch,
    LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { fetchServices, createService, updateService, deleteService } from '../../services/servicesService';
import { uploadFile, replaceFile, deleteFile } from '../../services/supabaseService';
import { useSnackbar } from '../../contexts/SnackbarProvider';


const ManageServicesPage = () => {
    const showSnackBar = useSnackbar();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [serviceData, setServiceData] = useState({
        title: { en: '', ar: '' },
        description: { en: '', ar: '' },
        details: { en: '', ar: '' },
        price: '',
        duration: '',
        imageUrl: '',
        icon: ''
    });

    // Fetch services from API
    const fetchAllServices = async () => {
        setLoading(true);
        try {
            const services = await fetchServices();
            setServices(services);
        } catch (err) {
            showSnackBar('Failed to load services', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllServices();
    }, []);

    // Handle form changes for nested multilingual fields
    const handleChange = (e, language = null) => {
        const { name, value } = e.target;
        if (language) {
            setServiceData({
                ...serviceData,
                [name]: { ...serviceData[name], [language]: value },
            });
        } else {
            setServiceData({ ...serviceData, [name]: value });
        }
    };

    // chack valid faileds
    const checkServiceValid = () => {
        if (serviceData.title.en === '' || serviceData.title.ar === '') {
            showSnackBar('Please enter title in both languages', 'error');
            return false;
        } else if (serviceData.description.en === '' || serviceData.description.ar === '') {
            showSnackBar('Please enter description in both languages', 'error');
            return false;
        } else if (serviceData.price === '') {
            showSnackBar('Please enter price', 'error');
            return false;
        } else if (serviceData.duration === '') {
            showSnackBar('Please enter duration', 'error');
            return false;
        } else if (serviceData.imageUrl === '' || serviceData.icon === '') {
            showSnackBar('Please upload an image or icon', 'error');
            return false;
        } else {
            return true;
        }
    };

    // Handle form submission for creating/updating a service
    const handleSubmitService = async () => {
        if (!checkServiceValid()) return;
        
        setLoading(true);
        try {
            if (isEditable && selectedServiceId) {
                await updateService(selectedServiceId, serviceData);
                showSnackBar('Service updated successfully', 'success');
            } else {
                await createService(serviceData);
                showSnackBar('Service created successfully', 'success');
            }
            fetchAllServices();
            handleCloseDialog();
        } catch (err) {
            showSnackBar('Operation failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle the edit action
    const handleClickEdit = (service) => {
        setIsEditable(true);
        setSelectedServiceId(service._id);
        setServiceData(service);
        setOpen(true);
    };

    // Handle the delete action
    const handleDeleteService = async (id) => {
        setLoading(true);

        deleteService(id).then((data) => {
            console.log('Service deleted successfully', data);
            deleteFile(data.imageUrl, 'uploads')
                .then((data) => { console.log('Image deleted successfully', data) })
                .catch((err) => { console.error('Failed to delete image', err) });
            showSnackBar('Service deleted successfully', 'success');
            fetchAllServices();
        }).catch((err) => {
            showSnackBar('Failed to delete service', 'error');
        })
    };

    // Handle file upload
    const handleUploadImage = async (file, type = 'imageUrl', action = 'upload') => {
        const directoryPath = type === 'imageUrl' ? 'services/images' : 'services/icons';
        if (!file) return;
        if (serviceData.title.en === '') {
            showSnackBar('Please enter title first', 'error');
            return;
        }
        const fileName = serviceData.title.en.replace(/\s+/g, '-').toLowerCase();
        setUploading(true);
        if (action === 'upload') {
            uploadFile(file, directoryPath, fileName).then((data) => {
                setServiceData({ ...serviceData, [type]: data.fullUrl });
                showSnackBar('Image uploaded successfully', 'success');
            }).catch((err) => {
                console.error('Failed to upload image', err);
                showSnackBar('Failed to upload image', 'error');
            }).finally(() => {
                setUploading(false);
            });
        } else if (action === 'replace') {
            replaceFile(file, directoryPath, fileName).then((data) => {
                setServiceData({ ...serviceData, [type]: data.fullUrl });
                showSnackBar('Image replaced successfully', 'success');
            }).catch((err) => {
                console.error('Failed to replace image', err);
                showSnackBar('Failed to replace image', 'error');
            }).finally(() => {
                setUploading(false);
            });
        }
    };

    // Toggle status
    const handleToggleStatus = async (id, status) => {
        try {
            const data = await updateService(id, { isActive: !status });
            if (data.error) {
                showSnackBar('Failed to toggle status', 'error');
                return;
            }
            setServices((prevServices) =>
                prevServices.map((service) => (service._id === id ? { ...service, isActive: !status } : service))
            );
            showSnackBar('Status updated successfully', 'success');
        } catch (err) {
            showSnackBar('Failed to toggle status', 'error');
        }
    };

    // Open/close dialog handlers
    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => {
        setOpen(false);
        setIsEditable(false);
        setSelectedServiceId(null);
        setServiceData({
            title: { en: '', ar: '' },
            description: { en: '', ar: '' },
            details: { en: '', ar: '' },
            price: '',
            duration: '',
            imageUrl: '',
            icon: ''
        });
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Manage Services
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                style={{ marginBottom: 16 }}
            >
                Add New Service
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {services.map((service) => (
                        <Grid item xs={12} sm={6} md={3} key={service._id} position={'relative'}>
                            {/* show icon */}
                            {service.icon && (
                                <img
                                    src={service.icon}
                                    alt={service.title.en}
                                    style={{
                                        width: '50px',
                                        position: 'absolute',
                                        top: 30,
                                        left: 30,
                                        borderRadius: '50%',
                                        border: '2px solid #fff',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                />
                            )}
                            <Card>
                                {service.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={service.imageUrl}
                                        alt={service.title.en}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">
                                        {service.title.en}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {service.description.en.slice(0, 50)}...
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Price: ${service.price}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Duration: {service.duration} mins
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Active: {service.isActive ? 'Yes' : 'No'}
                                    </Typography>
                                </CardContent>
                                <Box display="flex" justifyContent="flex-end" padding={1}>
                                    <IconButton color="primary" onClick={() => handleClickEdit(service)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDeleteService(service._id)}>
                                        <Delete />
                                    </IconButton>
                                    <Switch
                                        checked={service.isActive}
                                        color="primary"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        onChange={() => handleToggleStatus(service._id, service.isActive)}
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{isEditable ? 'Edit Service' : 'Create New Service'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title (EN)"
                        fullWidth
                        value={serviceData.title.en}
                        onChange={(e) => handleChange(e, 'en')}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title (AR)"
                        fullWidth
                        value={serviceData.title.ar}
                        onChange={(e) => handleChange(e, 'ar')}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description (EN)"
                        fullWidth
                        value={serviceData.description.en}
                        onChange={(e) => handleChange(e, 'en')}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description (AR)"
                        fullWidth
                        value={serviceData.description.ar}
                        onChange={(e) => handleChange(e, 'ar')}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="details"
                        label="Details (EN)"
                        fullWidth
                        value={serviceData.details.en}
                        onChange={(e) => handleChange(e, 'en')}
                    />
                    <TextField
                        margin="dense"
                        name="details"
                        label="Details (AR)"
                        fullWidth
                        value={serviceData.details.ar}
                        onChange={(e) => handleChange(e, 'ar')}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        fullWidth
                        type="number"
                        value={serviceData.price}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="duration"
                        label="Duration"
                        fullWidth
                        value={serviceData.duration}
                        onChange={handleChange}
                    />
                    <Box mt={2}>
                        <Typography variant="h6">Choose Image</Typography>
                        <input type="file" accept="image/*" onChange={(e) => {
                            isEditable ? handleUploadImage(e.target.files[0], 'imageUrl', 'replace') : handleUploadImage(e.target.files[0], 'imageUrl', 'upload')
                        }} />
                        {uploading && <LinearProgress />}
                        {serviceData.imageUrl && !uploading && (
                            <Box mt={2}>
                                <Typography variant="body2">Image Preview: {serviceData.imageUrl}</Typography>
                                <img
                                    src={serviceData.imageUrl}
                                    alt="Service Preview"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h6">Choose Icon</Typography>
                        <input type="file" accept='image/*' onChange={(e) => {
                            isEditable ? handleUploadImage(e.target.files[0], 'icon', 'replace') : handleUploadImage(e.target.files[0], 'icon', 'upload')
                        }} />
                        {uploading && <LinearProgress />}
                        {serviceData.icon && !uploading && (
                            <Box mt={2}>
                                <Typography variant="body2">Icon Preview: {serviceData.icon}</Typography>
                                <img
                                    src={serviceData.icon}
                                    alt="Service Icon"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitService} color="primary" disabled={loading}>
                        {isEditable ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageServicesPage;
