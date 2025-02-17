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
    ListItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getClients } from '../services/clientService';
import { getTrainerById } from '../services/trainerService';
import { chatGetHistory, chatAddMsg } from '../services/chatService';
import { HubConnectionBuilder } from "@microsoft/signalr";



function ClientsPage() {

    const joinChat = async (userName, chatRoom) => {
        var connection = new HubConnectionBuilder()
            .withUrl("http://localhost:7146/chat")
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (userName, message) => {
            setMessage((messages) => [...messages, { userName, message }]);
        });

        try {
            await connection.start();
            await connection.invoke("JoinChat", { userName, chatRoom });

            setConnection(connection);
            setChatRoom(chatRoom);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async (message) => {
        await connection.invoke("SendMessage", message);
    };

    const closeChat = async () => {
        await connection.stop();
        setConnection(null);
    };


    const [clients, setClients] = useState([]);
    const [openChats, setOpenChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [trainer, setTrainer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState([]);



    useEffect(() => {
        const trainerId = localStorage.getItem('id_trainer');
        if (trainerId) {
            getTrainerById(trainerId)
                .then((trainerData) => {
                    setTrainer({ ...trainerData, id: trainerId });
                })
                .catch(() => setError('Ошибка загрузки данных тренера'));
        } else {
            setError('ID тренера не найден в localStorage');
        }
    }, []);

    useEffect(() => {
        getClients()
            .then((data) => {
                const trainerId = localStorage.getItem('id_trainer');
                // Фильтруем клиентов по trainerId
                const filteredClients = data.filter((client) => client.trainerId === parseInt(trainerId, 10));
                const clientsWithIds = filteredClients.map((client) => ({
                    ...client,
                    userId: client.user.id,
                }));
                setClients(clientsWithIds);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleChatToggle = async (clientId, clientUserId) => {
        // Если чат уже открыт, закрываем его
        if (openChats[clientId]) {
            setOpenChats((prev) => ({ ...prev, [clientId]: false }));
            closeChat();
            setMessage('');
            return;
        }

        try {
            // Получаем историю чата
            const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
            if (history && history.length > 0) {
                // Сохраняем историю чата
                setChatHistory((prev) => ({ ...prev, [clientId]: history }));
                joinChat('', `${clientId}_${localStorage.getItem('id_trainer')}`)
            }
            // Открываем чат
            setOpenChats((prev) => ({ ...prev, [clientId]: true }));
        } catch (error) {
            alert('Не удалось получить историю чата.');
        }
    };

    const handleSendMessage = async (clientId, clientUserId) => {
        if (!message.trim()) return;

        try {
            // Отправляем сообщение
            const newMessage = {
                senderId: localStorage.getItem('id_user'),
                recipientId: clientUserId,
                message: message.trim(),
            };
            await chatAddMsg(newMessage);

            // Обновляем историю чата
            const updatedHistory = [...(chatHistory[clientId] || []), { ...newMessage, time: new Date().toISOString() }];
            setChatHistory((prev) => ({ ...prev, [clientId]: updatedHistory }));

            // Очищаем поле ввода
            setMessage('');
        } catch (error) {
            alert('Не удалось отправить сообщение.');
        }
    };

    if (loading) return <Typography>Загрузка клиентов...</Typography>;
    if (error) return <Typography color="error">Ошибка: {error}</Typography>;

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Заголовок */}
            <Box sx={{ p: 2, position: 'sticky', top: 50, zIndex: 10, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center">
                    Мои клиенты
                </Typography>
            </Box>

            {/* Список клиентов */}
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                <Paper sx={{ p: 2, border: 'none' }}>
                    {clients.length === 0 ? ( // Проверяем, есть ли клиенты
                        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                            Клиентов нет
                        </Typography>
                    ) : (
                        <List>
                            {clients.map((client) => (
                                <React.Fragment key={client.id}>
                                    <ListItem
                                        sx={{
                                            border: '1px solid rgb(25 118 210)',
                                            p: 2,
                                            borderRadius: '20px',
                                            margin: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={client.user.avatar} alt={client.user.name} sx={{ width: 80, height: 80, mr: 2 }} />
                                            <Box>
                                                <Typography variant="h6">{client.user.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Город: {client.user.city.name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleChatToggle(client.id, client.userId)}
                                            endIcon={openChats[client.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        >
                                            Чат
                                        </Button>
                                    </ListItem>
                                    <Collapse in={openChats[client.id]}>
                                        <Paper elevation={3} sx={{ mt: 1, mb: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Typography variant="h6">Чат с {client.user.name}</Typography>
                                            <Box sx={{ height: 150, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                                                {(chatHistory[client.id] || []).map((msg) => {
                                                    const idUser = localStorage.getItem('id_user');
                                                    const isCurrentUser = msg.senderId === parseInt(idUser, 10) || msg.senderId === idUser;

                                                    return (
                                                        <Box
                                                            key={msg.id}
                                                            sx={{
                                                                mb: 1,
                                                                display: 'flex',
                                                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    p: 1,
                                                                    borderRadius: 1,
                                                                    backgroundColor: isCurrentUser ? '#e3f2fd' : '#f5f5f5',
                                                                    maxWidth: '70%',
                                                                }}
                                                            >
                                                                <Typography variant="body1" color={isCurrentUser ? 'primary' : 'textSecondary'}>
                                                                    {msg.message}
                                                                </Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    {new Date(msg.time).toLocaleTimeString()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Введите сообщение..."
                                                    variant="outlined"
                                                    size="small"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleSendMessage(client.id, client.userId)}
                                                >
                                                    Отправить
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Collapse>
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}

export default ClientsPage; 