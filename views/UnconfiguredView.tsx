
import React, { useState, useEffect, useMemo } from 'react';
import { 
  RefreshCcw, History, Search, 
  PlusCircle, BookOpen, Loader2, Server,
  Cpu, Activity, Settings2, Octagon
} from 'lucide-react';
import { Language, translations } from '../translations';
import { UnconfiguredONU, OLT } from '../types';
import { unconfiguredOnuService } from '../services/unconfiguredOnuService';
import { oltService } from '../services/oltService';

interface UnconfiguredViewProps {
  language: Language;
}

const UnconfiguredView: React.FC<UnconfiguredViewProps> = ({ language }) => {
  const t = translations[language];
  const [onus, setOnus] = useState<UnconfiguredONU[]>([]);
  const [olts, setOlts] = useState<OLT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOltId, setFilterOltId] = useState('any');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOnus = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const [pendingOnus, oltList] = await Promise.all([
        unconfiguredOnuService.getUnconfiguredOnus(filterOltId),
        oltService.getOlts()
      ]);
      setOnus(pendingOnus);
      setOlts(oltList);
    } catch (error) {
      console.error("Failed to fetch unconfigured ONUs", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOnus();
  }, [filterOltId]);

  const groupedOnus = useMemo(() => {
    return onus.reduce((acc, onu) => {
      if (!acc[onu.olt_id]) {
        acc[onu.olt_id] = {
          name: onu.olt_name,
          onus: []
        };
      }
      acc[onu.olt_id].onus.push(onu);
      return acc;
    }, {} as Record<string, { name: string; onus: UnconfiguredONU[] }>);
  }, [onus]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Top Controls - SmartOLT Style */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OLT</label>
            <select 
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
              value={filterOltId}
              onChange={(e) => setFilterOltId(e.target.value)}
            >
              <option value="any">Any</option>
              {olts.map(olt => (
                <option key={olt.id} value={olt.id}>{olt.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => fetchOnus(true)}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-green-600/10 uppercase tracking-widest"
          >
            {isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            {t.refresh}
          </button>
        </div>

        {/* Auto Actions Section */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
          <div className="px-3 flex items-center gap-2 border-r border-slate-200 mr-2">
             <Activity size={14} className="text-blue-500" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.autoActions}</span>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
            {t.configureActions}
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
            <History size={12} /> {t.taskHistory}
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
            {t.refresh}
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-600/20">
            <Octagon size={12} /> {t.stopAuto}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200">
          <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Polling PON interfaces...</p>
        </div>
      ) : Object.keys(groupedOnus).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Search size={32} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-400 tracking-tighter uppercase mb-2">{t.noUnconfigured}</h3>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-xs">No pending hardware detected on authorized OLT ports at this moment.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {(Object.entries(groupedOnus) as [string, { name: string; onus: UnconfiguredONU[] }][]).map(([oltId, group]) => (
            <div key={oltId} className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                  <Cpu size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">
                  {oltId} - {group.name}
                </h3>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      <th className="px-6 py-5">PON Type</th>
                      <th className="px-6 py-5">Board</th>
                      <th className="px-6 py-5">Port</th>
                      <th className="px-6 py-5">PON Description</th>
                      <th className="px-6 py-5">SN</th>
                      <th className="px-6 py-5">Type</th>
                      <th className="px-6 py-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {group.onus.map(onu => (
                      <tr key={onu.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">
                            {onu.pon_type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700">{onu.board}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700">{onu.port}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Server size={12} className="text-slate-300" />
                            <span className="text-xs font-bold text-slate-500 italic uppercase">{onu.pon_description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[11px] font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                            {onu.sn}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{onu.model}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            {onu.supports_immediate_auth ? (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 uppercase tracking-widest">
                                {t.authorize}
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <button className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest">
                                  {t.viewOnu}
                                </button>
                                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest">
                                  {t.resync}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8">
        <button className="w-full max-w-sm bg-white border border-slate-200 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all group text-left border-b-4 border-b-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{t.authorizationPresets}</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">{t.managePresets}</p>
            </div>
          </div>
        </button>

        <button className="w-full max-w-sm bg-green-600 p-5 rounded-3xl shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all group text-left border-b-4 border-b-green-800">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 text-white p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{t.addLater}</h4>
              <p className="text-[9px] font-bold text-green-100 uppercase tracking-[0.1em] mt-1 italic">Queue for manual commissioning</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UnconfiguredView;
