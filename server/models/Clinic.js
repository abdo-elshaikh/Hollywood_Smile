const mongoose = require('mongoose');

// Achievement Schema
const AchievementSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true, // Ensure number is required
        min: 0 // Optional: Ensure it is non-negative
    },
    label: {
        en: {
            type: String,
            unique: true,
            required: true,
            trim: true // Optional: Remove whitespace from both ends
        },
        ar: {
            type: String,
            unique: true,
            required: true,
            trim: true // Optional: Remove whitespace from both ends
        }
    },
    icon: {
        type: String,
        default: '' // Optional: Provide a default value
    },
    description: {
        en: {
            type: String,
            default: '' // Optional: Provide a default value
        },
        ar: {
            type: String,
            default: '' // Optional: Provide a default value
        }
    }
}, { _id: false });

// Clinic Schema
const ClinicSchema = new mongoose.Schema({
    name: {
        en: {
            type: String,
            required: true
        },
        ar: {
            type: String,
            required: true
        }
    },
    subtitle: {
        en: {
            type: String,
            required: true
        },
        ar: {
            type: String,
            required: true
        }
    },
    logo: {
        light: {
            type: String,
            required: true
        },
        dark: {
            type: String,
            required: true
        }
    },
    address: {
        en: {
            type: String,
            required: true
        },
        ar: {
            type: String,
            required: true
        }
    },
    zip: String,
    phone: String,
    email: String,
    website: String,
    mapLink: String,
    description: {
        en: {
            type: String,
            default: ''
        },
        ar: {
            type: String,
            default: ''
        }
    },
    primaryContact: String,
    secondaryContact: String,
    emergencyContact: String,
    achievements: [AchievementSchema],
    openHours: {
        saturday: { from: String, to: String, isClosed: Boolean },
        sunday: { from: String, to: String, isClosed: Boolean },
        monday: { from: String, to: String, isClosed: Boolean },
        tuesday: { from: String, to: String, isClosed: Boolean },
        wednesday: { from: String, to: String, isClosed: Boolean },
        thursday: { from: String, to: String, isClosed: Boolean },
        friday: { from: String, to: String, isClosed: Boolean }
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String,
        tiktok: String,
    },
    onlineTimes: [
        {
            day: { type: String, required: true, unique: true },
            from: { type: String, required: true },
            to: { type: String, required: true },
            isAvailable: { type: Boolean, default: true }
        }
    ]
}, { timestamps: true });

// Virtuals for JSON output
ClinicSchema.set('toJSON', { virtuals: true });

// Model Creation
const Clinic = mongoose.model('Clinic', ClinicSchema);
module.exports = Clinic;
