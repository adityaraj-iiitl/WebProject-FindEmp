import api from '../api/config';

export const companyService = {
    getAllCompanies: async () => {
        const response = await api.get('/companies');
        return response.data;
    },
    getCompaniesByRecruiter: async (recruiterId) => {
        const response = await api.get(`/companies/recruiter/${recruiterId}`);
        return response.data;
    },
    createCompany: async (companyData) => {
        const response = await api.post('/companies', companyData);
        return response.data;
    },
    updateCompany: async (id, companyData) => {
        const response = await api.put(`/companies/${id}`, companyData);
        return response.data;
    }
};
