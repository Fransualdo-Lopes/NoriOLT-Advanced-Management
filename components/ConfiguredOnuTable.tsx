
import React from 'react';
import { Eye, Signal, Activity, WifiOff, Trash2, Edit3, Smartphone, Monitor } from 'lucide-react';
import { ONU } from '../types';
import { Language, translations } from '../translations';

interface ConfiguredOnuTableProps {
  onus: ONU[];
  loading: boolean;
  language: Language;
}

const ConfiguredOnuTable: React.FC<ConfiguredOnuTableProps> = ({ onus, loading, language }) => {
  const t = translations[language];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[...Array(10)].map((_, i) => (
                  <th key={i} className="px-6 py-4"><div className="h-2 bg-slate-200 rounded w-16 animate-pulse"></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  {[...Array(10)].map((_, j) => (
                    <td key={j} className="px-6 py-6"><div className="h-3 bg-slate-100 rounded w-full animate-pulse"></div></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (onus.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
           <Smartphone size={32} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">No ONUs found</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm">No hardware matches your current filtration criteria. Try adjusting the search or OLT parameters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <th className="px-6 py-4">{t.status}</th>
              <th className="px-6 py-4 text-center">{t.actions}</th>
              <th className="px-6 py-4">{t.name}</th>
              <th className="px-6 py-4">{t.snMac}</th>
              <th className="px-6 py-4">ONU (OLT Path)</th>
              <th className="px-6 py-4">ZONE</th>
              <th className="px-6 py-4">ODB</th>
              <th className="px-6 py-4 text-center">{t.signal}</th>
              <th className="px-6 py-4 text-center">B/R</th>
              <th className="px-6 py-4 text-center">{t.vlan}</th>
              <th className="px-6 py-4 text-center">VoIP</th>
              <th className="px-6 py-4 text-center">TV</th>
              <th className="px-6 py-4">{t.type}</th>
              <th className="px-6 py-4">{t.authDate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {onus.map(onu => (
              <tr key={onu.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {onu.status === 'online' ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Online" />
                    ) : onu.status === 'los' ? (
                      // Fixed: removed the unsupported 'title' prop from Lucide icon component
                      <WifiOff size={14} className="text-red-500" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" title="Offline" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all shadow-md shadow-slate-900/10" title="Inspect">
                      <Eye size={12} />
                    </button>
                    <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all" title="Edit">
                      <Edit3 size={12} />
                    </button>
                    <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-lg transition-all" title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 tracking-tight">{onu.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{onu.zone || 'No Zone'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                    {onu.sn}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-100 rounded text-slate-400">
                      <Monitor size={10} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-700 font-black">{onu.olt}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">gpon-onu_{onu.pon}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{onu.zone || '-'}</td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{onu.odb || '-'}</td>
                <td className="px-6 py-4">
                   <div className="flex flex-col items-center gap-1">
                     <div className="flex items-center gap-0.5">
                       {[1, 2, 3, 4, 5].map(bar => (
                         <div 
                           key={bar} 
                           className={`w-1 h-3 rounded-full ${getBarColor(bar, onu.signal)}`}
                         />
                       ))}
                     </div>
                     <span className={`text-[10px] font-black ${onu.signal > -22 ? 'text-green-600' : 'text-orange-600'}`}>
                       {onu.signal} <span className="text-[9px] font-bold text-slate-300">dBm</span>
                     </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${
                    onu.mode === 'Router' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {onu.mode.charAt(0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-[10px] font-black text-slate-700">{onu.vlan}</td>
                <td className="px-6 py-4 text-center">
                   <div className={`w-2 h-2 rounded-full mx-auto ${Math.random() > 0.5 ? 'bg-slate-100' : 'bg-green-500'}`} />
                </td>
                <td className="px-6 py-4 text-center">
                   <div className={`w-2 h-2 rounded-full mx-auto ${Math.random() > 0.8 ? 'bg-green-500' : 'bg-slate-100'}`} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{onu.type || 'HGU'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[10px] font-bold text-slate-500 italic uppercase">{onu.authDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getBarColor = (barIndex: number, signal: number) => {
  const normalized = Math.max(0, Math.min(5, Math.ceil((signal + 40) / 4))); // Simple mapping
  if (barIndex <= normalized) {
    if (signal > -20) return 'bg-green-500';
    if (signal > -25) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  return 'bg-slate-100';
};

export default ConfiguredOnuTable;
