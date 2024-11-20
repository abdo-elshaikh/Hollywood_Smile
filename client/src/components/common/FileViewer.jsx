import React, { useState, useEffect } from 'react';
import { IconButton, Box, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const FileViewer = ({ file, currentPath, onClose }) => {
    const BaseUrl = `/uploads/${currentPath}`;
    const [content, setContent] = useState('');

    const readFileContent = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setContent(e.target.result);
        };
        reader.onerror = () => {
            setContent('Error reading file');
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (file && file.type === 'text/plain') {
            readFileContent(file);
        }
    }, [file]);

    const renderFileContent = (file) => {
        if (!file) return <div>No file selected</div>;
        if (file.type.startsWith('image/')) {
            return <img src={`${BaseUrl}/${file.name}`} alt={file.name} style={{ width: '100%', height: 'auto' }} />;
        } else if (file.type.startsWith('application/pdf')) {
            return <iframe src={`${BaseUrl}/${file.name}`} title={file.name} style={{ width: '100%', height: '600px' }} />;
        } else if (file.type.startsWith('video/')) {
            return <video src={`${BaseUrl}/${file.name}`} controls style={{ width: '100%', height: 'auto' }} />;
        } else if (file.type.startsWith('audio/')) {
            return <audio src={`${BaseUrl}/${file.name}`} controls style={{ width: '100%', height: 'auto' }} />;
        } else {
            return <div>{content || 'File type not supported'}</div>;
        }
    };

    return (
        <Container sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', top: 16, right: 16 }}
            >
                <CloseIcon />
            </IconButton>
            {renderFileContent(file)}
        </Container>
    );
};

export default FileViewer;
