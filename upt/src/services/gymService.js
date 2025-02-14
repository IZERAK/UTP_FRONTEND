import apiClient from './apiClient';

// Получить зал по ID
export const getGymById = async (id) => {
  try {
    const response = await apiClient.get('/gym/get', {
      params: { id }, // Передаем параметр id в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch gym');
  }
};

// Получить список всех залов
export const getAllGyms = async () => {
  try {
    const response = await apiClient.get('/gym/get-all');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all gyms');
  }
};