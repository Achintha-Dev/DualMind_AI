import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';

import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SettingsPage from '../pages/SettingsPage';
import HistoryPage from '../pages/HistoryPage';
import NotFound from '../pages/NotFound';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Protected Route */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;