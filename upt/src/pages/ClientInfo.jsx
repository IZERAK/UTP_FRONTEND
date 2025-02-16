import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import { getGenders } from '../services/infrastructureService.js';
import { getUserByEmail, updateUser } from '../services/userService.js';
import { createClient } from '../services/clientService.js';
import { getAllCities } from '../services/cityService.js';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
    ArrowBack,
    ArrowForward,
    Height,
    MonitorWeight,
    Female,
    Male,
    Accessibility,
    Straighten
} from '@mui/icons-material';

const ClientInfo = () => {
    const [gender, setGender] = useState(''); // Состояние для выбранного пола
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [stomach, setStomach] = useState('');
    const [hips, setHips] = useState('');
    const [thighs, setThighs] = useState('');
    const [genders, setGenders] = useState([]); // Состояние для хранения списка полов
    const genderTranslations = {
        "None": "Не указано",
        "Male": "Мужской",
        "Female": "Женский"
    };
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const navigate = useNavigate();
    // Загружаем список полов при монтировании компонента
    useEffect(() => {
        const fetchGenders = async () => {
            try {
                const gendersData = await getGenders();
                const genders = Object.entries(gendersData).map(([id, label]) => ({
                    id: id,
                    label: label
                }));
                setGenders(genders);
            } catch (error) {
                console.error('Ошибка при получении списка полов:', error);
            }
        };

        fetchGenders();
    }, []);

    const fetchUserCityName = async (userEmail) => {
        try {
            // Получаем данные пользователя по email
            const userData = await getUserByEmail(userEmail);

            // Если нет данных пользователя или cityId не определен, возвращаем null
            if (!userData || !userData.city) return null;

            const userCityId = userData.city.id; // Извлекаем cityId из данных пользователя

            // Получаем список всех городов

            // Находим город по cityId и возвращаем его название
            return userCityId
        } catch (error) {
            console.error('Ошибка при получении названия города:', error.message);
            return 'Ошибка получения города';
        }
    };

    const handleNextClick = async () => {
        const userEmail = localStorage.getItem('userEmail'); // Получаем email из localStorage

        if (!userEmail) {
            console.error('Email пользователя не найден');
            alert('Произошла ошибка. Пожалуйста, авторизуйтесь снова.');
            return;
        }

        try {
            // Получаем данные пользователя по email
            const userData = await getUserByEmail(userEmail);

            // Извлекаем ID города, имя и телефон пользователя
            const cityId = await fetchUserCityName(userEmail);
            const userFullName = userData.name;
            const userPhone = userData.phoneNumber;

            // Подготавливаем данные для обновления
            const updatedUserData = {
                id: userData.id, // ID пользователя
                name: userFullName, // Передаем существующее имя
                phoneNumber: userPhone, // Передаем существующий телефон
                gender: gender, // Обновляем выбранный гендер
                cityId: cityId, // Сохраняем существующий ID города
                emailAddress: userEmail // Передаем email пользователя
            };

            // Вызываем функцию обновления данных пользователя
            await updateUser(updatedUserData);

            // Дополнительная логика: вызов метода addClient
            const clientData = {
                userId: userData.id, // ID пользователя
                height: height, // Рост
                weight: weight, // Вес
                chest: chest, // Объем груди
                waist: waist, // Объем талии
                stomach: stomach, // Объем живота
                hips: hips, // Объем ягодиц
                thighs: thighs // Объем бедер
            };

            // Вызываем метод addClient для создания клиента
            await createClient(clientData);
            navigate('/client_main')

            showSnackbar('Данные успешно обновлены и клиент добавлен!', 'success');
        } catch (error) {
            console.error('Ошибка при обновлении данных или добавлении клиента:', error.message);
            showSnackbar(`Ошибка`, 'error');
        }
    };
    // Функция для показа уведомления
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    // Закрытие Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#f5f5f5' }}
        >
            <Box sx={{ width: '600px', padding: '20px', borderRadius: '10px', backgroundColor: 'white' }}>
                <Typography variant="h4" gutterBottom align="center" data-cy="client-info-title">
                    Дополнительная информация
                </Typography>

                {/* Поле для выбора пола */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="gender-label">Пол</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        label="Пол"
                        inputProps={{ 'data-cy': 'gender-select' }}
                        startAdornment={
                            <InputAdornment position="start">
                                {gender === 'male' ? (
                                    <Male color="primary" />
                                ) : gender === 'female' ? (
                                    <Female color="primary" />
                                ) : (
                                    <Accessibility color="primary" />
                                )}
                            </InputAdornment>
                        }
                    >
                        {genders.map((gender) => (
                            <MenuItem
                                key={gender.id}
                                value={gender.label} // Оригинальное значение (например, "Male")
                                data-cy={`gender-option-${gender.label}`}
                            >
                                {genderTranslations[gender.label] || gender.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Поле для роста */}
                <TextField
                    label="Рост (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'height-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Height color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для веса */}
                <TextField
                    label="Вес (кг)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'weight-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MonitorWeight color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для объёма груди */}
                <TextField
                    label="Объём груди (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'chest-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Straighten color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для объёма талии */}
                <TextField
                    label="Объём талии (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'waist-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Straighten color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для объёма живота */}
                <TextField
                    label="Объём живота (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={stomach}
                    onChange={(e) => setStomach(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'stomach-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Straighten color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для объёма ягодиц */}
                <TextField
                    label="Объём ягодиц (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'hips-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Straighten color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Поле для объёма бёдер */}
                <TextField
                    label="Объём бёдер (см)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    inputProps={{ maxLength: 3, 'data-cy': 'thighs-input' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Straighten color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Кнопка "Далее" */}
                <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{ mt: 2 }}
                    data-cy="next-button"
                    onClick={handleNextClick} // Добавляем обработчик события
                >
                    Далее
                </Button>
                {/* Уведомление Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default ClientInfo;