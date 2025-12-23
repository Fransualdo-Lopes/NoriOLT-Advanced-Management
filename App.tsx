
import React, { useState } from 'react';
import { ViewType, SettingsTab, UnconfiguredONU } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider, useTranslation } from './contexts/I18nContext';
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
import SettingsView from './views/SettingsView';
import OnuDetailsView from './views/OnuDetailsView';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, hasPermission } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [selectedOnuId, setSelectedOnuId] = useState<string | null>(null);
  const [provisioningOnu, setProvisioningOnu] = useState<UnconfiguredONU | null>(null);

  const navigateToSettings = (tab: SettingsTab = 'general') => {
    setSettingsTab(tab);
    setActiveView('settings');
  };

  const navigateToOnuDetails = (id: string) => {
    setSelectedOnuId(id);
    setActiveView('onu-details');
  };

  const startProvisioning = (onu: UnconfiguredONU) => {
    setProvisioningOnu(onu);
    setActiveView('provisioning');
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
        return <DashboardView language={language} onNavigate={setActiveView} />;
      case 'configured':
        return renderProtectedView(
          'configured', 
          Permission.VIEW_CONFIGURED, 
          <ConfiguredView language={language} onAddOnu={() => { setProvisioningOnu(null); setActiveView('provisioning'); }} onViewOnu={navigateToOnuDetails} />
        );
      case 'unconfigured':
        return renderProtectedView(
          'unconfigured', 
          Permission.VIEW_UNCONFIGURED, 
          <UnconfiguredView language={language} onAuthorize={startProvisioning} />
        );
      case 'provisioning':
        return renderProtectedView(
          'provisioning',
          Permission.PROVISION_ONU,
          <div className="flex flex-col items-center justify-center py-8 min-h-[calc(100vh-120px)] animate-in fade-in zoom-in duration-300">
            <div className="w-full max-w-3xl">
              <OnuProvisionForm 
                language={language} 
                onCancel={() => setActiveView('unconfigured')}
                onSuccess={() => setActiveView('configured')}
                initialData={provisioningOnu}
              />
            </div>
          </div>
        );
      case 'presets':
        return renderProtectedView(
          'presets',
          Permission.MANAGE_OLT,
          <PresetManagerView language={language} />
        );
      case 'settings':
        return renderProtectedView(
          'settings',
          Permission.VIEW_USERS,
          <SettingsView language={language} initialTab={settingsTab} />
        );
      case 'onu-details':
        return renderProtectedView(
          'onu-details',
          Permission.VIEW_CONFIGURED,
          <OnuDetailsView 
            onuId={selectedOnuId || ''} 
            language={language} 
            onBack={() => setActiveView('configured')} 
          />
        );
      default:
        return (
          <MaintenanceView 
            language={language}
            viewName={activeView} 
            onGoBack={() => setActiveView('dashboard')} 
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      navigateToSettings={navigateToSettings}
      language={language}
      setLanguage={setLanguage}
      onLogout={logout}
    >
      <div className="pt-2">
        {renderContent()}
      </div>
    </Layout>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  </AuthProvider>
);

export default App;
