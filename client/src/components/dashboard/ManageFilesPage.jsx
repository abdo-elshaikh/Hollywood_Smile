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
import fileService from "../../services/fileService";
import FileViewer from "../common/FileViewer";

const ManageFilesPage = () => {
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
        fetchItems();
    }, [directoryPath]);

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

    const handleFileSelect = async (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        const selectedFile = event.target.files[0];
        try {
            setUploading(true);
            const response = await fileService.uploadFile(selectedFile, directoryPath);
            setUploadProgress(Math.round((response.loaded * 100) / response.total));
            showSnackbar("File uploaded successfully", "success");
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message, "error");
        } finally {
            setUploading(false);
            setUploadProgress(0);
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

    const handleCopy = () => {
        setClipboardPath(directoryPath);
        setClipboard(contextItem);
        setClipboardAction("copy");
        handleContextMenuClose();
        showSnackbar("Item copied to clipboard", "info");
    };

    const handleCut = () => {
        setClipboardPath(directoryPath);
        setClipboard(contextItem);
        setClipboardAction("cut");
        handleContextMenuClose();
        showSnackbar("Item cut to clipboard", "info");
    };

    const handlePaste = async () => {
        if (!clipboard) {
            showSnackbar("Clipboard is empty", "error");
            return;
        }

        const source = `${clipboardPath}${clipboard.name}`;
        const destination = directoryPath;

        try {
            if (clipboardAction === "copy") {
                await fileService.copyFile(source, destination);
                showSnackbar("Item copied successfully", "success");
            } else if (clipboardAction === "cut") {
                await fileService.moveFile(source, destination);
                showSnackbar("Item moved successfully", "success");
            }
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message, "error");
        } finally {
            setClipboard(null);
            setClipboardPath("");
            setClipboardAction(null);
        }
    };

    const handleDelete = async () => {
        if (!contextItem) return;
        try {
            await fileService.deleteFile(directoryPath, contextItem.name);
            showSnackbar("Item deleted successfully", "success");
            await fetchItems();
        } catch (error) {
            showSnackbar(error.message, "error");
        } finally {
            handleContextMenuClose();
        }
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

    const handleRenameOrCreate = async () => {
        if (isCreatingFolder) {
            if (!newName) {
                showSnackbar("Folder name cannot be empty", "error");
                return;
            }
            const data = {
                directoryPath,
                name: newName,
                type: "directory",
            };
            try {
                await fileService.createItem(data);
                showSnackbar("Folder created successfully", "success");
                await fetchItems();
            } catch (error) {
                showSnackbar(error.message, "error");
            }
        } else {
            try {
                await fileService.renameFile(directoryPath, contextItem.name, newName);
                showSnackbar("File renamed successfully", "success");
                await fetchItems();
            } catch (error) {
                showSnackbar(error.message, "error");
            }
        }
        handleDialogClose();
    };

    const handlePreviewOpen = (file) => {
        setSelectedFile(file);
        setPreviewDialogOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewDialogOpen(false);
        setSelectedFile(null);
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClickPath = (path) => {
        if (directoryPath === path) return;
        setDirectoryPath(path.includes(directoryPath) ? directoryPath.slice(0, path.length + 1) : path);
    };

    const handleClickFolder = (folderName) => {
        const newPath = `${directoryPath}${folderName}/`;
        setHistory([...history.slice(0, historyIndex + 1), newPath]);
        setHistoryIndex(historyIndex + 1);
        setDirectoryPath(newPath);
    };

    return (
        <Box component="section" p={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
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
                        onClick={() => document.getElementById("file-upload").click()}
                    >
                        Upload File
                    </Button>
                    <input accept="*" multiple id="file-upload" type="file" hidden onChange={handleUpload} />
                    <Button onClick={handlePaste} variant="outlined" disabled={!clipboard}>
                        Paste
                    </Button>
                </Box>
            </Box>
            {uploading && <LinearProgress variant="determinate" value={uploadProgress} />}
            <Box
                component={Paper}
                sx={{
                    display: "flex",
                    mb: 2,
                    alignItems: "center",
                    p: 1
                }}
            >
                <Button onClick={() => setDirectoryPath("")} startIcon={<Home />} />
                <Button
                    onClick={() => {
                        if (historyIndex > 0) {
                            setHistoryIndex(historyIndex - 1);
                            setDirectoryPath(history[historyIndex - 1]);
                        }
                    }}
                    disabled={historyIndex === 0}
                >
                    <ArrowBack />
                </Button>
                <Button onClick={fetchItems} >
                    <Refresh />
                </Button>
                <Button
                    onClick={() => {
                        if (historyIndex < history.length - 1) {
                            setHistoryIndex(historyIndex + 1);
                            setDirectoryPath(history[historyIndex + 1]);
                        }
                    }}
                    disabled={historyIndex === history.length - 1}
                >
                    <ArrowForward />
                </Button>

                <TextField
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: "100%",
                        maxWidth: "300px",
                    }}
                />
            </Box>
            <Grid container spacing={2}>
                {filteredFolders.map((folder) => (
                    <Grid item xs={6} sm={4} md={2} key={folder.name}>
                        <Card >
                            <CardActionArea
                                onContextMenu={(e) => handleContextMenuOpen(e, folder)}
                                onClick={() => handleClickFolder(folder.name)}
                                sx={{ cursor: "pointer", height: "100%" }}
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
                    <Grid item xs={6} sm={4} md={2} key={file.name} >
                        <Card>
                            <CardActionArea
                                onContextMenu={(e) => handleContextMenuOpen(e, file)}
                                onClick={() => handlePreviewOpen(file)}
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
            <Dialog open={previewDialogOpen} onClose={handlePreviewClose}>
                <FileViewer file={selectedFile} />
                <DialogActions>
                    <Button onClick={handlePreviewClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleContextMenuClose}
            >
                <MenuItem onClick={handleCopy} startIcon={<ContentCopy />}>
                    Copy
                </MenuItem>
                <MenuItem onClick={handleCut} startIcon={<ContentCut />}>
                    Cut
                </MenuItem>
                <MenuItem onClick={() => handleDialogOpen(false)} startIcon={<Edit />}>
                    Rename
                </MenuItem>
                <MenuItem onClick={handleDelete} startIcon={<Delete />}>
                    Delete
                </MenuItem>
            </Menu>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isCreatingFolder ? "Create New Folder" : "Rename Item"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={isCreatingFolder ? "Folder Name" : "New Name"}
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleRenameOrCreate}>
                        {isCreatingFolder ? "Create" : "Rename"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageFilesPage;
