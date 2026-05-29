import api from '../api/config';

export const chatService = {
    sendChatMessage: async (message, userEmail = '') => {
        const response = await api.post('/chat', { message, userEmail });
        return response.data;
    }
};
