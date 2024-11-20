const mongoose = require('mongoose');

const ServicesSchema = new mongoose.Schema(
    {
        title: {
            en: {
                type: String,
                required: [true, 'Title in English is required'],
            },
            ar: {
                type: String,
                required: [true, 'Title in Arabic is required'],
            },
        },
        description: {
            en: {
                type: String,
                required: [true, 'Description in English is required'],
            },
            ar: {
                type: String,
                required: [true, 'Description in Arabic is required'],
            },
        },
        details: {
            en: {
                type: String,
                required: [true, 'Details in English are required'],
            },
            ar: {
                type: String,
                required: [true, 'Details in Arabic are required'],
            },
        },
        price: {
            type: String,
            required: [true, 'Price is required'],
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
        },
        imageUrl: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },
        icon: {
            type: String,
            default: 'https://img.icons8.com/?size=100&id=107992&format=png&color=000000',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Services = mongoose.model('Services', ServicesSchema);

module.exports = Services;
