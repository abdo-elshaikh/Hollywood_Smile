import React, { useState, useEffect } from "react";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../../services/offersService";
import {
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    CardMedia,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from '../../contexts/SnackbarProvider';
import CustomPagination from "../common/CustomPagination";
import { uploadFile } from "../../services/supabaseService";
import { fetchServices } from "../../services/servicesService";

const ManageOffers = () => {
    const showSnackbar = useSnackbar();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newOffer, setNewOffer] = useState({
        title: { ar: "", en: "" },
        description: { ar: "", en: "" },
        expiryDate: "",
        discount: "",
        imageUrl: "",
        isActive: false,
        showInNotifications: false,
        showInHome: false,
        service: "",
    });
    const [editOffer, setEditOffer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [services, setServices] = useState([]);
    const [loadingImage, setLoadingImage] = useState(false);

    useEffect(() => {
        fetchOffers();
        getSercices();
    }, []);

    const fetchOffers = async () => {
        try {
            const data = await getOffers();
            const updatedOffers = data.map((offer) => {
                const expiryDate = new Date(offer.expiryDate);
                const hasExpired = expiryDate < new Date();
                if (offer.isActive && hasExpired) {
                    updateOffer(offer._id, { isActive: false, showInNotifications: false });
                    offer.isActive = false;
                    offer.showInNotifications = false;
                }
                offer.expiryDate = expiryDate;
                return offer;
            });
            updatedOffers.sort((a, b) => b.expiryDate - a.expiryDate);
            setOffers(updatedOffers);
        } catch (err) {
            setError("Failed to load offers");
        } finally {
            setLoading(false);
        }
    };

    const getSercices = async () => {
        try {
            const data = await fetchServices();
            setServices(data);
        } catch (err) {
            showSnackbar("Failed to load services", "error");
        }
    };

    const handleUploadImage = async (file) => {
        if (newOffer.title.en === "") {
            showSnackbar("Please enter title in both languages", "error");
            return;
        }
        setLoadingImage(true);
        try {
            const directoryPath = 'images/offers';
            const data = await uploadFile(file, directoryPath, newOffer.title.en.replace(/\s+/g, '-').toLowerCase());
            if (data.fullUrl) {
                setNewOffer({ ...newOffer, imageUrl: data.fullUrl });
                showSnackbar("Image uploaded successfully", "success");
            } else {
                showSnackbar("Failed to upload image", "error");
            }
        } catch (err) {
            showSnackbar("Failed to upload image", "error");
        } finally {
            setLoadingImage(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [field, subField] = name.split(".");
            setNewOffer({ ...newOffer, [field]: { ...newOffer[field], [subField]: value } });
        } else {
            setNewOffer({ ...newOffer, [name]: value });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setNewOffer({ ...newOffer, [name]: checked });
    };

    const openDialog = (offer = null) => {
        if (offer) {
            setNewOffer({
                ...offer,
                expiryDate: offer.expiryDate.toISOString().substring(0, 16),
            });
            setEditOffer(offer);
        } else {
            setNewOffer({
                title: { ar: "", en: "" },
                description: { ar: "", en: "" },
                expiryDate: new Date().toISOString().substring(0, 16),
                discount: "",
                imageUrl: "",
                isActive: false,
                showInNotifications: false,
            });
        }
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditOffer(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editOffer) {
                const result = await updateOffer(editOffer._id, newOffer);
                setOffers(offers.map((offer) => (offer._id === editOffer._id ? result : offer)));
            } else {
                const result = await createOffer(newOffer);
                setOffers([...offers, result]);
            }
            closeDialog();
            showSnackbar("Offer saved successfully", "success");
        } catch (err) {
            showSnackbar("Failed to save offer", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOffer(id);
            setOffers(offers.filter((offer) => offer._id !== id));
            showSnackbar("Offer deleted", "success");
        } catch (err) {
            showSnackbar("Failed to delete offer", "error");
        }
    };

    const handleToggle = async (id, field, value) => {
        try {
            const updatedOffer = offers.find((offer) => offer._id === id);
            updatedOffer[field] = value;
            await updateOffer(id, updatedOffer);
            setOffers(offers.map((offer) => (offer._id === id ? updatedOffer : offer)));
            showSnackbar("Offer updated successfully", "success");
        } catch (err) {
            showSnackbar("Failed to update offer", "error");
        }
    };

    if (loading) return <p>Loading offers...</p>;
    if (error) return <p>{error}</p>;

    const currentOffers = offers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Button variant="contained" color="primary" onClick={() => openDialog()} sx={{ mb: 1 }}>
                Create New Offer
            </Button>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {currentOffers.map((offer) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={offer._id}>
                        <Card elevation={3}>
                            {offer.imageUrl && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={offer.imageUrl}
                                    alt="Offer Image"
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{offer.title.en}</Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {offer.title.ar}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {offer.description.en}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {offer.description.ar}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Expiry Date: {new Date(offer.expiryDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    Discount: {offer.discount}
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={offer.showInHome}
                                            onChange={(e) => handleToggle(offer._id, "showInHome", e.target.checked)}
                                        />
                                    }
                                    label="Show in Offers"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={offer.showInNotifications}
                                            onChange={(e) => handleToggle(offer._id, "showInNotifications", e.target.checked)}
                                        />
                                    }
                                    label="Show in Notifications"
                                />
                                {/* service */}
                                <Typography variant="caption" color="success" fontWeight='bold' display="block" gutterBottom>
                                    Service: {services.find((service) => service._id === offer.service)?.title.en} - {services.find((service) => service._id === offer.service)?.title.ar}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => openDialog(offer)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(offer._id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <CustomPagination
                total={offers.length}
                perPage={rowsPerPage}
                page={currentPage}
                itemName="offers"
                onPageChange={(page) => setCurrentPage(page)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
            />

            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editOffer ? "Edit Offer" : "Create Offer"}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="serviceLabel">Service</InputLabel>
                            <Select
                                labelId="serviceLabel"
                                id="service"
                                name="service"
                                value={newOffer.service}
                                onChange={handleChange}
                                displayEmpty
                                required
                            >
                                <MenuItem value=""><em>Select Service</em></MenuItem>
                                {services.map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        {service.title.en} - {service.title.ar}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Title (EN)"
                            name="title.en"
                            value={newOffer.title.en}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                        />
                        <TextField
                            label="Title (AR)"
                            name="title.ar"
                            value={newOffer.title.ar}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Description (EN)"
                            name="description.en"
                            value={newOffer.description.en}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            variant="outlined"
                        />
                        <TextField
                            label="Description (AR)"
                            name="description.ar"
                            value={newOffer.description.ar}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            variant="outlined"
                        />
                        <TextField
                            label="Discount"
                            name="discount"
                            value={newOffer.discount}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                        />
                        <TextField
                            label="Expiry Date"
                            name="expiryDate"
                            type="datetime-local"
                            value={newOffer.expiryDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={newOffer.showInHome} onChange={handleCheckboxChange} name="showInHome" />}
                            label="Show in Home"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={newOffer.showInNotifications} onChange={handleCheckboxChange} name="showInNotifications" />}
                            label="Show in Notifications"
                        />
                        {loadingImage && <CircularProgress />}
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                            Image Preview : {newOffer.imageUrl ? newOffer.imageUrl : "No Image Selected"}
                        </Typography>
                        {!loadingImage && (
                            <CardMedia
                                component="img"
                                height="140"
                                image={newOffer.imageUrl}
                                alt="Offer Image"
                                sx={{ mt: 2 }}
                            />
                        )}
                        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                            Upload Image
                            <input type="file" hidden onChange={(e) => handleUploadImage(e.target.files[0])} />
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="secondary">Cancel</Button>
                        <Button type="submit" disabled={loadingImage} color="primary">{editOffer ? "Save" : "Create"}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </motion.div>
    );
};

export default ManageOffers;
