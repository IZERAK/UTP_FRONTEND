import apiClient from './apiClient';

// Получить список оплат пользователя
export const getPaymentsByUserId = async (userId) => {
  try {
    const response = await apiClient.get('/payment/get', {
      params: { userId }, // Передаем параметр userId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch payments');
  }
};

// Добавить новую оплату
export const addPayment = async (amount, purchasedProduct, title, userId) => {
  try {
    const response = await apiClient.post('/payment/add', {
      amount,
      purchasedProduct,
      title,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add payment');
  }
};

// Удалить оплату
export const deletePayment = async (paymentId) => {
  try {
    const response = await apiClient.delete('/payment/delete', {
      params: { paymentId }, // Передаем параметр paymentId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete payment');
  }
};