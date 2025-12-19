
import React from 'react';
import { Eye, Signal } from 'lucide-react';
import { ONU } from '../types';
import { Language, translations } from '../translations';

interface ConfiguredTableProps {
  onus: ONU[];
  language: Language;
}

const ConfiguredTable: React.FC<ConfiguredTableProps> = ({ onus, language }) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.status}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.actions}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.name}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.snMac}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.oltLink}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.signal}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.mode}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.vlan}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.type}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.authDate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {onus.map(onu => (
              <tr key={onu.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-4">
                  <div className={`w-3 h-3 rounded-full ${onu.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                </td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-3 rounded shadow-sm transition-transform active:scale-95 uppercase">
                    <Eye size={12} /> {language === 'en' ? 'VIEW' : 'VER'}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-gray-900">{onu.name}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{onu.sn}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-800 font-medium">{onu.olt}</span>
                    <span className="text-[10px] text-gray-400">gpon-onu_{onu.pon}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                   <div className="flex items-center gap-1.5">
                     <Signal size={12} className={onu.signal > -20 ? 'text-green-500' : 'text-orange-500'} />
                     <span className="text-xs font-semibold">{onu.signal} dBm</span>
                   </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter ${
                    onu.mode === 'Router' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'
                  }`}>
                    {onu.mode}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-gray-600">{onu.vlan}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-500">{onu.type}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-500">{onu.authDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 p-3 flex justify-between items-center text-xs font-medium text-gray-500 border-t border-gray-200">
        <div>{language === 'en' ? `Showing 1-${onus.length} of ${onus.length}` : `Mostrando 1-${onus.length} de ${onus.length}`}</div>
        <div className="flex gap-2">
           <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50" disabled>{language === 'en' ? 'Previous' : 'Anterior'}</button>
           <button className="px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded">1</button>
           <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50" disabled>{language === 'en' ? 'Next' : 'Próximo'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguredTable;
