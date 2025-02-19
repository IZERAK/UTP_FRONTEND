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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getClients } from '../services/clientService';
import { getTrainerById } from '../services/trainerService';
import { chatGetHistory, chatAddMsg } from '../services/chatService';
import { getAllClientGoals } from '../services/goalService';
import { HubConnectionBuilder } from "@microsoft/signalr";

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [openChats, setOpenChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [trainer, setTrainer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [userGoal, setUserGoal] = useState(null);

    const joinChat = async (userName, clientId, clientUserId, chatRoom) => {
        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7146/chat")
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (senderUserName, messageText) => {
            const isTrainerMessage = senderUserName === trainer?.user?.name;
            const senderId = isTrainerMessage ? clientUserId : localStorage.getItem('id_user');
            const newMsg = {
                senderId: senderId,
                message: messageText,
                time: new Date().toISOString(),
            };

            setChatHistory((prev) => ({
                ...prev,
                //[clientId]: [...(prev[clientId] || []), newMsg],
                [clientId]: [...(prev[clientId] || []), {
                    senderId,
                    message: messageText,
                    time: new Date().toISOString()
                }]
            }));
        });

        try {
            await connection.start();
            await connection.invoke("JoinChat", { userName, chatRoom });
            setConnection(connection);
            setChatRoom(chatRoom);
        } catch (error) {
            console.error('Ошибка подключения к чату:', error);
        }
    };

    const sendMessage = async (messageText) => {
        if (!connection) {
            console.error('Нет активного подключения');
            return;
        }
        try {
            await connection.invoke("SendMessage", messageText);
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    };

    const closeChat = async () => {
        if (connection) {
            await connection.stop();
            setConnection(null);
            setChatRoom('');
        }
    };

    useEffect(() => {
        const trainerId = localStorage.getItem('id_trainer');
        if (trainerId) {
            getTrainerById(trainerId)
                .then((trainerData) => {
                    setTrainer({ ...trainerData, id: trainerId });
                })
                .catch(() => setError('Ошибка загрузки данных тренера'));
        }
    }, []);

    useEffect(() => {
        getClients()
            .then((data) => {
                const trainerId = localStorage.getItem('id_trainer');
                const filteredClients = data.filter(client => 
                    client.trainerId === parseInt(trainerId, 10)
                );
                setClients(filteredClients.map(client => ({
                    ...client,
                    userId: client.user.id,
                })));
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleChatToggle = async (clientName, clientId, clientUserId) => {
        if (openChats[clientId]) {
            setOpenChats(prev => ({ ...prev, [clientId]: false }));
            await closeChat();
            return;
        }

        try {
            const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
            setChatHistory(prev => ({ ...prev, [clientId]: history || [] }));
            const roomName = `${clientId}_${localStorage.getItem('id_trainer')}`;
            await joinChat(clientName, clientId, clientUserId, roomName);
            setOpenChats(prev => ({ ...prev, [clientId]: true }));
        } catch (error) {
            alert('Не удалось загрузить историю чата');
        }
    };

    const handleSendMessage = async (clientId, clientUserId) => {
        if (!message.trim()) return;

        try {
            const newMessage = {
                senderId: localStorage.getItem('id_user'),
                recipientId: clientUserId,
                message: message.trim(),
            };
            await chatAddMsg(newMessage);
            await sendMessage(message.trim());
            setMessage('');
        } catch (error) {
            alert('Ошибка отправки сообщения');
        }
    };

    // Обработчик клика на аватар
    const handleAvatarClick = async (client) => {
        
        setSelectedClient(client);
        await fetchGoal(client.id)
        setIsProfileModalOpen(true);
    };

        const fetchGoal = async (clientId) => {
            try {
                const response = await getAllClientGoals(clientId);
    
                if(response[0]){
                    setUserGoal(response[0]);
                }
                
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
            }
        };

    const formatGoalType = (goal) => {
        const goalMap = {
            'CorrectionAndWeightLoss': 'Коррекция и снижение веса',
            'MuscleGain': 'Набор мышечной массы',
            'CompetitionsPreparation': 'Подготовка к соревнованиям',
            'RestorationMusculoskeletalSystem': 'Восстановление опорно-двигательного аппарата'
        };
        return goalMap[goal] || goal;
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const renderProfileModal = () => (
            <Dialog 
                open={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Профиль клиента</DialogTitle>
                <DialogContent dividers>
                    {selectedClient && (
                        <Stack spacing={3} sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar 
                                    src={selectedClient.user?.avatar} 
                                    sx={{ width: 120, height: 120 }}
                                />
                            </Box>
                            
                            <Typography variant="h4" align="center">
                                {selectedClient.user?.name}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Рост:</strong> {selectedClient.height}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Вес:</strong> {selectedClient.weight}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Объём груди:</strong> {selectedClient.volumeBreast}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Объём живота:</strong> {selectedClient.volumeAbdomen}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Объём талии:</strong> {selectedClient.volumeWaist}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Объём ягодиц:</strong> {selectedClient.volumeButtock}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Объём бёдер:</strong> {selectedClient.volumeHip}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Контакты:</strong> {selectedClient.user?.phoneNumber}
                            </Typography>
    
                            <Typography variant="body1">
                                <strong>Цель:</strong> {userGoal == null ? "Не назначена" : formatGoalType(userGoal.goalTrainingProgram)}
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsProfileModalOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        );

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, position: 'sticky', top: 50, zIndex: 10, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center">
                    Мои клиенты
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                <Paper sx={{ p: 2, border: 'none' }}>
                    {clients.length === 0 ? (
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
                                            <Avatar 
                                                src={client.user.avatar} 
                                                alt={client.user.name} 
                                                sx={{ width: 80, height: 80, mr: 2,
                                                cursor: 'pointer',
                                                '&:hover': { transform: 'scale(1.1)' },
                                                transition: 'transform 0.2s'
                                                 }} 
                                                onClick={() => handleAvatarClick(client)}
                                            />
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
                                            onClick={() => handleChatToggle(client.user.name, client.id, client.userId)}
                                            endIcon={openChats[client.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        >
                                            Чат
                                        </Button>
                                    </ListItem>
                                    <Collapse in={openChats[client.id]}>
                                        <Paper elevation={3} sx={{ mt: 1, mb: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Typography variant="h6">Чат с {client.user.name}</Typography>
                                            <Box sx={{ height: 150, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                                                {(chatHistory[client.id] || []).map((msg, index) => {

                                                    const currentUserId = localStorage.getItem('id_user');
                                                    const isCurrentUser = msg.senderId == currentUserId;
            
                                                    return (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                mb: 1,
                                                                display: 'flex',
                                                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                            }}
                                                        >
                                                            <Box sx={{
                                                                p: 1,
                                                                borderRadius: 1,
                                                                backgroundColor: isCurrentUser ? '#e3f2fd' : '#f5f5f5',
                                                                maxWidth: '70%',
                                                            }}>
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
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(client.id, client.user.id)}
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
                {renderProfileModal()}
            </Box>
        </Box>
    );
}

export default ClientsPage;