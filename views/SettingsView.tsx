
import React, { useState, useEffect } from 'react';
import { Settings, Users, Key, CreditCard, ChevronRight } from 'lucide-react';
import { Language, translations } from '../translations';
import { SettingsTab } from '../types';
import UsersTab from './settings/UsersTab';
import GeneralTab from './settings/GeneralTab';
import MaintenanceView from './MaintenanceView';

interface SettingsViewProps {
  language: Language;
  initialTab?: SettingsTab;
}

const SettingsView: React.FC<SettingsViewProps> = ({ language, initialTab = 'general' }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'users', label: 'Users' },
    { id: 'apikey', label: 'API key' },
    { id: 'billing', label: 'Billing' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        // Fixed: GeneralTab does not take props
        return <GeneralTab />;
      case 'users':
        return <UsersTab language={language} />;
      default:
        return (
          <MaintenanceView 
            language={language} 
            viewName={activeTab} 
            onGoBack={() => setActiveTab('general')} 
          />
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Horizontal Tab Bar */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`pb-4 px-1 text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsView;
