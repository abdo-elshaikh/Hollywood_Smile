import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardMedia, Tooltip,
    CardContent, IconButton, Dialog, TextField, CircularProgress, Select,
    FormControl, FormHelperText, FormGroup, Chip, DialogActions, Badge,
    DialogContent, DialogContentText, DialogTitle, Pagination, Divider,
    Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Add, Edit, Delete, Cancel } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import galleryService from '../../services/galleryService';
import fileService from '../../services/fileService';
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
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const showSnackbar = useSnackbar();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // For smaller screens

    // Fetch gallery items on component mount
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
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            try {
                setIsLoading(true);
                const data = await fileService.uploadFile(file, 'images/gallery');
                if (selectedItem) {
                    await fileService.deleteFile('images/gallery', selectedItem.imageUrl.split('/').pop());
                }
                setFormData({ ...formData, imageUrl: data.url });
                showSnackbar('File uploaded successfully', 'success');
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please select a valid image file.");
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
            if (selectedItem) {
                await galleryService.updateGalleryItem(selectedItem._id, formData);
            } else {
                await galleryService.createGalleryItem(formData);
            }
            fetchGalleryItems();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving gallery item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await galleryService.deleteGalleryItem(id);
            fetchGalleryItems();
        } catch (error) {
            console.error('Error deleting gallery item:', error);
        } finally {
            setIsLoading(false);
        }
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

    const defaultCategories = ['others', "Smile Makeover", "Gum Treatment", "Restorative", "Crowns", "General Dentistry", "Endodontics", ...categories];
    const defaultTags = ['others', "gum", "reshaping", "smile improvement", "crowns", "restorative", "strength", "checkup", "prevention", "routine", "root canal", "therapy", "pain relief", ...tags];

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

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {paginatedGalleryItems.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <Card sx={{ boxShadow: 4, position: 'relative', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={item.imageUrl}
                                            alt={item.altText}
                                            sx={{ height: 250 }}
                                        />
                                        <CardContent sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', color: '#fff', p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2">{item.description}</Typography>
                                        </CardContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            position="absolute"
                                            bottom={5}
                                            right={5}
                                            zIndex={2}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleOpenDialog(item)} color="primary">
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => handleDelete(item._id)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Pagination
                        count={Math.ceil(filteredGalleryItems.length / itemsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
                    />
                </>
            )}

            {/* Dialog for creating and editing gallery items */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedItem ? 'Update your gallery item below.' : 'Fill the form to add a new gallery item.'}
                    </DialogContentText>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        value={formData.description}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Alt Text"
                        name="altText"
                        fullWidth
                        value={formData.altText}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2">Image</Typography>
                        <Button variant="contained" component="label">
                            Upload Image
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleFileUpload}
                            />
                        </Button>
                    </Box>
                    {imagePreview && (
                        <Box>
                            <img src={imagePreview} alt="Image preview" width="100%" />
                        </Box>
                    )}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography variant="body2">Categories</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" alignItems="center">
                            {formData.categories.map((category) => (
                                <Badge badgeContent={<Cancel />} sx={{ mr: 1, mb: 1 }} onClick={(e) => changeCategories(category)}>
                                    <Chip key={category} label={category} />
                                </Badge>
                            ))}
                        </Box>
                        <Select
                            multiple
                            native
                            value={defaultCategories.filter(cat => !formData.categories.includes(cat))}
                            onChange={(e) => changeCategories(e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {defaultCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography variant="body2">Tags</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" alignItems="center">
                            {formData.tags.map((tag) => (
                                <Badge badgeContent={<Cancel />} sx={{ mr: 1, mb: 1 }} onClick={(e) => changeTags(tag)}>
                                    <Chip key={tag} label={tag} />
                                </Badge>
                            ))}
                        </Box>
                        <Select
                            multiple
                            native
                            value={defaultTags.filter(tag => !formData.tags.includes(tag))}
                            onChange={(e) => changeTags(e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {defaultTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageGalleryPage;
