import apiClient from './apiClient';

// Получить цель по ID
export const getGoalById = async (clientId) => {
  try {
    const response = await apiClient.get('/goal/get', {
      params: { clientId }, // Передаем параметр clientId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch goal');
  }
};

// Получить список всех целей клиента
export const getAllClientGoals = async (clientId) => {
  try {
    const response = await apiClient.get('/goal/get-all-client-goals', {
      params: { clientId }, // Передаем параметр clientId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all client goals');
  }
};

// Создать новую цель
export const createGoal = async (goalData) => {
  try {
    const response = await apiClient.post('/goal/create', goalData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create goal');
  }
};

// Обновить информацию о цели
export const updateGoal = async (goalData) => {
  try {
    const response = await apiClient.put('/goal/update', goalData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update goal');
  }
};

// Назначить тренера для цели
export const setTrainerToGoal = async (goalId, trainerId) => {
  try {
    const response = await apiClient.put('/goal/set-trainer', {
      goalId,
      trainerId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to set trainer to goal');
  }
};

// Удалить цель
export const deleteGoal = async (goalId) => {
  try {
    const response = await apiClient.delete('/goal/delete', {
      params: { goalId }, // Передаем параметр goalId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete goal');
  }
};