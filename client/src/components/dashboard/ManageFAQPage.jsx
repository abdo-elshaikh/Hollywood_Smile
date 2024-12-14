import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Switch, FormControlLabel, useTheme, useMediaQuery,
    CircularProgress, List, ListItem, ListItemText, ListItemIcon, Divider
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import axiosInstance from '../../services/axiosInstance';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useAuth } from '../../contexts/AuthContext';




const ManageFAQPage = () => {
    const { user } = useAuth();
    const [faqs, setFaqs] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const showSnackbar = useSnackbar();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [editData, setEditData] = useState({
        _id: null,
        question_en: "",
        question_ar: "",
        answer_en: "",
        answer_ar: "",
        showInHome: false,
        available: true,
        tags: [],
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

      
    

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/faqs');
            if (response.status === 200) {
                setFaqs(response.data);
                setTags([...new Set(response.data.map((faq) => faq.tags).flat())]);
            } else {
                console.error('Failed to fetch FAQs');
            }
        } catch (error) {
            console.error('Failed to fetch FAQs', error);
        }
        setIsLoading(false);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setEditData(null);
        setOpen(false);
    };

    const handleSaveFAQ = async () => {
        try {
            if (editData?._id) {
                await axiosInstance.put(`/faqs/${editData._id}`, editData);
            } else {
                await axiosInstance.post("/faqs", editData);
            }
            fetchFAQs();
            showSnackbar("FAQ saved successfully", "success");
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving FAQ:", error);
        }
    };

    const handleDeleteFAQ = async (id) => {
        try {
            await axiosInstance.delete(`/faqs/${id}`);
            setFaqs(faqs.filter((faq) => faq._id !== id));
            showSnackbar("FAQ deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    const handleToggleShowInHome = async (faq) => {
        try {
            await axiosInstance.put(`/faqs/${faq.id}`, { ...faq, showInHome: !faq.showInHome });
            setFaqs(faqs.map((f) => (f._id === faq.id ? { ...f, showInHome: !f.showInHome } : f)));
            showSnackbar("FAQ toggled successfully", "success");
        } catch (error) {
            console.error("Error toggling showInHome:", error);
        }
    };

    const handleToggleAvailable = async (faq) => {
        try {
            await axiosInstance.put(`/faqs/${faq.id}`, { ...faq, available: !faq.available });
            setFaqs(faqs.map((f) => (f._id === faq.id ? { ...f, available: !f.available } : f)));
            showSnackbar("FAQ toggled successfully", "success");
        } catch (error) {
            console.error("Error toggling available:", error);
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'question_en', headerName: 'Question (EN)', flex: 2 },
        { field: 'question_ar', headerName: 'Question (AR)', flex: 2 },
        {
            field: 'showInHome',
            headerName: 'Show on Home',
            renderCell: (params) => (
                <Switch
                    checked={params.value}
                    onChange={() => handleToggleShowInHome(params.row)}
                />
            )
        },
        {
            field: 'available',
            headerName: 'Available',
            renderCell: (params) => (
                <Switch
                    checked={params.value}
                    onChange={() => handleToggleAvailable(params.row)}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => handleOpenDialog(params.row)}
                    color="primary"
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDeleteFAQ(params.row.id)}
                    color="error"
                />
            ]
        }
    ];

    const rows = faqs.map((faq) => ({
        id: faq._id,
        name: faq.name,
        email: faq.email,
        phone: faq.phone,
        question_en: faq.question_en,
        question_ar: faq.question_ar,
        answer_en: faq.answer_en,
        answer_ar: faq.answer_ar,
        showInHome: faq.showInHome,
        available: faq.available
    }));


    // const addDemoData = async () => {
    //     try {
    //         await Promise.all(demoData.map(async (faq) => {
    //             if (!faqs.find((f) => f.question_en === faq.question_en)) {
    //                 await axiosInstance.post("/faqs", faq);
    //             }
    //         }));
    //         fetchFAQs();
    //         showSnackbar("Demo data added successfully", "success");
    //     } catch (error) {
    //         console.error("Error adding demo data:", error);
    //     }
    // }

    return (
        <Box >
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                sx={{ mb: 2 }}
            >
                Add FAQ
            </Button>
            {/* add demo data */}
            {/* <Button
                variant="contained"
                color="secondary"
                startIcon={<Add />} 
                onClick={addDemoData}
                sx={{ mb: 2, ml: 2 }}
            >
                Add Demo Data
            </Button> */}


            <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.default', overflow: 'auto' }}>
                {isSmallScreen ? (
                    <List>
                        {faqs.map((faq) => (
                            <ListItem key={faq._id} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
                                <ListItemText
                                    primary={faq.question_en}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {faq.question_ar}
                                            </Typography>
                                            <Divider variant="middle" sx={{ my: 1 }} />
                                            <Box display="flex" alignItems="center" >
                                                <Typography variant="body2">Show in Home</Typography>
                                                <Switch
                                                    checked={faq.showInHome}
                                                    onChange={() => handleToggleShowInHome(faq)}
                                                />
                                                <Typography variant="body2">Available</Typography>
                                                <Switch
                                                    checked={faq.available}
                                                    onChange={() => handleToggleAvailable(faq)}
                                                />
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1, backgroundColor: 'background.paper' }}>
                                    <Edit onClick={() => handleOpenDialog(faq)} />
                                    <Delete onClick={() => handleDeleteFAQ(faq._id)} />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        loading={isLoading}
                    />
                )}
            </Box>

            <FAQDialog open={open} onClose={handleCloseDialog} faqData={editData} setFaqData={setEditData} onSave={handleSaveFAQ} />
            <FaqDetails open={openDetails} onClose={() => setOpenDetails(false)} faq={editData} />
        </Box>
    );
};

const FAQDialog = ({ open, onClose, faqData, setFaqData, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{faqData?._id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Question (EN)"
                    fullWidth
                    margin="dense"
                    value={faqData?.question_en || ""}
                    onChange={(e) => setFaqData({ ...faqData, question_en: e.target.value })}
                />
                <TextField
                    label="Question (AR)"
                    fullWidth
                    margin="dense"
                    value={faqData?.question_ar || ""}
                    onChange={(e) => setFaqData({ ...faqData, question_ar: e.target.value })}
                />
                <TextField
                    label="Answer (EN)"
                    fullWidth
                    margin="dense"
                    multiline
                    value={faqData?.answer_en || ""}
                    onChange={(e) => setFaqData({ ...faqData, answer_en: e.target.value })}
                />
                <TextField
                    label="Answer (AR)"
                    fullWidth
                    margin="dense"
                    multiline
                    value={faqData?.answer_ar || ""}
                    onChange={(e) => setFaqData({ ...faqData, answer_ar: e.target.value })}
                />
                <FormControlLabel
                    control={<Switch checked={faqData?.showInHome || false} onChange={(e) => setFaqData({ ...faqData, showInHome: e.target.checked })} />}
                    label="Show on Home"
                />
                <FormControlLabel
                    control={<Switch checked={faqData?.available || false} onChange={(e) => setFaqData({ ...faqData, available: e.target.checked })} />}
                    label="Available"
                />
                {/* tags */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    tags will be used for searching FAQs
                </Typography>
                <TextField
                    label="Tags"
                    fullWidth
                    margin="dense"
                    value={faqData?.tags?.join(', ') || ""}
                    onChange={(e) => setFaqData({ ...faqData, tags: e.target.value.split(',').map((tag) => tag.trim()) })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

const FaqDetails = ({ faq, onClose, open }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{faq.question_en}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Name: {faq.name}</Typography>
                    <Typography variant="body1">Email: {faq.email}</Typography>
                    <Typography variant="body1">Phone: {faq.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Question (EN): {faq.question_en}</Typography>
                    <Typography variant="body1">Question (AR): {faq.question_ar}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Answer (EN): {faq.answer_en}</Typography>
                    <Typography variant="body1">Answer (AR): {faq.answer_ar}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Show on Home: {faq.showInHome ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1">Available: {faq.available ? 'Yes' : 'No'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Tags: {faq.tags.join(', ')}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageFAQPage;
