const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question_en: { type: 'String', required: function () { return !this.question_ar; } },
    question_ar: { type: 'String', required: function () { return !this.question_en; } },
    answer_en: { type: 'String', },
    answer_ar: { type: 'String', },
    available: { type: 'Boolean', default: false },
    showInHome: { type: 'Boolean', default: false },
    tags: { type: 'Array', default: [] },
    name: { type: 'String', required: function () { return !this.email && !this.phone; } },
    email: { type: 'String', },
    phone: { type: 'String', },
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
