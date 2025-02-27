import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAllNews, createNews } from '../services/newsService'; // Добавьте функцию addNews
import { accessToPublishTrainerNews } from '../services/trainerService';
import { grey } from '@mui/material/colors';

function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [currentTab, setCurrentTab] = useState('today');
  const [openDialog, setOpenDialog] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState(''); // Название новости
  const [newNewsText, setNewNewsText] = useState(''); // Текст новости
  const [newNewsImage, setNewNewsImage] = useState(null); // Изображение новости
  const [hasAccessToPublish, setHasAccessToPublish] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allNews = await getAllNews();
        setNewsData(allNews);
        const trainerId = localStorage.getItem('id_trainer');
        if (trainerId) {
          const access = await accessToPublishTrainerNews(trainerId);
          setHasAccessToPublish(access);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewNewsTitle('');
    setNewNewsText('');
    setNewNewsImage(null); // Сбрасываем изображение при закрытии диалога
  };

  const handleAddNews = async () => {
    if (newNewsTitle.trim() && newNewsText.trim()) {
      const userId = localStorage.getItem('id_user'); // Получаем ID пользователя из localStorage

      try {
        const response = await createNews(newNewsTitle, newNewsText, userId, newNewsImage); // Предполагается, что функция addNews принимает FormData и userId
        setNewsData([response, ...newsData]);
        handleCloseDialog();
      } catch (error) {
        console.error('Ошибка при добавлении новости:', error);
        alert('Не удалось добавить новость.');
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewNewsImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNewsImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredNews = newsData
  .filter((news) => {
    const date = new Date(news.creationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (currentTab === 'today') {
      return date.toDateString() === today.toDateString();
    } else if (currentTab === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    } else if (currentTab === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return date >= startOfMonth && date <= endOfMonth;
    }
    return false;
  })
  .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

  const handleChangeTab = (event, newValue) => setCurrentTab(newValue);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Титульник */}
      <Box sx={{ p: 2, position: 'sticky', top: 50, zIndex: 10, mb:'20px'}}>
        <Typography variant="h4" align="center">
          Новости
        </Typography>
      </Box>
      {/* Меню новостей и кнопка добавить */}
      <Box sx={{ p: 2, backgroundColor: '#fff', position: 'sticky', zIndex: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          <Tab value="today" label="Сегодня" />
          <Tab value="week" label="Неделя" />
          <Tab value="month" label="Месяц" />
        </Tabs>

        {localStorage.getItem('id_trainer') && (
          <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={!hasAccessToPublish}
        >
          Добавить новость
        </Button>
        )}
        
      </Box>
      {/* Блок новостей */}
      <Box sx={{ flexGrow: 1, p: 2, width: 1000 }}>
        <Paper sx={{ p: 2, border: 'none' }}>
          <List>
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <ListItem key={news.id} sx={{ border: '1px solid rgb(25 118 210)', p: 2, borderRadius: '20px', margin: '5px' }}>
                  {news.image && <Avatar src={news.image} sx={{ mr: 2 }} />}
                  <ListItemText primary={news.name} secondary={news.text} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" align="center" color="text.secondary">
                Новостей нет.
              </Typography>
            )}
          </List>
        </Paper>
      </Box>
      {/* Диалог для добавления новости */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить новость</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название новости"
            type="text"
            fullWidth
            value={newNewsTitle}
            onChange={(e) => setNewNewsTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Текст новости"
            type="text"
            fullWidth
            value={newNewsText}
            onChange={(e) => setNewNewsText(e.target.value)}
          />
          <input type="file" onChange={handleImageUpload} />
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