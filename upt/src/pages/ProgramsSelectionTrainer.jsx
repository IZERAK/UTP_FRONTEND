import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTrainerById, updateTrainer } from '../services/trainerService';

function ProgramsSelectionTrainer() {
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [trainer, setTrainer] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const programs = [
        { id: 1, name: 'Коррекция и снижение веса', key: 'CorrectionAndWeightLoss' },
        { id: 2, name: 'Набор мышечной массы', key: 'MuscleGain' },
        { id: 3, name: 'Подготовка к соревнованиям', key: 'CompetitionsPreparation' },
        { id: 4, name: 'Восстановление опорно-двигательного аппарата', key: 'RestorationMusculoskeletalSystem' },
    ];

    useEffect(() => {
        const fetchTrainerData = async () => {
            const trainerId = localStorage.getItem('id_trainer');
            if (trainerId) {
                try {
                    const trainerData = await getTrainerById(trainerId);
                    setTrainer(trainerData);
                } catch (error) {
                    console.error('Ошибка при загрузке данных тренера:', error);
                }
            }
        };
        fetchTrainerData();
    }, []);

    const handleProgramToggle = (program) => {
        setSelectedPrograms((prev) =>
            prev.some((p) => p.id === program.id)
                ? prev.filter((p) => p.id !== program.id)
                : [...prev, program]
        );
    };

    const handleContinue = async (event) => {
        event.preventDefault();

        try {
            const trainingPrograms = selectedPrograms.map((program) => program.key);
            console.log(trainingPrograms)

            const trainerData = {
                trainerId: trainer.id,
                experience: trainer.experience,
                medicGrade: trainer.medicGrade,
                workInjuries: trainer.workInjuries,
                workSportsmens: trainer.workSportsmens,
                trainingPrograms: trainingPrograms,
                clientsIds:trainer.clients,
                gymId: trainer.gymId,
                description: trainer.description,
            };
            await updateTrainer(trainerData);
            navigate('/map');
        } catch (error) {
            console.error('Ошибка при обновлении тренера:', error);
            alert('Не удалось обновить тренера. Пожалуйста, попробуйте снова.');
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Какие услуги вы можете предоставить?
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {programs.map((program) => (
                        <Grid item key={program.id}>
                            <Card
                                sx={{
                                    minWidth: 200,
                                    backgroundColor: selectedPrograms.some((p) => p.id === program.id) ? '#e0e0e0' : '#fff',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleProgramToggle(program)}
                            >
                                <CardContent>
                                    <Typography variant="h6">{program.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {selectedPrograms.length > 0 && (
                    <Box sx={{ marginTop: 6, textAlign: 'center' }}>
                        <Button variant="contained" size="large" onClick={handleContinue}>
                            Продолжить
                        </Button>
                    </Box>
                )}
            
            </Box>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Мои программы</DialogTitle>
                <DialogContent>
                    {trainer?.trainingPrograms?.length > 0 ? (
                        <List>
                            {trainer.trainingPrograms.map((programKey, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={programs.find(p => p.key === programKey)?.name || programKey} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" align="center" color="text.secondary">
                            У вас пока нет программ.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ProgramsSelectionTrainer;
