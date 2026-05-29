import api from '../api/config';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },
    getUserProfile: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    updateUserProfile: async (id, profileData) => {
        const response = await api.put(`/users/profile/${id}`, profileData);
        return response.data;
    },
    incrementProfileViews: async (id) => {
        const response = await api.post(`/users/${id}/view`);
        return response.data;
    }
};
