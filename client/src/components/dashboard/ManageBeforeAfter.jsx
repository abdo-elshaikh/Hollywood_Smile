import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, CardActions, TextField, Typography, Button, IconButton, Tooltip, CardMedia
} from '@mui/material';
import { Add, Edit, Save, Cancel, Delete } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';
import { uploadFile, replaceFile, deleteFile } from '../../services/supabaseService';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { motion } from 'framer-motion';

const ManageBeforeAfter = () => {
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newEntry, setNewEntry] = useState({});
    const showSnackbar = useSnackbar();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('/before-after');
            setData(res.data || []);
            const lastEntry = res.data[res.data.length - 1];
            const nextCodeNumber = lastEntry ? parseInt(lastEntry.code.split('-')[1]) + 1 : 1;
            setNewEntry({
                beforeImage: 'https://via.placeholder.com/300',
                afterImage: 'https://via.placeholder.com/300',
                title: '',
                description: '',
                code: `BA-${nextCodeNumber.toString().padStart(4, '0')}`
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Error fetching data', 'error');
        }
    };

    const handleUploadImage = async (file, entryCode, fileName) => {
        const dir = `before-after/${entryCode}`;
        try {
            const data = editingId ? await replaceFile(file, dir, fileName) : await uploadFile(file, dir, fileName);
            return data.fullUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar('Error uploading image', 'error');
        }
    };

    const handleSave = async (item) => {
        try {
            if (item._id) {
                await axiosInstance.put(`/before-after/${item._id}`, item);
            } else {
                await axiosInstance.post('/before-after', item);
                const nextCodeNumber = parseInt(newEntry.code.split('-')[1]) + 1;
                setNewEntry({
                    beforeImage: '',
                    afterImage: '',
                    title: '',
                    description: '',
                    code: `BA-${nextCodeNumber.toString().padStart(4, '0')}`
                });
                showSnackbar('New entry added successfully', 'success');
            }
            fetchData();
            setEditingId(null);
        } catch (error) {
            console.error('Error saving entry:', error);
            showSnackbar('Error saving entry', 'error');
        }
    };

    const handleDelete = async (item) => {
        deleteFile(item.beforeImage.split('/uploads/')[1], 'uploads').then((data) => console.log(data)).catch((error) => console.error(error));
        deleteFile(item.afterImage.split('/uploads/')[1], 'uploads').then((data) => console.log(data)).catch((error) => console.error(error));
        try {
            await axiosInstance.delete(`/before-after/${item._id}`);
            fetchData();
            showSnackbar('Entry deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting entry:', error);
            showSnackbar('Error deleting entry', 'error');
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleInputChange = (id, field, value) => {
        if (id) {
            setData((prevData) =>
                prevData.map((item) =>
                    item._id === id ? { ...item, [field]: value } : item
                )
            );
        } else {
            setNewEntry((prevNewEntry) => ({ ...prevNewEntry, [field]: value }));
        }
    };

    const handleImageUploadChange = async (id, field, file, fileName, code) => {
        const url = await handleUploadImage(file, code, fileName);
        if (url) handleInputChange(id, field, url);
    };

    const renderCardContent = (item, isEditing) => (
        <CardContent>
            {isEditing ? (
                <>
                    <CardMedia
                        onClick={() => document.getElementById(`beforeImage-upload-${item._id || 'new'}`).click()}
                        component="img"
                        height="200"
                        image={item.beforeImage}
                        alt="Before Image"
                        sx={{ cursor: 'pointer' }}
                    />
                    <CardMedia
                        onClick={() => document.getElementById(`afterImage-upload-${item._id || 'new'}`).click()}
                        component="img"
                        height="200"
                        image={item.afterImage}
                        alt="After Image"
                        sx={{ cursor: 'pointer', mt: 2 }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`beforeImage-upload-${item._id || 'new'}`}
                        onChange={(e) => handleImageUploadChange(item._id, 'beforeImage', e.target.files[0], `${item.code}-before.jpg`, item.code)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`afterImage-upload-${item._id || 'new'}`}
                        onChange={(e) => handleImageUploadChange(item._id, 'afterImage', e.target.files[0], `${item.code}-after.jpg`, item.code)}
                    />
                    <Typography variant="h6" align="center" gutterBottom>
                        Code: {item.code}
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        label="Title"
                        value={item.title}
                        onChange={(e) => handleInputChange(item._id, 'title', e.target.value)}
                        sx={{ marginBottom: 1 }}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        label="Description"
                        multiline
                        value={item.description}
                        onChange={(e) => handleInputChange(item._id, 'description', e.target.value)}
                    />
                </>
            ) : (
                <>
                    <CardMedia component="img" height="200" image={item.beforeImage} alt="Before Image" />
                    <CardMedia component="img" height="200" image={item.afterImage} alt="After Image" sx={{ mt: 2 }} />
                    <Typography variant="h6" align="center" gutterBottom>
                        {item.title} : {item.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description.slice(0, 100)}
                    </Typography>
                </>
            )}
        </CardContent>
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Before & After
            </Typography>
            <Grid container spacing={3}>
                {data.map((item) => {
                    const isEditing = editingId === item._id;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Card sx={{ height: 600 }}>
                                    {renderCardContent(item, isEditing)}
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        {isEditing ? (
                                            <>
                                                <Button startIcon={<Save />} onClick={() => handleSave(item)} variant="contained" color="primary">
                                                    Save
                                                </Button>
                                                <Button startIcon={<Cancel />} onClick={() => setEditingId(null)} variant="outlined" color="secondary">
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title='Edit'>
                                                    <IconButton color="primary" onClick={() => handleEdit(item._id)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Delete'>
                                                    <IconButton color="secondary" onClick={() => handleDelete(item)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    );
                })}
                <Grid item xs={12} sm={6} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ border: '2px dashed #ccc', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CardContent>
                                {renderCardContent(newEntry, true)}
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button variant='outlined' startIcon={<Add sx={{ mr: 2, ml: 2 }} />} onClick={() => handleSave(newEntry)}>
                                        Add
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ManageBeforeAfter;
