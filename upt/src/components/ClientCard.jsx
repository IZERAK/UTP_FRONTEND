import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Stack,
    Paper,
    Box,
} from '@mui/material';

const timeSlots = ['09:00-12:00', '12:00-18:00', '18:00-22:00'];
const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const ClientCard = ({ client }) => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', width:'500px', alignItems: 'center', padding: 2 }}>
            {/* Аватар клиента */}
            <Avatar
                alt={client.name}
                src={client.avatar}
                sx={{ width: 80, height: 80, mb: 2 }}
            />
            {/* Имя клиента */}
            <Typography variant="h6" gutterBottom>
                {client.name}
            </Typography>
            {/* Цель клиента */}
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Цель: {client.goal}
            </Typography>
            {/* Временные слоты (в одну строку) */}
            <Stack
                spacing={1}
                direction="row"
                justifyContent="center"
                sx={{ mb: 2, flexWrap: 'nowrap', overflowX: 'auto' }}
            >
                {timeSlots.map((slot) => (
                    <Paper
                        key={slot}
                        elevation={3}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            backgroundColor: client.availableTimeSlots.includes(slot) ? '#d1e7fd' : '#f5f5f5',
                            border: client.availableTimeSlots.includes(slot) ? '2px solid #007bff' : '1px solid #ccc',
                        }}
                    >
                        <Typography variant="body2" color={client.availableTimeSlots.includes(slot) ? 'primary' : 'textSecondary'}>
                            {slot}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
            {/* Дни недели (в одну строку) */}
            <Stack
                spacing={1}
                direction="row"
                justifyContent="center"
                sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}
            >
                {daysOfWeek.map((day) => (
                    <Paper
                        key={day}
                        elevation={3}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            backgroundColor: client.availableDays.includes(day) ? '#d1e7fd' : '#f5f5f5',
                            border: client.availableDays.includes(day) ? '2px solid #007bff' : '1px solid #ccc',
                        }}
                    >
                        <Typography variant="body2" color={client.availableDays.includes(day) ? 'primary' : 'textSecondary'}>
                            {day}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Card>
    );
};

export default ClientCard;