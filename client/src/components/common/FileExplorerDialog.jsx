import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Box,
    Grid,
    Paper,
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
} from "@mui/material";
import {
    CloudUpload,
    Folder,
    Description,
    ContentCopy,
    ContentCut,
    Edit,
    Delete,
    Home,
    ArrowBack,
    ArrowForward,
    Refresh,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { uploadImage } from "../../services/uploadImage";
import FileViewer from "./FileViewer";

const FileExplorerDialog = ({ open, onClose, onSelectFile }) => {
    const showSnackbar = useSnackbar();
    const [directoryPath, setDirectoryPath] = useState("/");
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [contextItem, setContextItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [clipboard, setClipboard] = useState(null);
    const [clipboardPath, setClipboardPath] = useState("");
    const [clipboardAction, setClipboardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(["/"]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        if (open) fetchItems();
    }, [directoryPath, open]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const result = await fileService.getFilesInDirectory(directoryPath);
            setFolders(result.files.filter((item) => item.type === "directory"));
            setFiles(result.files.filter((item) => item.type !== "directory"));
        } catch (error) {
            showSnackbar(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showSnackbar("Please select a file to upload", "error");
            return;
        }
        try {
            setUploading(true);
            const data = await uploadImage(selectedFile, directoryPath);
            if (data) {
                setUploadProgress(Math.round((data.loaded * 100) / data.total));
                showSnackbar("File uploaded successfully", "success");
            }
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message, "error");
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setSelectedFile(null);
        }
    };

    const handleSelectFile = (file) => {
        const basePath = import.meta.env.VITE_API_URL + "/uploads/";
        const filePath = `${basePath}${directoryPath}${file.name}`;
        onSelectFile({ ...file, path: filePath });
        showSnackbar("File selected", "success");
        onClose();
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

    const handleDialogOpen = (isFolderCreation = false) => {
        setIsCreatingFolder(isFolderCreation);
        setNewName(isFolderCreation ? "" : contextItem?.name || "");
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewName("");
        setContextItem(null);
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
            <DialogTitle>File Explorer</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" onClick={() => setDirectoryPath("/")}>
                            Home
                        </Link>
                        {directoryPath
                            .split("/")
                            .filter(Boolean)
                            .map((part, index, arr) => {
                                const path = `/${arr.slice(0, index + 1).join("/")}/`;
                                return (
                                    <Link key={path} color="inherit" onClick={() => setDirectoryPath(path)}>
                                        {part}
                                    </Link>
                                );
                            })}
                    </Breadcrumbs>
                    <Box display="flex" gap={1}>
                        <Button onClick={() => handleDialogOpen(true)} variant="outlined">
                            New Folder
                        </Button>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            disabled={uploading}
                            onClick={() => document.getElementById("file-input").click()}
                        >
                            {selectedFile ? "Upload" : "Upload File"}
                        </Button>
                        <input id="file-input" type="file" hidden onChange={handleFileSelect} />
                    </Box>
                </Box>
                {uploading && <LinearProgress variant="determinate" value={uploadProgress} />}
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
            </DialogContent>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleContextMenuClose}
                PaperProps={{ style: { maxHeight: 200 } }}
            >
                <MenuItem onClick={() => handleSelectFile(contextItem)}>Select</MenuItem>
                <MenuItem onClick={() => handleDialogOpen()}>Rename</MenuItem>
                <MenuItem onClick={() => setClipboard(contextItem)}>Copy</MenuItem>
                <MenuItem onClick={() => setClipboard(contextItem, "cut")}>Cut</MenuItem>
                <MenuItem onClick={() => handleDialogOpen(true)}>Delete</MenuItem>
            </Menu>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileExplorerDialog;
