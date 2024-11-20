import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Modal, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import commentService from "../../services/commentService";

const ManageComments = () => {
    const showSnackbar = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [comments, setComments] = useState([]);

    // Fetch comments from the server
    const fetchComments = async () => {
        try {
            const data = await commentService.getComments();
            setComments(data);
        } catch (err) {
            showSnackbar(err.message, "error");
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        if (currentComment) {
            setEditedText(currentComment.content);
        }
    }, [currentComment]);

    const handleEditClick = (comment) => {
        setCurrentComment(comment);
        setEditedText(comment.content);
        setOpenModal(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await commentService.deleteComment(id);
            showSnackbar("Comment deleted successfully", "success");
            fetchComments();
        } catch (err) {
            showSnackbar(err.message, "error");
        }
    };

    const handleUpdate = async () => {
        try {
            await commentService.updateComment(currentComment._id, { content: editedText });
            showSnackbar("Comment updated successfully", "success");
            setOpenModal(false);
            fetchComments();
        } catch (err) {
            showSnackbar(err.message, "error");
        }
    };

    // Define columns for the DataGrid
    const columns = [
        { field: 'user', headerName: 'User', flex: 1, renderCell: (params) => params.value?.name },
        { field: 'content', headerName: 'Comment', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEditClick(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row._id)}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ padding: 4 }}
        >
            <Typography variant="h4" gutterBottom>
                Manage Comments
            </Typography>

            {/* DataGrid Component */}
            <Box sx={{ height: 500, width: '100%', marginTop: 2 }}>
                <DataGrid
                    rows={comments}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                />
            </Box>

            {/* Modal for Editing Comments */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: "auto",
                    marginTop: "10%"
                }}>
                    <Typography variant="h6">Edit Comment</Typography>
                    <TextField
                        fullWidth
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" onClick={handleUpdate}>Update</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default ManageComments;
