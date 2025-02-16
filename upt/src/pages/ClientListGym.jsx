import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowForward, Map } from '@mui/icons-material';

const gyms = [
    { id: 1, name: 'Зал 1', location: 'Москва, ул. Ленина, 10' },
    { id: 2, name: 'Зал 2', location: 'Санкт-Петербург, ул. Пушкина, 5' },
    { id: 3, name: 'Зал 3', location: 'Новосибирск, ул. Гоголя, 15' },
    
    // Добавьте больше залов по необходимости
];

const ClientListGym = () => {
    const [selectedGym, setSelectedGym] = useState(null);

    const handleToggle = (gymId) => {
        setSelectedGym(gymId);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#f5f5f5' }}
        >
            <Box sx={{ width: '600px', padding: '20px', borderRadius: '10px', backgroundColor: 'white' }}>
                <Button
                    component={RouterLink}
                    to="/client-main/map"
                    startIcon={<Map />}
                    sx={{ mt: 2, mb: 2 }}
                    data-cy="back-button"
                >
                    На карту
                </Button>
                <Typography variant="h4" gutterBottom align="center" data-cy="gym-list-title">
                    Выберите зал
                </Typography>

                <List>
                    {gyms.map((gym) => (
                        <ListItem
                            key={gym.id}
                            button
                            onClick={() => handleToggle(gym.id)}
                            sx={{
                                backgroundColor: selectedGym === gym.id ? '#e0e0e0' : 'white',
                                borderRadius: '5px',
                                mb: 1,
                            }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedGym === gym.id}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={gym.name} secondary={gym.location} />
                        </ListItem>
                    ))}
                </List>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, mb: 2 }}
                    endIcon={<ArrowForward />}
                    disabled={!selectedGym}
                    data-cy="next-button"
                >
                    Далее
                </Button>
            </Box>
        </Box>
    );
};

export default ClientListGym;