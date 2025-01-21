import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Иконка галочки

function PaymentsPage() {
    // Пример данных о платежах
    const payments = [
        {
            id: 1,
            type: 'Оплата тарифа',
            amount: '500 руб.',
            time: '10:00',
            date: '15 октября 2023',
        },
        {
            id: 2,
            type: 'Списание баланса',
            amount: '200 руб.',
            time: '14:30',
            date: '16 октября 2023',
        },
        {
            id: 3,
            type: 'Оплата тарифа',
            amount: '500 руб.',
            time: '09:15',
            date: '17 октября 2023',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Платежи
            </Typography>

            {/* Список платежей */}
            {payments.map((payment) => (
                <Paper
                    key={payment.id}
                    elevation={3}
                    sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#000', // Чёрная плашка
                        color: '#fff', // Белый текст
                        borderRadius: 2,
                    }}
                >
                    {/* Левая часть: иконка и текст */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircleIcon sx={{ color: '#4caf50' }} /> {/* Иконка галочки */}
                        <Box>
                            <Typography variant="body1" fontWeight="bold">
                                {payment.type}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {payment.date}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Правая часть: цена и время */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {payment.amount}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {payment.time}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

export default PaymentsPage;