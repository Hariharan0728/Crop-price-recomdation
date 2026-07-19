import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import Dashboard from './pages/Dashboard';
import CropBackground from './components/CropBackground';

function App() {
  return (
    <BrowserRouter>
      {/* Dynamic animated crop background - renders behind all pages */}
      <CropBackground />
      <div className="app-wrapper min-h-screen">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/setup" element={<ProfileSetupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
