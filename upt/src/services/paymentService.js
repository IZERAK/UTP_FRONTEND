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
export const addPayment = async (amount_v, purchasedProduct, title, userId_v) => {
  const amount = parseInt(amount_v, 10)
  const userId = parseInt(userId_v, 10)
  try {
    const response = await apiClient.post('/payment/add', {
      userId,
      title,
      amount,
      purchasedProduct
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