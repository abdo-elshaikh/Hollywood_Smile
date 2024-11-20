// models/Gallery.js
const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true, },
    description: { type: String },
    imageUrl: { type: String, required: true, },
    altText: { type: String, default: 'No Image' },
    categories: [String],
    tags: [String],
    date: { type: Date, default: Date.now },
    photographer: { type: String, default: 'Hollywood Smile' },
    likes: { type: Number, default: 0 },
    loves: { type: Number, default: 0 },
    
},
    {
        timestamps: true,
    }
);

const Gallery = mongoose.model('Gallery', GallerySchema);
module.exports = Gallery;