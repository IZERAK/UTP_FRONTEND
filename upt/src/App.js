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

import ClientInfo from './pages/ClientInfo';
import ClientMain from './pages/ClientsMain'
import ClientNews from './pages/ClientsNews';
import ClientProgram from './pages/ClinetProgram';
import ClientMap from './pages/ClinetMap';
import ClientListGym from './pages/ClientListGym';
import ClientTarinerList from './pages/ClientTarinerList';
import ClientsTrainerPage from './pages/ClientTrainerPage';
import ClientProfile from './pages/ClientProfile';
import ClientTarinerProfile from './pages/ClientTrainerProfile';




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

        {/*Страницы клиента*/}
        <Route path="/client_info" element={<ClientInfo />} />
        <Route path="/client_main" element={<ClientMain />}>
          <Route path="news" element={<ClientNews />} />
          <Route path='programs' element={<ClientProgram />} />
          <Route path='map' element={<ClientMap />} />
          <Route path='list-gym' element={<ClientListGym />} />
          <Route path='list-trainer' element={<ClientTarinerList />} />
          <Route path='trainer-profile' element={<ClientTarinerProfile />} />
          <Route path='trainers' element={<ClientsTrainerPage />} />
          <Route path='profile' element={<ClientProfile />} />
        </Route>

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