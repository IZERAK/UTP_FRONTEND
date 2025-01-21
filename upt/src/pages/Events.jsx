import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; // Иконка галочки

function EventsPage() {
    // Пример данных о мероприятиях
    const events = [
        {
            id: 1,
            title: 'Марафон "Беги за мечтой"',
            date: '15 октября 2023',
            location: 'Москва, Парк Горького',
        },
        {
            id: 2,
            title: 'Велосипедный заезд "Круг света"',
            date: '22 октября 2023',
            location: 'Санкт-Петербург, Невский проспект',
        },
        {
            id: 3,
            title: 'Йога в парке',
            date: '29 октября 2023',
            location: 'Казань, Центральный парк',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Мероприятия
            </Typography>

            {/* Список мероприятий */}
            {events.map((event) => (
                <Paper
                    key={event.id}
                    elevation={3} // Тень для блока
                    sx={{
                        p: 3,
                        mb: 4,
                        textAlign: 'center', // Центрируем текст
                        backgroundColor: '#f5f5f5', // Светлый фон
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        {event.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Дата:</strong> {event.date}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Место:</strong> {event.location}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<CheckIcon />} // Иконка галочки
                        onClick={() => alert(`Вы приняли участие в мероприятии: ${event.title}`)}
                        sx={{ mt: 2 }} // Отступ сверху
                    >
                        Принять участие
                    </Button>
                </Paper>
            ))}
        </Box>
    );
}

export default EventsPage;