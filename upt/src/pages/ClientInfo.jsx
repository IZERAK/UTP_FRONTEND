import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { userService } from '../services/apiService'; // Импортируем сервисы

const ProfilePage = () => {
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [chestVolume, setChestVolume] = useState('');
    const [waistVolume, setWaistVolume] = useState('');
    const [abdomenVolume, setAbdomenVolume] = useState('');
    const [buttocksVolume, setButtocksVolume] = useState('');
    const [thighVolume, setThighVolume] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();



    // Обработчик отправки формы
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Валидация полей
        if (!gender || !height || !weight || !chestVolume || !waistVolume || !abdomenVolume || !buttocksVolume || !thighVolume) {
            setError('Все поля обязательны для заполнения!');
            return;
        }



        // Формируем данные для отправки
        const userData = {

            gender: parseInt(gender), // Пол (0 - мужской, 1 - женский)
            height: parseInt(height), // Рост
            weight: parseFloat(weight), // Вес
            volumeBreast: parseFloat(chestVolume), // Объем груди
            volumeWaist: parseFloat(waistVolume), // Объем талии
            volumeAbdomen: parseFloat(abdomenVolume), // Объем живота
            volumeButtock: parseFloat(buttocksVolume), // Объем ягодиц
            volumeHip: parseFloat(thighVolume), // Объем бедра
            isNotificationEnable: true, // Уведомления включены
            isEmailNotificationEnable: true, // Уведомления по почте включены
            avatar: "default-avatar-url" // Аватар по умолчанию
        };

        try {
            setLoading(true);
            // Отправляем данные на сервер
            const response = await userService.updateUser(51, userData);
            console.log('Данные пользователя обновлены:', response);

            // Перенаправляем пользователя на страницу info-user
            navigate('/client_info_add');
        } catch (error) {
            setError(error.message || 'Произошла ошибка при обновлении данных.');
        } finally {
            setLoading(false);
        }
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate(-1); // Переход на предыдущую страницу
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Обновление профиля
                </Typography>

                {/* Форма для ввода данных */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Пол</InputLabel>
                        <Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="Пол"
                        >
                            <MenuItem value={0}>Мужской</MenuItem>
                            <MenuItem value={1}>Женский</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        required
                        fullWidth
                        label="Рост (см)"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Вес (кг)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Объем груди (см)"
                        type="number"
                        value={chestVolume}
                        onChange={(e) => setChestVolume(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Объем талии (см)"
                        type="number"
                        value={waistVolume}
                        onChange={(e) => setWaistVolume(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Объем живота (см)"
                        type="number"
                        value={abdomenVolume}
                        onChange={(e) => setAbdomenVolume(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Объем ягодиц (см)"
                        type="number"
                        value={buttocksVolume}
                        onChange={(e) => setButtocksVolume(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Объем бедра (см)"
                        type="number"
                        value={thighVolume}
                        onChange={(e) => setThighVolume(e.target.value)}
                        margin="normal"
                    />

                    {/* Кнопка отправки */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Обновить профиль'}
                    </Button>

                    {/* Кнопка "Назад" */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ mt: 2 }}
                    >
                        Назад
                    </Button>
                </Box>

                {/* Отображение ошибок */}
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ProfilePage;