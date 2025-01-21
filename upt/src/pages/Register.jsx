import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Link, CircularProgress, Snackbar, Alert } from '@mui/material';
import registerUser from "../services/registerService"; // Импортируем registerUser как default

function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Состояние для ошибок
    const [success, setSuccess] = useState(false); // Состояние для успешной регистрации

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Проверка на пустые поля
        if (!email || !password || !confirmPassword) {
            setError('Все поля обязательны для заполнения!');
            return;
        }

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setError('Пароли не совпадают!');
            return;
        }

        setLoading(true);
        setError(null); // Сбрасываем ошибку перед запросом

        try {
            // Вызов функции регистрации из registerService
            const response = await registerUser(email, password);
            setSuccess(true); // Устанавливаем успешную регистрацию
            console.log('Ответ сервера:', response);
        } catch (error) {
            setError(error.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null); // Закрываем уведомление об ошибке
        setSuccess(false); // Закрываем уведомление об успехе
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
                    Регистрация
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
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Подтвердите пароль"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/auth" variant="body2">
                                Уже есть аккаунт? Войти
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
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

            {/* Уведомление об успехе */}
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Регистрация прошла успешно!
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default RegistrationForm;