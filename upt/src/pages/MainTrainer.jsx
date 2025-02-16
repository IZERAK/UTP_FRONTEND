import React, { useState, useEffect } from 'react';
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

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemIcon
} from '@mui/material';

import {
    Notifications,
    ExitToApp,
    InfoOutlined,
    CheckCircleOutline,
    WarningAmberOutlined,
    ErrorOutline,
} from '@mui/icons-material';

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getUncheckedNotifications, markNotificationAsChecked } from '../services/notificationService';

function MainTrainer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Состояние для выпадающего меню уведомлений
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const notificationsOpen = Boolean(notificationsAnchorEl);

    // Состояние для выпадающего меню "Клиенты"
    const [clientsAnchorEl, setClientsAnchorEl] = useState(null);
    const clientsOpen = Boolean(clientsAnchorEl);

    // Загрузка непрочитанных уведомлений при открытии диалогового окна
    useEffect(() => {
        if (dialogOpen) {
            fetchUncheckedNotifications();
        }
    }, [dialogOpen]);

    const fetchUncheckedNotifications = async () => {
        try {
            const uncheckedNotifications = await getUncheckedNotifications(localStorage.getItem('id_user'));
            setNotifications(uncheckedNotifications);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };
    
    const handleCloseDialog = async () => {
            // Пометить все уведомления как прочитанные
            try {
                await Promise.all(notifications.map(notification => markNotificationAsChecked(notification.id)));
                setNotifications([]); // Очищаем список уведомлений
            } catch (error) {
                console.error('Ошибка при пометке уведомлений как прочитанных:', error);
            }
            setDialogOpen(false);
        };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const getIconBySeverity = (severity) => {
        switch (severity) {
            case 'info':
                return <InfoOutlined color="primary" />;
            case 'success':
                return <CheckCircleOutline color="success" />;
            case 'warning':
                return <WarningAmberOutlined color="warning" />;
            case 'error':
                return <ErrorOutline color="error" />;
            default:
                return <InfoOutlined color="primary" />;
        }
    };

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
        { id: 'programs', text: 'Программы', path: 'programs', icon: <FitnessCenterIcon /> },
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
                    <IconButton color="inherit" onClick={handleOpenDialog}>
                        <Notifications />
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

            {/* Диалоговое окно для уведомлений */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Уведомления</DialogTitle>
                <DialogContent>
                    {notifications.length === 0 ? ( // Проверяем, есть ли клиенты
                        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                            Уведомлений нет
                        </Typography>
                    ) : (
                        <List>
                            {notifications.map((notification) => (
                                <ListItem key={notification.id} sx={{ py: 0.5, top: 0 }}>
                                    <ListItemIcon>{getIconBySeverity(notification.severity)}</ListItemIcon>
                                    <ListItemText primary={notification.text} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MainTrainer;