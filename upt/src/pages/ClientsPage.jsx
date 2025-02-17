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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getClients, getFilteredClients } from '../services/clientService';
import { getTrainerById, decrementDialogCount } from '../services/trainerService';
import { chatGetHistory, chatAddMsg } from '../services/chatService'; // Импортируем метод для получения истории чата

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [openChats, setOpenChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [trainer, setTrainer] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [currentClientId, setCurrentClientId] = useState(null);
    const [message, setMessage] = useState(''); // Состояние для текста сообщения
    const [chatHistory, setChatHistory] = useState({}); // Состояние для истории чата

    useEffect(() => {
        const trainerId = localStorage.getItem('id_trainer');
        if (trainerId) {
            getTrainerById(trainerId)
                .then((trainerData) => {
                    setTrainer({ ...trainerData, id: trainerId });
                    setPrograms(trainerData.trainingPrograms || []);
                })
                .catch(() => setError('Ошибка загрузки данных тренера'));
        } else {
            setError('ID тренера не найден в localStorage');
        }
    }, []);

    useEffect(() => {
        getClients()
            .then((data) => {
                const clientsWithIds = data.map((client) => ({
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

    const fetchClients = async () => {
        try {
            let allClients = [];
            for (let program of programs) {
                const filterRequest = {
                    request: {
                        goalTrainingProgram: program,
                    },
                    search: '',
                    asc: true,
                };
                const clientsForProgram = await getFilteredClients(filterRequest);
                allClients = [...allClients, ...clientsForProgram];
            }
            const uniqueClients = Array.from(new Map(allClients.map((client) => [client.id, client])).values());
            const clientsWithIds = uniqueClients.map((client) => ({
                ...client,
                userId: client.user.id,
            }));
            setFilteredClients(clientsWithIds);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleChatToggle = async (clientId, clientUserId) => {
        if (!trainer?.id) return;

        // Закрываем все открытые чаты перед открытием нового
        setOpenChats((prev) => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}));

        // Если чат уже открыт, закрываем его
        if (openChats[clientId]) {
            setOpenChats((prev) => ({ ...prev, [clientId]: false }));
            setMessage(''); // Сбрасываем текст в поле сообщения
            return;
        }

        try {
            // Получаем историю чата
            const history = await chatGetHistory(localStorage.getItem('id_user'), clientUserId);
            if (history && history.length > 0) {
                // Сохраняем историю чата
                setChatHistory((prev) => ({ ...prev, [clientId]: history }));
                setOpenChats((prev) => ({ ...prev, [clientId]: true }));
            } else {
                // Если истории нет, предлагаем списать токен
                setCurrentClientId(clientId);
                setOpenConfirmDialog(true);
            }
        } catch (error) {
            alert('Не удалось получить историю чата.');
        }
    };
    const handleConfirmDecrement = async () => {
        if (!trainer?.id) return;

        try {
            await decrementDialogCount(trainer.id); // Уменьшаем количество диалогов
            setOpenChats((prev) => ({ ...prev, [currentClientId]: true })); // Открываем чат
            setOpenConfirmDialog(false); // Закрываем модальное окно
        } catch (error) {
            alert('Не удалось списать токен для чата.');
        }
    };

    const handleCancelDecrement = () => {
        setOpenConfirmDialog(false);
    };

    const handleSendMessage = async (clientId, clientUserId) => {
        if (!message.trim() || !trainer?.id) return;

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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
            setSelectedProgram('');
            setFilteredClients(clients);
        } else if (newValue === 1) {
            fetchClients();
        }
    };

    const handleProgramChange = (event) => {
        const program = event.target.value;
        setSelectedProgram(program);
        fetchClients();
    };

    if (loading) return <Typography>Загрузка клиентов...</Typography>;
    if (error) return <Typography color="error">Ошибка: {error}</Typography>;

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Заголовок */}
            <Box sx={{ p: 2, position: 'sticky', top: 50, zIndex: 10, backgroundColor: 'white' }}>
                <Typography variant="h4" align="center">
                    Клиенты
                </Typography>
            </Box>

            {/* Вкладки и фильтр */}
            <Box sx={{ p: 2, backgroundColor: '#fff', position: 'sticky', top: 120, zIndex: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Все клиенты" />
                    <Tab label="Фильтр клиентов" />
                </Tabs>
            </Box>

            {/* Модальное окно подтверждения */}
            <Dialog open={openConfirmDialog} onClose={handleCancelDecrement}>
                <DialogTitle>Подтверждение</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Вы уверены, что хотите списать токен для начала чата?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDecrement} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDecrement} color="primary">
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Список клиентов */}
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                <Paper sx={{ p: 2, border: 'none' }}>
                    <List>
                        {(tabValue === 0 ? clients : filteredClients).map((client) => (
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
                                            {(chatHistory[client.id] || []).map((msg, index) => {
                                                const idUser = localStorage.getItem('id_user'); // Получаем id_user из localStorage
                                                const isCurrentUser = msg.senderId == parseInt(idUser, 10); // Проверяем, является ли отправитель текущим пользователем

                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb: 1,
                                                            display: 'flex',
                                                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', // Выравниваем сообщение в зависимости от отправителя
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 1,
                                                                borderRadius: 1,
                                                                backgroundColor: isCurrentUser ? '#e3f2fd' : '#f5f5f5', // Разные цвета для сообщений
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
                </Paper>
            </Box>
        </Box>
    );
}

export default ClientsPage;