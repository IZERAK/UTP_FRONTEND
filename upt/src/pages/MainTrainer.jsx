import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography, Badge, Button } from '@mui/material';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

function MainTrainer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Обработчик выхода из системы
    const handleLogout = () => {
        // Здесь можно добавить логику для выхода из системы
        localStorage.removeItem('accessToken'); // Удаляем токен доступа
        localStorage.removeItem('refreshToken'); // Удаляем refresh-токен
        navigate('/auth'); // Переход на страницу входа
    };

    // Список пунктов меню с иконками
    const menuItems = [
        { id: 'news', text: 'Новости', path: 'news', icon: <HomeIcon /> },
        { id: 'programs', text: 'Программы', path: 'programs', icon: <FitnessCenterIcon /> },
        { id: 'clients', text: 'Клиенты', path: 'clients', icon: <PeopleIcon /> },
        { id: 'profile', text: 'Профиль', path: 'profile', icon: <PersonIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Навигационная панель */}
            <AppBar position="fixed">
                <Toolbar>
                    {/* Пункты меню */}
                    <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                color="inherit"
                                component={Link}
                                to={item.path}
                                startIcon={item.icon}
                                sx={{
                                    borderRadius: 2, // Закругленные углы
                                    backgroundColor: location.pathname.includes(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent', // Плашка для активного пункта
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Эффект при наведении
                                    },
                                    px: 2, // Отступы по горизонтали
                                    py: 1, // Отступы по вертикали
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>

                    {/* Иконка уведомлений */}
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="error"> {/* Пример: 4 новых уведомления */}
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Кнопка выхода */}
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Основной контент */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}> {/* mt: 8 для отступа под AppBar */}
                <Outlet /> {/* Здесь будут отображаться вложенные маршруты */}
            </Box>
        </Box>
    );
}

export default MainTrainer;