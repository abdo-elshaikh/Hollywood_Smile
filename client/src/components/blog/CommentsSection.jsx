import React, { useState, useEffect } from 'react';
import {
    Box, Card, Typography, List, ListItem, ListItemAvatar, Avatar,
    ListItemText, IconButton, TextField, Button, Collapse, Divider, Tooltip
} from '@mui/material';
import { ThumbUp, ThumbDown, Reply, Edit, Delete, Send, ExpandLess, ExpandMore, Cancel, Save } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import commentService from '../../services/commentService';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

const CommentsSection = ({ id, addNotification, toComment }) => {
    const [showReplies, setShowReplies] = useState({});
    const [replies, setReplies] = useState([]);
    const [editReply, setEditReply] = useState(null);
    const [editComment, setEditComment] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(null);
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { user } = useAuth();

    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const data = await commentService.getCommentsByBlog(id);
            const comments = data.filter((c) => !c.isReply).sort((a, b) => new Date(b.date) - new Date(a.date));

            const replies = data.filter((c) => c.isReply).sort((a, b) => new Date(b.date) - new Date(a.date));
            setComments(comments.map((comment) => ({
                ...comment,
                replies: comment.replies.map((reply) => reply._id)
            })));
            setReplies(replies);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const likeComment = async (commentId) => {
        try {
            await commentService.likeComment(commentId);
            addNotification('like comment', 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    }

    const dislikeComment = async (commentId) => {
        try {
            await commentService.dislikeComment(commentId);
            addNotification('dislike comment', 'warning');
            fetchData();
        } catch (error) {
            console.error('Failed to dislike comment:', error);
        }
    }

    const handleCommentSubmit = async () => {
        if (!commentText) return;
        if (!user) {
            setCommentText('');
            return alert('You must be logged in to comment');
        }
        try {
            if (editComment) {
                await handleEditComment(editComment, commentText);
                setEditComment(null);
            } else {
                await commentService.addComment({ content: commentText, blog: id });
            }
            await addNotification('comment', 'success');
            setCommentText('');
            fetchData();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleReplySubmit = async (commentId) => {
        try {
            if (editReply) {
                await commentService.updateComment(editReply, { content: replyText });
                setEditReply(null);
            } else {
                await commentService.addReply(commentId, { content: replyText, blog: id });
            }
            await addNotification('comment reply', 'success');
            setReplyText('');
            setShowReply(null);
            fetchData();
        } catch (error) {
            console.error('Failed to add reply:', error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await commentService.deleteComment(commentId);
            addNotification('delete comment', 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleReplyDelete = async (commentId, replyId) => {
        try {
            await commentService.deleteReply(commentId, replyId);
            addNotification('delete reply', 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to delete reply:', error);
        }
    };

    const handleEditComment = async (commentId, comment) => {
        try {
            await commentService.updateComment(commentId, { content: comment });
            addNotification('edit comment', 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const handleClickEditComment = (commentId, content) => {
        setEditComment(commentId);
        setCommentText(content);
        toComment();
    };

    const handleClickEditReply = (commentId, content) => {
        setEditReply(commentId);
        setReplyText(content);
    };

    const handleShowReply = (commentId) => {
        setShowReply(commentId);
        const replyInput = document.getElementById('input-reply');
        if (replyInput) {
            replyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            replyInput.focus();
        }
    };

    const toggleReplies = (commentId) => {
        setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* Add Comment */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    id="comment-input"
                    placeholder={t('blog.add_comment')}
                    variant="outlined"
                    value={commentText}

                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <Button disabled={!editComment} onClick={() => { setEditComment(null); setCommentText('') }} variant="text" color="primary">
                        {t('blog.cancel')} <Cancel sx={{ mr: 2, ml: 2 }} />
                    </Button>
                    <Button disabled={!editComment} onClick={() => handleCommentSubmit()} variant="text" color="primary">
                        {t('blog.save')} <Save sx={{ mr: 2, ml: 2 }} />
                    </Button>
                    <Button disabled={editComment} onClick={handleCommentSubmit} variant="text" color="primary">
                        {t('blog.send')} <Send sx={{ mr: 2, ml: 2 }} />
                    </Button>
                </Box>
            </Box>

            {/* Comment List */}
            <List sx={{ bgcolor: 'background.paper', p: 2 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{t('blog.comments')}</Typography>
                {comments.map((comment) => (
                    <Card key={comment._id} sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: '0' }}>
                        <ListItem alignItems='flex-start' justifyContent='start'>
                            <ListItemAvatar>
                                <Avatar src={comment.user?.avatarUrl} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: 1,
                                        bgcolor: 'background.default',
                                        p: 1,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            {comment.user?.name || 'User'} | {new Date(comment.date).toLocaleDateString()} - {new Date(comment.date).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.primary' }}>{comment.content}</Typography>
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, width: '100%' }}>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Tooltip title={t('blog.like')}>
                                                    <IconButton disabled={!user} onClick={() => likeComment(comment._id)} color="primary" sx={{ borderRadius: '50%' }}>
                                                        <ThumbUp />
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography variant="body2">{comment.likes}</Typography>
                                                <Tooltip title={t('blog.dislike')}>
                                                    <IconButton disabled={!user} onClick={() => dislikeComment(comment._id)} color="error" sx={{ borderRadius: '50%' }}>
                                                        <ThumbDown />
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography variant="body2">{comment.dislikes}</Typography>
                                                <Tooltip title={t('blog.reply_comment')}>
                                                    <IconButton onClick={() => {
                                                        handleShowReply(comment._id);
                                                        setReplyText('');
                                                    }} disabled={!user} color='success' >
                                                        <Reply />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }} />
                                            {user && comment.user?._id === user?._id && (
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Tooltip title={t('blog.edit_comment')}>
                                                        <IconButton onClick={() => handleClickEditComment(comment._id, comment.content)}>
                                                            <Edit color="primary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={t('blog.delete_comment')}>
                                                        <IconButton onClick={() => handleCommentDelete(comment._id)} color="error">
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Reply Input */}
                                        <Box sx={{ display: showReply === comment._id ? 'flex' : 'none', gap: 1, alignItems: 'center', mb: 1 }}>
                                            <TextField
                                                id="input-reply"
                                                size="small"
                                                fullWidth
                                                multiline
                                                disabled={!user}
                                                variant="outlined"
                                                placeholder={t('blog.reply_comment')}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <Button onClick={() => handleReplySubmit(comment._id)} variant="text" color="primary">
                                                {editReply ? < Save sx={{ mr: 2, ml: 2 }} /> : <Send sx={{ mr: 2, ml: 2 }} />}
                                            </Button>
                                            {editReply && (
                                                <Button onClick={() => { setEditReply(null); setReplyText(''); setShowReply(null) }} variant="text" color="primary">
                                                    {t('blog.cancel')} <Cancel sx={{ mr: 2, ml: 2 }} />
                                                </Button>
                                            )}
                                        </Box>

                                        {/* Toggle Replies */}
                                        {comment.replies.length > 0 && (
                                            <Button onClick={() => toggleReplies(comment._id)} sx={{ mt: 1 }}>
                                                {showReplies[comment._id] ? <ExpandLess /> : <ExpandMore />}
                                                <Typography variant="caption">{t('blog.show_replies')} ({comment.replies.length})</Typography>
                                            </Button>
                                        )}
                                    </Box>
                                }
                                sx={{ textAlign: isArabic ? 'right' : 'left' }}
                            />
                        </ListItem>

                        {/* Replies */}
                        <Collapse in={showReplies[comment._id]} timeout={300} unmountOnExit>
                            <List disablePadding>
                                {replies
                                    .filter((reply) => comment.replies.includes(reply._id))
                                    .map((reply) => (
                                        <ListItem
                                            key={reply._id}
                                            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pl: isArabic ? 0 : 7, pr: isArabic ? 7 : 0 }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={reply.user?.avatarUrl} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FF4545' }}>
                                                            {reply.user?.name} | {new Date(reply.date).toLocaleDateString()} - {new Date(reply.date).toLocaleTimeString()}
                                                        </Typography>
                                                        <Typography variant="body1">{reply.content}</Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box >
                                                        {user && reply.user?._id === user?._id &&
                                                            <>
                                                                <Tooltip title={t('blog.edit_reply')}>
                                                                    <IconButton onClick={() => {
                                                                        handleClickEditReply(reply._id, reply.content);
                                                                        handleShowReply(comment._id);
                                                                    }}>
                                                                        <Edit color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={t('blog.delete_reply')}>
                                                                    <IconButton onClick={() => handleReplyDelete(comment._id, reply._id)} color="error">
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                    </Box>
                                                }
                                                sx={{ textAlign: isArabic ? 'right' : 'left' }}
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                        </Collapse>
                    </Card>
                ))}

                {/* no_comments */}
                {comments.length === 0 && (
                    <Typography variant="body1">{t('blog.no_comments')}</Typography>
                )}
            </List>
        </Box>
    );
};

export default CommentsSection;
