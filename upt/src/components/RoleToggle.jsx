import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

function RoleToggle({ onChange }) {
    const [role, setRole] = useState('client'); // По умолчанию выбрана роль "клиент"

    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) { // Предотвращаем сброс выбора
            setRole(newRole);
            onChange(newRole); // Передаём выбранную роль в родительский компонент
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

            <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRoleChange}
                aria-label="Выберите роль"
            >
                <ToggleButton
                    value="client"
                    aria-label="Я клиент"
                    sx={{
                        backgroundColor: role === 'client' ? '#1976d2 !important' : '#fff !important',
                        color: role === 'client' ? '#fff !important' : '#1976d2 !important', // Белый текст для выбранной кнопки
                        border: '1px solid #1976d2', // Синяя рамка
                        boxShadow: role === 'client' ? '0px 4px 10px rgba(25, 118, 210, 0.3)' : 'none', // Тень для выбранной кнопки
                        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s', // Плавный переход
                        '&:hover': {
                            backgroundColor: role === 'client' ? '#1565c0' : '#f5f5f5', // Темно-синий при наведении
                        },
                    }}
                >
                    Я клиент
                </ToggleButton>
                <ToggleButton
                    value="trainer"
                    aria-label="Я тренер"
                    sx={{
                        backgroundColor: role === 'trainer' ? '#1976d2 !important' : '#fff !important',
                        color: role === 'trainer' ? '#fff !important' : '#1976d2 !important', // Белый текст для выбранной кнопки
                        border: '1px solid #1976d2', // Синяя рамка
                        boxShadow: role === 'trainer' ? '0px 4px 10px rgba(25, 118, 210, 0.3)' : 'none', // Тень для выбранной кнопки
                        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s', // Плавный переход
                        '&:hover': {
                            backgroundColor: role === 'trainer' ? '#1565c0' : '#f5f5f5', // Темно-синий при наведении
                        },
                    }}
                >
                    Я тренер
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default RoleToggle;