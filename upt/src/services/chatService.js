import apiClient from './apiClient';

// Получить зал по ID
export const chatGetHistory = async (senderUserId,recipientUserId
) => {
  try {
    const response = await apiClient.get('/chat/get-history', {
      params: { senderUserId,recipientUserId }, // Передаем параметр id в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch gym');
  }
};

// Получить список всех залов
export const chatAddMsg = async () => {
  try {
    const response = await apiClient.get('/chat/add');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all gyms');
  }
};

export const chatDeleteMsg = async () => {
  try {
    const response = await apiClient.delete('/chat/delete');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all gyms');
  }
};