import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function WeightGoalPage() {
    const [currentWeight, setCurrentWeight] = useState('');
    const [desiredWeight, setDesiredWeight] = useState('');
    const [deadline, setDeadline] = useState('3 месяца'); // Hardcoded deadlines
    const [selectedDays, setSelectedDays] = useState({
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
    });
    const [selectedTimes, setSelectedTimes] = useState({
        morning: false,
        day: false,
        evening: false,
    });

    const navigate = useNavigate();

    // Hardcoded данные
    const deadlines = ['3 месяца', '6 месяцев', '12 месяцев'];
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const timesOfDay = ['Утро', 'День', 'Вечер'];

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            currentWeight,
            desiredWeight,
            deadline,
            selectedDays,
            selectedTimes,
        });
        alert('Данные успешно сохранены!');
        navigate('/trainer_main/map');
    };

    const handleBack = () => {
        navigate(-1);
    };

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
                    Укажите ваши цели
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    {/* Текущий вес */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Текущий вес (кг)"
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        required
                    />

                    {/* Желаемый вес */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Желаемый вес (кг)"
                        type="number"
                        value={desiredWeight}
                        onChange={(e) => setDesiredWeight(e.target.value)}
                        required
                    />

                    {/* Сроки для результата */}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Сроки для результата</InputLabel>
                        <Select
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            label="Сроки для результата"
                        >
                            {deadlines.map((deadline) => (
                                <MenuItem key={deadline} value={deadline}>
                                    {deadline}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* В какие дни готовы заниматься */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        В какие дни готовы заниматься
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {daysOfWeek.map((day) => {
                            const dayKey = day.toLowerCase();
                            return (
                                <Grid item key={dayKey} xs={4}>
                                    <Button
                                        fullWidth
                                        variant={selectedDays[dayKey] ? 'contained' : 'outlined'}
                                        onClick={() => setSelectedDays({ ...selectedDays, [dayKey]: !selectedDays[dayKey] })}
                                        sx={{
                                            backgroundColor: selectedDays[dayKey] ? 'primary.main' : 'white',
                                            color: selectedDays[dayKey] ? 'white' : 'primary.main',
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: selectedDays[dayKey] ? 'primary.dark' : 'primary.light',
                                            },
                                        }}
                                    >
                                        {day}
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* В какое время удобно заниматься */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        В какое время удобно заниматься
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {timesOfDay.map((time) => {
                            const timeKey = time.toLowerCase();
                            return (
                                <Grid item key={timeKey} xs={4}>
                                    <Button
                                        fullWidth
                                        variant={selectedTimes[timeKey] ? 'contained' : 'outlined'}
                                        onClick={() => setSelectedTimes({ ...selectedTimes, [timeKey]: !selectedTimes[timeKey] })}
                                        sx={{
                                            backgroundColor: selectedTimes[timeKey] ? 'primary.main' : 'white',
                                            color: selectedTimes[timeKey] ? 'white' : 'primary.main',
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: selectedTimes[timeKey] ? 'primary.dark' : 'primary.light',
                                            },
                                        }}
                                    >
                                        {time}
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Кнопки */}
                    <Box sx={{ mt: 4, width: '100%', display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="outlined" onClick={handleBack}>
                            Назад
                        </Button>
                        <Button fullWidth variant="contained" type="submit">
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default WeightGoalPage;