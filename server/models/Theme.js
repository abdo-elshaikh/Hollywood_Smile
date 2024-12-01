const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark'], default: 'light' },
  colors: {
    primary: { type: String, default: '#1976d2' },
    secondary: { type: String, default: '#FAB12F' },
    text: { type: String, default: '#0D1321' },
    title: { type: String, default: '#2F89FC' },
    background: { type: String, default: '#F7F9FC' },
    border: { type: String, default: '#E3F2FD' },
    shadow: { type: String, default: '#E3F2FD' },
    subtitle: { type: String, default: '#575C66' },
    default: { type: String, default: '#f5f5f5' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);
