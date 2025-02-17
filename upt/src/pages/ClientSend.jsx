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
    Tabs,
    Tab,
    ListItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getTrainers, getClientTrainer, getFilteredTrainers } from '../services/trainerService.js';
import { setClientsToTrainer } from '../services/trainerService.js';
import { chatGetHistory, chatAddMsg } from '../services/chatService.js';
import { HubConnectionBuilder } from "@microsoft/signalr";

function ClientsPage() {
    const [allTrainers, setAllTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [myTrainer, setMyTrainer] = useState(null);
    const [openChats, setOpenChats] = useState({});
    const [loading, setLoading] = useState({
        all: true,
        filtered: false,
        myTrainer: true
    });
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState('');

    const joinChat = async (userName, trainerId, clientUserId, chatRoom) => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7146/chat")
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (senderUserName, messageText) => {
            const isTrainer = senderUserName === userName;
            const senderId = isTrainer ? localStorage.getItem('id_user') : clientUserId;
            
            setChatHistory(prev => ({
                ...prev,
                [trainerId]: [...(prev[trainerId] || []), {
                    senderId,
                    message: messageText,
                    time: new Date().toISOString()
                }]
            }));
        });

        try {
            await newConnection.start();
            await newConnection.invoke("JoinChat", { userName, chatRoom });
            setConnection(newConnection);
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
        const fetchData = async () => {
            try {
                const trainersData = await getTrainers();
                setAllTrainers(trainersData);
                
                const clientId = localStorage.getItem("id_client");
                if (clientId) {
                    const myTrainerData = await getClientTrainer(clientId);
                    setMyTrainer(myTrainerData);
                }
                
                setLoading({ all: false, filtered: false, myTrainer: false });
            } catch (error) {
                setError(error.message);
                setLoading({ all: false, filtered: false, myTrainer: false });
            }
        };
        
        fetchData();
        setSelectedProgram("CorrectionAndWeightLoss");
    }, []);

    const fetchFilteredTrainers = async (program) => {
        setLoading(prev => ({ ...prev, filtered: true }));
        try {
            const response = await getFilteredTrainers({
                request: { goalTrainingProgram: program }
            });
            setFilteredTrainers(response);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(prev => ({ ...prev, filtered: false }));
        }
    };

    const handleChatToggle = async (clientName, trainerId, clientUserId) => {
        if (openChats[trainerId]) {
            setOpenChats(prev => ({ ...prev, [trainerId]: false }));
            await closeChat();
            return;
        }

        try {
            const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
            setChatHistory(prev => ({ ...prev, [trainerId]: history || [] }));
            
            const roomName = `${localStorage.getItem('id_client')}_${trainerId}`;
            await joinChat(clientName, trainerId, clientUserId, roomName);
            
            setOpenChats(prev => ({ ...prev, [trainerId]: true }));
        } catch (error) {
            alert('Ошибка загрузки истории чата');
        }
    };

    const handleSendMessage = async (trainerId, trainerUserId) => {
        if (!message.trim()) return;

        try {
            const newMessage = {
                senderId: localStorage.getItem('id_user'), // Исправлено на id_trainer
                recipientId: trainerUserId,
                message: message.trim(),
            };
            
            await chatAddMsg(newMessage);
            await sendMessage(message.trim());
            setMessage('');
        } catch (error) {
            alert('Ошибка отправки сообщения');
        }
    };

    // UI Handlers
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 1) {
            fetchFilteredTrainers(selectedProgram);
        }
    };

    const handleSelectTrainer = async (trainerId) => {
        try {
            const clientId = localStorage.getItem('id_client');
            const requestData = {
                trainerId: trainerId,
                clientIds: [parseInt(clientId)]
            };
            const response = await setClientsToTrainer(requestData);
            setMyTrainer(response);
        } catch (error) {
            alert(error.message);
        }
    };

    const renderContent = () => {
        if (loading.all && tabValue === 0) return <CircularProgress sx={{ margin: 'auto' }} />;
        if (loading.filtered && tabValue === 1) return <CircularProgress sx={{ margin: 'auto' }} />;
        if (loading.myTrainer && tabValue === 2) return <CircularProgress sx={{ margin: 'auto' }} />;

        if (error) return <Typography color="error">{error}</Typography>;

        const currentData = {
            0: allTrainers,
            1: filteredTrainers,
            2: myTrainer ? [myTrainer] : []
        }[tabValue];

        return (
            <List>
                {currentData.map((trainer) => (
                    <React.Fragment key={trainer.id}>
                        <ListItem sx={{
                            border: '1px solid rgb(25 118 210)',
                            p: 2,
                            borderRadius: '20px',
                            margin: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={trainer.user?.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{trainer.user?.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Опыт: {trainer.experience} лет
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Рейтинг: <strong>{trainer.rating}</strong>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChatToggle(trainer.user.name, trainer.id, trainer.user?.id)}
                                        endIcon={openChats[trainer.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    >
                                        Чат
                                    </Button>
                                </Box>
                                {tabValue !== 2 && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleSelectTrainer(trainer.id)}
                                    >
                                        Выбрать
                                    </Button>
                                )}
                            </Box>
                        </ListItem>
                        <Collapse in={openChats[trainer.id]}>
                            <Paper elevation={3} sx={{ mt: 1, mb: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="h6">Чат с {trainer.user.name}</Typography>
                                <Box sx={{ 
                                    height: 150, 
                                    overflowY: 'auto', 
                                    border: '1px solid #ddd', 
                                    borderRadius: 1, 
                                    p: 2 
                                }}>
                                    {(chatHistory[trainer.id] || []).map((msg, index) => {
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
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(trainer.id, trainer.user.id)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleSendMessage(trainer.id, trainer.user.id)}
                                    >
                                        Отправить
                                    </Button>
                                </Box>
                            </Paper>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        );
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, position: 'sticky', top: 50, zIndex: 10, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center">
                    Тренеры
                </Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#fff', position: 'sticky', top: 120, zIndex: 9 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Все тренеры" />
                    <Tab label="Подходящие тренеры" />
                    <Tab label="Мой тренер" />
                </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                <Paper sx={{ p: 2, border: 'none' }}>
                    {renderContent()}
                </Paper>
            </Box>

            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Подтверждение</DialogTitle>
                <DialogContent>
                    <Typography>Для начала чата требуется списать один токен</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Отмена</Button>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ClientsPage;