const mongoose = require('mongoose');

const OffersSchema = new mongoose.Schema(
    {
        title: {
            ar: {
                type: String,
                required: [true, 'Title in Arabic is required'],
            },
            en: {
                type: String,
                required: [true, 'Title in English is required'],
            }
        },
        description: {
            ar: {
                type: String,
                required: [true, 'Description in Arabic is required'],
            },
            en: {
                type: String,
                required: [true, 'Description in English is required'],
            }
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiration date is required'],
            index: true, // Adding an index for better performance
        },
        discount: {
            type: String,
            required: [true, 'Discount is required'],
            validate: {
                validator: function (v) {
                    return /^(\d+(\.\d+)?%)?$/.test(v);
                },
                message: 'Discount should be a percentage value (e.g., "10%")',
            },
        },
        imageUrl: {
            type: String,
            default: 'https://via.placeholder.com/150?text=No+Image+Available',
        },
        showInNotifications: {
            type: Boolean,
            default: false,
        },
        showInHome: {
            type: Boolean,
            default: false,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
            required: [true, 'Service is required'],
        } 
    },
    { timestamps: true }
);

// Virtual field for `isActive`
OffersSchema.virtual('isActive').get(function () {
    return new Date() <= this.expiryDate;
});

const Offers = mongoose.model('Offers', OffersSchema);
module.exports = Offers;
