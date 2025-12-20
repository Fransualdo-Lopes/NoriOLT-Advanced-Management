
import React, { useState, useEffect, useMemo } from 'react';
import { 
  RefreshCcw, Settings, History, StopCircle, 
  ChevronRight, LayoutGrid, Search, 
  PlusCircle, BookOpen, Loader2, Server,
  Cpu, Activity
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

  // Group ONUs by OLT
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
      {/* Header & Main Controls */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <span className="bg-amber-100 text-amber-600 p-2 rounded-xl border border-amber-200">
              <Activity size={20} />
            </span>
            {t.unconfigured} <span className="text-blue-600">Pending</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-12">Found hardware awaiting logic profile</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OLT:</label>
            <select 
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
              value={filterOltId}
              onChange={(e) => setFilterOltId(e.target.value)}
            >
              <option value="any">Any (All Clusters)</option>
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

          <div className="h-10 w-px bg-slate-200 mx-2 hidden lg:block"></div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">{t.autoActions}:</span>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
              {t.configureActions}
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <History size={12} /> {t.taskHistory}
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/10">
              {t.stopAuto}
            </button>
          </div>
        </div>
      </div>

      {/* Grouped Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning GPON Ports...</p>
        </div>
      ) : Object.keys(groupedOnus).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Search size={48} className="text-slate-200 mb-4" />
          <h3 className="text-xl font-black text-slate-400 tracking-tighter uppercase">{t.noUnconfigured}</h3>
          <p className="text-xs font-bold text-slate-300 uppercase mt-1 tracking-widest">All detected hardware is already authorized.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Fix: Explicitly cast Object.entries to properly type 'group' and avoid 'unknown' member access errors */}
          {(Object.entries(groupedOnus) as [string, { name: string; onus: UnconfiguredONU[] }][]).map(([oltId, group]) => (
            <div key={oltId} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <Cpu size={14} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">
                  {oltId} - {group.name}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                      <th className="px-6 py-4">{t.ponType}</th>
                      <th className="px-6 py-4">{t.board}</th>
                      <th className="px-6 py-4">{t.port}</th>
                      <th className="px-6 py-4">{t.ponDescription}</th>
                      <th className="px-6 py-4">{t.sn}</th>
                      <th className="px-6 py-4">{t.type}</th>
                      <th className="px-6 py-4 text-center">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {group.onus.map(onu => (
                      <tr key={onu.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">
                            {onu.pon_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{onu.board}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{onu.port}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Server size={12} className="text-slate-300" />
                            <span className="text-xs font-bold text-slate-600 italic">{onu.pon_description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                            {onu.sn}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{onu.model}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {onu.supports_immediate_auth ? (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 uppercase tracking-widest">
                                {t.authorize}
                              </button>
                            ) : (
                              <>
                                <button className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
                                  {t.viewOnu}
                                </button>
                                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
                                  {t.resync}
                                </button>
                              </>
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

      {/* Bottom Action Footer */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center pt-6">
        <button className="flex-1 max-w-sm bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{t.authorizationPresets}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.managePresets}</p>
            </div>
          </div>
        </button>

        <button className="flex-1 max-w-sm bg-green-600 p-4 rounded-2xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all group text-left">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{t.addLater}</h4>
              <p className="text-[10px] font-bold text-green-100 uppercase tracking-widest mt-0.5">Queue for site visit</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UnconfiguredView;
