import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDaysOfWeek, getGenders } from '../services/infrastructureService';
import { updateUser, getUserByEmail } from '../services/userService';
import { createTrainer } from '../services/trainerService';

function TrainerInfo() {
    const [gender, setGender] = useState('');
    const [genders, setGenders] = useState([]);
    const [experience, setExperience] = useState('');
    const [hasMedicalEducation, setHasMedicalEducation] = useState('');
    const [worksWithInjuries, setWorksWithInjuries] = useState('');
    const [worksWithAthletes, setWorksWithAthletes] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [description, setDescription] = useState('');
    const [userData, setUserData] = useState(null);
    const [trainingPrograms, setTrainingPrograms] = useState(['CorrectionAndWeightLoss']);
    const [gymId, setGymId] = useState(1);
    const navigate = useNavigate();

    const genderTranslations = {
        male: "Мужской",
        female: "Женский",
        none: "Другой"
    };

    const transformGenders = (gendersData) => {
        return Object.entries(gendersData).map(([key, value]) => ({
            id: key,
            value: key,
            label: genderTranslations[value.toLowerCase()] || value,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    throw new Error('Email пользователя не найден');
                }

                const user = await getUserByEmail(userEmail);
                setUserData(user);




                const gendersData = await getGenders();
                setGenders(transformGenders(gendersData));

                if (user.gender) {
                    setGender(user.gender);
                }
            } catch (error) {
                setError('Не удалось загрузить данные.');
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!experience || isNaN(experience) || parseFloat(experience) < 0 || parseFloat(experience) > 10) {
            alert('Пожалуйста, введите корректное значение стажа (от 0 до 10 лет).');
            return;
        }

        if (!userData) {
            alert('Данные пользователя не загружены.');
            return;
        }

        try {
            const trainerData = {
                userId: userData.id,
                experience: parseInt(experience, 10),
                medicGrade: hasMedicalEducation === 'yes',
                workInjuries: worksWithInjuries === 'yes',
                workSportsmens: worksWithAthletes === 'yes',
                trainingPrograms: trainingPrograms,
                gymId: gymId,
                description: description,
            };

            const createdTrainer = await createTrainer(trainerData);
            console.log('Тренер успешно создан:', createdTrainer);
            localStorage.setItem('id_trainer', createdTrainer);
            navigate('/programs_selection');
        } catch (error) {
            console.error('Ошибка при создании тренера:', error);
            alert('Не удалось создать тренера. Пожалуйста, попробуйте снова.');
        }
    };


    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography>{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Дополните свой профиль
            </Typography>
            <form onSubmit={handleSubmit}>
                {/* Пол */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="gender-label">Пол</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        {genders.map(({ id, value, label }) => (
                            <MenuItem key={id} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Стаж (числовое поле) */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        id="experience-input"
                        label="Стаж (лет)"
                        type="number"
                        inputProps={{ min: 0, max: 10 }}
                        value={experience}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                                setExperience(value);
                            }
                        }}
                    />
                </FormControl>
                {/* Наличие медицинского образования */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="medical-education-label">Медицинское образование</InputLabel>
                    <Select
                        labelId="medical-education-label"
                        id="medical-education-select"
                        value={hasMedicalEducation}
                        onChange={(e) => setHasMedicalEducation(e.target.value)}
                    >
                        <MenuItem value="yes">Да</MenuItem>
                        <MenuItem value="no">Нет</MenuItem>
                    </Select>
                </FormControl>
                {/* Работа с травмами */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Работа с травмами</InputLabel>
                    <Select
                        labelId="injuries-label"
                        id="injuries-select"
                        value={worksWithInjuries}
                        onChange={(e) => setWorksWithInjuries(e.target.value)}
                    >
                        <MenuItem value="yes">Да</MenuItem>
                        <MenuItem value="no">Нет</MenuItem>
                    </Select>
                </FormControl>
                {/* Работа со спортсменами */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="athletes-label">Работа со спортсменами</InputLabel>
                    <Select
                        labelId="athletes-label"
                        id="athletes-select"
                        value={worksWithAthletes}
                        onChange={(e) => setWorksWithAthletes(e.target.value)}
                    >
                        <MenuItem value="yes">Да</MenuItem>
                        <MenuItem value="no">Нет</MenuItem>
                    </Select>
                </FormControl>
                {/* Описание */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        id="description-input"
                        label="Описание"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>

                {/* Кнопки управления */}
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Сохранить
                    </Button>
                </Box>
            </form>
        </Container>
    );
}

export default TrainerInfo;