
import React from 'react';
import { RefreshCcw, PlusCircle } from 'lucide-react';
import OnuTable from '../components/OnuTable';
import { Language, translations } from '../translations';

interface ConfiguredViewProps {
  onAddOnu: () => void;
  language: Language;
}

const ConfiguredView: React.FC<ConfiguredViewProps> = ({ onAddOnu, language }) => {
  const t = translations[language];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              {t.configured} <span className="text-blue-600">Inventory</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized GPON Units Fleet</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
             <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-sm"><RefreshCcw size={16} /> {t.refresh}</button>
             <button onClick={onAddOnu} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-blue-600/20"><PlusCircle size={16} /> {t.addOnu}</button>
          </div>
       </div>
       
       <OnuTable language={language} />
    </div>
  );
};

export default ConfiguredView;
