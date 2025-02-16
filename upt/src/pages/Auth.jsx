// src/pages/Login.jsx
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Card,
    CardContent,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Email, Lock, Person } from '@mui/icons-material';
import { loginUser } from '../services/authService';
import { getUserByEmail } from '../services/userService';
import { getClientByUserId } from '../services/clientService';
import { getTrainerByUserId } from '../services/trainerService';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          
            const loginResponse = await loginUser( emailAddress, password );

            // Сохраняем токены в localStorage
            localStorage.setItem('accessToken', loginResponse.accessToken);
            localStorage.setItem('refreshToken', loginResponse.refreshToken);
            localStorage.setItem('userEmail', emailAddress);

            // Получаем ID пользователя по email
            const userIdResponse = await getUserByEmail(emailAddress);
            localStorage.setItem('id_user', userIdResponse.id); // Предполагается, что такой метод уже существует
            const userId = userIdResponse.id;

            if (!userId) {
                throw new Error('Пользователь не найден');
            }

            // Проверяем, является ли пользователь клиентом
            let isClient = false;
            try {
                const clinet = await getClientByUserId(userId);
                localStorage.setItem('id_client', clinet.id)
                isClient = true;
            } catch (error) {
                console.log('Пользователь не является клиентом:', error.message);
            }

            // Если пользователь не клиент, проверяем, является ли он тренером
            if (!isClient) {
                try {
                    const trainer = await getTrainerByUserId(userId);
                    localStorage.setItem('id_trainer', trainer.id)
                } catch (error) {
                    throw new Error('Пользователь не является ни клиентом, ни тренером');
                }
            }

            // Уведомление об успешной авторизации
            setSnackbarMessage('Авторизация успешна!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Перенаправляем пользователя на соответствующую страницу
            setTimeout(() => {
                if (isClient) {
                    navigate('/client_main'); // Страница клиента
                } else {
                    navigate('/trainer_main'); // Страница тренера
                }
            }, 1000);
        } catch (err) {
            setSnackbarMessage(err.message || 'Ошибка авторизации');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#f5f5f5' }}
        >
            <Card sx={{ width: '400px', padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" data-cy="login-title">
                        Авторизация
                    </Typography>
                    {/* Поле для почты */}
                    <TextField
                        label="Почта"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={emailAddress}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ 'data-cy': 'emailAddress-input' }} // Селектор для Cypress
                    />
                    {/* Поле для пароля */}
                    <TextField
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ 'data-cy': 'password-input' }} // Селектор для Cypress
                    />
                    {/* Кнопка "Войти" */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                        startIcon={<Person color="inherit" />}
                        data-cy="login-button" // Селектор для Cypress
                        onClick={handleSubmit}
                    >
                        Войти
                    </Button>
                    {/* Ссылка на страницу регистрации */}
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Нет аккаунта?{' '}
                        <Link component={RouterLink} to="/register" color="primary" data-cy="register-link">
                            Зарегистрируйтесь
                        </Link>
                    </Typography>
                    {/* Ссылка "Забыли пароль" */}
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        <Link component={RouterLink} to="/forgot-password" color="primary" data-cy="forgot-password-link">
                            Забыли пароль?
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
            {/* Snackbar для уведомлений */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;