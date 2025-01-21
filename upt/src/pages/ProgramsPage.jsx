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
                to="/trainer_main/map" // Абсолютный путь к карте
                sx={{ mt: 2 }} // Отступ сверху
            >
                Перейти на карту
            </Button>
        </div>
    );
}

export default ProgramsPage;