
import React from 'react';
import { Eye, Signal, WifiOff, Monitor, Smartphone } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      </div>
    );
  }

  if (onus.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-20 flex flex-col items-center justify-center text-center">
        <Smartphone size={32} className="text-slate-200 mb-4" />
        <h3 className="text-sm font-bold text-slate-800 uppercase">No ONUs found</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1500px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 text-center">{t.status}</th>
              <th className="px-4 py-3 text-center">View</th>
              <th className="px-4 py-3">{t.name}</th>
              <th className="px-4 py-3">{t.snMac}</th>
              <th className="px-4 py-3">ONU</th>
              <th className="px-4 py-3">{t.zone}</th>
              <th className="px-4 py-3">{t.odb}</th>
              <th className="px-4 py-3 text-center">{t.signal}</th>
              <th className="px-4 py-3 text-center">B/R</th>
              <th className="px-4 py-3 text-center">{t.vlan}</th>
              <th className="px-4 py-3 text-center">VoIP</th>
              <th className="px-4 py-3 text-center">TV</th>
              <th className="px-4 py-3">{t.type}</th>
              <th className="px-4 py-3">{t.authDate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {onus.map(onu => (
              <tr key={onu.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    {onu.status === 'online' ? (
                      <GlobeIcon className="text-green-500" />
                    ) : onu.status === 'los' ? (
                      <WifiOff size={16} className="text-red-500" />
                    ) : (
                      <SettingsIcon className="text-slate-400" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-4 rounded shadow-sm">
                       View
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-slate-700">{onu.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono font-bold text-slate-600">{onu.sn}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-800 font-bold">{onu.olt}</span>
                    <span className="text-[10px] text-slate-400">gpon-onu_{onu.pon}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{onu.zone || 'None'}</td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{onu.odb || 'None'}</td>
                <td className="px-4 py-3">
                   <div className="flex flex-col items-center gap-1">
                     <div className="flex items-end gap-0.5">
                       {[1, 2, 3, 4].map(bar => (
                         <div 
                           key={bar} 
                           className={`w-1 rounded-sm ${bar <= getSignalBars(onu.signal) ? getSignalColor(onu.signal) : 'bg-slate-200'} ${bar === 1 ? 'h-1.5' : bar === 2 ? 'h-2.5' : bar === 3 ? 'h-3.5' : 'h-4.5'}`}
                         />
                       ))}
                     </div>
                     <span className={`text-[10px] font-bold ${getSignalText(onu.signal)}`}>
                       {onu.signal > -99 ? `${onu.signal}` : '-'}
                     </span>
                   </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                    onu.mode === 'Router' ? 'bg-slate-700 text-white border-slate-800' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    {onu.mode}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[11px] font-bold text-slate-700">{onu.vlan}</td>
                <td className="px-4 py-3 text-center">-</td>
                <td className="px-4 py-3 text-center">-</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{onu.type}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
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

const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const SettingsIcon = ({ className }: { className: string }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const getSignalBars = (signal: number) => {
  if (signal > -20) return 4;
  if (signal > -24) return 3;
  if (signal > -27) return 2;
  return 1;
};

const getSignalColor = (signal: number) => {
  if (signal > -20) return 'bg-green-500';
  if (signal > -24) return 'bg-yellow-500';
  if (signal > -27) return 'bg-orange-500';
  return 'bg-red-500';
};

const getSignalText = (signal: number) => {
  if (signal > -20) return 'text-green-600';
  if (signal > -24) return 'text-yellow-600';
  if (signal > -27) return 'text-orange-600';
  return 'text-red-600';
};

export default ConfiguredOnuTable;
