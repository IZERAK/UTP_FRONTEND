import React, { useEffect, useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';

const ClientMap = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (window.ymaps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
    script.async = true;

    script.onload = () => {
      window.ymaps.ready(initMap);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      if (map) {
        map.destroy();
      }
    };
  }, []);

  const initMap = () => {
    if (!map && mapContainerRef.current) {
      const ymap = new window.ymaps.Map(mapContainerRef.current, {
        center: [55.751574, 37.573856],
        zoom: 10,
        controls: [],
      });

      setMap(ymap);
    }
  };

  const handleSearchResult = (coordinates) => {
    if (map) {
      map.setCenter(coordinates, 15);
    }
  };

  return (
    <Box marginTop="50px" height="800px" >
      <Button
        variant="contained"
        sx={{ margin: '16px'}}
        onClick={() => navigate('/client-main/list-gym')}
      >
        Перейти к списку залов
      </Button>
      <SearchComponent onSearchResult={handleSearchResult} />
      <Box
        ref={mapContainerRef}
        sx={{
          height:'600px',
          margin: '0 auto', // Центрируем карту по горизонтали
          border: '1px solid #ccc', // Добавляем рамку для визуализации
          borderRadius: '8px', // Скругляем углы
          overflow: 'hidden', // Скрываем всё, что выходит за пределы контейнера
        }}
      ></Box>
    </Box>
  );
};

export default ClientMap;