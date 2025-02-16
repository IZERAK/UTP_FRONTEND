import React, { useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, Rating, Grid, TextField, Card, CardContent, Modal } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";


const trainer = {
  id: 1,
  name: "Иванов Иван Иванович",
  address: "Москва, ул. Ленина, 10",
  rating: 4.5,
  skills: "Персональный тренинг, йога, пилатес",
  reviews: [
    { id: 1, user: "Анна", text: "Отличный тренер!", rating: 5 },
    { id: 2, user: "Сергей", text: "Помог достичь моей цели.", rating: 4 },
  ],
};

const goals = [
  {
    selectedDuration: '3 месяца',
    selectedDays: ['Пн', 'Ср', 'Пт'],
    selectedTimes: ['9-12', '18-22'],
    injury: 'Нет',
    goal: 'Коррекция и снижение веса',
    directions: ['Групповые тренировки', 'Растяжка'],
  }
];

const ClientTrainerProfile = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ p: 6, maxWidth: 800, margin: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Avatar src={trainer.avatar} sx={{ width: 150, height: 150 }} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4">{trainer.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {trainer.address}
          </Typography>
          <Rating value={trainer.rating} precision={0.5} readOnly />
          <Box sx={{ mt: 2 }}>
            <IconButton color="primary">
              <FavoriteIcon />
            </IconButton>
            <Button variant="contained" startIcon={<ChatIcon />} sx={{ ml: 2 }}>
              Чат
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setOpenModal(true)}>
              Цели клиента
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Навыки</Typography>
        <Typography variant="body1">{trainer.skills}</Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Отзывы</Typography>
        {trainer.reviews.map((review) => (
          <Card key={review.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.user}
              </Typography>
              <Rating value={review.rating} precision={0.5} readOnly />
              <Typography variant="body2">{review.text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Чат</Typography>
        <TextField fullWidth label="Написать сообщение..." variant="outlined" sx={{ mt: 2 }} />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Отправить
        </Button>
      </Box>

      {/* Модальное окно с целями клиента */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ p: 4, bgcolor: "white", maxWidth: 600, margin: "auto", mt: 10, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Цели клиента</Typography>
          {goals.map((goal, index) => (
            <Card key={index} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">{goal.goal}</Typography>
                <Typography variant="body2">Срок: {goal.selectedDuration}</Typography>
                <Typography variant="body2">Дни: {goal.selectedDays.join(', ')}</Typography>
                <Typography variant="body2">Время: {goal.selectedTimes.join(', ')}</Typography>
                <Typography variant="body2">Травмы: {goal.injury}</Typography>
                <Typography variant="body2">Направления: {goal.directions.join(', ')}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Выбрать эту цель
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenModal(false)}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClientTrainerProfile;
