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
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function MainTrainer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Состояние для выпадающего меню уведомлений
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const notificationsOpen = Boolean(notificationsAnchorEl);

    // Состояние для выпадающего меню "Клиенты"
    const [clientsAnchorEl, setClientsAnchorEl] = useState(null);
    const clientsOpen = Boolean(clientsAnchorEl);

    // Тестовые данные для уведомлений
    const notifications = [
        { id: 1, text: 'Новый клиент записался на тренировку.' },
        { id: 2, text: 'Оплата за тренировку прошла успешно.' },
        { id: 3, text: 'Новое сообщение от клиента.' },
        { id: 4, text: 'Запланировано мероприятие на следующую неделю.' },
    ];

    // Обработчик выхода из системы
    const handleLogout = () => {
        localStorage.clear() // Удаляем refresh-токен
        navigate('/auth'); // Переход на страницу входа
    };

    // Обработчик открытия окна уведомлений
    const handleNotificationsOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    // Обработчик закрытия окна уведомлений
    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    // Обработчик открытия выпадающего меню "Клиенты"
    const handleClientsMenuOpen = (event) => {
        setClientsAnchorEl(event.currentTarget);
    };

    // Обработчик закрытия выпадающего меню "Клиенты"
    const handleClientsMenuClose = () => {
        setClientsAnchorEl(null);
    };

    // Обработчик выбора пункта меню "Клиенты"
    const handleClientsMenuItemClick = (path) => {
        navigate(path); // Переход на выбранный путь
        handleClientsMenuClose(); // Закрываем меню
    };

    // Список пунктов меню с иконками
    const menuItems = [
        { id: 'news', text: 'Новости', path: 'news', icon: <HomeIcon /> },
        { id: 'profile', text: 'Профиль', path: 'profile', icon: <PersonIcon /> },
    ];

    // Пункты выпадающего меню "Клиенты"
    const clientsMenuItems = [
        { id: 'clients', text: 'Мои клиенты', path: 'clients' },
        { id: 'find-clients', text: 'Найти клиентов', path: 'find-clients' },
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

                        {/* Кнопка "Клиенты" с выпадающим меню */}
                        <Button
                            color="inherit"
                            startIcon={<PeopleIcon />}
                            endIcon={<ArrowDropDownIcon />}
                            onClick={handleClientsMenuOpen}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: location.pathname.includes('clients') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                px: 2,
                                py: 1,
                            }}
                        >
                            Клиенты
                        </Button>

                        {/* Выпадающее меню "Клиенты" */}
                        <Menu
                            anchorEl={clientsAnchorEl}
                            open={clientsOpen}
                            onClose={handleClientsMenuClose}
                        >
                            {clientsMenuItems.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    onClick={() => handleClientsMenuItemClick(item.path)}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Иконка уведомлений */}
                    <IconButton color="inherit" onClick={handleNotificationsOpen}>
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Окно уведомлений */}
                    <Menu
                        anchorEl={notificationsAnchorEl}
                        open={notificationsOpen}
                        onClose={handleNotificationsClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            style: {
                                width: 300, // Ширина окна уведомлений
                            },
                        }}
                    >
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Уведомления
                            </Typography>
                            <List>
                                {notifications.map((notification) => (
                                    <ListItem key={notification.id}>
                                        <ListItemText primary={notification.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Menu>

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