import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Link, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Хук для навигации
import loginUser from "../services/loginService" // Импортируем сервис авторизации

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Хук для навигации

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Проверка на пустые поля
        if (!email || !password) {
            setError('Все поля обязательны для заполнения!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Вызов функции авторизации
            const response = await loginUser(email, password);
            console.log('Ответ сервера:', response);

            // Перенаправляем на страницу "Выберите роль"
            navigate('/select-role');
        } catch (error) {
            setError(error.message || 'Произошла ошибка при авторизации. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
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
                    Авторизация
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Пароль"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/register" variant="body2">
                                Нет аккаунта? Зарегистрироваться
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
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}

export default Auth;