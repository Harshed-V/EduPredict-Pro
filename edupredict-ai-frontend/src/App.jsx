import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PredictPage from './pages/PredictPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import FaqAssistant from './components/chatbot/FaqAssistant';

export default function App() {
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
    </>
  );
}
