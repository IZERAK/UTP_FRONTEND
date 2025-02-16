// components/SearchComponent.jsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchComponent = ({ onSearchResult }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Используем API Яндекс.Карт для поиска
    window.ymaps.geocode(searchQuery).then((res) => {
      const firstResult = res.geoObjects.get(0);
      if (firstResult) {
        const coordinates = firstResult.geometry.getCoordinates();
        onSearchResult(coordinates); // Передаем координаты в родительский компонент
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск места..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ marginLeft: '8px' }}>
        Найти
      </Button>
    </Box>
  );
};

export default SearchComponent;