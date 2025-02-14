import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TrainerInfo() {
    const [gender, setGender] = useState('');
    const [experience, setExperience] = useState(''); // Состояние для стажа
    const [hasMedicalEducation, setHasMedicalEducation] = useState(null); // null, "yes", "no"
    const [worksWithInjuries, setWorksWithInjuries] = useState(null); // null, "yes", "no"
    const [workingDays, setWorkingDays] = useState({});
    const [daysOfWeek, setDaysOfWeek] = useState([]); // Состояние для хранения дней недели из API
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Ошибки

    const prepareRequestBody = (state) => {
        const { gender, experience, hasMedicalEducation, worksWithInjuries, workingDays } = state;
    
        // Сопоставление русских названий дней с английскими
        const russianToEnglishDays = {
            'воскресенье': 'Sunday',
            'понедельник': 'Monday',
            'вторник': 'Tuesday',
            'среда': 'Wednesday',
            'четверг': 'Thursday',
            'пятница': 'Friday',
            'суббота': 'Saturday'
        };
    
        // Преобразуем выбранные дни в английские названия
        const selectedDays = Object.entries(workingDays)
            .filter(([day, selected]) => selected)
            .map(([day]) => russianToEnglishDays[day]);
    
        return {
            gender,
            experience,
            hasMedicalEducation: hasMedicalEducation === 'yes',
            worksWithInjuries: worksWithInjuries === 'yes',
            workingDays: selectedDays
        };
    };

    const navigate = useNavigate();

    const daysOfWeekTranslations = {
        Sunday: "Воскресенье",
        Monday: "Понедельник",
        Tuesday: "Вторник",
        Wednesday: "Среда",
        Thursday: "Четверг",
        Friday: "Пятница",
        Saturday: "Суббота"
    };
    // Получаем дни недели из API
   /*  useEffect(() => {
        const fetchDaysOfWeek = async () => {
            try {
                const data = await daysOfWeekService.getDaysOfWeek(); // Получаем дни недели через сервис
                const daysArray = Object.values(data); // Преобразуем объект в массив

                // Промапливаем дни недели на русский язык
                const translatedDaysArray = daysArray.map(day => daysOfWeekTranslations[day]);

                setDaysOfWeek(translatedDaysArray); // Сохраняем данные в состоянии

                // Инициализируем состояние workingDays с учетом переведенных дней
                const initialWorkingDays = translatedDaysArray.reduce((acc, day) => {
                    const dayKey = day.toLowerCase(); // Преобразуем день в нижний регистр для использования в качестве ключа
                    acc[dayKey] = false; // Инициализируем все дни как не выбранные
                    return acc;
                }, {});

                setWorkingDays(initialWorkingDays);
            } catch (error) {
                setError('Не удалось загрузить дни недели.');
                console.error('Ошибка при загрузке дней недели:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDaysOfWeek();
    }, []); */
    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const requestBody = prepareRequestBody({
            gender,
            experience,
            hasMedicalEducation,
            worksWithInjuries,
            workingDays,
        });
        
        console.log('Тело запроса:', requestBody);
        // Здесь можно добавить отправку на сервер
        
        alert('Данные успешно сохранены!');
        navigate('/trainer_main');
    };

    // Обработчик изменения дней приема клиентов
    const handleWorkingDaysChange = (day) => () => {
        setWorkingDays({ ...workingDays, [day]: !workingDays[day] });
    };

    // Обработчик выбора стажа
    const handleExperienceChange = (value) => () => {
        setExperience(value);
    };

    // Обработчик выбора для медицинского образования
    const handleMedicalEducationChange = (value) => () => {
        setHasMedicalEducation(value);
    };

    // Обработчик выбора для работы с травмами
    const handleWorksWithInjuriesChange = (value) => () => {
        setWorksWithInjuries(value);
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate(-1); // Переход на предыдущую страницу
    };

    if (loading) {
        return <Typography>Загрузка...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Дополните свой профиль
                </Typography>

                {/* Форма для ввода данных */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    {/* Пол */}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Пол</InputLabel>
                        <Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="Пол"
                        >
                            <MenuItem value="male">Мужской</MenuItem>
                            <MenuItem value="female">Женский</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Стаж */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Стаж
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {['1-3 года', '3-6 лет', 'Более 6 лет'].map((exp) => (
                            <Grid item key={exp} xs={4}>
                                <Button
                                    fullWidth
                                    variant={experience === exp ? 'contained' : 'outlined'}
                                    onClick={handleExperienceChange(exp)}
                                    sx={{
                                        backgroundColor: experience === exp ? 'primary.main' : 'white',
                                        color: experience === exp ? 'white' : 'primary.main',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: experience === exp ? 'primary.dark' : 'primary.light',
                                        },
                                    }}
                                >
                                    {exp}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Наличие медицинского образования */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Наличие медицинского образования
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {['yes', 'no'].map((option) => (
                            <Grid item key={option} xs={6}>
                                <Button
                                    fullWidth
                                    variant={hasMedicalEducation === option ? 'contained' : 'outlined'}
                                    onClick={handleMedicalEducationChange(option)}
                                    sx={{
                                        backgroundColor: hasMedicalEducation === option ? 'primary.main' : 'white',
                                        color: hasMedicalEducation === option ? 'white' : 'primary.main',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: hasMedicalEducation === option ? 'primary.dark' : 'primary.light',
                                        },
                                    }}
                                >
                                    {option === 'yes' ? 'Да' : 'Нет'}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Работа с травмами */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Работа с травмами
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {['yes', 'no'].map((option) => (
                            <Grid item key={option} xs={6}>
                                <Button
                                    fullWidth
                                    variant={worksWithInjuries === option ? 'contained' : 'outlined'}
                                    onClick={handleWorksWithInjuriesChange(option)}
                                    sx={{
                                        backgroundColor: worksWithInjuries === option ? 'primary.main' : 'white',
                                        color: worksWithInjuries === option ? 'white' : 'primary.main',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: worksWithInjuries === option ? 'primary.dark' : 'primary.light',
                                        },
                                    }}
                                >
                                    {option === 'yes' ? 'Да' : 'Нет'}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    {/* В какие дни принимаете клиентов */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        В какие дни принимаете клиентов
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {daysOfWeek.map((day) => {
                            const dayKey = day.toLowerCase(); // Преобразуем день в нижний регистр для использования в качестве ключа
                            return (
                                <Grid item key={dayKey} xs={4}>
                                    <Button
                                        fullWidth
                                        variant={workingDays[dayKey] ? 'contained' : 'outlined'}
                                        onClick={handleWorkingDaysChange(dayKey)}
                                        sx={{
                                            backgroundColor: workingDays[dayKey] ? 'primary.main' : 'white',
                                            color: workingDays[dayKey] ? 'white' : 'primary.main',
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: workingDays[dayKey] ? 'primary.dark' : 'primary.light',
                                            },
                                        }}
                                    >
                                        {day}
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Кнопка отправки формы и кнопка "Назад" */}
                    <Box sx={{ mt: 4, width: '100%', display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleBack}
                        >
                            Назад
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ backgroundColor: 'primary.main' }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default TrainerInfo;