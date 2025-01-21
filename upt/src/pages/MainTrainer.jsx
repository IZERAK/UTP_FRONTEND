import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Badge } from '@mui/material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NewsIcon from '@mui/icons-material/Article';
import ProgramsIcon from '@mui/icons-material/FitnessCenter';
import ClientsIcon from '@mui/icons-material/People';
import ProfileIcon from '@mui/icons-material/Person';

function MainTrainer() {
    const navigate = useNavigate();

    // Обработчик выхода из системы
    const handleLogout = () => {
        // Здесь можно добавить логику для выхода из системы
        localStorage.removeItem('accessToken'); // Удаляем токен доступа
        localStorage.removeItem('refreshToken'); // Удаляем refresh-токен
        navigate('/login'); // Переход на страницу входа
    };

    // Список пунктов меню
    const menuItems = [
        { id: 'news', text: 'Новости', icon: <NewsIcon />, path: 'news' },
        { id: 'programs', text: 'Программы', icon: <ProgramsIcon />, path: 'programs' },
        { id: 'clients', text: 'Клиенты', icon: <ClientsIcon />, path: 'clients' },
        { id: 'profile', text: 'Профиль', icon: <ProfileIcon />, path: 'profile' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Боковое меню */}
            <Drawer
                variant="permanent" // Меню всегда видимо
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar /> {/* Отступ для AppBar */}
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                component={Link}
                                to={item.path}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Основной контейнер */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Навигационная панель */}
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        {/* Иконка уведомлений */}
                        <IconButton color="inherit" sx={{ ml: 'auto' }}>
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
        </Box>
    );
}

export default MainTrainer;