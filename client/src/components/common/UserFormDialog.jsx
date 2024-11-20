// UserFormDialog.js
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { createUser, updateUser } from "../../services/userService";
import { Password } from "@mui/icons-material";

const UserFormDialog = ({ open, onClose, onUserUpdated, userToEdit }) => {
    const [userData, setUserData] = useState({ name: "", email: "", role: "user", isActive: true });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setUserData(userToEdit);
        } else {
            setUserData({ name: "", email: "", role: "user", isActive: true });
        }
    }, [userToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (userToEdit) {
                await updateUser(userToEdit._id, userData);
            } else {
                // Create a new user
                userData.password = 'password@123';
                await createUser(userData);
            }
            onUserUpdated();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{userToEdit ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Role"
                        select
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        {/* 'visitor', 'admin', 'author', 'editor' */}
                        <option value="visitor">Visitor</option>
                        <option value="admin">Admin</option>
                        <option value="author">Author</option>
                        <option value="editor">Editor</option>
                    </TextField>
                    <TextField
                        label="Active"
                        select
                        value={userData.isActive ? "yes" : "no"}
                        onChange={(e) => setUserData({ ...userData, isActive: e.target.value === "yes" })}
                        fullWidth
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </TextField>
                    {loading && <CircularProgress />}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onUserUpdated} color="primary" disabled={loading}>
                    {userToEdit ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormDialog;
