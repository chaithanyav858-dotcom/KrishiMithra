import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FlowProvider } from './context/FlowContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoadingSpinner } from './components/common/UiFeedback';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { WeatherPage } from './pages/WeatherPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
        <LoadingSpinner message="Initializing KrishiMitra agricultural system..." />
      </div>
    );
  }

  const handleOpenHistoryDetail = (recordId) => {
    setSelectedRecordId(recordId);
    setActivePage('history');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'login':
        return <LoginPage setActivePage={setActivePage} />;
      case 'register':
        return <RegisterPage setActivePage={setActivePage} />;
      case 'dashboard':
        return isAuthenticated ? (
          <DashboardPage 
            setActivePage={setActivePage} 
            onOpenHistoryDetail={handleOpenHistoryDetail} 
          />
        ) : (
          <LoginPage setActivePage={setActivePage} />
        );
      case 'recommendation':
        return <CropRecommendationPage setActivePage={setActivePage} />;
      case 'weather':
        return <WeatherPage setActivePage={setActivePage} />;
      case 'irrigation':
        return <IrrigationPage setActivePage={setActivePage} />;
      case 'history':
        return (
          <HistoryPage 
            setActivePage={setActivePage} 
            selectedRecordId={selectedRecordId}
            onClearSelectedRecordId={() => setSelectedRecordId(null)}
          />
        );
      case 'profile':
        return isAuthenticated ? (
          <ProfilePage setActivePage={setActivePage} />
        ) : (
          <LoginPage setActivePage={setActivePage} />
        );
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] text-gray-900">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActivePage()}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FlowProvider>
        <AppContent />
      </FlowProvider>
    </AuthProvider>
  );
}
