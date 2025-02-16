import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import InputMask from 'react-input-mask';
import RoleSlider from '../components/RoleToggle'; // Импортируем кастомный слайдер
import { getAllCities } from '../services/cityService'; // Импортируем функцию для получения городов
import { updateUser } from '../services/userService'; // Импортируем готовые методы
import {getClientByUserId} from '../services/clientService'
import {getTrainerByUserId} from '../services/trainerService'


function RoleSelectionPage() {
  const [role, setRole] = useState('client'); // Роль: 'client' или 'trainer'
  const [fullName, setFullName] = useState(''); // ФИО
  const [phoneNumber, setPhoneNumber] = useState(''); // Номер телефона
  const [city, setCity] = useState(''); // Выбранный город
  const [cities, setCities] = useState([]); // Список городов из API
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибки
  const [avatar, setAvatar] = useState(null); // Аватарка (Base64)
  const [preview, setPreview] = useState(null); // Предпросмотр аватарки
  const navigate = useNavigate(); // Хук для навигации

  // Получаем список городов из API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await getAllCities(); // Вызов функции для получения городов
        setCities(citiesData); // Устанавливаем список городов в состояние
      } catch (error) {
        setError('Не удалось загрузить список городов.');
        console.error('Ошибка при загрузке городов:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Обработчик выбора роли
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  // Конвертация файла в Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Обработчик загрузки аватарки
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Размер файла не должен превышать 2 MB.');
      return;
    }
    try {
      const base64 = await convertToBase64(file);
      setAvatar(base64);
      setPreview(URL.createObjectURL(file));
      setError(null);
    } catch (error) {
      setError('Произошла ошибка при загрузке аватарки.');
      console.error('Ошибка при конвертации файла:', error);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Валидация полей
    if (!fullName || !phoneNumber || !city || !avatar) {
      setError('Все поля обязательны для заполнения!');
      return;
    }

    // Проверка номера телефона
    const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 11; // Проверка на 11 цифр
    if (!isPhoneValid) {
      setError('Номер телефона должен содержать 11 цифр.');
      return;
    }

    try {
      setLoading(true);

      // Получаем email из localStorage
      const email = localStorage.getItem('userEmail');
      if (!email) {
        throw new Error('Email пользователя не найден в localStorage.');
      }
      // Формируем данные для обновления пользователя
      const userData = {
        id: localStorage.getItem("id_user"),
        name: fullName,
        phoneNumber,
        emailAddress: localStorage.getItem('userEmail'),
        cityId: city, // Предполагается, что city - это ID города
        avatar
      };

      // Обновляем данные пользователя
      await updateUser(userData);


      // Переход на страницу в зависимости от роли
      if (role === 'client') {
        const client = await getClientByUserId(localStorage.getItem('id_user'));
        localStorage.setItem('id_client', client.id)
        navigate('/client_info', { state: { ...userData, role } });
      } else if (role === 'trainer') {
        const trainer = await getTrainerByUserId(localStorage.getItem('id_user'));
        localStorage.setItem('id_trainer', trainer.id)
        navigate('/trainer_info_add', { state: { ...userData, role } });
      }
    } catch (error) {
      setError(error.message || 'Произошла ошибка при обновлении данных пользователя.');
      console.error('Ошибка при обновлении данных пользователя:', error);
    } finally {
      setLoading(false);
    }
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
        <Typography component="h1" variant="h5">
          Выберите роль
        </Typography>
        {/* Кастомный слайдер для выбора роли */}
        <Box sx={{ mt: 3 }}>
          <RoleSlider onChange={handleRoleChange} />
        </Box>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column', // Вертикальное расположение блоков
            ml: 0, // Выравнивание по левому краю
          }}
        >
          {/* Блок с кнопкой и аватаркой */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-start', width: 550 }}>
            {/* Кнопка загрузки аватарки */}
            <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
              <Avatar
                src={preview || '/default-avatar.png'}
                alt="Аватарка"
                sx={{ width: 100, height: 100 }}
              />
            </label>
            <Button
              variant="contained"
              component="label"
              htmlFor="avatar-upload"
              fullWidth={false}
              sx={{ height: 40 }}
            >
              Загрузить
            </Button>
            {/* Скрытый input для загрузки файла */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </Box>
        </Box>
        {/* Форма для ввода данных */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            required
            fullWidth
            label="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            margin="normal"
          />
          {/* Поле для номера телефона с маской */}
          <InputMask
            mask="+7 (999) 999-99-99" // Маска для российского номера
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                required
                fullWidth
                label="Номер телефона"
                margin="normal"
              />
            )}
          </InputMask>
          {/* Выбор города */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Город</InputLabel>
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              label="Город"
              disabled={loading || cities.length === 0}
            >
              {cities.map((cityItem) => (
                <MenuItem key={cityItem.id} value={cityItem.id}>
                  {cityItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Кнопка отправки */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Продолжить'}
          </Button>
        </Box>
        {/* Отображение ошибок */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default RoleSelectionPage;