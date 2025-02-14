// apiConfig.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL:"https://localhost:7146/api/web", // Базовый URL API
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
});

export default apiClient;