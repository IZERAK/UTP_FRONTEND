import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ProfilePage() {
    // Состояние для настроек
    const [settings, setSettings] = React.useState({
        notifications: 'Да',
        emailSubscription: 'Нет',
        changeTariff: 'Нет',
        deleteAccount: 'Нет',
    });

    // Обработчик изменения настроек
    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({...prev, [setting]: value}));
    };

    // Данные платежей
    const payments = [
        {
            id: 1,
            type: 'Оплата тарифа',
            amount: '500 руб.',
            time: '10:00',
            date: '15 октября 2023',
        },
        {
            id: 2,
            type: 'Списание баланса',
            amount: '200 руб.',
            time: '14:30',
            date: '16 октября 2023',
        },
        {
            id: 3,
            type: 'Оплата тарифа',
            amount: '500 руб.',
            time: '09:15',
            date: '17 октября 2023',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Профиль
            </Typography>

            {/* Секция "Мои данные" */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Мои данные</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Имя:</strong> Иван Иванов</Typography>
                        <Typography><strong>Email:</strong> ivan@example.com</Typography>
                        <Typography><strong>Телефон:</strong> +7 (999) 123-45-67</Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Секция "История платежей" */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">История платежей</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ mt: 2 }}>
                        {payments.map((payment) => (
                            <Paper
                                key={payment.id}
                                elevation={3}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderRadius: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                                    <Typography variant="body1" fontWeight="bold">
                                        {payment.type}
                                    </Typography>
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                        {payment.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                        {payment.time}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {payment.amount}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Обновлённая секция "Настройки" */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Настройки</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Уведомления */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Уведомления</Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={settings.notifications}
                                exclusive
                                onChange={(e, val) => val && handleSettingChange('notifications', val)}
                            >
                                <ToggleButton value="Да">Да</ToggleButton>
                                <ToggleButton value="Нет">Нет</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Рассылка на почту */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Рассылка на почту</Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={settings.emailSubscription}
                                exclusive
                                onChange={(e, val) => val && handleSettingChange('emailSubscription', val)}
                            >
                                <ToggleButton value="Да">Да</ToggleButton>
                                <ToggleButton value="Нет">Нет</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Сменить тариф */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Сменить тариф</Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={settings.changeTariff}
                                exclusive
                                onChange={(e, val) => val && handleSettingChange('changeTariff', val)}
                            >
                                <ToggleButton value="Да">Да</ToggleButton>
                                <ToggleButton value="Нет">Нет</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Удалить аккаунт */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Удалить аккаунт</Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={settings.deleteAccount}
                                exclusive
                                onChange={(e, val) => val && handleSettingChange('deleteAccount', val)}
                            >
                                <ToggleButton value="Да">Да</ToggleButton>
                                <ToggleButton value="Нет">Нет</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default ProfilePage; 