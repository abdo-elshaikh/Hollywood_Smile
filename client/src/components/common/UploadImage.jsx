import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, LinearProgress, IconButton, Tooltip, Grid, CircularProgress } from "@mui/material";
import { CloudUpload, Clear, Error, AttachFile } from "@mui/icons-material";
import { uploadImage } from "../../services/uploadImage";
import { useTranslation } from "react-i18next";

const UploadImage = () => {
    const [file, setFile] = useState(null);
    const [directory, setDirectory] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (file) {
            setError(null);
        }
    }, [file]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        if (!directory) {
            setError("Please specify a directory.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setError("File size exceeds the limit of 50MB.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const data = await uploadImage(file, directory, "uploads");
            if (data) {
                setImageUrl(data.fullUrl);
                setProgress(100);
            } else {
                setError("Upload failed.");
            }
        } catch (err) {
            setError(`Upload failed: ${err.message}`);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
            }}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
            />
            <label htmlFor="fileInput">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<AttachFile />}
                >
                    {t("common.selectFile")}
                </Button>
            </label>
            {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {file.name}
                </Typography>
            )}
            <TextField
                variant="outlined"
                label={t("common.directory")}
                value={directory}
                onChange={(e) => setDirectory(e.target.value)}
                sx={{ mt: 1 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ mt: 2 }}
                startIcon={<CloudUpload />}
            >
                {t("common.upload")}
            </Button>
            {uploading && (
                <Box sx={{ width: "100%", mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            {imageUrl && (
                <Box sx={{ mt: 2 }}>
                    <img
                        src={imageUrl}
                        alt="Uploaded file"
                        style={{ maxWidth: "100%", maxHeight: 300 }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default UploadImage;
