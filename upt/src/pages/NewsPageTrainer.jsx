import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function NewsPage() {
    // Состояния для новостей
    const [todayNews, setTodayNews] = useState([
        { id: 1, text: 'Сегодня открылся новый фитнес-зал в центре города.' },
        { id: 2, text: 'Скидка 20% на все абонементы до конца недели.' },
    ]);

    const [weekNews, setWeekNews] = useState([
        { id: 1, text: 'На этой неделе стартует марафон по бегу.' },
        { id: 2, text: 'Мастер-класс по йоге с известным инструктором.' },
    ]);

    const [monthNews, setMonthNews] = useState([
        { id: 1, text: 'В этом месяце запускается новая программа тренировок.' },
        { id: 2, text: 'Конкурс на лучший результат месяца с призами.' },
    ]);

    // Состояния для управления диалогом
    const [openDialog, setOpenDialog] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [newNewsText, setNewNewsText] = useState('');

    // Функция для открытия диалога добавления новости
    const handleOpenDialog = (section) => {
        setCurrentSection(section);
        setOpenDialog(true);
    };

    // Функция для закрытия диалога
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewNewsText('');
    };

    // Функция для добавления новости
    const handleAddNews = () => {
        if (newNewsText.trim()) {
            const newNews = {
                id: Date.now(), // Уникальный ID на основе времени
                text: newNewsText,
            };

            // Добавляем новость в соответствующий раздел
            if (currentSection === 'today') {
                setTodayNews([...todayNews, newNews]);
            } else if (currentSection === 'week') {
                setWeekNews([...weekNews, newNews]);
            } else if (currentSection === 'month') {
                setMonthNews([...monthNews, newNews]);
            }

            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Новости
            </Typography>

            {/* Раздел "Новости сегодня" */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Новости сегодня
                </Typography>
                <List>
                    {todayNews.map((news) => (
                        <ListItem key={news.id}>
                            <ListItemText primary={news.text} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('today')}
                    >
                        Сообщить
                    </Button>
                </Box>
            </Paper>

            {/* Раздел "Новости недели" */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Новости недели
                </Typography>
                <List>
                    {weekNews.map((news) => (
                        <ListItem key={news.id}>
                            <ListItemText primary={news.text} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('week')}
                    >
                        Сообщить
                    </Button>
                </Box>
            </Paper>

            {/* Раздел "Новости месяца" */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Новости месяца
                </Typography>
                <List>
                    {monthNews.map((news) => (
                        <ListItem key={news.id}>
                            <ListItemText primary={news.text} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('month')}
                    >
                        Сообщить
                    </Button>
                </Box>
            </Paper>

            {/* Диалог для добавления новости */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Добавить новость</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Текст новости"
                        type="text"
                        fullWidth
                        value={newNewsText}
                        onChange={(e) => setNewNewsText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleAddNews}>Добавить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NewsPage;