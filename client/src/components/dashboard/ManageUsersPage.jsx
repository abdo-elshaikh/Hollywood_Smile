import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { useAuth } from "../../contexts/AuthContext";
import { getUsers, deleteUser, updateUser, createUser } from "../../services/userService";
import { Delete, Edit } from "@mui/icons-material";

const ManageUsersPage = () => {
  // Context and State Management
  const { themeMode } = useCustomTheme();
  const { user } = useAuth();
  const showSnackbar = useSnackbar();

  // Component States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch Users on Component Mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const filteredData = data.users.filter((u) => u._id !== user._id);
      setUsers(filteredData);
    } catch (error) {
      showSnackbar("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting a User
  const handleDeleteUser = async () => {
    try {
      setUpdating(true);
      const response = await deleteUser(deleteUserId);
      if (!response.error) {
        showSnackbar("User deleted successfully", "success");
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== deleteUserId));
      } else {
        showSnackbar(response.message, "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Error deleting user", "error");
    } finally {
      setOpenDeleteDialog(false);
      setUpdating(false);
    }
  };

  // Handle Adding or Updating a User
  const handleSaveUser = async () => {
    try {
      setUpdating(true);
      if (currentUser._id) {
        // Update User
        const response = await updateUser(currentUser._id, currentUser);
        if (!response.error) {
          showSnackbar("User updated successfully", "success");
          fetchUsers();
        } else {
          showSnackbar(response.message, "error");
        }
      } else {
        // Add New User
        const password = import.meta.env.VITE_DEFAULT_PASSWORD;
        const data = await createUser({ ...currentUser, password });
        if (!data.error) {
          showSnackbar("User created successfully", "success");
          fetchUsers();
        } else {
          showSnackbar( data.message || 'Error creating user', "error");
        }
      }
    } catch (error) {
      showSnackbar(error.message || "Error saving user", "error");
    } finally {
      setOpenUserFormDialog(false);
      setUpdating(false);
    }
  };

  // Handle changing the role of a user
  const handleRoleChange = async (id, role) => {
    try {
      const response = await updateUser(id, { role });
      if (!response.error) {
        showSnackbar("User role updated successfully", "success");
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? { ...user, role } : user))
        );
      } else {
        showSnackbar(response.message, "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Error updating user role", "error");
    }
  };

  // Handle changing the status of a user
  const handleStatusChange = async (id, isActive) => {
    try {
      const response = await updateUser(id, { isActive });
      if (!response.error) {
        showSnackbar("User status updated successfully", "success");
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? { ...user, isActive } : user))
        );
      } else {
        showSnackbar(response.message, "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Error updating user status", "error");
    }
  };

  // Columns Configuration for DataGrid
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      editable: true,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value}
          onChange={(e) => handleRoleChange(params.id, e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="visitor">Visitor</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="author">Author</MenuItem>
        </Select>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Switch
          // size="small"
          color="primary"
          checked={params.value}
          onChange={(e) => handleStatusChange(params.id, e.target.checked)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color="error"
            onClick={() => {
              setDeleteUserId(params.row._id);
              setOpenDeleteDialog(true);
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => {
              setCurrentUser(params.row);
              setOpenUserFormDialog(true);
            }}
          >
            <Edit />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        Manage Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setCurrentUser(null);
          setOpenUserFormDialog(true);
        }}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
          />
        </Box>
      )}

      {/* Add User Form Dialog */}
      <Dialog
        open={openUserFormDialog}
        onClose={() => setOpenUserFormDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={currentUser?.username || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={currentUser?.email || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSaveUser} sx={{ marginTop: 2 }}>
            {currentUser ? "Save Changes" : "Add User"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {users.find((user) => user._id === deleteUserId)?.username} user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsersPage;
