const mongoose = require('mongoose');

const OnlineBookingSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            maxLength: [11, 'Phone number must be 11 digits long'],
            minLength: [11, 'Phone number must be 11 digits long'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
            required: [true, 'Service is required'],
        },
        message: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctors',
            default: null,
        },
    },
    { timestamps: true }
);

// generate booking code
OnlineBookingSchema.pre('save', async function (next) {
    const booking = this;
    if (!booking.code) {
        booking.code = booking._id.toString().toUpperCase().slice(0, 6);
    }
    next();
});

const OnlineBooking = mongoose.model('OnlineBooking', OnlineBookingSchema);
module.exports = OnlineBooking;
