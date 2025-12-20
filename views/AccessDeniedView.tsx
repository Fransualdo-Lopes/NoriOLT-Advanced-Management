
import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Language, translations } from '../translations';

interface AccessDeniedViewProps {
  language: Language;
  onGoBack: () => void;
}

const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ language, onGoBack }) => {
  const t = translations[language];

  return (
    <div className="bg-white border border-red-100 rounded-2xl p-20 text-center shadow-xl shadow-red-900/5 animate-in fade-in zoom-in duration-300">
      <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600 shadow-inner">
        <ShieldAlert size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase italic">
        Access Denied
      </h2>
      <p className="text-slate-500 max-w-lg mx-auto leading-relaxed mb-8 font-medium">
        Your current operator role does not have the necessary permissions to access this module. 
        Please contact your system administrator if you believe this is an error.
      </p>
      <button 
        onClick={onGoBack} 
        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 mx-auto"
      >
        <ArrowLeft size={18} /> {t.returnConsole}
      </button>
    </div>
  );
};

export default AccessDeniedView;
