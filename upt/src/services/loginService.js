import axios from 'axios';

const loginUser = async (email, password) => {
    try {
        const requestBody = {
            emailAddress: email, // Поле "emailAddress" в теле запроса
            password: password, // Поле "password" в теле запроса
        };

        console.log('Отправляемый запрос:', requestBody); // Логируем тело запроса

        const response = await axios.post('https://localhost:7146/api/web/autorization/login', requestBody);
        
        // Предположим, что в ответе есть accessToken и refreshToken
        const { accessToken, refreshToken } = response.data;

        // Сохраняем токены в localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data; // Возвращаем данные от сервера
    } catch (error) {
        if (error.response) {
            // Ошибка от сервера
            throw new Error(error.response.data.message || 'Неизвестная ошибка');
        } else {
            // Ошибка сети или другая ошибка
            throw new Error('Произошла ошибка при авторизации. Пожалуйста, попробуйте снова.');
        }
    }
};

export default loginUser;