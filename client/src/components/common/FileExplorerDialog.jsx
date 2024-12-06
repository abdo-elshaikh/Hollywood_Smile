import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Breadcrumbs,
    Link,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    CircularProgress,
} from "@mui/material";
import {
    CloudUpload,
    Folder,
    Description,
    ContentCopy,
    ContentCut,
    Delete,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import {
    uploadFile,
    listFiles,
    deleteFile,
    copyFile,
    moveFile,
} from "../../services/supabaseService";

const FileExplorerDialog = ({ open, onClose, onSelectFile }) => {
    const showSnackbar = useSnackbar();
    const [directoryPath, setDirectoryPath] = useState("");
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [contextItem, setContextItem] = useState(null);
    const [clipboard, setClipboard] = useState(null);
    const [clipboardAction, setClipboardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (open) fetchItems();
    }, [directoryPath, open]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await listFiles("uploads", directoryPath);
            setFolders(data.filter((item) => item.id === null));
            setFiles(data.filter((item) => item.id !== null));
        } catch (error) {
            showSnackbar(error.message || "Failed to load items.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showSnackbar("Please select a file to upload.", "error");
            return;
        }
        try {
            setUploading(true);
            const data = await uploadFile(selectedFile, directoryPath, selectedFile.name);
            if (data) {
                showSnackbar("File uploaded successfully.", "success");
                await fetchItems();
            }
        } catch (error) {
            showSnackbar(error.message || "File upload failed.", "error");
        } finally {
            setUploading(false);
            setSelectedFile(null);
        }
    };

    const handleContextMenuOpen = (event, item) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setContextItem(item);
    };

    const handleContextMenuClose = () => {
        setAnchorEl(null);
        setContextItem(null);
    };

    const handleDelete = async (item) => {
        try {
            await deleteFile(`${directoryPath}${item.name}`);
            showSnackbar("File deleted successfully.", "success");
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message || "File deletion failed.", "error");
        }
    };

    const handleClipboardAction = async () => {
        if (!clipboard || !clipboardAction) return;
        try {
            if (clipboardAction === "copy") {
                await copyFile(`${directoryPath}${clipboard.name}`, directoryPath);
                showSnackbar("File copied successfully.", "success");
            } else if (clipboardAction === "cut") {
                await moveFile(`${directoryPath}${clipboard.name}`, directoryPath);
                showSnackbar("File moved successfully.", "success");
            }
            setClipboard(null);
            setClipboardAction(null);
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message || "Clipboard action failed.", "error");
        }
    };

    const handleSelectFile = (file) => {
        const basePath = import.meta.env.VITE_SUPABASE_BUCKET_URL;
        const filePath = `${basePath}/${directoryPath}${file.name}`;
        onSelectFile({ path: filePath, type: file.metadata.mimetype });
        setDirectoryPath("");
        showSnackbar("File selected successfully.", "success");
        onClose();
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>File Explorer</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" onClick={() => setDirectoryPath("")}>
                            Home
                        </Link>
                        {directoryPath.split("/").filter(Boolean).map((path, index) => (
                            <Link
                                key={index}
                                color="inherit"
                                onClick={() =>
                                    setDirectoryPath(
                                        directoryPath.split("/").slice(0, index + 1).join("/") + "/"
                                    )
                                }
                            >
                                {path}
                            </Link>
                        ))}
                    </Breadcrumbs>
                    <Box display="flex" gap={1}>
                        <Button component="label" variant="outlined" startIcon={<CloudUpload />}>
                            Upload File
                            <input type="file" hidden onChange={handleFileSelect} />
                        </Button>
                        {selectedFile && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </Button>
                        )}
                    </Box>
                </Box>
                {uploading && <LinearProgress />}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredFolders.map((folder) => (
                            <Grid item xs={6} sm={3} md={2} key={folder.name}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => setDirectoryPath(`${directoryPath}${folder.name}/`)}
                                        onContextMenu={(e) => handleContextMenuOpen(e, folder)}
                                    >
                                        <CardContent>
                                            <Folder fontSize="large" />
                                            <Typography variant="h6">{folder.name}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                        {filteredFiles.map((file) => (
                            <Grid item xs={6} sm={3} md={2} key={file.name}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => handleSelectFile(file)}
                                        onContextMenu={(e) => handleContextMenuOpen(e, file)}
                                    >
                                        <CardContent>
                                            <Description fontSize="large" />
                                            <Typography variant="h6">{file.name}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </DialogContent>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleContextMenuClose}
                PaperProps={{ style: { maxHeight: 200 } }}
            >
                <MenuItem onClick={() => handleSelectFile(contextItem)}>Select</MenuItem>
                <MenuItem onClick={() => setClipboard(contextItem)}>Copy</MenuItem>
                <MenuItem
                    onClick={() => {
                        setClipboard(contextItem);
                        setClipboardAction("cut");
                    }}
                >
                    Cut
                </MenuItem>
                <MenuItem onClick={() => handleDelete(contextItem)}>Delete</MenuItem>
            </Menu>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileExplorerDialog;
