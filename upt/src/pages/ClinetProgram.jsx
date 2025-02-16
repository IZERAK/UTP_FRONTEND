import React, { useState } from 'react';
import { Link as RouterLink, Link } from 'react-router-dom'; // Импортируем Link
import {
    Box,
    Typography,
    Chip,
    FormLabel,
    Grid,
    Button,
    Fab,
    Tooltip,
    Drawer,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const goals = [
    {
        selectedDuration: '3 months',
        selectedDays: ['Пн', 'Ср', 'Пт'],
        selectedTimes: ['9-12', '18-22'],
        injury: 'no',
        goal: 'Коррекция и снижение веса',
        directions: ['Групповые тренировки', 'Растяжка'],
    },
    {
        selectedDuration: '6 months',
        selectedDays: ['Вт', 'Чт', 'Сб'],
        selectedTimes: ['12-18'],
        injury: 'yes',
        goal: 'Набор мышечной массы',
        directions: ['Танцевальные тренировки', 'ABS'],
    },
];

const ClinetProgram = () => {
    const [goalsState, setGoalsState] = useState(goals);
    const [selectedGoal, setSelectedGoal] = useState('');
    const [selectedDirections, setSelectedDirections] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [injury, setInjury] = useState('');
    const [currentWeight, setCurrentWeight] = useState('');
    const [desiredWeight, setDesiredWeight] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);



    const handleAddGoal = () => {
        setDrawerOpen(true);
        setActiveStep(0);
    };

    const handleRemoveGoal = (index) => {
        const newGoals = goalsState.filter((_, i) => i !== index);
        setGoalsState(newGoals);
    };

    const handleSearchGoal = (goal) => {

    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            setGoalsState([
                ...goalsState,
                {
                    selectedDuration: selectedDuration,
                    selectedDays: selectedDays,
                    selectedTimes: selectedTimes,
                    injury: injury,
                    goal: selectedGoal,
                    directions: selectedDirections,
                },
            ]);
            setSelectedGoal('');
            setSelectedDirections([]);
            setSelectedDuration('');
            setSelectedDays([]);
            setSelectedTimes([]);
            setInjury('');
            setDrawerOpen(false);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleGoalChange = (goal) => {
        setSelectedGoal(goal);
    };

    const handleDirectionChange = (direction) => {
        if (selectedDirections.includes(direction)) {
            setSelectedDirections(selectedDirections.filter((d) => d !== direction));
        } else {
            setSelectedDirections([...selectedDirections, direction]);
        }
    };

    const handleDurationChange = (duration) => {
        setSelectedDuration(duration);
    };

    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleTimeChange = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleInjuryChange = (value) => {
        setInjury(value);
    };

    const steps = [
        {
            label: 'Выберите цель',
            content: (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Текущий выбор: {selectedGoal || 'не выбрано'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Chip
                            label="Коррекция и снижение веса"
                            clickable
                            color={selectedGoal === 'Коррекция и снижение веса' ? 'primary' : 'default'}
                            onClick={() => handleGoalChange('Коррекция и снижение веса')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Chip
                            label="Набор мышечной массы"
                            clickable
                            color={selectedGoal === 'Набор мышечной массы' ? 'primary' : 'default'}
                            onClick={() => handleGoalChange('Набор мышечной массы')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Chip
                            label="Подготовка к соревнованиям"
                            clickable
                            color={selectedGoal === 'Подготовка к соревнованиям' ? 'primary' : 'default'}
                            onClick={() => handleGoalChange('Подготовка к соревнованиям')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Chip
                            label="Восстановление опорно-двигательного аппарата"
                            clickable
                            color={selectedGoal === 'Восстановление опорно-двигательного аппарата' ? 'primary' : 'default'}
                            onClick={() => handleGoalChange('Восстановление опорно-двигательного аппарата')}
                        />
                    </Grid>
                </Grid>
            ),
        },
        {
            label: 'Выберите направления',
            content: (
                <div>
                    <Typography variant="subtitle1" gutterBottom>
                        Выбранная цель: {selectedGoal}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Chip
                                label="Групповые тренировки"
                                clickable
                                color={selectedDirections.includes('Групповые тренировки') ? 'primary' : 'default'}
                                onClick={() => handleDirectionChange('Групповые тренировки')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip
                                label="Растяжка"
                                clickable
                                color={selectedDirections.includes('Растяжка') ? 'primary' : 'default'}
                                onClick={() => handleDirectionChange('Растяжка')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip
                                label="Танцевальные тренировки"
                                clickable
                                color={selectedDirections.includes('Танцевальные тренировки') ? 'primary' : 'default'}
                                onClick={() => handleDirectionChange('Танцевальные тренировки')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chip
                                label="ABS"
                                clickable
                                color={selectedDirections.includes('ABS') ? 'primary' : 'default'}
                                onClick={() => handleDirectionChange('ABS')}
                            />
                        </Grid>
                    </Grid>
                </div>
            ),
        },
        {
            label: 'Дополнительные параметры',
            content: (
                <div>
                    <Typography variant="subtitle1" gutterBottom>
                        Выбранная цель: {selectedGoal}
                    </Typography>

                    <FormLabel component="legend">Сроки для результата</FormLabel>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                            <Chip
                                label="3 месяца"
                                clickable
                                color={selectedDuration === '3 months' ? 'primary' : 'default'}
                                onClick={() => handleDurationChange('3 months')}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Chip
                                label="6 месяцев"
                                clickable
                                color={selectedDuration === '6 months' ? 'primary' : 'default'}
                                onClick={() => handleDurationChange('6 months')}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Chip
                                label="12 месяцев"
                                clickable
                                color={selectedDuration === '12 months' ? 'primary' : 'default'}
                                onClick={() => handleDurationChange('12 months')}
                            />
                        </Grid>
                    </Grid>

                    <FormLabel component="legend">Дни недели</FormLabel>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
                            <Grid item xs={4} key={i}>
                                <Chip
                                    label={day}
                                    clickable
                                    color={selectedDays.includes(day) ? 'primary' : 'default'}
                                    onClick={() => handleDayChange(day)}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <FormLabel component="legend">Время занятий</FormLabel>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                            <Chip
                                label="9-12"
                                clickable
                                color={selectedTimes.includes('9-12') ? 'primary' : 'default'}
                                onClick={() => handleTimeChange('9-12')}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Chip
                                label="12-18"
                                clickable
                                color={selectedTimes.includes('12-18') ? 'primary' : 'default'}
                                onClick={() => handleTimeChange('12-18')}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Chip
                                label="18-22"
                                clickable
                                color={selectedTimes.includes('18-22') ? 'primary' : 'default'}
                                onClick={() => handleTimeChange('18-22')}
                            />
                        </Grid>
                    </Grid>

                    <FormLabel component="legend">Травмы</FormLabel>
                    <Grid container>
                        <Grid >
                            <Chip
                                label="Да"
                                clickable
                                color={injury === 'yes' ? 'primary' : 'default'}
                                onClick={() => handleInjuryChange('yes')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Chip
                                label="Нет"
                                clickable
                                color={injury === 'no' ? 'primary' : 'default'}
                                onClick={() => handleInjuryChange('no')}
                            />
                        </Grid>
                    </Grid>
                </div>
            ),
        },
        {
            label: 'Дополнительные параметры',
            content: (
                <Box>
                    {/* Существующее содержимое третьего шага */}
                    <Typography variant="subtitle1">Вес:</Typography>
                    <TextField
                        label="Текущий вес"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Желаемый вес"
                        value={desiredWeight}
                        onChange={(e) => setDesiredWeight(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Box>
            ),
        },
    ];

    return (
        <Box height="100%" alignItems="center" display="flex" justifyContent="center">
            <Stack spacing={2} sx={{ width: '40%', maxWidth: '100%' }}>
                <Typography variant="h4" gutterBottom align="center" data-cy="workouts-title">
                    Цели тренировок
                </Typography>

                {/* Список целей */}
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {goalsState.map((goal, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                mb: 2,
                                boxShadow: 1,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <ListItemText
                                primary={goal.goal}
                                secondary={
                                    <span>
                                        Срок: {goal.selectedDuration}, Дни: {goal.selectedDays.join(', ')},
                                        Время: {goal.selectedTimes.join(', ')}, Травмы: {goal.injury === 'yes' ? 'Да' : 'Нет'},
                                        Направления: {goal.directions.join(', ')}
                                    </span>
                                }
                            />
                            <ListItemSecondaryAction>
                                <Link to="/client-main/map" style={{ textDecoration: 'none' }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="search"
                                        color='primary'
                                        onClick={() => handleSearchGoal(goal)}
                                        sx={{ mr: 1 }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </Link>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color='error'
                                    onClick={() => handleRemoveGoal(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                {/* Кнопка добавления если нет целей */}
                {goalsState.length === 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAddGoal}
                    >
                        Добавить первую цель
                    </Button>
                )}

                {/* Навигационные кнопки */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        component={RouterLink}
                        to="/client-info"
                        startIcon={<ArrowBack />}
                        data-cy="back-button"
                    >
                        Назад
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForward />}
                        onClick={() => console.log('Данные успешно отправлены:', goalsState)}
                        data-cy="next-button"
                    >
                        Далее
                    </Button>
                </Box>
            </Stack>

            {goalsState.length > 0 && (
                <Tooltip title="Добавить цель" placement="left">
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{ position: 'fixed', bottom: 30, right: 30 }}
                        onClick={handleAddGoal}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}

            {/* Сайдбар для добавления целей */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: '20%' } }}
            >
                <Stepper activeStep={activeStep} orientation="vertical" sx={{ p: 2 }}>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                            <StepContent>
                                {step.content}
                                <Box sx={{ mb: 2, mt: 2 }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            disabled={
                                                (activeStep === 0 && !selectedGoal) ||
                                                (activeStep === 1 && selectedDirections.length === 0) ||
                                                (activeStep === 2 && (!selectedDuration || selectedDays.length === 0))
                                            }
                                        >
                                            {index === steps.length - 1 ? 'Сохранить цель' : 'Далее'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Назад
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Drawer>
        </Box>

    );
};

export default ClinetProgram;