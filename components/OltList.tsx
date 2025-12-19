
import React, { useEffect, useState } from 'react';
import { Server, Thermometer, Clock, Activity, ChevronRight, Settings2 } from 'lucide-react';
import { OLT } from '../types';
import { oltService } from '../services/oltService';
import { Language, translations } from '../translations';

interface OltListProps {
  language: Language;
}

const OltList: React.FC<OltListProps> = ({ language }) => {
  const t = translations[language];
  const [olts, setOlts] = useState<OLT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    oltService.getOlts().then(data => {
      setOlts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Server size={14} /> {t.olts} <span className="text-blue-500">[{olts.length}]</span>
        </h3>
        <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
          {language === 'en' ? 'Manage Cluster' : 'Gerenciar Cluster'} <ChevronRight size={10} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {olts.map(olt => (
          <div key={olt.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:shadow-blue-900/5 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  olt.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm tracking-tight">{olt.name}</h4>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <Clock size={12} className="text-slate-300" /> {olt.uptime}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <Thermometer size={12} className={olt.temperature > 40 ? 'text-red-500' : 'text-orange-400'} /> {olt.temperature}°C
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                  olt.status === 'online' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {olt.status}
                </div>
                <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Settings2 size={18} />
                </button>
              </div>
            </div>
            
            {/* Port Status Visualization Strip */}
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  title={`PON Port ${i+1}`}
                  className={`flex-1 h-1 rounded-full ${i < 8 ? 'bg-green-400' : 'bg-slate-100'}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OltList;
