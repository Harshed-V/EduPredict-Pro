import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PredictPage from './pages/PredictPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import FaqAssistant from './components/chatbot/FaqAssistant';
import ProfileModal from './components/ui/ProfileModal';
import { checkBackendHealth } from './services/predictApi';

export default function App() {
  useEffect(() => {
    // Background call to trigger backend spin-up (cold start) as soon as frontend loads
    checkBackendHealth().catch((err) => {
      console.warn('Backend cold start ping completed with error (normal if sleeping or booting):', err.message);
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/model-performance" element={<ModelPerformancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FaqAssistant />
      <ProfileModal />
    </>
  );
}

