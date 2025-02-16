// src/pages/ClientMain.jsx
import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import {
    Notifications,
    ExitToApp,
    InfoOutlined,
    CheckCircleOutline,
    WarningAmberOutlined,
    ErrorOutline,
} from '@mui/icons-material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getUncheckedNotifications, markNotificationAsChecked } from '../services/notificationService';

const ClientMain = () => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

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

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    // Обработчик выхода из системы
    const handleLogout = () => {
        localStorage.clear() // Удаляем refresh-токен
        navigate('/auth'); // Переход на страницу входа
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

    return (
        <Box height="100%">
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Box display="flex" flexGrow={1} gap={2}>
                        <Button component={Link} to="news" color="inherit">
                            Новости
                        </Button>
                        <Button component={Link} to="programs" color="inherit">
                            Программы
                        </Button>
                        <Button component={Link} to="trainers" color="inherit">
                            Тренера
                        </Button>
                        <Button component={Link} to="profile" color="inherit">
                            Профиль
                        </Button>
                    </Box>
                    <IconButton color="inherit" onClick={handleOpenDialog}>
                        <Notifications />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box padding={3} height="100%">
                <Outlet />
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
};

export default ClientMain;