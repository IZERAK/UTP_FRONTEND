import apiClient from './apiClient';

// Получить новость по ID пользователя
export const getNewsByUserId = async (userId) => {
  try {
    const response = await apiClient.get('/news/get', {
      params: { userId }, // Передаем параметр userId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch news');
  }
};

// Получить список всех новостей
export const getAllNews = async () => {
  try {
    const response = await apiClient.get('/news/get-all');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all news');
  }
};

// Создать новость
export const createNews = async (title, text, userId, image = null) => {
  try {
    const response = await apiClient.post('/news/create', {
      title,
      text,
      userId,
      image,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create news');
  }
};

// Обновить новость
export const updateNews = async (newsId, title, text, userId, image = null) => {
  try {
    const response = await apiClient.put('/news/update', {
      newsId,
      title,
      text,
      userId,
      image,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update news');
  }
};

// Удалить новость
export const deleteNews = async (newsId) => {
  try {
    const response = await apiClient.delete('/news/delete', {
      params: { newsId }, // Передаем параметр newsId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete news');
  }
};