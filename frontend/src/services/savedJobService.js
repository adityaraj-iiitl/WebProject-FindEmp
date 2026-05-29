import api from '../api/config';

export const savedJobService = {
    toggleSavedJob: async (userId, jobId) => {
        const response = await api.post('/saved-jobs/toggle', null, {
            params: { userId, jobId }
        });
        return response.data;
    },
    getSavedJobs: async (userId) => {
        const response = await api.get(`/saved-jobs/${userId}`);
        return response.data;
    }
};
