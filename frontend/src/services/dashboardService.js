import api from '../api/config';

export const dashboardService = {
    getDashboardStats: async (userId, role) => {
        const response = await api.get(`/dashboard/stats/${userId}`, {
            params: { role }
        });
        return response.data;
    }
};
