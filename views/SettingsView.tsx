
import React, { useState } from 'react';
import { Settings, UserPlus, Users, Key, CreditCard, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../translations';
import { SettingsTab } from '../types';
import UsersTab from './settings/UsersTab';
import MaintenanceView from './MaintenanceView';

interface SettingsViewProps {
  language: Language;
}

const SettingsView: React.FC<SettingsViewProps> = ({ language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  const tabs = [
    { id: 'general', label: t.general, icon: Settings },
    { id: 'users', label: t.users, icon: Users },
    { id: 'apikey', label: t.apiKey, icon: Key },
    { id: 'billing', label: t.billing, icon: CreditCard },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab language={language} />;
      default:
        return (
          <MaintenanceView 
            language={language} 
            viewName={t[activeTab as keyof typeof t] || activeTab} 
            onGoBack={() => setActiveTab('users')} 
          />
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          
          <div className="mt-8 p-4 bg-slate-900 rounded-2xl border border-slate-800 hidden md:block">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
               <ShieldCheck size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Compliance Active</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
              RBAC policies are strictly enforced for this session. All modifications are logged by Nori-Engine Audit.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
