import axiosInstance from './axiosInstance';

const commentService = {
    async getComments() {
        try {
            const response = await axiosInstance.get('/comments');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async addComment(comment) {
        try {
            const response = await axiosInstance.post('/comments', comment);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async deleteComment(commentId) {
        try {
            const response = await axiosInstance.delete(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async updateComment(commentId, comment) {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}`, comment);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async addReply(commentId, reply) {
        try {
            const response = await axiosInstance.post(`/comments/${commentId}/reply`, reply);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async getCommentsByBlog(blogId) {
        try {
            const response = await axiosInstance.get(`/comments/${blogId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async deleteReply(commentId, replyId) {
        try {
            const response = await axiosInstance.delete(`/comments/${commentId}/reply/${replyId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async likeComment(commentId) {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}/like`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async dislikeComment(commentId) {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}/dislike`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async approveComment(commentId) {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}/approve`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
};

export default commentService;
