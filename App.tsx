
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ViewType } from './types';
import { Language, translations } from './translations';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Permission } from './roles';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import ConfiguredView from './views/ConfiguredView';
import UnconfiguredView from './views/UnconfiguredView';
import OnuProvisionForm from './components/OnuProvisionForm';
import MaintenanceView from './views/MaintenanceView';
import LoginView from './views/LoginView';
import AccessDeniedView from './views/AccessDeniedView';
import PresetManagerView from './views/PresetManagerView';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, hasPermission, user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const handleLoginSuccess = () => {
    // Auth context will automatically pick up user from localStorage on reload
    // but in a single session we usually refresh state or rely on context
    window.location.reload(); 
  };

  const renderProtectedView = (viewId: ViewType, permission: Permission, component: React.ReactNode) => {
    if (hasPermission(permission)) {
      return component;
    }
    return <AccessDeniedView language={language} onGoBack={() => setActiveView('dashboard')} />;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView language={language} />;
      case 'configured':
        return renderProtectedView(
          'configured', 
          Permission.VIEW_CONFIGURED, 
          <ConfiguredView language={language} onAddOnu={() => setActiveView('provisioning')} />
        );
      case 'unconfigured':
        return renderProtectedView(
          'unconfigured', 
          Permission.VIEW_UNCONFIGURED, 
          <UnconfiguredView language={language} />
        );
      case 'provisioning':
        return renderProtectedView(
          'provisioning',
          Permission.PROVISION_ONU,
          <div className="animate-in fade-in zoom-in duration-300">
            <OnuProvisionForm 
              language={language} 
              onCancel={() => setActiveView('configured')}
              onSuccess={() => setActiveView('configured')}
            />
          </div>
        );
      case 'presets':
        return renderProtectedView(
          'presets',
          Permission.MANAGE_OLT, // Assuming OLT management covers presets
          <PresetManagerView language={language} />
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
      onLogout={logout}
    >
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

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
