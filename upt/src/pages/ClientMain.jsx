import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Radio,
  RadioGroup,
  Grid,
} from '@mui/material';

const NorwayProgram = () => {
  const [tabValue, setTabValue] = useState(0);
  const [program, setProgram] = useState([]);
  const [direction, setDirection] = useState([]);
  const [weight, setWeight] = useState({ current: '', desired: '' });
  const [duration, setDuration] = useState('');
  const [days, setDays] = useState([]);
  const [time, setTime] = useState('');
  const [injuries, setInjuries] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProgramChange = (event) => {
    const value = event.target.name;
    setProgram(prev => 
      prev.includes(value) 
        ? prev.filter(p => p !== value) 
        : [...prev, value]
    );
  };

  const handleDirectionChange = (event) => {
    const value = event.target.name;
    setDirection(prev => 
      prev.includes(value) 
        ? prev.filter(d => d !== value) 
        : [...prev, value]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Первый интерфейс */}
      <Typography variant="h4" gutterBottom>Норвегия</Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Программы" />
        <Tab label="Тренера" />
        <Tab label="Пройти..." />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Выберите свой вариант программы</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {['Коррекция и снижение веса', 'Набор мышечной массы', 'Подготовка к соревнованиям', 'Восстановление опорно-двигательного аппарата']
              .map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={program.includes(option)}
                      onChange={handleProgramChange}
                      name={option}
                    />
                  }
                  label={option}
                />
              ))}
          </Box>
        </Box>
      )}

      {tabValue === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Выберите направление</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {['Групповые тренировки', 'Растяжка', 'Танцевальные тренировки', 'АВБ', 'Поиск']
              .map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={direction.includes(option)}
                      onChange={handleDirectionChange}
                      name={option}
                    />
                  }
                  label={option}
                />
              ))}
          </Box>
        </Box>
      )}

      {/* Второй интерфейс */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Набор мышечной массы</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ваш текущий вес"
              value={weight.current}
              onChange={(e) => setWeight({...weight, current: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ваш желаемый вес"
              value={weight.desired}
              onChange={(e) => setWeight({...weight, desired: e.target.value})}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography>Срок для результата</Typography>
          <ToggleButtonGroup
            exclusive
            value={duration}
            onChange={(e, val) => setDuration(val)}
          >
            {['3 мес', '6 мес', '12 мес'].map((opt) => (
              <ToggleButton key={opt} value={opt}>{opt}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography>В какие дни готовы заниматься</Typography>
          <ToggleButtonGroup
            value={days}
            onChange={(e, val) => setDays(val)}
            sx={{ mt: 1 }}
          >
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <ToggleButton key={day} value={day}>{day}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography>В какое время удобно заниматься</Typography>
          <ToggleButtonGroup
            exclusive
            value={time}
            onChange={(e, val) => setTime(val)}
            sx={{ mt: 1 }}
          >
            {['9-12', '12-18', '18-22'].map((t) => (
              <ToggleButton key={t} value={t}>{t}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography>Есть ли у вас травмы</Typography>
          <RadioGroup
            row
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
          >
            <FormControlLabel value="Да" control={<Radio />} label="Да" />
            <FormControlLabel value="Нет" control={<Radio />} label="Нет" />
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default NorwayProgram;