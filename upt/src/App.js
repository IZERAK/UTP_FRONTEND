import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Role from './pages/Role';
import ClientInfoAddPage from './pages/ClientInfoAdd'; 

import ChoosePlan from './pages/ChoosePlan';
import Pay from './pages/Pay';
import TrainerInfo from './pages/TrainerInfo'
import MainTrainer from "./pages/MainTrainer";
import NewsPage from './pages/NewsPageTrainer';
import ProgramsPage from './pages/ProgramsPage';
import ClientsPage from './pages/ClientsPage';
import MapPage from './pages/Map';
import ProfileTrainer from './pages/ProfileTrainer';
import EventsPage from './pages/Events';
import ProgramSelection from './pages/ProgramsSelection';
import ProgramInfo from './pages/ProgramInfo';
import MyClients from './pages/MyClients';
import ForgotPassword from './pages/ForgotPassword';
import ProgramsSelectionTrainer from './pages/ProgramsSelectionTrainer'


function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role" element={<Role />} />
        <Route path="/choose_plan" element={<ChoosePlan />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/trainer_info_add" element={<TrainerInfo />} />
        <Route path="/client_info_add" element={<ClientInfoAddPage />} />
        <Route path="/forgot_password" element={<ForgotPassword/>}/>
        <Route path="/programs_selection" element={<ProgramsSelectionTrainer />} />
        <Route path="/map" element={<MapPage />} />


        {/* Trainer Routes */}
        <Route path="/trainer_main" element={<MainTrainer />}>
          <Route path="news" element={<NewsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="programs/selection" element={<ProgramsSelectionTrainer />} />
          <Route path="programs/info" element={<ProgramInfo />} />
          <Route path="map" element={<MapPage />} />
          <Route path="find-clients" element={<ClientsPage />} />
          <Route path="clients" element={<MyClients />} />
          <Route path="profile" element={<ProfileTrainer />} />
          <Route index element={<ProfileTrainer />} />
        </Route>

      
      </Routes>
    </Router>
  );
}

export default App;