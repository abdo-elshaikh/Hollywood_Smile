const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        isReply: {
            type: Boolean,
            default: false,
        },
        blocked: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
