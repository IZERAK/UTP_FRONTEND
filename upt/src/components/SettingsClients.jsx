import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Notifications, MailOutline } from '@mui/icons-material';
import { getUserById, updateUser, deleteUser } from '../services/userService';

const SettingsClients = () => {
  const navigate = useNavigate(); // Хук для навигации
  const [notifications, setNotifications] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
    const [userData, setUserData] = useState({
      id: 0,
      name: '',
      phone: '',
      email: '',
      gender: 'None',
      avatarUrl: null,
      avatarFile: null,
      cityId: 0,
      isNotificationEnable: true,
      isEmailNotificationEnable: true,
    });

useEffect(() => {
    // Получаем ID текущего пользователя из localStorage
    const userId = localStorage.getItem('id_user');
      // Загрузка данных с API
      Promise.all([getUserById(userId)])
        .then(([userResponse]) => {
          const user = userResponse;

          setNewsletter(userResponse.isNotificationEnable);
          setNotifications(userResponse.isEmailNotificationEnable);
          setUserData({
            id: user.id,
            name: user.name,
            phone: user.phoneNumber,
            email: user.emailAddress,
            gender: user.gender,
            avatarUrl: user.avatar, 
            cityId: user.city.id,
            isNotificationEnable: user.isNotificationEnable,
            isEmailNotificationEnable: user.isEmailNotificationEnable,
          });
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных:', error);
        });
  }, []);

  // Обработчики для переключателей
  const handleNotificationsChange = async (event) => {
    setNotifications(event.target.checked);
    await saveChanges(event.target.checked, newsletter);
  };

  const handleNewsletterChange = async (event) => {
    setNewsletter(event.target.checked);
    await saveChanges(notifications, event.target.checked);
  };

  const saveChanges = async (isEmailNotification, isNotification) => {
    try {
      
      const userFormData = {
        id: localStorage.getItem("id_user"),
        name: userData.name,
        phoneNumber: userData.phone,
        emailAddress: localStorage.getItem('userEmail'),
        cityId: userData.cityId, // Предполагается, что city - это ID города
        gender: userData.gender,
        isNotificationEnable: isNotification,
        isEmailNotificationEnable: isEmailNotification,
        avatar: userData.avatarUrl
      };
      

      if (userData.avatarUrl) {
        userFormData.avatar = userData.avatarUrl;
      }

      await updateUser(userFormData);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      alert('Не удалось сохранить изменения.');
    }
  };

  // Открытие и закрытие модального окна
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePlan=()=>{
    try{
        navigate('/choose_plan')
    }
    catch{

    }
}
const handleDelete = async () => { // Добавляем async
    try {
        await deleteUser(localStorage.getItem('id_user')); // Ожидаем выполнение запроса
        localStorage.clear();
        alert('Аккаунт удалён!');
        setOpenDialog(false);
        navigate('/auth'); // Правильный вызов navigate
    } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
    }
};

  return (
    <Container>
      <Box sx={{ 
        p: 3, 
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Центрирование по горизонтали
      }}>

        {/* Переключатель "Уведомления" */}
        <Grid 
          container 
          spacing={2} 
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={8} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={handleNotificationsChange}
                  color="primary"
                />
              }
              label="Уведомления"
            />
          </Grid>
          <Grid item xs={4} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Notifications color="primary" />
          </Grid>
        </Grid>

        {/* Переключатель "Рассылка на почту" */}
        <Grid 
          container 
          spacing={2} 
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={8} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={newsletter}
                  onChange={handleNewsletterChange}
                  color="primary"
                />
              }
              label="Рассылка на почту"
            />
          </Grid>
          <Grid item xs={4} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MailOutline color="primary" />
          </Grid>
        </Grid>                

      {/* Сменить тариф */}
      {localStorage.getItem('id_trainer') && (
        <Box sx={{ 
          mt: 3,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
              <Button 
                onClick={handlePlan} 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#1976d2', 
                  color: 'white',
                  width: '80%'
                }}>
                  Сменить тариф
              </Button>
          </Box>
      )}
      

        {/* Кнопка для удаления аккаунта */}
        <Box sx={{ 
          mt: 3,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color="error"
            sx={{ width: '80%' }}
            onClick={handleOpenDialog}
          >
            Удалить аккаунт
          </Button>
        </Box>
      </Box>

      {/* Модальное окно подтверждения удаления аккаунта */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Удалить аккаунт</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            variant="outlined"
            sx={{ mx: 1 }}
          >
            Отменить
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            sx={{ mx: 1 }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsClients;