const mongoose = require('mongoose');

const SubscribeSchema = new mongoose.Schema({
    name: { type: String, default: '', },
    phone: { type: String, default: '', },
    email: { type: String, default: '', required: true, unique: true, },
    block: { type: Boolean, default: false, },
}, {
    timestamps: true,
});

const Subscribe = mongoose.model('Subscribe', SubscribeSchema);
module.exports = Subscribe;