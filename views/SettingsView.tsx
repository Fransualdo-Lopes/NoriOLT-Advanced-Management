
import React, { useState } from 'react';
import { Settings, Users, Key, CreditCard, ShieldCheck, History, Edit3 } from 'lucide-react';
import { Language, translations } from '../translations';
import { SettingsTab } from '../types';
import UsersTab from './settings/UsersTab';
import MaintenanceView from './MaintenanceView';

interface SettingsViewProps {
  language: Language;
}

const SettingsView: React.FC<SettingsViewProps> = ({ language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs = [
    { id: 'general', label: t.general, icon: Settings },
    { id: 'users', label: t.users, icon: Users },
    { id: 'apikey', label: t.apiKey, icon: Key },
    { id: 'billing', label: t.billing, icon: CreditCard },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings language={language} />;
      case 'users':
        return <UsersTab language={language} />;
      default:
        return (
          <MaintenanceView 
            language={language} 
            viewName={t[activeTab as keyof typeof t] || activeTab} 
            onGoBack={() => setActiveTab('general')} 
          />
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Horizontal Tab Bar (Match Image 4) */}
      <div className="border-b border-slate-200 flex gap-8 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`pb-4 px-1 text-sm font-semibold transition-all relative ${
              activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full shadow-[0_-2px_4px_rgba(37,99,235,0.4)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

const GeneralSettings: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">Edit general settings</button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">See history</button>
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-3">Setting</th>
              <th className="px-6 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
            <tr><td className="px-6 py-4">Title</td><td className="px-6 py-4 font-bold text-slate-900">JETZ INTERNET</td></tr>
            <tr><td className="px-6 py-4">Timezone</td><td className="px-6 py-4">America/Belem</td></tr>
            <tr><td className="px-6 py-4">IPs allowed to access JETZOLT</td><td className="px-6 py-4">Allowed from anywhere</td></tr>
            <tr><td className="px-6 py-4">Time limit for installers (days)</td><td className="px-6 py-4">5</td></tr>
            <tr><td className="px-6 py-4">Language</td><td className="px-6 py-4">English</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsView;
