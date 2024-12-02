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
  Select,
  MenuItem,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tooltip,
  Grid,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Search } from "@mui/icons-material";
import { getUsers, deleteUser, updateUser, createUser } from "../../services/userService";

const ManageUsersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch {
      console.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setUsers(users.filter((user) => user._id !== deleteUserId));
    } catch {
      console.error("Error deleting user");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser._id) {
        await updateUser(currentUser._id, currentUser);
      } else {
        await createUser(currentUser);
      }
      fetchUsers();
    } catch {
      console.error("Error saving user");
    } finally {
      setOpenUserFormDialog(false);
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenUserFormDialog(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.row.role}
          size="small"
          onChange={(e) => updateUser(params.row._id, { role: e.target.value })}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="visitor">Visitor</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="author">Author</MenuItem>
          <MenuItem value="support">Support</MenuItem>
        </Select>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.isActive}
          onChange={() => updateUser(params.row._id, { isActive: !params.row.isActive })}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditUser(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setDeleteUserId(params.row._id);
                setOpenDeleteDialog(true);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Search users..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setCurrentUser(null);
            setOpenUserFormDialog(true);
          }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
        {loading ? (
          <CircularProgress />
        ) : isMobile ? (
          <Grid container spacing={2}
            sx={{ borderRadius: 2, p: 2, overflow: "auto" }}
          >
            {filteredUsers.map((user) => (
              <Grid item xs={12} key={user._id} sx={{ mb: 2 }}>
                <Grid container spacing={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
                  <Grid item xs={8}>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setDeleteUserId(user._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12}
                    sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}
                  >
                    <Switch
                      checked={user.isActive}
                      onChange={() => updateUser(user._id, { isActive: !user.isActive })}
                    />

                    <Select
                      size="small"
                      sx={{ ml: 2 }}
                      value={user.role}
                      onChange={(e) => updateUser(user._id, { role: e.target.value })}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="visitor">Visitor</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                      <MenuItem value="author">Author</MenuItem>
                      <MenuItem value="support">Support</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
          />
        )}
      </Box>

      <Dialog open={openUserFormDialog} onClose={() => setOpenUserFormDialog(false)}>
        <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={currentUser?.name || ""}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserFormDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsersPage;
