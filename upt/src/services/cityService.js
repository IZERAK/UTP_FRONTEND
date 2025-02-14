import apiClient from './apiClient';

// Получить город по ID
export const getCityById = async (id) => {
  try {
    const response = await apiClient.get(process.env.REACT_APP_CITY_GET, {
      params: { id }, // Передаем параметр id в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch city');
  }
};

// Получить список всех городов
export const getAllCities = async () => {
  try {
    const response = await apiClient.get(process.env.REACT_APP_CITY_GET_ALL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all cities');
  }
};