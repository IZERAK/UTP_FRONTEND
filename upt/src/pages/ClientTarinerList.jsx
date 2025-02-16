import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TrainerCard from '../components/TrainerCard';
import trainer1 from '../assets/Trainer 1 man.png'
import trainer2 from '../assets/Trainer 2 woman.png'
import trainer3 from '../assets/Trainer 3 man.png'
import trainer4 from '../assets/Trainer 4 man.png'
import trainer5 from '../assets/Trainer 5 man.png'
import trainer6 from '../assets/Trainer 6 woman.png'
import trainer7 from '../assets/Trainer 7 woman.png'
import trainer8 from '../assets/Trainer 8 woman.png'
import trainer9 from '../assets/Trainer 9 man.png'
import trainer10 from '../assets/Trainer 10 woman.png'

const trainers = [
    {
        id: 1,
        name: 'Иванов Иван Иванович',
        address: 'Москва, ул. Ленина, 10',
        rating: 4.5,
        avatar: trainer1, // Импортированное изображение
    },
    {
        id: 2,
        name: 'Петрова Анна Сергеевна',
        address: 'Санкт-Петербург, ул. Пушкина, 5',
        rating: 4.7,
        avatar: trainer2, // Импортированное изображение
    },
    {
        id: 3,
        name: 'Сидоров Алексей Дмитриевич',
        address: 'Новосибирск, ул. Гоголя, 15',
        rating: 4.6,
        avatar: trainer3, // Импортированное изображение
    },
    {
        id: 4,
        name: 'Кузнецов Дмитрий Владимирович',
        address: 'Екатеринбург, ул. Малышева, 20',
        rating: 4.8,
        avatar: trainer4, // Импортированное изображение
    },
    {
        id: 5,
        name: 'Смирнов Павел Андреевич',
        address: 'Казань, ул. Баумана, 30',
        rating: 4.9,
        avatar: trainer5, // Импортированное изображение
    },
    {
        id: 6,
        name: 'Морозова Екатерина Игоревна',
        address: 'Нижний Новгород, ул. Большая Покровская, 25',
        rating: 4.7,
        avatar: trainer6, // Импортированное изображение
    },
    {
        id: 7,
        name: 'Волкова Ольга Александровна',
        address: 'Ростов-на-Дону, ул. Садовая, 40',
        rating: 4.6,
        avatar: trainer7, // Импортированное изображение
    },
    {
        id: 8,
        name: 'Лебедева Мария Викторовна',
        address: 'Уфа, ул. Ленина, 50',
        rating: 4.8,
        avatar: trainer8, // Импортированное изображение
    },
    {
        id: 9,
        name: 'Попов Сергей Николаевич',
        address: 'Красноярск, ул. Мира, 60',
        rating: 4.7,
        avatar: trainer9, // Импортированное изображение
    },
    {
        id: 10,
        name: 'Козлова Татьяна Павловна',
        address: 'Воронеж, ул. Плехановская, 70',
        rating: 4.9,
        avatar: trainer10, // Импортированное изображение
    },
];

const ClientTarinerList = () => {
    return (
            <Box sx={{ my: 4 }} padding={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    Наши тренеры
                </Typography>
                <Grid container spacing={4}>
                    {trainers.map((trainer) => (
                        <Grid item key={trainer.id} xs={12} sm={6} md={4}>
                            <TrainerCard trainer={trainer} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
    );
};

export default ClientTarinerList;