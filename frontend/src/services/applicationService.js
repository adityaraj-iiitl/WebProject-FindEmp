import api from '../api/config';

export const applicationService = {
    applyToJob: async (applicationData) => {
        const response = await api.post('/applications', applicationData);
        return response.data;
    },
    applyToJobLegacy: async (applicationData) => {
        const response = await api.post('/applications/apply', applicationData);
        return response.data;
    },
    getApplicationsByApplicant: async (applicantId) => {
        const response = await api.get(`/applications/applicant/${applicantId}`);
        return response.data;
    },
    getApplicationsByUserLegacy: async (userId) => {
        const response = await api.get(`/applications/user/${userId}`);
        return response.data;
    },
    getApplicationsByRecruiter: async (recruiterId) => {
        const response = await api.get(`/applications/recruiter/${recruiterId}`);
        return response.data;
    },
    getApplicationsByJob: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return response.data;
    },
    updateApplicationStatus: async (id, status) => {
        const response = await api.put(`/applications/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    }
};
