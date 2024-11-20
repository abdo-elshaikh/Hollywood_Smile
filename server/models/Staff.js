const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
// The Staff model defines a schema for staff members using Mongoose.