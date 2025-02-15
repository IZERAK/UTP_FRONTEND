// apiConfig.js
import axios from 'axios';

const token = `Bearer ${localStorage.getItem('accessToken')}`

const apiClient = axios.create({
  baseURL:"https://localhost:7146/api/web", // Базовый URL API
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
    },
});

export default apiClient;