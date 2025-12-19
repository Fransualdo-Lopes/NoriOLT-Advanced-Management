
import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../translations';

interface MaintenanceViewProps {
  viewName: string;
  onGoBack: () => void;
  language: Language;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ viewName, onGoBack, language }) => {
  const t = translations[language];

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-20 text-center shadow-xl shadow-blue-900/5 animate-in fade-in zoom-in duration-300">
      <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
        <Settings size={40} className="animate-spin-slow" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">
        {t.maintenanceTitle}
      </h2>
      <p className="text-slate-500 max-w-lg mx-auto leading-relaxed mb-8">
        {t.status} <span className="font-bold text-slate-700">{viewName}</span> {t.maintenanceDesc}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={onGoBack} 
          className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {t.returnConsole}
        </button>
        <button 
          className="px-8 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-2"
        >
          <ShieldAlert size={18} /> {t.status}
        </button>
      </div>
    </div>
  );
};

export default MaintenanceView;
