
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import { NetworkStatusChart, AuthorizationsChart } from '../components/Charts';
import OltList from '../components/OltList';
import ActivityLog from '../components/ActivityLog';
import { mockOutages } from '../data/mockData';
import { Language, translations } from '../translations';

interface DashboardViewProps {
  language: Language;
}

const DashboardView: React.FC<DashboardViewProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dynamic Stats Section consuming REST API endpoints */}
      <DashboardStats language={language} />

      <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-bold px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>{t.integrity}: 98.4%</span>
        </div>
        <span>{t.telemetry} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NetworkStatusChart />
          <AuthorizationsChart />
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-3.5 flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">{t.incidents}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-tighter">
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
                <tbody className="divide-y divide-gray-50">
                  {mockOutages.map(outage => (
                    <tr key={outage.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{outage.oltName}</td>
                      <td className="p-4 text-center text-blue-600 underline cursor-pointer font-black">{outage.boardPort}</td>
                      <td className="p-4 text-center font-black text-slate-900">{outage.onusAffected}</td>
                      <td className="p-4 text-center font-medium">{outage.los}</td>
                      <td className="p-4 text-center font-medium">{outage.power}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded border border-red-100 font-bold uppercase text-[9px] tracking-tighter">
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
          {/* New Event-Driven Activity Log with auto-refresh */}
          <ActivityLog language={language} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
