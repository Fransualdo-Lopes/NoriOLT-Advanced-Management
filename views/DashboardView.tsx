
import React from 'react';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import { NetworkStatusChart, AuthorizationsChart } from '../components/Charts';
import OltList from '../components/OltList';
import ActivityLog from '../components/ActivityLog';
import { mockOutages } from '../data/mockData';
import { Language, translations } from '../translations';
import { ViewType } from '../types';

interface DashboardViewProps {
  language: Language;
  onNavigate: (view: ViewType) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DashboardStats language={language} onNavigate={onNavigate} />

      <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>{t.integrity}: 98.4%</span>
        </div>
        <span>{t.telemetry} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NetworkStatusChart />
          <AuthorizationsChart />
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-400" />
                <h3 className="font-black text-xs uppercase tracking-widest">{t.incidents}</h3>
              </div>
              <button className="text-[10px] font-black uppercase text-blue-400 flex items-center gap-1">
                Manage Cluster <ChevronRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4">{t.oltCluster}</th>
                    <th className="p-4 text-center">{t.reference}</th>
                    <th className="p-4 text-center">{t.impacted}</th>
                    <th className="p-4 text-center">{t.los}</th>
                    <th className="p-4 text-center">PWR</th>
                    <th className="p-4">{t.rootCause}</th>
                    <th className="p-4">{t.duration}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {mockOutages.map(outage => (
                    <tr key={outage.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{outage.oltName}</td>
                      <td className="p-4 text-center text-blue-600 underline font-black">{outage.boardPort}</td>
                      <td className="p-4 text-center font-black">{outage.onusAffected}</td>
                      <td className="p-4 text-center">{outage.los}</td>
                      <td className="p-4 text-center">{outage.power}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded border border-red-100 font-black uppercase text-[9px]">
                          {outage.cause}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 italic text-[11px]">{outage.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <OltList language={language} />
          <ActivityLog language={language} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
