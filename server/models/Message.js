const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        name: { type: 'String', required: [true, 'Name is required'] },
        phone: { type: 'String', required: [true, 'Phone number is required'] },
        email: { type: 'String' },
        message: { type: 'String', required: [true, 'Message is required'] },
        read: { type: 'Boolean', default: false },
        replied: { type: 'Boolean', default: false },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;