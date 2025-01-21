import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Иконка плюса

function NewsPage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Новости
            </Typography>

            {/* Раздел "Новости сегодня" */}
            <Paper
                elevation={3} // Тень для блока
                sx={{
                    p: 3,
                    mb: 4,
                    textAlign: 'center', // Центрируем текст
                    backgroundColor: '#f5f5f5', // Светлый фон
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Новости сегодня
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />} // Иконка плюса
                    onClick={() => alert('Сообщить о новости за сегодня')}
                >
                    Сообщить
                </Button>
            </Paper>

            {/* Раздел "Новости недели" */}
            <Paper
                elevation={3} // Тень для блока
                sx={{
                    p: 3,
                    mb: 4,
                    textAlign: 'center', // Центрируем текст
                    backgroundColor: '#f5f5f5', // Светлый фон
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Новости недели
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />} // Иконка плюса
                    onClick={() => alert('Сообщить о новости за неделю')}
                >
                    Сообщить
                </Button>
            </Paper>

            {/* Раздел "Новости месяца" */}
            <Paper
                elevation={3} // Тень для блока
                sx={{
                    p: 3,
                    mb: 4,
                    textAlign: 'center', // Центрируем текст
                    backgroundColor: '#f5f5f5', // Светлый фон
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Новости месяца
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />} // Иконка плюса
                    onClick={() => alert('Сообщить о новости за месяц')}
                >
                    Сообщить
                </Button>
            </Paper>
        </Box>
    );
}

export default NewsPage;