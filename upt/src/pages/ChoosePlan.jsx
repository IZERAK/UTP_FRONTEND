import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import { getPurchasedProducts } from '../services/infrastructureService';

// Маппинг типов планов к их характеристикам
const planDescriptions = {
  FreeSubscribe: {
    title: 'Бесплатный план',
    plan: 'FreeSubscribe',
    duration: '2 недели',
    price: 'Бесплатно',
    price_v: 0,
    messageLimit: 15,
    includesNewsPublication: false,
  },
  ProSubscribe: {
    title: 'Pro план',
    plan: 'ProSubscribe',
    duration: '1 месяц',
    price_v: 1499,
    price: '1 499 ₽',
    messageLimit: 50,
    includesNewsPublication: true,
  },
  DeluxeSubscribe: {
    title: 'Deluxe план',
    plan: 'DeluxeSubscribe',
    duration: '1 месяц',
    price_v: 1999,
    price: '1 999 ₽',
    messageLimit: 100,
    includesNewsPublication: true,
  },
};

function ChoosePlanPage() {
  const [plans, setPlans] = useState([]); // Состояние для хранения планов
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибки
  const navigate = useNavigate(); // Хук для навигации

  // Получаем планы из API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPurchasedProducts(); // Вызов метода для получения планов
        const plansArray = Object.entries(data).map(([index, type]) => ({ index, type }));
        setPlans(plansArray); // Устанавливаем планы в состояние
      } catch (error) {
        setError('Не удалось загрузить планы.');
        console.error('Ошибка при загрузке планов:', error);
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };
    fetchPlans();
  }, []);

  // Обработчик выбора плана
  const handlePlanSelect = (planIndex) => {
    const selectedPlan = plans.find((plan) => plan.index === planIndex);
    const planData = planDescriptions[selectedPlan.type];

    if (selectedPlan) {
      // Сохраняем выбранный план в localStorage
      localStorage.setItem('selectedPlan', planData.plan);
      localStorage.setItem('selectedPlanPrice', planData.price_v);


      // Переходим на страницу оплаты с передачей выбранного индекса плана
      navigate('/pay', { state: { selectedPlanIndex: planIndex } });
    }
  };

  // Обработчик кнопки "Назад"
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" variant="h6" align="center" sx={{ mt: 8 }}>
          {error}
        </Typography>
      </Container>
    );
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
          {plans.map((plan) => (
            <Grid item key={plan.index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  p: 2,
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                  }}
                >
                  {/* Название плана с улучшенной читаемостью */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      color:
                        plan.type === 'FreeSubscribe'
                          ? 'primary.main'
                          : plan.type === 'ProSubscribe'
                            ? 'secondary.main'
                            : 'success.main',
                      mb: 2,
                    }}
                  >
                    {planDescriptions[plan.type]?.title || 'Неизвестный план'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Срок:</strong>{' '}
                    {planDescriptions[plan.type]?.duration || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Цена:</strong>{' '}
                    {planDescriptions[plan.type]?.price || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Количество сообщений:</strong>{' '}
                    {planDescriptions[plan.type]?.messageLimit || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Публикация новостей:</strong>{' '}
                    {planDescriptions[plan.type]?.includesNewsPublication ? '✔️' : '❌'}
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 'auto', p: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handlePlanSelect(plan.index)}
                    sx={{
                      fontSize: '0.875rem',
                      py: 1,
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
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