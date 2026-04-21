import axios from 'axios';

// When you are developing locally, it uses localhost. 
// When you deploy, you will change this to your Render/Railway URL.
const API_BASE_URL = 'http://localhost:8080/api'; 

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;
