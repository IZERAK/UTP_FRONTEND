import axios from 'axios';

const API_BASE_URL = 'https://localhost:7146/api';

// Функция для получения accessToken из localStorage
const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Функция для обновления accessToken
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post(`${API_BASE_URL}/web/autorization/refresh-access-token`, {
            refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken); // Сохраняем новый accessToken
        return accessToken;
    } catch (error) {
        // Если refreshToken недействителен, разлогиньте пользователя
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Перенаправляем на страницу авторизации
        throw error;
    }
};

// Функция для выполнения запросов с обработкой истечения accessToken
const apiRequest = async (method, url, data = null) => {
    let accessToken = getAccessToken();

    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}${url}`,
            data,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Если токен истёк, обновляем его и повторяем запрос
            accessToken = await refreshAccessToken();
            const retryResponse = await axios({
                method,
                url: `${API_BASE_URL}${url}`,
                data,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return retryResponse.data;
        }
        throw error;
    }
};

// Сервис для работы с городами
export const cityService = {
    getCities: async () => {
        return apiRequest('get', '/web/city/get-all');
    },
};

// Сервис для работы с пользователями
export const userService = {
    updateUser: async (userData) => {
        return apiRequest('put', '/web/user/update', userData);
    },
};

