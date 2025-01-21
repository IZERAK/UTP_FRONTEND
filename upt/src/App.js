import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth'; // Импортируем компонент авторизации
import Register from './pages/Register'; // Импортируем компонент регистрации
import Role from './pages/Role'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role" element={<Role />} />
      </Routes>
    </Router>
  );
}

export default App;