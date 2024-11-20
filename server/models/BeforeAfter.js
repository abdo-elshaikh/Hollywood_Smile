const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BeforeAfterSchema = new Schema({
    beforeImage: {
        type: String,
        required: true,
        default: 'https://via.placeholder.com/600x400.png?text=Before'
    },
    afterImage: {
        type: String,
        required: true,
        default: 'https://via.placeholder.com/600x400.png?text=After'
    },
    description: {
        type: String,
        required: true,
        default: 'Before and After Description'
    },
    title: {
        type: String,
        required: true,
        default: 'Before and After'
    },
    code: {
        type: String,
        required: true,
        unique: true,
        default: 'BA'
    }

}, { timestamps: true });

const BeforeAfter = mongoose.model('BeforeAfter', BeforeAfterSchema);

module.exports = BeforeAfter;