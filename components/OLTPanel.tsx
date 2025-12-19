
import React from 'react';
import { Settings, Server, Thermometer, Clock } from 'lucide-react';
import { OLT } from '../types';
import { Language, translations } from '../translations';

interface OLTPanelProps {
  olts: OLT[];
  language: Language;
}

const OLTPanel: React.FC<OLTPanelProps> = ({ olts, language }) => {
  const t = translations[language];
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Server size={18} />
          <h3 className="font-semibold text-sm">{t.olts}</h3>
        </div>
        <button className="text-xs text-gray-300 hover:text-white flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
          {language === 'en' ? 'All' : 'Tudo'} <Settings size={12} />
        </button>
      </div>
      <div className="p-2 space-y-1">
        {olts.map(olt => (
          <div key={olt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Settings size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{olt.name}</div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={10} /> {olt.uptime}</span>
                  <span className="flex items-center gap-1"><Thermometer size={10} /> {olt.temperature}°C</span>
                </div>
              </div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${olt.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OLTPanel;
