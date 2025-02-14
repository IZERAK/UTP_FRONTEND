import apiClient from './apiClient';

// Получить пользователя по ID
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get('/user/get', {
      params: { id }, // Передаем параметр id в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

// Получить пользователя по email
export const getUserByEmail = async (emailAddress) => {
  try {
    const response = await apiClient.get('/user/get-by-email', {
      params: { EmailAddress: emailAddress }, // Передаем параметр emailAddress в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user by email');
  }
};

// Обновить данные пользователя
export const updateUser = async (userData) => {
  try {
    const response = await apiClient.put('/user/update', userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

// Подтвердить email пользователя
export const confirmUserEmail = async (userId) => {
  try {
    const response = await apiClient.put('/user/email-confirmed', {
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to confirm user email');
  }
};

// Удалить пользователя
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete('/user/delete', {
      params: { id }, // Передаем параметр id в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};