import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Иконка поиска

function MapPage() {
    const [gyms, setGyms] = useState([]); // Состояние для хранения данных о залах
    const [filteredGyms, setFilteredGyms] = useState([]); // Состояние для отфильтрованных залов
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
    const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок

    // Загрузка данных о залах
   /*  useEffect(() => {
        const fetchGyms = async () => {
            try {
                const data = await gymService.getGyms(); // Запрашиваем данные
                setGyms(data); // Сохраняем данные в состояние
                setFilteredGyms(data); // Инициализируем отфильтрованные данные
                setLoading(false); // Убираем загрузку
            } catch (err) {
                setError(err.message); // Обрабатываем ошибку
                setLoading(false); // Убираем загрузку
            }
        };

        fetchGyms();
    }, []); */

    // Обработчик изменения поискового запроса
    useEffect(() => {
        if (searchQuery) {
            const filtered = gyms.filter((gym) =>
                gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Поиск по названию
                gym.city.name.toLowerCase().includes(searchQuery.toLowerCase()) // Поиск по городу
            );
            setFilteredGyms(filtered); // Обновляем отфильтрованные залы
        } else {
            setFilteredGyms(gyms); // Если запрос пустой, показываем все залы
        }
    }, [searchQuery, gyms]);

    // Преобразуем координаты из строки в массив чисел
    const parseLocation = (location) => {
        return location.split(',').map(coord => parseFloat(coord.trim()));
    };

    // Координаты центра карты (первый зал или Москва по умолчанию)
    const defaultState = {
        center: gyms.length > 0 ? parseLocation(gyms[0].location) : [55.751574, 37.573856],
        zoom: 10,
    };

    if (loading) {
        return <Typography>Загрузка данных...</Typography>;
    }

    if (error) {
        return <Typography color="error">Ошибка: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Карта залов
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Здесь отображаются залы для тренировок.
            </Typography>

            {/* Поле поиска */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Поиск залов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />

            {/* Контейнер для карты */}
            <YMaps>
                <Map
                    defaultState={defaultState}
                    width="1000px"
                    height="500px"
                >
                    {/* Добавляем метки на карту для отфильтрованных залов */}
                    {filteredGyms.map((gym, index) => {
                        const coordinates = parseLocation(gym.location);
                        return (
                            <Placemark
                                key={index}
                                geometry={coordinates}
                                properties={{
                                    balloonContent: `
                                        <strong>${gym.name}</strong><br>
                                        <em>Город:</em> ${gym.city.name}<br>
                                        <em>Время работы:</em> ${gym.openTime} - ${gym.closeTime}
                                    `,
                                }}
                                options={{
                                    preset: 'islands#blueSportIcon', // Иконка для метки
                                }}
                            />
                        );
                    })}
                </Map>
            </YMaps>
        </Box>
    );
}

export default MapPage;