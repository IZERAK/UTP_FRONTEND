import apiClient from './apiClient';

// Получить тренера по ID
export const getTrainerById = async (trainerId) => {
  try {
    const response = await apiClient.get('/trainer/get', {
      params: { trainerId }, // Передаем параметр trainerId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch trainer');
  }
};

// Получить тренера по ID пользователя
export const getTrainerByUserId = async (userId) => {
  try {
    const response = await apiClient.get('/trainer/get-by-user-id', {
      params: { userId }, // Передаем параметр userId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch trainer by user ID');
  }
};

// Получить отфильтрованных тренеров
export const getFilteredTrainers = async (filterRequest) => {
  try {
    const response = await apiClient.post('/trainer/get-filtered', filterRequest);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch filtered trainers');
  }
};

// Создать нового тренера
export const createTrainer = async (trainerData) => {
  try {
    const response = await apiClient.post('/trainer/create', trainerData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create trainer');
  }
};

// Обновить информацию о тренере
export const updateTrainer = async (trainerData) => {
  try {
    const response = await apiClient.put('/trainer/update', trainerData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update trainer');
  }
};

// Назначить клиентов тренеру
export const setClientsToTrainer = async (trainerId, clientIds) => {
  try {
    const response = await apiClient.put('/trainer/set-clients', {
      trainerId,
      clientIds,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to set clients to trainer');
  }
};

// Уменьшить счетчик доступных откликов у тренера
export const decrementDialogCount = async (trainerId) => {
  try {
    const response = await apiClient.put('/trainer/dialog-count-decremen', null, {
      params: { trainerId }, // Передаем параметр trainerId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to decrement dialog count');
  }
};

// Удалить тренера
export const deleteTrainer = async (trainerId) => {
  try {
    const response = await apiClient.delete('/trainer/delete', {
      params: { trainerId }, // Передаем параметр trainerId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete trainer');
  }
};

export const accessToPublishTrainerNews = async (trainerId) => {
  try {
    const response = await apiClient.get('trainer/access-to-publish-news', {
      params: { trainerId }, // Передаем параметр trainerId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete trainer');
  }
};