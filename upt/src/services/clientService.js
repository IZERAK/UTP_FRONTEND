import apiClient from './apiClient';

// Получить клиента по ID
export const getClientById = async (clientId) => {
  try {
    const response = await apiClient.get(process.env.REACT_APP_CLIENT_GET, {
      params: { clientId }, // Передаем параметр clientId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch client');
  }
};

// Получить клиента по ID пользователя
export const getClientByUserId = async (userId) => {
  try {
    const response = await apiClient.get(process.env.REACT_APP_CLIENT_GET_BY_USER_ID, {
      params: { userid: userId }, // Передаем параметр userid в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch client by user ID');
  }
};

// Получить отфильтрованных клиентов
export const getFilteredClients = async (filterRequest) => {
  try {
    const response = await apiClient.post(process.env.REACT_APP_CLIENT_GET_FILTERED, filterRequest);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch filtered clients');
  }
};

// Создать нового клиента
export const createClient = async (clientData) => {
  try {
    const response = await apiClient.post(process.env.REACT_APP_CLIENT_CREATE, clientData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create client');
  }
};

// Обновить информацию о клиенте
export const updateClient = async (clientData) => {
  try {
    const response = await apiClient.put('/client/update', clientData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update client');
  }
};

// Назначить тренера клиенту
export const setTrainerToClient = async (clientId, trainerId) => {
  try {
    const response = await apiClient.put('/client/set-trainer', {
      clientId,
      trainerId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to set trainer to client');
  }
};

// Удалить клиента
export const deleteClient = async (clientId) => {
  try {
    const response = await apiClient.delete('/client/delete', {
      params: { clientId }, // Передаем параметр clientId в запросе
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete client');
  }
};