import apiClient from './apiClient';

// Получить список отзывов на тренера
export const getTrainerFeedbacks = async (trainerId) => {
  try {
    const response = await apiClient.get('/feedback/get', {
      params: { trainerId }, // Передаем параметр trainerId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch feedbacks for trainer');
  }
};

// Добавить отзыв тренеру
export const addFeedbackToTrainer = async (clientId, trainerId, rating, text) => {
  try {
    const response = await apiClient.post('/feedback/add', {
      clientId,
      trainerId,
      rating,
      text,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add feedback to trainer');
  }
};

// Удалить отзыв тренеру
export const deleteFeedbackForTrainer = async (clientId, trainerId) => {
  try {
    const response = await apiClient.delete('/feedback/delete', {
      data: { clientId, trainerId }, // Тело запроса для DELETE метода
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete feedback for trainer');
  }
};