import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import { planService } from '../services/apiService'; // Импортируем сервис для планов

function ChoosePlanPage() {
    const [plans, setPlans] = useState([]); // Состояние для хранения планов
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Ошибки
    const navigate = useNavigate(); // Хук для навигации

    // Получаем планы из API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await planService.getPlans();
                setPlans(Object.values(data)); // Преобразуем объект в массив
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Обработчик выбора плана
    const handlePlanSelect = (plan) => {
        // Переход на страницу оплаты с передачей выбранного плана
        navigate('/pay', { state: { selectedPlan: plan } });
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate(-1); // Переход на предыдущую страницу
    };

    if (loading) {
        return <Typography>Загрузка...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Выберите тариф
                </Typography>

                {/* Отображение планов в виде сетки */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {plans.map((plan, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                                <CardContent>
                                    {/* Название плана с улучшенной читаемостью */}
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: plan === 'FreeSubscribe' ? 'primary.main' : 'secondary.main',
                                            mb: 2,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {plan === 'FreeSubscribe' && 'Бесплатный план'}
                                        {plan === 'ProSubscribe' && 'Pro план'}
                                        {plan === 'DeluxeSubscribe' && 'Deluxe план'}
                                    </Typography>

                                    {/* Детали плана */}
                                    <Typography>
                                        <strong>Срок:</strong> {plan === 'FreeSubscribe' ? '2 недели' : '1 месяц'}
                                    </Typography>
                                    <Typography>
                                        <strong>Цена:</strong> {plan === 'FreeSubscribe' ? 'Бесплатно' : plan === 'ProSubscribe' ? '1 499 ₽' : '1 999 ₽'}
                                    </Typography>
                                    <Typography>
                                        <strong>Количество SMS:</strong> {plan === 'FreeSubscribe' ? '15' : plan === 'ProSubscribe' ? '50' : '100'}
                                    </Typography>
                                    <Typography>
                                        <strong>Участие в мероприятиях:</strong> {plan === 'FreeSubscribe' ? '❌' : '✔️'}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ mt: 'auto', p: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handlePlanSelect(plan)}
                                        sx={{ backgroundColor: plan === 'FreeSubscribe' ? 'primary.main' : 'secondary.main' }}
                                    >
                                        Выбрать
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Кнопка "Назад" */}
                <Box sx={{ mt: 4, width: '100%', maxWidth: 400 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ mt: 2 }}
                    >
                        Назад
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ChoosePlanPage;