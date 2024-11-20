import { useEffect, useState } from 'react';
import {
    Paper, Button, Dialog, Box, Container,
    DialogActions, DialogContent, DialogTitle,
    TextField, CircularProgress, Typography, IconButton,
    Grid, Switch, Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import doctorService from '../../services/doctorService';
import fileService from '../../services/fileService';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import ConfirmationDialog from "../common/ConfirmationDialog";

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState(null);
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
        isActive: true,
    });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const showSnackbar = useSnackbar();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const doctors = await doctorService.fetchDoctors();
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
            socialLinks: {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: '',
            },
            isActive: true,
        });
    };

    const createOrUpdateDoctor = async () => {
        setLoading(true);
        try {
            if (doctorId) {
                await doctorService.updateDoctor(doctorId, doctorData);
                showSnackbar('Doctor updated successfully', 'success');
            } else {
                await doctorService.createDoctor(doctorData);
                showSnackbar('Doctor created successfully', 'success');
            }
            fetchDoctors();
            setOpen(false);
        } catch (error) {
            console.error(error);
            showSnackbar(error.message, 'error');
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
        try {
            await doctorService.deleteDoctor(selectedDoctor._id);
            showSnackbar('Doctor deleted successfully', 'success');
            fetchDoctors();
        } catch (error) {
            console.error(error);
            showSnackbar(error.message, 'error');
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const directoryPath = 'images/doctors';
        if (file) {
            const data = await fileService.uploadFile(file, directoryPath);
            if (data.url && data.imageUrl) {
                await fileService.deleteFile(directoryPath, doctorData.imageUrl.split('/').pop());
            }
            setDoctorData((prev) => ({ ...prev, imageUrl: data.url }));
            showSnackbar('Image uploaded successfully', 'success');
        } else {
            showSnackbar('Please select an image', 'error');
        }
    };

    const columns = [
        {
            field: 'imageUrl',
            headerName: 'Photo',
            fex: 1,
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
            renderCell: (params) => (
                <div>
                    {params.row.name.en}
                </div>
            ),
        },
        {
            field: 'position',
            headerName: 'Position (English)',
            flex: 1,
            renderCell: (params) => (
                <div>
                    {params.row.position.en}
                </div>
            ),
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
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Manage Doctors</Typography>
                <Button variant="contained" onClick={handleDialogOpen}>
                    <Add /> Add Doctor
                </Button>
            </Box>

            <Paper elevation={3} style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={doctors}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{doctorId ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name (Arabic)"
                                variant="outlined"
                                fullWidth
                                value={doctorData.name.ar}
                                onChange={(e) => setDoctorData({ ...doctorData, name: { ...doctorData.name, ar: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name (English)"
                                variant="outlined"
                                fullWidth
                                value={doctorData.name.en}
                                onChange={(e) => setDoctorData({ ...doctorData, name: { ...doctorData.name, en: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Position (Arabic)"
                                variant="outlined"
                                fullWidth
                                value={doctorData.position.ar}
                                onChange={(e) => setDoctorData({ ...doctorData, position: { ...doctorData.position, ar: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Position (English)"
                                variant="outlined"
                                fullWidth
                                value={doctorData.position.en}
                                onChange={(e) => setDoctorData({ ...doctorData, position: { ...doctorData.position, en: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description (Arabic)"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                value={doctorData.description.ar}
                                onChange={(e) => setDoctorData({ ...doctorData, description: { ...doctorData.description, ar: e.target.value } })}
                            />
                            <TextField
                                label="Description (English)"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                value={doctorData.description.en}
                                onChange={(e) => setDoctorData({ ...doctorData, description: { ...doctorData.description, en: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">Image: {doctorData.imageUrl}</Typography>
                            <TextField
                                type="file"
                                accept="image/*"
                                variant="outlined"
                                fullWidth
                                onChange={handleImageChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Facebook"
                                variant="outlined"
                                fullWidth
                                value={doctorData.socialLinks.facebook}
                                onChange={(e) => setDoctorData({ ...doctorData, socialLinks: { ...doctorData.socialLinks, facebook: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Instagram"
                                variant="outlined"
                                fullWidth
                                value={doctorData.socialLinks.instagram}
                                onChange={(e) => setDoctorData({ ...doctorData, socialLinks: { ...doctorData.socialLinks, instagram: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Twitter"
                                variant="outlined"
                                fullWidth
                                value={doctorData.socialLinks.twitter}
                                onChange={(e) => setDoctorData({ ...doctorData, socialLinks: { ...doctorData.socialLinks, twitter: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="LinkedIn"
                                variant="outlined"
                                fullWidth
                                value={doctorData.socialLinks.linkedin}
                                onChange={(e) => setDoctorData({ ...doctorData, socialLinks: { ...doctorData.socialLinks, linkedin: e.target.value } })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Switch
                                checked={doctorData.isActive}
                                onChange={(e) => setDoctorData({ ...doctorData, isActive: e.target.checked })}
                            />
                            <Typography variant="caption">Active</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={createOrUpdateDoctor} variant="contained" color="primary">
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Deletion"
                message={`Are you sure you want to delete ${selectedDoctor?.name?.en} from the list?`}
            />
        </Container>
    );
};

export default ManageDoctors;
