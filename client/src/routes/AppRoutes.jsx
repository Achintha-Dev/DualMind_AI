import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SettingsPage from '../pages/SettingsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default AppRoutes;