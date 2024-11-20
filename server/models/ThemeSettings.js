const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThemeSettingsSchema = new Schema({
    mode: { 
        type: String, 
        required: true, 
        enum: ['light', 'dark'],
        default: 'light'
    },
    palette: {
        primary: { 
            main: { type: String, required: true },
            contrastText: { type: String, default: '#ffffff' }
        },
        secondary: { 
            main: { type: String, required: true },
            contrastText: { type: String, default: '#ffffff' }
        },
        error: { 
            main: { type: String, default: '#f44336' }
        },
        warning: { 
            main: { type: String, default: '#ff9800' }
        },
        info: { 
            main: { type: String, default: '#2196f3' }
        },
        success: { 
            main: { type: String, default: '#4caf50' }
        },
        background: {
            default: { type: String, required: true },
            paper: { type: String, required: true },
        },
        text: {
            primary: { type: String, default: '#000000' },
            secondary: { type: String, default: '#757575' }
        }
    },
    typography: {
        fontFamily: { type: String, required: true, default: 'Arial, sans-serif' },
        fontSize: { type: Number, default: 14 },
        fontWeightLight: { type: Number, default: 300 },
        fontWeightRegular: { type: Number, default: 400 },
        fontWeightMedium: { type: Number, default: 500 },
        fontWeightBold: { type: Number, default: 700 },
    },
    shadows: {
        type: [String],  // Allow for an array of shadow strings for detailed control
        required: true,
        default: ["none", "0px 1px 3px rgba(0, 0, 0, 0.2)", "0px 3px 6px rgba(0, 0, 0, 0.3)"]
    },
    borderRadius: { 
        type: Number, 
        default: 8 // Base border radius for consistent layout design
    },
    spacing: { 
        type: Number, 
        default: 8 // Base spacing unit for consistent layout design
    }
}, { timestamps: true });

module.exports = mongoose.model('ThemeSettings', ThemeSettingsSchema);
