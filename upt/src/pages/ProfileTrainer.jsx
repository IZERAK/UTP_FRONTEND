import React, { useState, useEffect } from 'react';
import { Container, Grid, Tab, Tabs, Box, TextField, Typography, InputAdornment, Avatar, Button, MenuItem } from '@mui/material';
import { AccountCircle, Settings, Email, Face, Height, MonitorWeight, Phone, Accessibility, Straighten, Star, Description } from '@mui/icons-material'; // Add Star and Description imports here
import { IMaskInput } from 'react-imask';
import { getTrainerById, updateTrainer } from '../services/trainerService';
import { getUserById, updateUser } from '../services/userService';
import SettingsClients from '../components/SettingsClients';

const TrainerProfile = () => {
  const [value, setValue] = useState(0);
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
    experience: 0,
    medicGrade: false,
    workInjuries: false,
    workSportsmens: false,
    trainingPrograms: [],
    gymId: 0,
    description: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(true); // Состояние загрузки данных
  const [error, setError] = useState(null); // Состояние ошибки
  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования

  useEffect(() => {
    // Получаем ID текущего пользователя из localStorage
    const trainerId = localStorage.getItem('id_trainer');
    const userId = localStorage.getItem('id_user');
    if (trainerId) {
        Promise.all([getUserById(userId), getTrainerById(trainerId)])
                .then(([userResponse, trainerResponse]) => {
                  const user = userResponse;
                  const trainer = trainerResponse;
                  
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
                    experience: trainer.experience,
                    medicGrade: trainer.medicGrade,
                    workInjuries: trainer.workInjuries,
                    workSportsmens: trainer.workSportsmens,
                    trainingPrograms: trainer.trainingPrograms,
                    gymId: trainer.gymId,
                    description: trainer.description,
                    rating: trainer.rating,
                    clientsIds: trainer.clients
                  });
                  setLoading(false);
                })
                .catch(error => {
                  console.error('Ошибка при загрузке данных:', error);
                  setError('Не удалось загрузить данные профиля.');
                  setLoading(false);
                });
      // Загрузка данных с API
    
    } else {
      setError('ID тренера не найден.');
      setLoading(false);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const PhoneMask = (props) => {
    return (
      <IMaskInput
        {...props}
        mask="+7 (000) 000-00-00"
        value={userData.phone}
      />
    );
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
try {

      const userFormData = {
        id: localStorage.getItem("id_user"),
        name: userData.name,
        phoneNumber: userData.phone,
        emailAddress: localStorage.getItem('userEmail'),
        cityId: userData.cityId, // Предполагается, что city - это ID города
        gender: userData.gender,
        isNotificationEnable: userData.isNotificationEnable,
        isEmailNotificationEnable: userData.isEmailNotificationEnable,
        avatar: userData.avatarUrl
      };

      if (userData.avatarUrl) {
        userFormData.avatar = userData.avatarUrl;
      }

      await updateUser(userFormData);

      const trainerFormData = {
        trainerId: localStorage.getItem("id_trainer"),
        experience: userData.experience ,
        medicGrade: userData.medicGrade ,
        workInjuries: userData.workInjuries ,
        workSportsmens: userData.workSportsmens ,
        trainingPrograms: userData.trainingPrograms,
        gymId: userData.gymId,
        description: userData.description,
        clientsIds: userData.clientsIds,
        avatar: userData.avatarUrl
      };

      await updateTrainer(trainerFormData);

      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      alert('Не удалось сохранить изменения.');
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserData({ ...userData, avatarFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, padding: 5, paddingTop: 8, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 1 }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Мои данные" icon={<AccountCircle />} />
          <Tab label="Настройки" icon={<Settings />} />
        </Tabs>
      </Box>
      <Box sx={{ marginTop: '64px' }}> {/* Отступ для фиксированной панели */}
        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>Мои данные</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Avatar src={userData.avatarUrl} sx={{ width: 100, height: 100 }} />
              {isEditing && (
                <input type="file" onChange={handleAvatarUpload} />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Имя"
                name="name"
                value={userData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Face color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Почта"
                name="email"
                value={userData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Пол"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Accessibility color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Опыт работы"
                name="experience"
                value={userData.experience}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Straighten color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Рейтинг"
                name="rating"
                value={userData.rating}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Star color="primary" /> {/* Use the Star icon here */}
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Номер телефона"
                name="phone"
                value={userData.phone}
                InputProps={{
                  inputComponent: PhoneMask,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={userData.description}
                onChange={handleChange}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description color="primary" /> {/* Use the Description icon here */}
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              {isEditing ? (
                <Button variant="contained" onClick={saveChanges}>Сохранить изменения</Button>
              ) : (
                <Button variant="contained" onClick={toggleEditMode}>Редактировать</Button>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>Настройки</Typography>
          <SettingsClients />
        </TabPanel>
      </Box>
    </Container>
  );
};

function TabPanel(props) {
  const { value, index, children } = props;
  return value === index && (
    <Box sx={{ p: 3 }}>
      {children}
    </Box>
  );
}

export default TrainerProfile;