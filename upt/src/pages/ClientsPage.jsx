import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    List,
    Button,
    Paper,
    Collapse,
    TextField,
    IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Импортируем изображения
import Trainer1 from '../assets/Тренер 1.jpg'
import Trainer2 from '../assets/Тренер 2.jpg'
import Trainer3 from '../assets/Тренер 3.jpg'
import Trainer4 from '../assets/Тренер 4.jpg'


// Случайные данные для клиентов
const clients = [
    {
        id: 1,
        name: 'Иванов Иван Иванович',
        address: 'г. Москва, ул. Ленина, д. 10',
        image: Trainer1,
    },
    {
        id: 2,
        name: 'Петров Петр Петрович',
        address: 'г. Санкт-Петербург, ул. Пушкина, д. 5',
        image: Trainer2,
    },
    {
        id: 3,
        name: 'Сидорова Анна Владимировна',
        address: 'г. Екатеринбург, ул. Мира, д. 15',
        image: Trainer3,
    },
    {
        id: 4,
        name: 'Козлова Елена Сергеевна',
        address: 'г. Новосибирск, ул. Гагарина, д. 20',
        image: Trainer4,
    },
];

function ClientsPage() {
    // Состояние для отслеживания открытого чата
    const [openChatId, setOpenChatId] = useState(null);

    // Обработчик открытия/закрытия чата
    const handleChatToggle = (clientId) => {
        if (openChatId === clientId) {
            setOpenChatId(null); // Закрыть чат, если он уже открыт
        } else {
            setOpenChatId(clientId); // Открыть чат для выбранного клиента
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Клиенты
            </Typography>

            <List>
                {clients.map((client) => (
                    <Paper
                        key={client.id}
                        elevation={3}
                        sx={{
                            mb: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Левая часть: аватар и информация */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                src={client.image}
                                alt={client.name}
                                sx={{ width: 80, height: 80, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="h6">{client.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {client.address}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Правая часть: кнопка чата */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleChatToggle(client.id)}
                                endIcon={
                                    openChatId === client.id ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )
                                }
                            >
                                Чат
                            </Button>
                        </Box>
                    </Paper>
                ))}

                {/* Чат для выбранного клиента */}
                {clients.map((client) => (
                    <Collapse key={client.id} in={openChatId === client.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                mt: 1,
                                mb: 2,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Typography variant="h6">Чат с {client.name}</Typography>

                            {/* История сообщений */}
                            <Box
                                sx={{
                                    height: 150,
                                    overflowY: 'auto',
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    p: 2,
                                }}
                            >
                                <Typography variant="body1" color="textSecondary">
                                    История сообщений...
                                </Typography>
                            </Box>

                            {/* Поле ввода сообщения */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Введите сообщение..."
                                    variant="outlined"
                                    size="small"
                                />
                                <Button variant="contained" color="primary">
                                    Отправить
                                </Button>
                            </Box>
                        </Paper>
                    </Collapse>
                ))}
            </List>
        </Box>
    );
}

export default ClientsPage;