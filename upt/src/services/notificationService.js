import apiClient from './apiClient';

// Получить список прочитанных уведомлений клиента
export const getCheckedNotifications = async (userId) => {
  try {
    const response = await apiClient.get('/notification/get-ckecked', {
      params: { userId }, // Передаем параметр userId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch checked notifications');
  }
};

// Получить список непрочитанных уведомлений клиента
export const getUncheckedNotifications = async (userId) => {
  try {
    const response = await apiClient.get('/notification/get-un-ckecked', {
      params: { userId }, // Передаем параметр userId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch unchecked notifications');
  }
};

// Добавить новое уведомление
export const createNotification = async (name, text, userId) => {
  try {
    const response = await apiClient.post('/notification/create', {
      name,
      text,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create notification');
  }
};

// Пометить уведомление как прочитанное
export const markNotificationAsChecked = async (notificationId) => {
  try {
    const response = await apiClient.put('/notification/set-checked', null, {
      params: { notificationId }, // Передаем параметр notificationId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to mark notification as checked');
  }
};

// Удалить уведомление
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete('/notification/delete', {
      params: { notificationId }, // Передаем параметр notificationId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete notification');
  }
};