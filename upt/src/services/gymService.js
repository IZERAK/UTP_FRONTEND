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

// Получить залы с тренерами
export const getAllWithTrainers = async (id) => {
  try {
    const response = await apiClient.get('/gym/get-all-with-trainers', {
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