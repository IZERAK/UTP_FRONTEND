import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Regiter';
import Auth from "./pages/Auth"

const App = () => {
  return (
    <Router>
      {/* Маршруты */}
      <Routes>
      <Route path="/" element={<Auth/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;