import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function ProgramsPage() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Программы
            </Typography>
            {/* Кнопка для перехода на страницу выбора программы */}
            <Button
                variant="contained"
                component={Link}
                to="/trainer_main/programs/selection"
                sx={{ mt: 2, mr: 2 }} // Отступ сверху и справа
            >
                Выбрать программу
            </Button>
            {/* Кнопка для перехода на карту */}
            <Button
                variant="contained"
                component={Link}
                to="/trainer_main/map"
                sx={{ mt: 2 }}
            >
                Перейти на карту
            </Button>
        </div>
    );
}

export default ProgramsPage;