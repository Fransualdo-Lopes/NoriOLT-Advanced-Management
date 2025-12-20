
import React, { useState, useEffect } from 'react';
import { Eye, Signal, Search, ArrowLeft, ArrowRight, Activity, Filter, WifiOff } from 'lucide-react';
import { ONU } from '../types';
import { onuService } from '../services/onuService';
import { Language, translations } from '../translations';

interface OnuTableProps {
  language: Language;
}

const OnuTable: React.FC<OnuTableProps> = ({ language }) => {
  const t = translations[language];
  const [onus, setOnus] = useState<ONU[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await onuService.getOnus({ page, search });
      setOnus(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch ONUs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const getStatusIcon = (status: ONU['status']) => {
    switch (status) {
      case 'online': return <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />;
      case 'los': return <WifiOff size={14} className="text-red-600" />;
      default: return <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" 
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {total} {language === 'en' ? 'Devices found' : 'Dispositivos'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4">{t.name}</th>
                <th className="px-6 py-4">{t.snMac}</th>
                <th className="px-6 py-4">{t.oltLink}</th>
                <th className="px-6 py-4">{t.signal}</th>
                <th className="px-6 py-4">{t.mode}</th>
                <th className="px-6 py-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-full"></div></td>
                  </tr>
                ))
              ) : (
                onus.map(onu => (
                  <tr key={onu.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        {getStatusIcon(onu.status)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{onu.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{onu.zone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                        {onu.sn}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded text-slate-400">
                          <Activity size={12} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-700 font-bold">{onu.olt}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">PON {onu.pon}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                         <Signal size={12} className={onu.signal > -22 ? 'text-green-500' : 'text-orange-500'} />
                         <span className={`text-xs font-black ${onu.signal > -22 ? 'text-green-600' : 'text-orange-600'}`}>
                           {onu.signal} <span className="text-[10px] font-bold text-slate-300">dBm</span>
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${
                        onu.mode === 'Router' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {onu.mode}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 uppercase tracking-widest shadow-lg shadow-slate-900/10">
                        <Eye size={12} /> {language === 'en' ? 'Inspect' : 'Inspecionar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {language === 'en' ? 'Page' : 'Página'} <span className="text-slate-900">{page}</span> of {Math.max(1, Math.ceil(total / 10))}
          </div>
          <div className="flex items-center gap-1">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               <ArrowLeft size={16} />
             </button>
             <div className="px-4 text-sm font-black text-slate-700">{page}</div>
             <button 
               onClick={() => setPage(p => p + 1)}
               disabled={onus.length < 10}
               className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnuTable;
