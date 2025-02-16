import React, { useState, useEffect } from 'react';
import { Container, Grid, Tab, Tabs, Box, TextField, Typography, InputAdornment, Avatar, Button, MenuItem } from '@mui/material';
import { AccountCircle, Settings, Email, Face, Height, MonitorWeight, Phone, Accessibility, Straighten } from '@mui/icons-material';
import { IMaskInput } from 'react-imask';
import SettingsClients from '../components/SettingsClients';
import { getUserByEmail, updateClient, getClientByUserId } from '../services/clientService';
import { getUserById, updateUser } from '../services/userService';

const ClientProfile = () => {
  const [value, setValue] = useState(0);
  const [userData, setUserData] = useState({
    id: 0,
    name: '',
    phone: '',
    email: '',
    gender: 'None',
    height: '',
    weight: '',
    chest: '',
    waist: '',
    belly: '',
    hips: '',
    thighs: '',
    avatarUrl: null,
    avatarFile: null,
    cityId: 0,
    isNotificationEnable: true,
    isEmailNotificationEnable: true,
    clientId: 0,
  });
  const [loading, setLoading] = useState(true); // Состояние загрузки данных
  const [error, setError] = useState(null); // Состояние ошибки
  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования

  useEffect(() => {
    // Получаем ID текущего пользователя из localStorage
    const userId = localStorage.getItem('id_user');
    if (userId) {
      // Загрузка данных с API
      Promise.all([getUserById(userId), getClientByUserId(userId)])
        .then(([userResponse, clientResponse]) => {
          const user = userResponse;
          const client = clientResponse;

          setUserData({
            id: user.id,
            name: user.name,
            phone: user.phoneNumber,
            email: user.emailAddress,
            gender: user.gender,
            height: `${client.height} см`,
            weight: `${client.weight} кг`,
            chest: `${client.volumeBreast} см`,
            waist: `${client.volumeWaist} см`,
            belly: `${client.volumeAbdomen} см`,
            hips: `${client.volumeButtock} см`,
            thighs: `${client.volumeHip} см`,
            avatarUrl: user.avatar || client.user.avatar, // Используем аватарку из user или client
            cityId: user.city.id,
            isNotificationEnable: user.isNotificationEnable,
            isEmailNotificationEnable: user.isEmailNotificationEnable,
            clientId: client.id,
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных:', error);
          setError('Не удалось загрузить данные профиля.');
          setLoading(false);
        });
    } else {
      setError('ID пользователя не найден.');
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

      const clientFormData = {
        clientId: userData.clientId,
        height: parseInt(userData.height.replace(' см', '')),
        weight: parseInt(userData.weight.replace(' кг', '')),
        volumeBreast: parseInt(userData.chest.replace(' см', '')),
        volumeWaist: parseInt(userData.waist.replace(' см', '')),
        volumeAbdomen: parseInt(userData.belly.replace(' см', '')),
        volumeButtock: parseInt(userData.hips.replace(' см', '')),
        volumeHip: parseInt(userData.thighs.replace(' см', ''))
      };

      await updateClient(clientFormData);

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
                label="Рост"
                name="height"
                value={userData.height}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Height color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Вес"
                name="weight"
                value={userData.weight}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonitorWeight color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Объём груди"
                name="chest"
                value={userData.chest}
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
                label="Объём талии"
                name="waist"
                value={userData.waist}
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
                label="Объём живота"
                name="belly"
                value={userData.belly}
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
                label="Объём ягодиц"
                name="hips"
                value={userData.hips}
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
                label="Объём бёдер"
                name="thighs"
                value={userData.thighs}
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

export default ClientProfile;