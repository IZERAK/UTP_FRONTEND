import apiClient from './apiClient';

// Получить список тренировочных программ
export const getTrainingPrograms = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-training-program');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch training programs');
  }
};

// Получить список гендеров
export const getGenders = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-genders');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch genders');
  }
};

// Получить список продаваемых продуктов
export const getPurchasedProducts = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-purchased-product');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch purchased products');
  }
};

// Получить список дедлайнов
export const getDeadlines = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-deadlines');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch deadlines');
  }
};

// Получить список дней недели
export const getDaysOfWeek = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-days-of-week');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch days of week');
  }
};

// Получить список периодов времени в течение дня
export const getTimesOfDay = async () => {
  try {
    const response = await apiClient.get('/infrastucture/get-times-of-day');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch times of day');
  }
};