import axios from 'axios';

const registerUser = async (email, password) => {
    try {
        const requestBody = {
            emailAddress: email, // Поле "emailAddress" в теле запроса
            passwordHash: password, // Поле "passwordHash" в теле запроса
        };

        console.log('Отправляемый запрос:', requestBody); // Логируем тело запроса

        const response = await axios.post('https://localhost:7146/api/web/autorization/register', requestBody);
        return response.data; // Возвращаем данные от сервера
    } catch (error) {
        if (error.response) {
            // Ошибка от сервера
            throw new Error(error.response.data.message || 'Неизвестная ошибка');
        } else {
            // Ошибка сети или другая ошибка
            throw new Error('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
        }
    }
};

export default registerUser;