import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Grid,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

// Импортируем логотипы банков (замените на реальные пути к изображениям)
import TinkoffLogo from '../assets/tinkoff-logo.png';
import AlfaLogo from '../assets/alfa-logo.png';
import SberLogo from '../assets/sber-logo.png';
import VTBLogo from '../assets/vtb-logo.png';

function PayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPlan } = location.state || {}; // Получаем выбранный план из состояния навигации

    // Данные о банках (логотипы и имена)
    const banks = [
        { id: 1, logo: TinkoffLogo, name: 'Tinkoff' },
        { id: 2, logo: AlfaLogo, name: 'Alfa-Bank' },
        { id: 3, logo: SberLogo, name: 'Sberbank' },
        { id: 4, logo: VTBLogo, name: 'VTB' },
    ];

    const [selectedBank, setSelectedBank] = useState(null); // Состояние для выбранного банка

    // Обработчик выбора банка
    const handleBankSelect = (bankId) => {
        setSelectedBank(bankId === selectedBank ? null : bankId); // Переключение выбора
    };

    // Обработчик оплаты
    const handlePayment = () => {
        if (!selectedBank) {
            alert('Пожалуйста, выберите банк для оплаты.');
            return;
        }
        console.log('Оплата плана:', selectedPlan, 'через банк:', banks.find((b) => b.id === selectedBank).name);
        alert(`Оплата плана "${selectedPlan}" через ${banks.find((b) => b.id === selectedBank).title} прошла успешно!`);
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

                {/* Банковской картой */}
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Банковской картой
                    </Typography>
                    {/* Номер карты с маской */}
                    <InputMask mask="9999 9999 9999 9999" maskChar=" " alwaysShowMask>
                        {(inputProps) => (
                            <TextField {...inputProps} fullWidth label="Номер карты" margin="normal" />
                        )}
                    </InputMask>
                    {/* Дата (Мес/год) и CVC на одном уровне */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {/* Дата (Мес/год) с маской */}
                            <InputMask mask="99/99" maskChar=" " alwaysShowMask>
                                {(inputProps) => (
                                    <TextField {...inputProps} fullWidth label="Мес/год" margin="normal" />
                                )}
                            </InputMask>
                        </Grid>
                        <Grid item xs={6}>
                            {/* CVC с маской */}
                            <InputMask mask="999" maskChar=" " alwaysShowMask>
                                {(inputProps) => (
                                    <TextField {...inputProps} fullWidth label="CVC" margin="normal" />
                                )}
                            </InputMask>
                        </Grid>
                    </Grid>
                </Box>

                {/* Выбор банка через СБП */}
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        СБП
                    </Typography>
                    <Grid container spacing={2}>
                        {banks.map((bank) => (
                            <Grid item xs={6} sm={3} key={bank.id}>
                                <Card
                                    onClick={() => handleBankSelect(bank.id)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: selectedBank === bank.id ? '2px solid #007bff' : '1px solid #ccc',
                                        borderRadius: 2,
                                        padding: 2,
                                        boxShadow: selectedBank === bank.id ? 5 : 3,
                                    }}
                                >
                                    <img
                                        src={bank.logo}
                                        alt={bank.name}
                                        style={{ width: '80px', height: 'auto' }} // Фиксированный размер логотипа
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Кнопка оплаты */}
                <Box sx={{ width: '100%', mb: 2 }}>
                    <Button fullWidth variant="contained" sx={{ backgroundColor: 'primary.main' }} onClick={handlePayment}>
                        Оплатить
                    </Button>
                </Box>

                {/* Кнопка "Назад" */}
                <Box sx={{ width: '100%' }}>
                    <Button fullWidth variant="outlined" onClick={handleBack}>
                        Назад
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default PayPage;