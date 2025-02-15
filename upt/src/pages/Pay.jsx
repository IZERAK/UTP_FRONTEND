import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    TextField,
    Grid,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { addPayment } from '../services/paymentService'; // Импортируем функцию addPayment

// Импортируем логотипы банков
import TinkoffLogo from '../assets/tinkoff-logo.png';
import AlfaLogo from '../assets/alfa-logo.png';
import SberLogo from '../assets/sber-logo.png';
import VTBLogo from '../assets/vtb-logo.png';

function PayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPlan } = location.state || {}; // Получаем выбранный план и цену
    const [selectedBank, setSelectedBank] = useState(null); // Состояние для выбранного банка
    const [loading, setLoading] = useState(false); // Состояние для загрузки

    // Данные о банках
    const banks = [
        { id: 1, logo: TinkoffLogo, name: 'Tinkoff' },
        { id: 2, logo: AlfaLogo, name: 'Alfa-Bank' },
        { id: 3, logo: SberLogo, name: 'Sberbank' },
        { id: 4, logo: VTBLogo, name: 'VTB' },
    ];

    // Обработчик выбора банка
    const handleBankSelect = (bankId) => {
        setSelectedBank(bankId === selectedBank ? null : bankId); // Переключение выбора
    };

    // Обработчик оплаты
    const handlePayment = async () => {
        if (!selectedBank) {
            alert('Пожалуйста, выберите банк для оплаты.');
            return;
        }

        setLoading(true); // Показываем индикатор загрузки

        try {
            const userId = localStorage.getItem('id_user'); // Получаем ID пользователя из локального хранилища
            const amount = localStorage.getItem('selectedPlanPrice'); // Используем цену напрямую
            const purchasedProduct = localStorage.getItem('selectedPlan'); // Тип приобретаемого продукта
            const title = 'test'; // Название платежа

            // Проверяем наличие всех необходимых данных
            if (!userId || !amount || !purchasedProduct || !title) {
                console.error('Недостаточно данных для оплаты:', { userId, amount, purchasedProduct, title });
                alert('Произошла ошибка. Проверьте данные.');
                setLoading(false);
                return;
            }

            // Вызываем функцию addPayment
            const response = await addPayment(amount, purchasedProduct, title, userId);

            console.log('Результат оплаты:', response); // Логируем результат
            alert(`Оплата плана "${selectedPlan}" через ${banks.find((b) => b.id === selectedBank).name} прошла успешно!`);
            localStorage.removeItem('selectedPlan'); // Получаем ID пользователя из локального хранилища
            localStorage.removeItem('selectedPlanPrice');
            navigate('/trainer_info_add'); // Переход на страницу после оплаты
        } catch (error) {
            console.error('Ошибка при оплате:', error.message || error);
            alert('Произошла ошибка при оплате. Попробуйте снова.');
        } finally {
            setLoading(false); // Скрываем индикатор загрузки
        }
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
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: 'primary.main' }}
                        onClick={handlePayment}
                        disabled={loading} // Отключаем кнопку во время загрузки
                    >
                        {loading ? 'Загрузка...' : 'Оплатить'}
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