import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardMedia, Tooltip,
    CardContent, IconButton, Dialog, TextField, CircularProgress, Select,
    FormControl, FormHelperText, FormGroup, Chip, DialogActions, Badge,
    DialogContent, DialogContentText, DialogTitle, Pagination, Divider,
    Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails,
    LinearProgress
} from '@mui/material';
import { Add, Edit, Delete, Cancel } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import galleryService from '../../services/galleryService';
import { uploadFile, replaceFile, deleteFile } from '../../services/supabaseService';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const ManageGalleryPage = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', categories: [], tags: [], altText: '' });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const showSnackbar = useSnackbar();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // For smaller screens

    useEffect(() => {
        fetchGalleryItems();
    }, [page]);

    const fetchGalleryItems = async () => {
        setIsLoading(true);
        try {
            const data = await galleryService.getGallery();
            setGalleryItems(data);
            const allCategories = [...new Set(data.flatMap((img) => img.categories))];
            setCategories(allCategories);
            const allTags = [...new Set(data.flatMap((img) => img.tags))];
            setTags(allTags);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        const fileName = file.name;
        const directoryPath = 'gallery';
        setUploading(true);
        try {
            const data = selectedItem ?
                await replaceFile(file, directoryPath, fileName) :
                await uploadFile(file, directoryPath, fileName);
            setFormData({ ...formData, imageUrl: data.fullUrl });
            showSnackbar('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar('Error uploading image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleOpenDialog = (item = null) => {
        setSelectedItem(item);
        setFormData(item ? item : { title: '', description: '', imageUrl: '', categories: [], tags: [], altText: '' });
        setImagePreview(item ? item.imageUrl : null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const data = selectedItem ?
                await galleryService.updateGalleryItem(selectedItem._id, formData) :
                await galleryService.createGalleryItem(formData);
            fetchGalleryItems();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving gallery item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (item) => {
        setIsLoading(true);
        deleteFile(item.imageUrl).then(async () => {
            try {
                await galleryService.deleteGalleryItem(item._id);
                fetchGalleryItems();
            } catch (error) {
                console.error('Error deleting gallery item:', error);
            } finally {
                setIsLoading(false);
            }
        }).catch(error => {
            console.error('Error deleting image:', error);
            showSnackbar('Error deleting image', 'error');
            setIsLoading(false);
        });
    };

    const filteredGalleryItems = galleryItems.filter(item => {
        const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(cat => item.categories.includes(cat));
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
        return matchesCategories && matchesTags;
    });

    const changeCategories = (value) => {
        const categories = formData.categories;
        if (!categories.includes(value)) {
            setFormData({ ...formData, categories: [...categories, value] });
        } else {
            setFormData({ ...formData, categories: categories.filter(cat => cat !== value) });
        }
    };

    const changeTags = (value) => {
        const tags = formData.tags;
        if (!tags.includes(value)) {
            setFormData({ ...formData, tags: [...tags, value] });
        } else {
            setFormData({ ...formData, tags: tags.filter(t => t !== value) });
        }
    };

    const paginatedGalleryItems = filteredGalleryItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const defaultCategories = ['others', "Smile Makeover", "Gum Treatment", "Restorative", "Crowns", "General Dentistry", "Endodontics", "Public Health", "Orthodontics"];
    const defaultTags = ['others', "gum", "reshaping", "smile improvement", "crowns", "restorative", "strength", "checkup", "prevention", "routine", "root canal", "therapy", "pain relief"];

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Manage Gallery
            </Typography>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                    mb: 2,
                    bgcolor: theme.palette.success.main,
                    '&:hover': { bgcolor: theme.palette.success.dark },
                }}
            >
                Add New Item
            </Button>

            {/* Filters */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary
                        expandIcon={isSmallScreen ? <ArrowDropDownIcon /> : <ArrowDownwardIcon />}
                        aria-controls="categories-tags-content"
                        id="categories-tags-header"
                    >
                        <Typography variant="h6">Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <FormGroup
                                    row
                                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                                >
                                    <Typography variant="body1" width='100%' color='primary.main' gutterBottom>
                                        Categories
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {defaultCategories.map(category => (
                                        <FormControlLabel
                                            key={category}
                                            control={
                                                <Checkbox
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCategories([...selectedCategories, category]);
                                                        } else {
                                                            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
                                                        }
                                                    }}
                                                />
                                            }
                                            label={category}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <FormGroup
                                    row
                                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                                >
                                    <Typography variant="body1" width='100%' color='primary.main' gutterBottom>
                                        Tags
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {defaultTags.map(tag => (
                                        <FormControlLabel
                                            key={tag}
                                            control={
                                                <Checkbox
                                                    checked={selectedTags.includes(tag)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedTags([...selectedTags, tag]);
                                                        } else {
                                                            setSelectedTags(selectedTags.filter(t => t !== tag));
                                                        }
                                                    }}
                                                />
                                            }
                                            label={tag}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Gallery Items */}
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {paginatedGalleryItems.map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        alt={item.title}
                                        height="200"
                                        image={item.imageUrl}
                                    />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="h6">{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>{item.description}</Typography>
                                    </CardContent>
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        zIndex: 1,
                                        display: 'flex',
                                        gap: 1
                                    }}>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleOpenDialog(item)} sx={{ color: 'blue' }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(item)} sx={{ color: 'red' }}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Pagination
                        count={Math.ceil(filteredGalleryItems.length / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                    />
                </>
            )}

            {/* Dialog to add/edit gallery item */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedItem ? 'Edit the information for this gallery item' : 'Add a new gallery item to the collection'}
                    </DialogContentText>
                    <Box>
                        <TextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            multiline
                            rows={4}
                        />
                        <TextField
                            name="altText"
                            label="Alt Text"
                            value={formData.altText}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="file-upload"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="contained" component="span" sx={{ width: '100%' }}>
                                {selectedItem ? 'Change Image' : 'Upload Image'}
                            </Button>
                        </label>
                        {uploading && <LinearProgress sx={{ mt: 2 }} />}
                        {formData.imageUrl && (
                            <Box sx={{ mt: 2 }}>
                                <img src={formData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
                            </Box>
                        )}
                    </Box>
                    <FormControl sx={{ width: '100%' }}>
                        <Typography variant="body1" color='primary.main' gutterBottom>
                            Categories
                        </Typography>
                        <FormGroup row sx={{ gap: 1, flexWrap: 'wrap' }}>
                            {defaultCategories.map(category => (
                                <FormControlLabel
                                    key={category}
                                    control={
                                        <Checkbox
                                            checked={formData.categories.includes(category)}
                                            onChange={() => changeCategories(category)}
                                        />
                                    }
                                    label={category}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                    <Box sx={{ mt: 2 }} />
                    <FormControl sx={{ width: '100%' }}>
                        <Typography variant="body1" color='primary.main' gutterBottom>
                            Tags
                        </Typography>
                        <FormGroup row sx={{ gap: 1, flexWrap: 'wrap' }}>
                            {defaultTags.map(tag => (
                                <FormControlLabel
                                    key={tag}
                                    control={
                                        <Checkbox
                                            checked={formData.tags.includes(tag)}
                                            onChange={() => changeTags(tag)}
                                        />
                                    }
                                    label={tag}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" startIcon={<Cancel />}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained" disabled={isLoading}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageGalleryPage;
