import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Badge,
    Button,
    Menu,
    MenuItem,
    ListItemIcon, // Добавляем ListItemIcon для иконок
} from '@mui/material';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event'; // Иконка для мероприятий

function MainTrainer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Состояние для выпадающего меню
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Обработчик выхода из системы
    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Удаляем токен доступа
        localStorage.removeItem('refreshToken'); // Удаляем refresh-токен
        navigate('/auth'); // Переход на страницу входа
    };

    // Обработчик открытия выпадающего меню
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Обработчик закрытия выпадающего меню
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Обработчик выбора пункта меню
    const handleMenuItemClick = (path) => {
        navigate(path); // Переход на выбранный путь
        handleMenuClose(); // Закрываем меню
    };

    // Список пунктов меню с иконками
    const menuItems = [
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
                        {/* Кнопка "Новости" с выпадающим меню */}
                        <Button
                            color="inherit"
                            startIcon={<HomeIcon />}
                            onClick={handleMenuOpen}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: location.pathname.includes('news') || location.pathname.includes('events') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                px: 2,
                                py: 1,
                            }}
                        >
                            Новости
                        </Button>

                        {/* Выпадающее меню */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                onClick={() => handleMenuItemClick('news')}
                                selected={location.pathname.includes('news')}
                            >
                                <ListItemIcon>
                                    <HomeIcon fontSize="small" /> {/* Иконка для новостей */}
                                </ListItemIcon>
                                Новости
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleMenuItemClick('events')}
                                selected={location.pathname.includes('events')}
                            >
                                <ListItemIcon>
                                    <EventIcon fontSize="small" /> {/* Иконка для мероприятий */}
                                </ListItemIcon>
                                Мероприятия
                            </MenuItem>
                        </Menu>

                        {/* Остальные пункты меню */}
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