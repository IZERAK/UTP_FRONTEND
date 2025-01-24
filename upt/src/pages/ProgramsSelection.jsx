import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Button, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function ProgramSelection() {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const navigate = useNavigate(); // Используем хук useNavigate

    const programs = [
        { id: 1, name: 'Коррекция и снижение веса' },
        { id: 2, name: 'Набор мышечной массы' },
        { id: 3, name: 'Подготовка к соревнованиям' },
        { id: 4, name: 'Восстановление опорно-двигательного аппарата' }
    ];

    const directions = [
        { id: 1, name: 'Групповые тренировки' },
        { id: 2, name: 'Растяжка' },
        { id: 3, name: 'Танцевальные тренировки' },
        { id: 4, name: 'ABS' }
    ];

    const handleProgramSelect = (program) => {
        setSelectedProgram(program);
        setSelectedDirection(null);
    };

    const handleDirectionSelect = (direction) => {
        setSelectedDirection(direction);
    };

    const handleContinue = () => {
        if (selectedProgram && selectedDirection) {
            navigate('/trainer_main/programs/info'); // Используем navigate для перехода
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Выберите свой вариант программы
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {programs.map((program) => (
                        <Grid item key={program.id}>
                            <Card
                                sx={{
                                    minWidth: 200,
                                    backgroundColor: selectedProgram?.id === program.id ? '#e0e0e0' : '#fff',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleProgramSelect(program)}
                            >
                                <CardContent>
                                    <Typography variant="h6">{program.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {selectedProgram && (
                    <Box sx={{ marginTop: 6 }}>
                        <Typography variant="h4" gutterBottom>
                            Выберите направление
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {directions.map((direction) => (
                                <Grid item key={direction.id}>
                                    <Card
                                        sx={{
                                            minWidth: 200,
                                            backgroundColor: selectedDirection?.id === direction.id ? '#e0e0e0' : '#fff',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleDirectionSelect(direction)}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">{direction.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {selectedProgram && selectedDirection && (
                    <Box sx={{ marginTop: 6, textAlign: 'center' }}>
                        <Button variant="contained" size="large" onClick={handleContinue}>
                            Продолжить
                        </Button>
                    </Box>
                )}

                {/* Кнопка для возврата на главную страницу программ */}
                <Button
                    variant="contained"
                    component={Link}
                    to="/trainer_main/programs" // Убедитесь, что путь правильный
                    sx={{ mt: 4 }}
                >
                    Назад к программам
                </Button>
            </Box>
        </Container>
    );
}

export default ProgramSelection;