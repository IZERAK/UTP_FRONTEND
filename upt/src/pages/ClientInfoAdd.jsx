import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ClientInfoAddPage() {
    const [height, setHeight] = useState(''); // Рост
    const [weight, setWeight] = useState(''); // Вес
    const [chest, setChest] = useState(''); // Объём груди
    const [waist, setWaist] = useState(''); // Объём талии
    const [abdomen, setAbdomen] = useState(''); // Объём живота
    const [hips, setHips] = useState(''); // Объём ягодиц
    const [thighs, setThighs] = useState(''); // Объём бёдер

    const navigate = useNavigate();

    // Обработчик отправки формы
    const handleSubmit = (event) => {
        event.preventDefault();
        // Здесь можно добавить логику для обработки данных формы
        console.log({
            height,
            weight,
            chest,
            waist,
            abdomen,
            hips,
            thighs,
        });
        alert('Данные успешно сохранены!');
        navigate('/client_main'); // Переход на главную страницу после сохранения
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate(-1); // Переход на предыдущую страницу
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
                    Дополните свой профиль
                </Typography>

                {/* Форма для ввода данных */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    {/* Рост */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Рост (см)"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />

                    {/* Вес */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Вес (кг)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />

                    {/* Объём груди */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Объём груди (см)"
                        type="number"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                        required
                    />

                    {/* Объём талии */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Объём талии (см)"
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        required
                    />

                    {/* Объём живота */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Объём живота (см)"
                        type="number"
                        value={abdomen}
                        onChange={(e) => setAbdomen(e.target.value)}
                        required
                    />

                    {/* Объём ягодиц */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Объём ягодиц (см)"
                        type="number"
                        value={hips}
                        onChange={(e) => setHips(e.target.value)}
                        required
                    />

                    {/* Объём бёдер */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Объём бёдер (см)"
                        type="number"
                        value={thighs}
                        onChange={(e) => setThighs(e.target.value)}
                        required
                    />

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

export default ClientInfoAddPage;