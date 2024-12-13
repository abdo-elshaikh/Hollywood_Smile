const mongoose = require('mongoose');

const TestimonySchema = new mongoose.Schema(
    {
        name: { type: 'String', required: [true, 'Name is required'] },
        position: { type: 'String', default: 'Visitor' },
        quote: { type: 'String', required: [true, 'Quote is required'] },
        imgUrl: { type: 'String', default: 'https://via.placeholder.com/150' },
        rating: { type: 'Number', required: [true, 'Rating is required'], min: 0, max: 5 },
        show: { type: 'Boolean', default: false },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Testimony = mongoose.model('Testimony', TestimonySchema);
module.exports = Testimony;
