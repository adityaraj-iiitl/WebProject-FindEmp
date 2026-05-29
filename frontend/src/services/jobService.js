import api from '../api/config';

export const jobService = {
    getAllJobs: async () => {
        const response = await api.get('/jobs');
        return response.data;
    },
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },
    getJobById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },
    searchJobs: async (keyword = '', location = '') => {
        const response = await api.get('/jobs/search', {
            params: { keyword, location }
        });
        return response.data;
    },
    getUniqueCompanies: async () => {
        const response = await api.get('/jobs/companies');
        return response.data;
    },
    getJobsByCompany: async (name) => {
        const response = await api.get(`/jobs/company/${name}`);
        return response.data;
    },
    getJobsByRecruiter: async (recruiterId) => {
        const response = await api.get(`/jobs/recruiter/${recruiterId}`);
        return response.data;
    },
    updateJob: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    },
    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    },
    incrementJobViews: async (id) => {
        const response = await api.post(`/jobs/${id}/view`);
        return response.data;
    }
};
