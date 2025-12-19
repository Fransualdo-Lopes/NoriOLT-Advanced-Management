
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { ViewType } from './types';
import { Language, translations } from './translations';
import { authService } from './services/authService';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import ConfiguredView from './views/ConfiguredView';
import OnuProvisionForm from './components/OnuProvisionForm';
import MaintenanceView from './views/MaintenanceView';
import LoginView from './views/LoginView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setActiveView('dashboard');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView language={language} />;
      case 'configured':
        return <ConfiguredView language={language} onAddOnu={() => setActiveView('provisioning')} />;
      case 'provisioning':
        return (
          <div className="animate-in fade-in zoom-in duration-300">
            <OnuProvisionForm 
              language={language} 
              onCancel={() => setActiveView('configured')}
              onSuccess={() => setActiveView('configured')}
            />
          </div>
        );
      default:
        return (
          <MaintenanceView 
            language={language}
            viewName={t[activeView as keyof typeof t] || activeView} 
            onGoBack={() => setActiveView('dashboard')} 
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      language={language}
      setLanguage={setLanguage}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-6">
        <button 
          className="hover:text-blue-500 transition-colors" 
          onClick={() => setActiveView('dashboard')}
        >
          System
        </button>
        <ChevronRight size={10} />
        <span className="text-gray-600">
          {activeView === 'dashboard' ? 'Overview' : t[activeView as keyof typeof t] || activeView}
        </span>
      </div>

      {renderContent()}
    </Layout>
  );
};

export default App;
