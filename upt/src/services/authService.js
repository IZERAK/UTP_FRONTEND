import apiClient from './apiClient';
import { getUserByEmail } from './userService';

// Регистрация пользователя
export const registerUser = async (emailAddress, password) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_AUTH_REGISTER}`, {
      emailAddress,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to register user');
  }
};

// Вход пользователя
export const loginUser = async (emailAddress, password) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_AUTH_LOGIN}`, {
      emailAddress,
      password,
    });

    // Проверяем, что в ответе есть необходимые данные (токены и email)
    if (response.data && response.data.accessToken && response.data.refreshToken) {
      // Сохраняем токены и email в localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userEmail', emailAddress);
      const user = await getUserByEmail(emailAddress);
      localStorage.setItem('id_user', user.id);

      return response.data; // Возвращаем данные для дальнейшего использования
    } else {
      throw new Error('Invalid response data from server');
    }
  } catch (error) {
    // Если произошла ошибка, очищаем localStorage (на случай, если там остались старые данные)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');

    throw new Error('Failed to login user: ' + error.message);
  }
};
// Восстановление пароля
export const restorePassword = async (emailAddress) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_AUTH_RESTORE_PASSWORD}`, {
      emailAddress,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to restore password');
  }
};

// Изменение пароля
export const editPassword = async (emailAddress, oldPassword, newPassword) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_AUTH_EDIT_PASSWORD}`, {
      emailAddress,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to edit password');
  }
};

// Обновление access токена на основе refresh токена
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_AUTH_REFRESH_TOKEN}`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};