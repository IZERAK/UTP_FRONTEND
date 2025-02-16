import React, { useEffect, useState, useRef } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllWithTrainers } from '../services/gymService';
import { setClientsToTrainer } from '../services/trainerService';
import { useNavigate } from 'react-router-dom';

function ClientMap() {
    const [gyms, setGyms] = useState([]);
    const [filteredGyms, setFilteredGyms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGym, setSelectedGym] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const data = await getAllWithTrainers();
                setGyms(data);
                setFilteredGyms(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchGyms();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        const query = event.target.value.toLowerCase();
        const filtered = gyms.filter(gym =>
            gym.name.toLowerCase().includes(query) ||
            gym.city.name.toLowerCase().includes(query)
        );
        setFilteredGyms(filtered);
    };

    const parseLocation = (locationString) => {
        const [lat, lon] = locationString.split(',').map(Number);
        return [lat, lon];
    };

    const handlePlacemarkClick = (gym) => {
        setSelectedGym(gym);
        setSelectedTrainer(null);
        if (mapRef.current) {
            mapRef.current.setCenter(parseLocation(gym.location), 14, {
                duration: 300,
            });
        }
    };

    const handleTrainerSelect = (trainer) => {
        setSelectedTrainer(trainer);
    };

    const handleContinue = async () => {
        if (selectedGym && selectedTrainer) {
            setIsSubmitting(true);
            try {
                const clientId = localStorage.getItem('id_client');
                const requestData = {
                  trainerId: selectedTrainer.id,
                  clientIds: [parseInt(clientId)]
                };
                await setClientsToTrainer(requestData);
                navigate(`/client_main/trainers`);
            } catch (error) {
                console.error('Ошибка при сохранении выбора:', error);
                alert('Произошла ошибка при выборе тренера');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const defaultState = {
        center: filteredGyms.length > 0 ? parseLocation(gyms[0].location) : [55.751574, 37.573856],
        zoom: 10,
    };

    return (
        <Box sx={{ p: 3 }}>
            <TextField
                fullWidth
                label="Поиск"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {loading ? (
                <Typography variant="body1" align="center">Загрузка...</Typography>
            ) : error ? (
                <Typography variant="body1" align="center" color="error">{error}</Typography>
            ) : (
                <>
                    <YMaps>
                        <Map
                            instanceRef={ref => mapRef.current = ref}
                            state={defaultState}
                            width="1000px"
                            height="400px"
                        >
                            {filteredGyms.map((gym) => (
                                <Placemark
                                    key={gym.id}
                                    geometry={parseLocation(gym.location)}
                                    onClick={() => handlePlacemarkClick(gym)}
                                    options={{ preset: 'islands#blueSportIcon' }}
                                />
                            ))}
                        </Map>
                    </YMaps>
                    {selectedGym && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Выбранный зал: {selectedGym.name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Тренеры в этом зале:
                            </Typography>
                            <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                                {selectedGym.trainers.map((trainer) => (
                                    <ListItem
                                        key={trainer.id}
                                        button
                                        selected={selectedTrainer?.id === trainer.id}
                                        onClick={() => handleTrainerSelect(trainer)}
                                        sx={{
                                            backgroundColor: theme => 
                                                selectedTrainer?.id === trainer.id 
                                                    ? theme.palette.action.selected 
                                                    : 'inherit',
                                            '&.Mui-selected': {
                                                backgroundColor: theme =>
                                                    theme.palette.action.selected,
                                            },
                                            '&:hover': {
                                                backgroundColor: theme =>
                                                    theme.palette.action.hover,
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={trainer.user.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={trainer.user.name}
                                            secondary={`Опыт работы: ${trainer.experience} лет`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                onClick={handleContinue}
                                disabled={!selectedTrainer || isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                {isSubmitting ? 'Отправка...' : 'Продолжить'}
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}

export default ClientMap;