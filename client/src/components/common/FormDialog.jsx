import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Grid,
    Alert,
} from "@mui/material";

const FormDialog = ({ open, onClose, title, initialData, fields, onSubmit }) => {
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await onSubmit(formData);
            if (response.success) {
                setSuccess("Form submitted successfully!");
                setFormData(initialData); // Reset form data
                onClose(); // Close dialog after successful submission
            } else {
                setError(response.message || "Failed to submit form. Please try again.");
            }
        } catch (error) {
            setError("An error occurred while submitting the form.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {fields?.map((field) => (
                            <Grid item xs={12} sm={6} md={4} key={field.name}>
                                {field.type === "text" ||
                                    field.type === "number" ||
                                    field.type === "email" ||
                                    field.type === "date" ||
                                    field.type === "textarea" ||
                                    field.type === "time" ? (
                                    <TextField
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ""}
                                        onChange={handleChange}
                                        fullWidth
                                        required={field.required}
                                        variant="outlined"
                                    />
                                ) : field.type === "select" ? (
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>{field.label}</InputLabel>
                                        <Select
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            required={field.required}
                                            label={field.label}
                                        >
                                            {field.options?.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : field.type === "checkbox" ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={field.name}
                                                checked={formData[field.name] || false}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={field.label}
                                    />
                                ) : null}
                            </Grid>
                        ))}
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormDialog;
