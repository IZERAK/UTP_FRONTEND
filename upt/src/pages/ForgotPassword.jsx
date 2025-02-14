import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { restorePassword } from '../services/authService'; // Импортируем функцию восстановления пароля

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Проверка на пустой email
    if (!email) {
      setError('Пожалуйста, введите ваш email');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Вызов функции восстановления пароля
      await restorePassword(email);

      // После успешного восстановления:
      setSuccess(true);

      // Очистка localStorage
      localStorage.clear();

      // Редирект на страницу авторизации через 2 секунды
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
    } catch (error) {
      setError(error.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  // Закрытие уведомлений
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
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
        <Typography component="h1" variant="h5">
          Восстановить пароль
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Отправить пароль'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth" variant="body2">
                Вернуться к авторизации
              </Link>
            </Grid>
          </Grid>
        </Box>

        {/* Уведомление об ошибке */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>

        {/* Уведомление об успехе */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} sx={{ width: '100%' }} severity="success">
            Новый пароль отправлен на вашу почту!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default ForgotPassword;