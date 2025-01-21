import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, TextField, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask'; // Импортируем InputMask для масок

// Импортируем логотипы банков (замените на реальные пути к изображениям)
import TinkoffLogo from '../assets/tinkoff-logo.png';
import AlfaLogo from '../assets/alfa-logo.png';
import SberLogo from '../assets/sber-logo.png';
import VTBLogo from '../assets/vtb-logo.png';

function PayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPlan } = location.state || {}; // Получаем выбранный план из состояния навигации

    // Данные о банках (только логотипы)
    const banks = [TinkoffLogo, AlfaLogo, SberLogo, VTBLogo];

    // Обработчик оплаты
    const handlePayment = () => {
        // Здесь можно добавить логику для обработки оплаты
        console.log('Оплата плана:', selectedPlan);
        alert(`Оплата плана "${selectedPlan}" прошла успешно!`);
        navigate('/trainer_info_add'); // Переход на страницу "trainer_info_add" после оплаты
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate(-1); // Переход на предыдущую страницу
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
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Оплата плана: {selectedPlan || 'Неизвестный план'}
                </Typography>

                {/* Банковской картой */}
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Банковской картой
                    </Typography>

                    {/* Номер карты с маской */}
                    <InputMask
                        mask="9999 9999 9999 9999" // Маска для номера карты
                        maskChar=" "
                        alwaysShowMask
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                fullWidth
                                label="Номер карты"
                                margin="normal"
                            />
                        )}
                    </InputMask>

                    {/* Дата (Мес/год) и CVC на одном уровне */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {/* Дата (Мес/год) с маской */}
                            <InputMask
                                mask="99/99" // Маска для даты (ММ/ГГ)
                                maskChar=" "
                                alwaysShowMask
                            >
                                {(inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        fullWidth
                                        label="Мес/год"
                                        margin="normal"
                                    />
                                )}
                            </InputMask>
                        </Grid>
                        <Grid item xs={6}>
                            {/* CVC с маской */}
                            <InputMask
                                mask="999" // Маска для CVC
                                maskChar=" "
                                alwaysShowMask
                            >
                                {(inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        fullWidth
                                        label="CVC"
                                        margin="normal"
                                    />
                                )}
                            </InputMask>
                        </Grid>
                    </Grid>
                </Box>

                {/* СБП и банки (только логотипы) */}
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        СБП
                    </Typography>
                    {banks.map((logo, index) => (
                        <Card key={index} sx={{ mb: 2, backgroundColor: 'white', boxShadow: 3 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={logo}
                                    alt={`Bank ${index + 1}`}
                                    style={{ width: '100px', height: 'auto' }} // Фиксированный размер логотипа
                                />
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Кнопка оплаты */}
                <Box sx={{ width: '100%', mb: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: 'primary.main' }}
                        onClick={handlePayment}
                    >
                        Оплатить
                    </Button>
                </Box>

                {/* Кнопка "Назад" */}
                <Box sx={{ width: '100%' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleBack}
                    >
                        Назад
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default PayPage;