import axiosInstance from './axiosInstance';

const blogService = {
    getBlogs: async () => {
        try {
            const response = await axiosInstance.get('/blogs');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getBlog: async (id) => {
        try {
            const response = await axiosInstance.get(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    addBlog: async (blog) => {
        try {
            const response = await axiosInstance.post('/blogs', blog);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    updateBlog: async (id, blog) => {
        try {
            const response = await axiosInstance.put(`/blogs/${id}`, blog);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    deleteBlog: async (id) => {
        try {
            const response = await axiosInstance.delete(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    addComment: async (blogId, comment) => {
        try {
            const response = await axiosInstance.post(`/blogs/${blogId}/comments`, comment);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    likeBlog: async (blogId) => {
        try {
            const response = await axiosInstance.post(`/blogs/${blogId}/like`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    deleteLike: async (blogId) => {
        try {
            const response = await axiosInstance.delete(`/blogs/${blogId}/like`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    addView: async (blogId) => {
        try {
            const response = await axiosInstance.post(`/blogs/${blogId}/view`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    dislikeBlog: async (blogId) => {
        try {
            const response = await axiosInstance.post(`/blogs/${blogId}/dislike`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    removeDislike: async (blogId) => {
        try {
            const response = await axiosInstance.delete(`/blogs/${blogId}/dislike`);
            return response.data;
        }
        catch (error) {
            return error.response.data;
        }
    },
    addShare: async (blogId) => {
        try {
            const response = await axiosInstance.post(`/blogs/${blogId}/share`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
};

export default blogService;
