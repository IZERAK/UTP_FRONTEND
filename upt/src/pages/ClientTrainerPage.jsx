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
import { setClientsToTrainer } from '../services/trainerService';
import { chatGetHistory, chatAddMsg } from '../services/chatService'; // Импортируем метод для получения истории чата


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
    const [currentClientId, setCurrentClientId] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});

    // Загрузка всех тренеров
    useEffect(() => {
        getTrainers()
            .then(data => {
                setAllTrainers(data);
                setLoading(prev => ({...prev, all: false}));
            })
            .catch(error => {
                setError(error.message);
                setLoading(prev => ({...prev, all: false}));
            });

            
            setSelectedProgram("CorrectionAndWeightLoss");
            fetchFilteredTrainers(selectedProgram);
    }, []);

    // Загрузка моего тренера
    useEffect(() => {
        getClientTrainer(localStorage.getItem("id_client"))
            .then(data => {
                setMyTrainer(data);
                setLoading(prev => ({...prev, myTrainer: false}));
            })
            .catch(error => {
                setError(error.message);
                setLoading(prev => ({...prev, myTrainer: false}));
            });
    }, []);

    // Загрузка отфильтрованных тренеров
    const fetchFilteredTrainers = async (program) => {
        setLoading(prev => ({...prev, filtered: true}));
    
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
            setLoading(prev => ({...prev, filtered: false}));
        }
    };

    const handleChatToggle = async (clientId, clientUserId) => {
        // if (!trainer?.id) return;

        // // Закрываем все открытые чаты перед открытием нового
        // setOpenChats((prev) => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}));

        // // Если чат уже открыт, закрываем его
        // if (openChats[clientId]) {
        //     setOpenChats((prev) => ({ ...prev, [clientId]: false }));
        //     setMessage(''); // Сбрасываем текст в поле сообщения
        //     return;
        // }

        // try {
        //     // Получаем историю чата
        //     const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
        //     if (history && history.length > 0) {
        //         // Сохраняем историю чата
        //         setChatHistory((prev) => ({ ...prev, [clientId]: history }));
        //         setOpenChats((prev) => ({ ...prev, [clientId]: true }));
        //     } else {
        //         // Если истории нет, предлагаем списать токен
        //         setCurrentClientId(clientId);
        //         setOpenConfirmDialog(true);
        //     }
        // } catch (error) {
        //     alert('Не удалось получить историю чата.');
        // }
    };

    const handleConfirmDecrement = async () => {
        setOpenConfirmDialog(false);
    };

    const handleSendMessage = async (clientId, clientUserId) => {
        // if (!message.trim() || !trainer?.id) return;

        // try {
        //     // Отправляем сообщение
        //     const newMessage = {
        //         senderId: trainer.id,
        //         recipientId: clientUserId,
        //         message: message.trim(),
        //     };
        //     await chatAddMsg(newMessage);

        //     // Обновляем историю чата
        //     const updatedHistory = [...(chatHistory[clientId] || []), { ...newMessage, time: new Date().toISOString() }];
        //     setChatHistory((prev) => ({ ...prev, [clientId]: updatedHistory }));

        //     // Очищаем поле ввода
        //     setMessage('');
        // } catch (error) {
        //     alert('Не удалось отправить сообщение.');
        // }
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
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleChatToggle(trainer.id, trainer.user?.id)}
                                    endIcon={openChats[trainer.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                >
                                    Чат
                                </Button>
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
                        {/* Остальная часть чата */}
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