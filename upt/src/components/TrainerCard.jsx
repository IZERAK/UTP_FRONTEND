import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Rating,
    Button,
    Avatar,
    IconButton,
} from '@mui/material';
import { Chat as ChatIcon, Add as AddIcon } from '@mui/icons-material';

const TrainerCard = ({ trainer }) => {
    const handleAddClick = () => {
        console.log('Добавлен тренер:', trainer.name);
        // Здесь можно добавить логику для добавления тренера в избранное или другое действие
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Равномерное распределение контента
                position: 'relative', // Для позиционирования кнопки "+"
            }}
        >
            {/* Кнопка "+" в верхнем правом углу */}
            <IconButton
                sx={{
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Полупрозрачный фон
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)', // Непрозрачный фон при наведении
                    },
                }}
                onClick={handleAddClick}
            >
                <AddIcon color="primary" />
            </IconButton>

            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                        src={trainer.avatar}
                        alt={trainer.name}
                        sx={{mr: 2 }}
                    />
                    <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {trainer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {trainer.address}
                        </Typography>
                        <Rating
                            name="trainer-rating"
                            value={trainer.rating}
                            precision={0.5}
                            readOnly
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>
            </CardContent>
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ChatIcon />}
                    sx={{ mt: 2 }}
                >
                    Написать
                </Button>
            </Box>
        </Card>
    );
};

export default TrainerCard;