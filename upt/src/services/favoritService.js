import apiClient from './apiClient';

// Получить список избранных тренеров для клиента
export const getFavoriteTrainers = async (clientId) => {
  try {
    const response = await apiClient.get('/favorit/get', {
      params: { clientId }, // Передаем параметр clientId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch favorite trainers');
  }
};

// Добавить тренера в список избранных
export const addFavoriteTrainer = async (clientId, trainerId) => {
  try {
    const response = await apiClient.post('/favorit/add', {
      clientId,
      trainerId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add trainer to favorites');
  }
};

// Удалить тренера из списка избранных
export const deleteFavoriteTrainer = async (clientId, trainerId) => {
  try {
    const response = await apiClient.delete('/favorit/delete', {
      data: { clientId, trainerId }, // Тело запроса для DELETE метода
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to remove trainer from favorites');
  }
};