import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function ProgramsPage() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Программы
            </Typography>
            {/* Кнопка для перехода на карту */}
            <Button
                variant="contained" // Стиль кнопки
                component={Link} // Используем Link для навигации
                to="map" // Переход на /trainer_main/programs/map
                sx={{ mt: 2 }} // Отступ сверху
            >
                Перейти на карту
            </Button>
        </div>
    );
}

export default ProgramsPage;