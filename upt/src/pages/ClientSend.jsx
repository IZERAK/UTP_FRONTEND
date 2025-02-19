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
    CircularProgress,
    Stack,
    Rating
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getTrainers, getClientTrainer, getFilteredTrainers } from '../services/trainerService.js';
import { setClientsToTrainer } from '../services/trainerService.js';
import { chatGetHistory, chatAddMsg } from '../services/chatService.js';
import { getTrainerFeedbacks } from '../services/feedbackService.js';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAllClientGoals } from '../services/goalService';

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
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

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

    // Функция для загрузки отзывов
    const fetchReviews = async (trainerId) => {
        try {
            const response = await getTrainerFeedbacks(trainerId);
            setReviews(response);
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        }
    };

    useEffect(() => {
        const clientId = localStorage.getItem("id_client");

        const fetchData = async () => {
            try {
                const trainersData = await getTrainers();
                setAllTrainers(trainersData);
                
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
        
        fetchGoal(clientId);
        fetchData();
    }, []);

    const fetchGoal = async (clientId) => {
        try {
            const response = await getAllClientGoals(clientId);

            if(response[0]){
                setSelectedProgram(response[0].goalTrainingProgram);
            }
            
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        }
    };

    const fetchFilteredTrainers = async (program) => {
        setLoading(prev => ({ ...prev, filtered: true }));
        try {
            
            if(program == '' || program == ' ' || program == null){
                program = "CorrectionAndWeightLoss";
            }
            
            const requestData = {
                trainingProgram: program
            };
            const response = await getFilteredTrainers({
                request: requestData
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

    // Обработчик клика на аватар
    const handleAvatarClick = async (trainer) => {
        setSelectedTrainer(trainer);
        await fetchReviews(trainer.id);
        setIsProfileModalOpen(true);
    };

    const formatGoalType = (trainingPrograms) => {
        const goalMap = {
            'CorrectionAndWeightLoss': 'Коррекция и снижение веса',
            'MuscleGain': 'Набор мышечной массы',
            'CompetitionsPreparation': 'Подготовка к соревнованиям',
            'RestorationMusculoskeletalSystem': 'Восстановление опорно-двигательного аппарата'
        };

        if(trainingPrograms == null)
            return "Не назначено";

        let result = "";

        for (let program of trainingPrograms){
            result += goalMap[program] || program;
            result += ", ";
        }
        
        return result;
    };

    // Модальное окно профиля тренера
    const renderProfileModal = () => (
        <Dialog 
            open={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Профиль тренера</DialogTitle>
            <DialogContent dividers>
                {selectedTrainer && (
                    <Stack spacing={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar 
                                src={selectedTrainer.user?.avatar} 
                                sx={{ width: 120, height: 120 }}
                            />
                        </Box>
                        
                        <Typography variant="h4" align="center">
                            {selectedTrainer.user?.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Rating 
                                value={selectedTrainer.rating} 
                                precision={0.5} 
                                readOnly 
                            />
                            <Typography variant="body1">
                                Опыт работы: {selectedTrainer.experience} лет
                            </Typography>
                        </Box>

                        <Typography variant="body1">
                            <strong>О себе:</strong> {selectedTrainer.description}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Методики работы:</strong> {formatGoalType(selectedTrainer.trainingPrograms)}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Контакты:</strong> {selectedTrainer.user?.phoneNumber}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom><strong>Отзывы:</strong></Typography>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <Box key={index} marginBottom={2}>
                                    <Avatar 
                                        src={review.creator.user?.avatar} 
                                        sx={{ 
                                            width: 50, 
                                            height: 50, 
                                            mr: 2,
                                            cursor: 'pointer',
                                            '&:hover': { transform: 'scale(1.1)' },
                                            transition: 'transform 0.2s',
                                        }}
                                    />
                                    <Typography><strong>{review.creator.user.name}: </strong>{review.text}</Typography>
                                    <Rating name="read-only" value={review.rating} readOnly />
                                </Box>
                            ))
                        ) : (
                            <Typography>Отзывов пока нет.</Typography>
                        )}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsProfileModalOpen(false)}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );

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
                            <Avatar 
                                src={trainer.user?.avatar} 
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    mr: 2,
                                    cursor: 'pointer',
                                    '&:hover': { transform: 'scale(1.1)' },
                                    transition: 'transform 0.2s'
                                }}
                                onClick={() => handleAvatarClick(trainer)}
                            />
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
            {renderProfileModal()}
        </Box>
    );
}

export default ClientsPage;