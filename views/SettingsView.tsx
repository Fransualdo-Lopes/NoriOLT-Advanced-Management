
import React, { useState, useEffect } from 'react';
import { Settings, Users, Key, CreditCard, ChevronRight } from 'lucide-react';
import { Language, translations } from '../translations';
import { SettingsTab } from '../types';
import UsersTab from './settings/UsersTab';
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
        return <GeneralSettings language={language} />;
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
      {/* Horizontal Tab Bar - Fixed to match Image 4 */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide">
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

const GeneralSettings: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Action Buttons (Match Image 3) */}
      <div className="flex gap-3">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all">
          Edit general settings
        </button>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all">
          See history
        </button>
      </div>

      {/* Settings Table (Match Image 3) */}
      <div className="overflow-hidden border border-slate-100 rounded-lg shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">Setting</th>
              <th className="px-6 py-4">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            <tr>
              <td className="px-6 py-4 text-slate-600">Title</td>
              <td className="px-6 py-4 font-bold text-slate-900 uppercase">JETZ INTERNET</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-slate-600">Timezone</td>
              <td className="px-6 py-4">America/Belem</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-slate-600">IPs allowed to access JETZOLT</td>
              <td className="px-6 py-4">Allowed from anywhere</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-slate-600">Time limit for installers to see ONUs (days)</td>
              <td className="px-6 py-4 font-bold">5</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-slate-600">Language</td>
              <td className="px-6 py-4">English</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsView;
