import React, { useState } from 'react';
import { Container, Grid, Tab, Tabs, Box, TextField, Typography, InputAdornment } from '@mui/material';
import { AccountCircle, Settings, Email, Face, Height, MonitorWeight, Phone, Accessibility, Straighten } from '@mui/icons-material';
import { IMaskInput } from 'react-imask';
import SettingsClients from '../components/SettingsClients';

const ClientProfile = () => {
  const [value, setValue] = useState(0);
  const [userData, setUserData] = useState({
    name: 'Иван Иванов',
    phone: '+7 (123) 456-78-90',
    email: 'ivan@example.com',
    gender: 'Мужской',
    height: '180 см',
    weight: '75 кг',
    chest: '100 см',
    waist: '80 см',
    belly: '85 см',
    hips: '95 см',
    thighs: '55 см'
  });

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

  return (
    <Container>
      <Box sx={{ borderBottom: 1, padding: 5, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Мои данные" icon={<AccountCircle />} />
          <Tab label="Настройки" icon={<Settings />} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Typography variant="h6" gutterBottom>Мои данные</Typography>
        <Grid container spacing={2}>
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
            />
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
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography variant="h6" gutterBottom>Настройки</Typography>
        <SettingsClients />
      </TabPanel>
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
