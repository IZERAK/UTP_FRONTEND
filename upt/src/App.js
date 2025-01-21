import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth'; // Импортируем компонент авторизации
import Register from './pages/Register'; // Импортируем компонент регистрации
import Role from './pages/Role'
import ClientInfo from "./pages/ClientInfo"
import ChoosePlan from './pages/ChoosePlan';
import Pay from './pages/Pay';
import TrainerInfo from './pages/TrainerInfo';
import MainTrainer from "./pages/MainTrainer"
import NewsPage from './pages/NewsPage';
import ProgramsPage from './pages/ProgramsPage';
import ClientsPage from './pages/ClientsPage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/Map';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role" element={<Role />} />
        <Route path="/client_info_add" element={<ClientInfo />} />
        <Route path="/choose_plan" element={<ChoosePlan />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/trainer_info_add" element={<TrainerInfo />} />
        <Route path="/trainer_main" element={<MainTrainer />}>
          <Route path="news" element={<NewsPage />} />
          <Route path="programs" element={<ProgramsPage />}>
            <Route path="map" element={<MapPage />} /> 
          </Route>
          <Route path="clients" element={<ClientsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route index element={<ProgramsPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;