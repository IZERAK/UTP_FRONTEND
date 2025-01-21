import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { Box, Typography } from '@mui/material';

function MapPage() {
    // Координаты центра карты (например, Москва)
    const defaultState = {
        center: [55.751574, 37.573856], // Широта и долгота
        zoom: 10, // Уровень масштабирования
    };

    // Координаты для меток (пример)
    const placemarks = [
        { id: 1, coordinates: [55.751574, 37.573856], title: 'Тренировка 1' },
        { id: 2, coordinates: [55.753930, 37.620795], title: 'Тренировка 2' },
        { id: 3, coordinates: [55.758011, 37.633952], title: 'Тренировка 3' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Карта тренировок
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Здесь отображаются локации для тренировок.
            </Typography>

            {/* Контейнер для карты */}
            <YMaps>
                <Map
                    defaultState={defaultState}
                    width="100%"
                    height="500px"
                >
                    {/* Добавляем метки на карту */}
                    {placemarks.map((mark) => (
                        <Placemark
                            key={mark.id}
                            geometry={mark.coordinates}
                            properties={{
                                balloonContent: mark.title,
                            }}
                            options={{
                                preset: 'islands#blueSportIcon', // Иконка для метки
                            }}
                        />
                    ))}
                </Map>
            </YMaps>
        </Box>
    );
}

export default MapPage;