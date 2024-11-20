import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Delete, Edit, MarkChatRead } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from '../../services/axiosInstance';
import MessageDetails from "../common/MessageDetails";
import { useSnackbar } from "../../contexts/SnackbarProvider";

const ManageMessagesPage = ({ setCurrentPage }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const showSnackbar = useSnackbar();

    const fetchMessages = async () => {
        setCurrentPage("messages");
        setLoading(true);
        try {
            const response = await axiosInstance.get("/messages");
            setMessages(response.data);
        } catch (error) {
            showSnackbar("Failed to fetch messages", "error");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axiosInstance.put(`/messages/${id}`, { read: true });
            showSnackbar("Message marked as read", "success");
            fetchMessages();
        } catch (error) {
            showSnackbar("Failed to mark message as read", "error");
        }
    };

    const deleteMessage = async (id) => {
        try {
            await axiosInstance.delete(`/messages/${id}`);
            showSnackbar("Message deleted", "success");
            fetchMessages();
        } catch (error) {
            showSnackbar("Failed to delete message", "error");
        }
    };


    useEffect(() => {
        fetchMessages();
    }, []);

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "phone", headerName: "Phone", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "message", headerName: "Message", flex: 2 },
        {
            field: "read",
            headerName: "Status",
            flex: 0.5,
            renderCell: (params) => (
                <Typography color={params.value ? "success.main" : "error.main"}>
                    {params.value ? "Read" : "Unread"}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button
                        color="primary"
                        size="small"
                        onClick={() => markAsRead(params.row._id)}
                        disabled={params.row.read}
                    >
                        <MarkChatRead />
                    </Button>
                    <Button
                        color="error"
                        size="small"
                        onClick={() => deleteMessage(params.row._id)}
                    >
                        <Delete />
                    </Button>
                </>
            ),
        },
    ];

    const rowData = messages.map((message) => ({
        _id: message._id,
        name: message.name,
        phone: message.phone,
        email: message.email,
        message: message.message,
        read: message.read,
    }))

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Manage Messages
            </Typography>
            <Box mt={2} style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={rowData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    loading={loading}
                    getRowId={(row) => row._id}
                    onCellDoubleClick={(params) => {
                        setSelectedMessage(params.row);
                        setOpenDetails(true);
                    }}
                />
            </Box>
            <MessageDetails
                open={openDetails}
                onClose={() => setOpenDetails(false)}
                message={selectedMessage}
            />
        </Box>
    );
};

export default ManageMessagesPage;
