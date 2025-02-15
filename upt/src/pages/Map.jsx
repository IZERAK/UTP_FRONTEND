import React, { useEffect, useState, useRef } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllGyms } from '../services/gymService';
import { getTrainerById, updateTrainer } from '../services/trainerService';
import { useNavigate } from 'react-router-dom';

function MapPage() {
    const [gyms, setGyms] = useState([]);
    const [filteredGyms, setFilteredGyms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGym, setSelectedGym] = useState(null);
    const [trainer, setTrainer] = useState(null);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const data = await getAllGyms();
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

    useEffect(() => {
        const fetchTrainerData = async () => {
            const trainerId = localStorage.getItem('id_trainer');
            if (trainerId) {
                try {
                    const trainerData = await getTrainerById(trainerId);
                    setTrainer(trainerData);
                } catch (error) {
                    console.error('Ошибка при загрузке данных тренера:', error);
                }
            }
        };
        fetchTrainerData();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = gyms.filter((gym) =>
                gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                gym.city.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGyms(filtered);
        } else {
            setFilteredGyms(gyms);
        }
    }, [searchQuery, gyms]);

    const parseLocation = (location) => {
        return location.split(',').map(coord => parseFloat(coord.trim()));
    };

    const defaultState = {
        center: gyms.length > 0 ? parseLocation(gyms[0].location) : [55.751574, 37.573856],
        zoom: 10,
    };

    const handlePlacemarkClick = (gym) => {
        setSelectedGym(gym);
        if (mapRef.current) {
            mapRef.current.setCenter(parseLocation(gym.location), 14, {
                duration: 300,
            });
        }
    };

    const handleContinue = async () => {
        if (selectedGym && trainer) {
            try {
                const updatedTrainer = {
                    trainerId: trainer.id,
                    experience: trainer.experience,
                    medicGrade: trainer.medicGrade,
                    workInjuries: trainer.workInjuries,
                    workSportsmens: trainer.workSportsmens,
                    trainingPrograms: trainer.trainingPrograms,
                    clientsIds: trainer.clients,
                    description: trainer.description,

                    gymId: selectedGym.id,
                };
                await updateTrainer(updatedTrainer);
                navigate('/choose_plan');
            } catch (error) {
                console.error('Ошибка при обновлении тренера:', error);
                alert('Не удалось обновить тренера. Пожалуйста, попробуйте снова.');
            }
        }
    };

    if (loading) {
        return <Typography>Загрузка данных...</Typography>;
    }
    if (error) {
        return <Typography color="error">Ошибка: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Карта залов
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Здесь отображаются залы для тренировок.
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Поиск залов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />
            <YMaps>
                <Map
                    defaultState={defaultState}
                    width="1500px"
                    height="500px"
                    instanceRef={mapRef}
                >
                    {filteredGyms.map((gym, index) => {
                        const coordinates = parseLocation(gym.location);
                        return (
                            <Placemark
                                key={index}
                                geometry={coordinates}
                                properties={{
                                    balloonContent: `
                                        <strong>${gym.name}</strong><br>
                                        <em>Город:</em> ${gym.city.name}<br>
                                        <em>Время работы:</em> ${gym.openTime} - ${gym.closeTime}
                                    `,
                                }}
                                options={{
                                    preset: selectedGym?.id === gym.id ? 'islands#blueSportIcon' : 'islands#blueSportIcon',
                                    iconImageSize: selectedGym?.id === gym.id ? [40, 40] : [30, 30],
                                }}
                                onClick={() => handlePlacemarkClick(gym)}
                            />
                        );
                    })}
                </Map>
            </YMaps>
            {selectedGym && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Выбранный зал: {selectedGym.name}</Typography>
                    <Button variant="contained" onClick={handleContinue}>
                        Продолжить
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default MapPage;
