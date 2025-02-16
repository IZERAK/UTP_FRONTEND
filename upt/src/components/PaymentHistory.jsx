import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { getPaymentsByUserId } from '../services/paymentService'; // Предполагается существование сервиса

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('id_user');
    
    getPaymentsByUserId(userId)
      .then(data => {
        setPayments(data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке истории платежей:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          История платежей
        </Typography>

        {payments.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Нет данных о платежах
          </Typography>
        ) : (
          payments.map((payment) => (
            <Box key={payment.id} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">
                    {formatDate(payment.date)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1">
                    {payment.title}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontWeight: 'bold',
                      color: payment.amount > 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {formatAmount(payment.amount)}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default PaymentHistory;