import axios from 'axios';

// The live backend URL from Railway
const API_BASE_URL = 'https://webproject-findemp-production.up.railway.app/api'; 

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;
