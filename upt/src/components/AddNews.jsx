import React from 'react';
import { Box, Typography, Card, CardContent, Button} from '@mui/material';


const AddNew = ({ title, items, onAdd }) => {
    return (
        <Box display="flex" flexDirection="column" alignContent="center" border="1px solid #ccc" borderRadius="8px" overflow="hidden">
            <Box display="flex" justifyContent="space-between" alignItems="center" padding={1} bgcolor="primary.main" color='primary.contrastText' borderBottom="1px solid #ccc">
                <Typography variant="h5" width="100" align='center'>{title}</Typography>
                <Button variant="contained" style={{ backgroundColor: "#fff", color: "#1976d2" }} size="small" onClick={onAdd}>Добавить</Button>
            </Box>
            <Box maxHeight="300px" overflow="auto" padding={2}flexDirection="column" gap={2}>
                {items.map((item) => (
                    <Card key={item.id} style={{ marginBottom: "10px", height:"100px"}}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{item.title}</Typography>
                            <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default AddNew;