import axios from 'axios';

const API_BASE_URL = 'https://localhost:7146/api';

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post(`${API_BASE_URL}/web/autorization/refresh-access-token`, {
            refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw error;
    }
};

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

export const cityService = {
    getCities: async () => {
        return apiRequest('get', '/web/city/get-all');
    },
};

export const genderService = {
    getGenders: async () => {
        return apiRequest('get', '/web/infrastucture/get-genders');
    },
};

export const userService = {
    updateUser: async (userId, userData) => {
        const data = { ...userData, id: userId };
        return apiRequest('put', `/web/user/update`, data);
    },
};

export const planService = {
    getPlans: async () => {
        return apiRequest('get', '/web/infrastucture/get-purchased-product');
    },
};

export const daysOfWeekService = {
    getDaysOfWeek: async () => {
        return apiRequest('get', '/web/infrastucture/get-days-of-week');
    },
};