import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Paper,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Trainer1 from '../assets/Тренер 1.jpg'
import Trainer2 from '../assets/Тренер 2.jpg'
import Trainer3 from '../assets/Тренер 3.jpg'

function ClientProfile() {
    // Состояние для отслеживания открытого чата для каждого клиента
    const [openChatId, setOpenChatId] = useState(null);

    // Данные клиентов
    const clients = [
        {
            id: 1,
            name: 'Иванов Иван Иванович',
            avatar: Trainer1,
            availableDays: ['Понедельник', 'Среда', 'Пятница'],
            availableTime: '10:00 - 18:00',
        },
        {
            id: 2,
            name: 'Петров Петр Петрович',
            avatar: Trainer2,
            availableDays: ['Вторник', 'Четверг'],
            availableTime: '09:00 - 17:00',
        },
        {
            id: 3,
            name: 'Сидорова Анна Владимировна',
            avatar: Trainer3,
            availableDays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'],
            availableTime: '08:00 - 20:00',
        },
    ];

    // Обработчик открытия/закрытия чата
    const handleStartChat = (clientId) => {
        if (openChatId === clientId) {
            setOpenChatId(null); // Закрыть чат, если он уже открыт
        } else {
            setOpenChatId(clientId); // Открыть чат для выбранного клиента
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Заголовок страницы */}
            <Typography variant="h4" gutterBottom>
                Мои клиенты
            </Typography>

            {/* Список клиентов с использованием Accordion */}
            {clients.map((client) => (
                <Accordion key={client.id} sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${client.id}-content`}
                        id={`panel-${client.id}-header`}
                    >
                        {/* Краткая информация о клиенте */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={client.avatar} alt={client.name} sx={{ width: 50, height: 50 }} />
                            <Typography variant="h6">{client.name}</Typography>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                        {/* Подробная информация о клиенте */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Доступные дни и время */}
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Доступные дни и время
                                </Typography>
                                <List>
                                    {client.availableDays.map((day, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={day} secondary={client.availableTime} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>

                            {/* Кнопка для открытия чата */}
                            <Button
                                variant="contained"
                                startIcon={<ChatIcon />}
                                onClick={() => handleStartChat(client.id)}
                                sx={{ mt: 1 }}
                            >
                                Начать чат (-1 токен)
                            </Button>

                            {/* Чат (раскрывающийся блок) */}
                            <Collapse in={openChatId === client.id}>
                                <Paper sx={{ p: 2, mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Чат с клиентом
                                    </Typography>
                                    <Box sx={{ height: 150, overflowY: 'auto', border: '1px solid #ddd', p: 2 }}>
                                        {/* Здесь будет отображаться история сообщений */}
                                        <Typography variant="body1" color="textSecondary">
                                            История сообщений...
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        <input
                                            type="text"
                                            placeholder="Введите сообщение..."
                                            style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                        <Button variant="contained">Отправить</Button>
                                    </Box>
                                </Paper>
                            </Collapse>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export default ClientProfile;