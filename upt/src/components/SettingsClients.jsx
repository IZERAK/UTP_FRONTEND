import React, { useState } from 'react';
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

const SettingsClients = () => {
  const [notifications, setNotifications] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Обработчики для переключателей
  const handleNotificationsChange = (event) => {
    setNotifications(event.target.checked);
  };

  const handleNewsletterChange = (event) => {
    setNewsletter(event.target.checked);
  };

  // Открытие и закрытие модального окна
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteAccount = () => {
    // Здесь можно добавить логику для удаления аккаунта
    alert('Аккаунт удалён!');
    setOpenDialog(false);
  };

  return (
    <Container>
      <Box sx={{ p: 3 }}>

        {/* Переключатель "Уведомления" */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <Notifications color="primary" />
          </Grid>
        </Grid>

        {/* Переключатель "Рассылка на почту" */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <MailOutline color="primary" />
          </Grid>
        </Grid>

        {/* Кнопка для удаления аккаунта */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
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
        <DialogTitle>Удалить аккаунт</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Отменить
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsClients;
