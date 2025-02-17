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
import { createClient, updateClient } from '../services/clientService.js';
import { setClientsToTrainer } from '../services/trainerService.js';
import { chatGetHistory, chatAddMsg } from '../services/chatService.js'; // Импортируем метод для получения истории чата
import { HubConnectionBuilder } from "@microsoft/signalr";



function ClientsPage() {

    const joinChat = async (userName, chatRoom) => {
        
        var connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7146/chat")
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
        debugger
        await connection.invoke("SendMessage", message.message);
    };

    const closeChat = async () => {
        await connection.stop();
        setConnection(null);
    };


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
    const [currentClientId, setCurrentClientId] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState([]);


    // Загрузка всех тренеров
    useEffect(() => {
        getTrainers()
            .then(data => {
                setAllTrainers(data);
                setLoading(prev => ({ ...prev, all: false }));
            })
            .catch(error => {
                setError(error.message);
                setLoading(prev => ({ ...prev, all: false }));
            });


        setSelectedProgram("CorrectionAndWeightLoss");
        fetchFilteredTrainers(selectedProgram);
    }, []);

    // Загрузка моего тренера
    useEffect(() => {
        getClientTrainer(localStorage.getItem("id_client"))
            .then(data => {
                setMyTrainer(data);
                setLoading(prev => ({ ...prev, myTrainer: false }));
            })
            .catch(error => {
                setError(error.message);
                setLoading(prev => ({ ...prev, myTrainer: false }));
            });
    }, []);

    // Загрузка отфильтрованных тренеров
    const fetchFilteredTrainers = async (program) => {
        setLoading(prev => ({ ...prev, filtered: true }));

        try {
            const response = await getFilteredTrainers({
                request: {
                    goalTrainingProgram: program
                }
            });

            setFilteredTrainers(response);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(prev => ({ ...prev, filtered: false }));
        }
    };

    const handleChatToggle = async (trainerId, clientUserId) => {
        // Если чат уже открыт, закрываем его
        if (openChats[trainerId]) {
            setOpenChats((prev) => ({ ...prev, [trainerId]: false }));
            closeChat();
            setMessage('');
            return;
        }

        try {
            const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
            
            if (history && history.length > 0) {
                setChatHistory((prev) => ({ ...prev, [trainerId]: history }));
                joinChat('Test123',`${localStorage.getItem('id_client')}_${trainerId}`)

            }
            // Открываем чат
            setOpenChats((prev) => ({ ...prev, [trainerId]: true }));
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
            sendMessage(newMessage)

            // Обновляем историю чата
            const updatedHistory = [...(chatHistory[clientId] || []), { ...newMessage, time: new Date().toISOString() }];
            setChatHistory((prev) => ({ ...prev, [clientId]: updatedHistory }));

            // Очищаем поле ввода
            setMessage('');
        } catch (error) {
            alert('Не удалось отправить сообщение.');
        }
    };

    const handleConfirmDecrement = async () => {
        setOpenConfirmDialog(false);
    };

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

            // Обновляем данные о моем тренере
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
                        <ListItem
                            sx={{
                                border: '1px solid rgb(25 118 210)',
                                p: 2,
                                borderRadius: '20px',
                                margin: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={trainer.user?.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{trainer.user?.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Опыт: {trainer.experience} лет
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChatToggle(trainer.id, trainer.user?.id)}
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
                                <Box sx={{ height: 150, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                                    {(chatHistory[trainer.id] || []).map((msg) => {
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
                    <Button onClick={handleConfirmDecrement} color="primary">Подтвердить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ClientsPage;