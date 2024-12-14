import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Container, Dialog, Switch,
    FormControlLabel, TextField, DialogContent, DialogActions,
    DialogTitle, Rating, Avatar, useTheme, useMediaQuery,
    List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../services/axiosInstance';
import { uploadImage } from '../../services/uploadImage';
import TestimonialForm from '../common/TestimonialForm';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch testimonials from the service
    const fetchTestimonials = async () => {
        try {
            const res = await axiosInstance.get('/testimonials');
            const sortedTestimonials = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTestimonials(sortedTestimonials);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Handle add/edit form dialog open/close
    const handleOpenFormDialog = (testimonial = null) => {
        setSelectedTestimonial(testimonial);
        setOpenFormDialog(true);
    };
    const handleCloseFormDialog = () => {
        setSelectedTestimonial(null);
        setOpenFormDialog(false);
    };

    // Handle testimonial deletion
    const handleDeleteTestimonial = async (id) => {
        try {
            await axiosInstance.delete(`/testimonials/${id}`);
            setTestimonials(testimonials.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
        }
    };

    // Handle testimonial show
    const handleShowTestimonial = async (id, show) => {
        show = !show;
        try {
            await axiosInstance.put(`/testimonials/${id}`, { show });
            setTestimonials(testimonials.map((t) => t._id === id ? { ...t, show } : t));
        } catch (error) {
            console.error('Failed to update testimonial:', error);
        }
    };


    // Define columns for the DataGrid
    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'position', headerName: 'Position', width: 150 },
        { field: 'quote', headerName: 'Quote', width: 300 },
        { field: 'rating', headerName: 'Rating', width: 100 },
        {
            field: 'show', headerName: 'Show', width: 100
            , renderCell: (params) => (
                <FormControlLabel
                    control={<Switch checked={params.row.show} />}
                    onChange={() => handleShowTestimonial(params.row._id, params.row.show)}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Button onClick={() => handleOpenFormDialog(params.row)}>Edit</Button>
                    <Button color="error" onClick={() => handleDeleteTestimonial(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => handleOpenFormDialog()}>
                Add Testimonial
            </Button>
            <Box sx={{ height: 550, my: 2, backgroundColor: 'background.default', borderRadius: 2, overflow: 'auto' }}>
                {isMobile ? (
                    <List>
                        {testimonials?.map((testimonial) => (
                            <ListItem key={testimonial._id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                                <ListItemAvatar>
                                    <Avatar src={testimonial?.imgUrl} alt={testimonial.name[0]} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={testimonial.name}
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {testimonial.position}
                                            </Typography>
                                            <br />
                                            <Rating name="read-only" value={testimonial.rating} readOnly />
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {testimonial.quote}
                                            </Typography>
                                            <Box
                                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <Switch checked={testimonial.show} onChange={() => handleShowTestimonial(testimonial._id, testimonial.show)} />
                                                <Button onClick={() => handleOpenFormDialog(testimonial)}>Edit</Button>
                                                <Button color="error" onClick={() => handleDeleteTestimonial(testimonial._id)}>Delete</Button>
                                            </Box>
                                        </>
                                    }

                                />

                            </ListItem>

                        ))}
                    </List>
                ) : (
                    <DataGrid
                        rows={testimonials}
                        columns={columns}
                        pageSize={5}
                        getRowId={(row) => row._id}
                        disableSelectionOnClick
                    />
                )}
            </Box>
            <Dialog
                open={openFormDialog}
                onClose={handleCloseFormDialog}
                fullScreen={isMobile}
                fullWidth
            >
                <DialogTitle>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'background.default',
                            color: 'text.primary',
                        }}
                    >
                        {selectedTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                        <Button onClick={handleCloseFormDialog}>&times;</Button>
                    </Box>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        p: 2,
                    }}
                >
                    <TestimonialForm testimonial={selectedTestimonial} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};


export default TestimonialsManager;
