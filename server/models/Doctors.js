const mongoose = require('mongoose');

const DoctorsSchema = new mongoose.Schema(
    {
        name: {
            ar: { type: 'String', required: [true, 'Name is required'] },
            en: { type: 'String', required: [true, 'Name is required'] },
        },
        position: {
            ar: { type: 'String', required: [true, 'Position is required'] },
            en: { type: 'String', required: [true, 'Position is required'] },
        },
        description: {
            ar: { type: 'String', required: [true, 'Description is required'] },
            en: { type: 'String', required: [true, 'Description is required'] },
        },
        imageUrl: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        socialLinks: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String,
        },
        email: {
            type: String,
            unique: true,
            default: 'Not available',
        },
        phone: {
            type: String,
            default: 'Not available',
        },
        address: {
            type: String,
            default: 'Not available',
        },
        workingHours: [
            {
                day: {
                    type: String,
                    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                },
                startTime: String,
                endTime: String,
            },
        ],
        rating: [
            {
                name: String,
                stars: Number,
                comment: String,
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ]
    },
    { timestamps: true }
);

const Doctors = mongoose.model('Doctors', DoctorsSchema);
module.exports = Doctors;
