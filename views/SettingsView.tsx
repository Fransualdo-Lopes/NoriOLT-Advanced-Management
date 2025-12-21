
import React, { useState } from 'react';
import { Settings, Users, Key, CreditCard } from 'lucide-react';
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
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'apikey', label: 'API key', icon: Key },
    { id: 'billing', label: 'Billing', icon: CreditCard },
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Tab Bar - No Horizontal Scroll, Flex Wrap for Mobile */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all rounded-lg ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={14} className="shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8 min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

const GeneralSettings: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/10 transition-all active:scale-95">
          Edit general settings
        </button>
        <button className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
          See history
        </button>
      </div>

      {/* Settings Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-inner bg-slate-50/30">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-100/50 border-b border-slate-200">
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">Setting Configuration</th>
              <th className="px-6 py-4">Current Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px] font-medium text-slate-700">
            {[
              { label: 'System Title', value: 'JETZ INTERNET', bold: true },
              { label: 'Timezone', value: 'America/Belem' },
              { label: 'Access Control', value: 'Allowed from anywhere' },
              { label: 'Installer Access (Days)', value: '5', bold: true },
              { label: 'Default Language', value: 'English' }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-white transition-colors">
                <td className="px-6 py-4 text-slate-500">{row.label}</td>
                <td className={`px-6 py-4 ${row.bold ? 'font-black text-slate-900 uppercase italic' : 'text-slate-800'}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsView;
