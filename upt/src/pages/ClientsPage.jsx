import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Avatar,
    List,
    Button,
    Paper,
    Collapse,
    TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getClientById } from '../services/clientService'; // Импортируем метод для получения клиента

function ClientsPage() {
    const [clients, setClients] = useState([]); // Состояние для хранения клиентов
    const [openChatId, setOpenChatId] = useState(null); // Состояние для отслеживания открытого чата
    const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок

    // Функция для выгрузки клиентов
    const fetchClients = async () => {
        const clientsList = [];
        let clientId = 1;

        while (true) {
            try {
                const client = await getClientById(clientId); // Запрашиваем клиента по ID
                clientsList.push(client); // Добавляем клиента в список
                clientId++; // Увеличиваем ID для следующего запроса
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    // Если сервер вернул ошибку 400, прерываем цикл
                    break;
                } else {
                    setError(error.message); // Обрабатываем другие ошибки
                    break;
                }
            }
        }
        console.log()
        setClients(clientsList); // Сохраняем список клиентов в состояние
        setLoading(false); // Убираем загрузку
    };

    // Загрузка клиентов при монтировании компонента
    useEffect(() => {
        fetchClients();
    }, []);

    // Обработчик открытия/закрытия чата
    const handleChatToggle = (clientId) => {
        if (openChatId === clientId) {
            setOpenChatId(null); // Закрыть чат, если он уже открыт
        } else {
            setOpenChatId(clientId); // Открыть чат для выбранного клиента
        }
    };

    if (loading) {
        return <Typography>Загрузка клиентов...</Typography>;
    }

    if (error) {
        return <Typography color="error">Ошибка: {error}</Typography>;
    }

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
                        {/* Левая часть: аватар, ФИО и цель */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                src={client.avatar} // Используем поле avatar
                                alt={client.name}
                                sx={{ width: 80, height: 80, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="h6">{client.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Цель: {client.goal} {/* Используем поле goal */}
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