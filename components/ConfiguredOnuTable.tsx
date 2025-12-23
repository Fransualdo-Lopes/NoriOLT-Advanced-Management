
import React from 'react';
import { Globe, WifiOff, Plug, Smartphone } from 'lucide-react';
import { ONU } from '../types';
import { Language, translations } from '../translations';

interface ConfiguredOnuTableProps {
  onus: ONU[];
  loading: boolean;
  language: Language;
  onViewOnu: (id: string) => void;
}

const ConfiguredOnuTable: React.FC<ConfiguredOnuTableProps> = ({ onus, loading, language, onViewOnu }) => {
  const t = translations[language];

  if (loading) {
    return (
      <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Inventory...</span>
        </div>
      </div>
    );
  }

  if (onus.length === 0) {
    return (
      <div className="bg-white rounded-sm border border-slate-200 p-24 flex flex-col items-center justify-center text-center shadow-sm">
        <Smartphone size={40} className="text-slate-100 mb-4" />
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No Authorized Devices found</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="bg-[#f8fafc] border-b border-slate-300">
            <tr className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">
              <th className="px-3 py-3 text-center border-r border-slate-200 w-12">{t.status}</th>
              <th className="px-3 py-3 text-center border-r border-slate-200 w-16">View</th>
              <th className="px-4 py-3 border-r border-slate-200">{t.name}</th>
              <th className="px-4 py-3 border-r border-slate-200">{t.snMac}</th>
              <th className="px-4 py-3 border-r border-slate-200">ONU</th>
              <th className="px-4 py-3 border-r border-slate-200">{t.zone}</th>
              <th className="px-4 py-3 border-r border-slate-200">{t.odb}</th>
              <th className="px-4 py-3 text-center border-r border-slate-200">{t.signal}</th>
              <th className="px-4 py-3 text-center border-r border-slate-200">B/R</th>
              <th className="px-3 py-3 text-center border-r border-slate-200">{t.vlan}</th>
              <th className="px-3 py-3 text-center border-r border-slate-200">VoIP</th>
              <th className="px-3 py-3 text-center border-r border-slate-200">TV</th>
              <th className="px-4 py-3 border-r border-slate-200">{t.type}</th>
              <th className="px-4 py-3">{t.authDate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {onus.map(onu => (
              <tr key={onu.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-3 py-2 text-center border-r border-slate-100">
                  <div className="flex justify-center">
                    {onu.status === 'online' ? (
                      <Globe size={14} className="text-green-500" />
                    ) : onu.status === 'los' ? (
                      <WifiOff size={14} className="text-red-500" />
                    ) : (
                      <Plug size={14} className="text-slate-400" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-center border-r border-slate-100">
                  <button 
                    onClick={() => onViewOnu(onu.id)}
                    className="inline-flex items-center gap-1 bg-[#1a73e8] hover:bg-blue-700 text-white text-[10px] font-black py-1 px-3 rounded shadow-sm uppercase tracking-tight transition-all active:scale-95"
                  >
                      View
                  </button>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <span className="text-[12px] font-bold text-slate-800">{onu.name}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <span className="text-[11px] font-mono font-black text-slate-600 tracking-tighter">{onu.sn}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-900 font-black leading-tight">{onu.olt}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">gpon-onu_{onu.pon}</span>
                  </div>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{onu.zone || 'None'}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{onu.odb || 'None'}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-end gap-0.5">
                        {[1, 2, 3, 4].map(bar => (
                          <div 
                            key={bar} 
                            className={`w-1 rounded-sm ${bar <= getSignalBars(onu.signal) ? getSignalColor(onu.signal) : 'bg-slate-200'} ${
                              bar === 1 ? 'h-1.5' : bar === 2 ? 'h-2.5' : bar === 3 ? 'h-3.5' : 'h-4.5'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-[9px] font-black ${getSignalTextColor(onu.signal)}`}>
                        {onu.signal > -99 ? `${onu.signal}` : '-'}
                      </span>
                    </div>
                </td>
                <td className="px-4 py-2 text-center border-r border-slate-100">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest shadow-sm ${
                    onu.mode === 'Router' ? 'bg-[#334155] text-white border-slate-800' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    {onu.mode}
                  </span>
                </td>
                <td className="px-3 py-2 text-center border-r border-slate-100 text-[11px] font-black text-slate-700">{onu.vlan}</td>
                <td className="px-3 py-2 text-center border-r border-slate-100 text-[11px] font-bold text-slate-400">-</td>
                <td className="px-3 py-2 text-center border-r border-slate-100 text-[11px] font-bold text-slate-400">-</td>
                <td className="px-4 py-2 border-r border-slate-100 whitespace-nowrap">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{onu.type}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{onu.authDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getSignalBars = (signal: number) => {
  if (signal > -18) return 4;
  if (signal > -22) return 3;
  if (signal > -25) return 2;
  return 1;
};

const getSignalColor = (signal: number) => {
  if (signal > -18) return 'bg-[#22c55e]';
  if (signal > -22) return 'bg-[#eab308]';
  if (signal > -25) return 'bg-[#f97316]';
  return 'bg-[#ef4444]';
};

const getSignalTextColor = (signal: number) => {
  if (signal > -18) return 'text-green-600';
  if (signal > -22) return 'text-yellow-600';
  if (signal > -25) return 'text-orange-600';
  return 'text-red-600';
};

export default ConfiguredOnuTable;
