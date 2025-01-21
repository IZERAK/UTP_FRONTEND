import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { cityService } from '../services/apiService'; // Импортируем сервис
import RoleSlider from '../components/RoleToggle'; // Импортируем кастомный слайдер

function RoleSelectionPage() {
    const [role, setRole] = useState('client'); // Роль: 'client' или 'trainer'
    const [fullName, setFullName] = useState(''); // ФИО
    const [phoneNumber, setPhoneNumber] = useState(''); // Номер телефона
    const [city, setCity] = useState(''); // Выбранный город
    const [cities, setCities] = useState([]); // Список городов из API
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(null); // Ошибки

    // Получаем список городов из API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const citiesData = await cityService.getCities();
                setCities(citiesData);
            } catch (error) {
                setError('Не удалось загрузить список городов.');
                console.error('Ошибка при загрузке городов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Обработчик выбора роли
    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();

        // Валидация полей
        if (!fullName || !phoneNumber || !city) {
            setError('Все поля обязательны для заполнения!');
            return;
        }

        // Сохраняем данные в localStorage или состоянии приложения
        const userData = {
            role,
            fullName,
            phoneNumber,
            city,
        };

        console.log('Данные пользователя:', userData);
        // Здесь можно отправить данные на сервер или сохранить для следующего шага
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
                    Выберите роль
                </Typography>

                {/* Кастомный слайдер для выбора роли */}
                <Box sx={{ mt: 3 }}>
                    <RoleSlider onChange={handleRoleChange} />
                </Box>

                {/* Форма для ввода данных */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        required
                        fullWidth
                        label="ФИО"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        label="Номер телефона"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Город</InputLabel>
                        <Select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            label="Город"
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Кнопка отправки */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Продолжить'}
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
}

export default RoleSelectionPage;