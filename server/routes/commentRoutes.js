const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Create a new comment
router.post('/', protect, async (req, res) => {
    try {
        const comment = new Comment(req.body);
        comment.user = req.user._id;
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().populate('blog')
            .populate('user')
            .populate('replies');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all comments for a specific blog post
router.get('/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId })
            .populate('blog')
            .populate('user')
            .populate('replies');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a comment by ID
router.put('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.user != req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to update this comment' });
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a comment by ID
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.user != req.user._id || req.user.role != 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
        const replies = comment.replies;
        await Comment.deleteMany({ _id: { $in: replies } });
        await comment.remove();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// add reply to a comment
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        const reply = new Comment({ ...req.body, isReply: true });
        reply.user = req.user._id;
        await reply.save();
        comment.replies.push(reply);
        await comment.save();
        res.status(201).json(reply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a reply by ID
router.delete('/:id/reply/:replyId', protect, async (req, res) => {
    try {
        const reply = await Comment.findByIdAndDelete(req.params.replyId);
        if (!reply) return res.status(404).json({ message: 'Reply not found' });
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        comment.replies = comment.replies.filter(reply => reply._id != req.params.replyId);
        await comment.save();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a reply by ID
router.put('/:id/reply/:replyId', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const reply = await Comment.findByIdAndUpdate(req.params.replyId, req.body, { new: true });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        const commentReply = comment.replies.id(req.params.replyId);
        if (!commentReply) return res.status(404).json({ message: 'Reply not found' });
        if (commentReply.user != req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to update this reply' });
        }
        commentReply.content = req.body.content;
        await comment.save();
        res.status(200).json(reply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// like a comment
router.put('/:id/like', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        comment.likes += 1;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// dislike a comment
router.put('/:id/dislike', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        comment.dislikes += 1;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
