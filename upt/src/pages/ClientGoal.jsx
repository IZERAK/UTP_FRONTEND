import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { getAllClientGoals, deleteGoal, createGoal } from '../services/goalService';

const formatDuration = (duration) => {
    const durationMap = {
        'Mounth3': '3 месяца',
        'Mounth6': '6 месяцев',
        'Year1': '1 год'
    };
    return durationMap[duration] || duration;
};

const formatDays = (days) => {
    const daysMap = {
        0: 'Вс',
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб'
    };
    return days.map(day => daysMap[day]).join(', ');
};

const formatTime = (time) => {
    const timeMap = {
        'Morning': '9-12',
        'Day': '12-18',
        'Evening': '18-22'
    };
    return timeMap[time] || time;
};

const formatGoalType = (goal) => {
    const goalMap = {
        'CorrectionAndWeightLoss': 'Коррекция и снижение веса',
        'MuscleGain': 'Набор мышечной массы',
        'CompetitionsPreparation': 'Подготовка к соревнованиям',
        'RestorationMusculoskeletalSystem': 'Восстановление опорно-двигательного аппарата'
    };
    return goalMap[goal] || goal;
};

const ClientGoal = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    
    // Состояния формы
    const [goalType, setGoalType] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [trainingTime, setTrainingTime] = useState('');
    const [hasInjuries, setHasInjuries] = useState(false);
    const [currentWeight, setCurrentWeight] = useState('');
    const [desiredWeight, setDesiredWeight] = useState('');

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await getAllClientGoals(localStorage.getItem("id_client"));
                setGoals(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const handleRemoveGoal = async (goalId) => {
        try {
            await deleteGoal(goalId);
            setGoals(prev => prev.filter(g => g.id !== goalId));
        } catch (err) {
            setError('Ошибка при удалении цели');
        }
    };

    const handleCreateGoal = async () => {
        try {
            const newGoal = {
                clientId: localStorage.getItem("id_client"),
                trainingProgram: goalType,
                deadlineForResult: deadline,
                daysOfWeekForTraining: selectedDays,
                timeForTraining: trainingTime,
                hasInjuries: hasInjuries,
                currentWeight: parseFloat(currentWeight),
                desiredWeight: parseFloat(desiredWeight)
            };

            await createGoal(newGoal);
            setGoals(prev => [...prev, newGoal]);
            handleCloseModal();
        } catch (err) {
            setError('Ошибка при создании цели: ' + err.message);
        }
    };

    const handleOpenModal = () => setOpenCreateModal(true);
    const handleCloseModal = () => {
        setOpenCreateModal(false);
        setGoalType('');
        setDeadline('');
        setSelectedDays([]);
        setTrainingTime('');
        setHasInjuries(false);
        setCurrentWeight('');
        setDesiredWeight('');
    };

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box height="100%" alignItems="center" display="flex" justifyContent="center">
            {/* Модальное окно создания цели */}
            <Dialog open={openCreateModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Создать новую цель</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Тип цели</InputLabel>
                            <Select
                                value={goalType}
                                onChange={(e) => setGoalType(e.target.value)}
                                label="Тип цели"
                            >
                                <MenuItem value="CorrectionAndWeightLoss">Коррекция и снижение веса</MenuItem>
                                <MenuItem value="MuscleGain">Набор мышечной массы</MenuItem>
                                <MenuItem value="CompetitionsPreparation">Подготовка к соревнованиям</MenuItem>
                                <MenuItem value="Recovery">Восстановление ОДА</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Срок достижения</InputLabel>
                            <Select
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                label="Срок достижения"
                            >
                                <MenuItem value="Mounth3">3 месяца</MenuItem>
                                <MenuItem value="Mounth6">6 месяцев</MenuItem>
                                <MenuItem value="Year1">1 год</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Дни тренировок</InputLabel>
                            <Select
                                multiple
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(e.target.value)}
                                renderValue={(selected) => formatDays(selected)}
                            >
                                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                    <MenuItem key={day} value={day}>
                                        <Checkbox checked={selectedDays.includes(day)} />
                                        <ListItemText primary={formatDays([day])} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Время тренировок</InputLabel>
                            <Select
                                value={trainingTime}
                                onChange={(e) => setTrainingTime(e.target.value)}
                                label="Время тренировок"
                            >
                                <MenuItem value="Morning">Утро (9-12)</MenuItem>
                                <MenuItem value="Day">День (12-18)</MenuItem>
                                <MenuItem value="Evening">Вечер (18-22)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={hasInjuries} 
                                        onChange={(e) => setHasInjuries(e.target.checked)} 
                                    />
                                }
                                label="Наличие травм в анамнезе"
                            />
                        </FormGroup>

                        <TextField
                            label="Текущий вес (кг)"
                            type="number"
                            value={currentWeight}
                            onChange={(e) => setCurrentWeight(e.target.value)}
                            fullWidth
                            inputProps={{ step: "0.1" }}
                        />

                        <TextField
                            label="Желаемый вес (кг)"
                            type="number"
                            value={desiredWeight}
                            onChange={(e) => setDesiredWeight(e.target.value)}
                            fullWidth
                            inputProps={{ step: "0.1" }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Отмена</Button>
                    <Button 
                        onClick={handleCreateGoal}
                        disabled={!goalType || !deadline || selectedDays.length === 0 || !trainingTime}
                        variant="contained" 
                        color="primary"
                    >
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Основной интерфейс */}
            <Stack spacing={2} sx={{ width: '500px', maxWidth: '700px' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Мои цели
                </Typography>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {goals.map((goal) => (
                        <ListItem
                            key={goal.id}
                            sx={{
                                mb: 2,
                                boxShadow: 1,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <ListItemText
                                primary={formatGoalType(goal.goalTrainingProgram)}
                                secondary={
                                    <span>
                                        Срок: {formatDuration(goal.deadlineForResult)}, <br/>
                                        Дни: {formatDays(goal.daysOfWeekForTraining)},<br/>
                                        Время: {formatTime(goal.timeForTraining)},<br/>
                                        Травмы: {goal.hasInjuries ? 'Да' : 'Нет'},<br/>
                                        Вес: {goal.currentWeight}кг → {goal.desiredWeight}кг<br/>
                                    </span>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color='error'
                                    onClick={() => handleRemoveGoal(goal.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForward />}
                        onClick={handleOpenModal}
                    >
                        Новая цель
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default ClientGoal;