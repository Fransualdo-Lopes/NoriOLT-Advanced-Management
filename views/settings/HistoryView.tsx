
import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, Download, FileText, 
  ChevronRight, AlertCircle, CheckCircle2, XCircle, 
  Monitor, User, Globe, Cpu, Loader2, Calendar
} from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { AuditLogEntry } from '../../types';
import { auditService, AuditFilters } from '../../services/auditService';

interface HistoryViewProps {
  language: string;
  onBack?: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    action: 'any',
    status: 'any'
  });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await auditService.getLogs(filters);
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchLogs, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await auditService.exportLogs(format);
      alert(`${format.toUpperCase()} export successful`);
    } catch (e) {
      alert('Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
              showFilters ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Filter size={16} /> {t('audit.filters.toggle')}
          </button>
          <div className="relative group flex-1 md:flex-none">
             <button className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50">
               <Download size={16} /> {t('common.export')}
             </button>
             <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <FileText size={14} /> CSV Format
                </button>
                <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Globe size={14} /> JSON (Raw)
                </button>
             </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
           <div className="space-y-1">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('audit.filters.context')}</label>
             <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 value={filters.search}
                 onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                 placeholder="User, SN, IP..."
                 className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
               />
             </div>
           </div>
           <div className="space-y-1">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('audit.filters.actionType')}</label>
             <select 
               value={filters.action}
               onChange={e => setFilters(f => ({...f, action: e.target.value}))}
               className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none appearance-none cursor-pointer"
             >
               <option value="any">{t('audit.filters.anyAction')}</option>
               <option value="ONU Reboot">ONU Reboot</option>
               <option value="Modify VLAN">Modify VLAN</option>
               <option value="Change Speed Profile">Speed Profile</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('audit.filters.status')}</label>
             <select 
               value={filters.status}
               onChange={e => setFilters(f => ({...f, status: e.target.value}))}
               className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none appearance-none cursor-pointer"
             >
               <option value="any">{t('audit.filters.anyStatus')}</option>
               <option value="success">Success</option>
               <option value="failure">Failure</option>
             </select>
           </div>
           <div className="flex items-end">
             <button 
               onClick={() => setFilters({ search: '', action: 'any', status: 'any' })}
               className="w-full py-2 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors"
             >
               {t('audit.filters.clear')}
             </button>
           </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">{t('audit.table.status')}</th>
                  <th className="px-6 py-4">{t('audit.table.action')}</th>
                  <th className="px-6 py-4">{t('audit.table.context')}</th>
                  <th className="px-6 py-4">{t('audit.table.operator')}</th>
                  <th className="px-6 py-4">{t('audit.table.ip')}</th>
                  <th className="px-6 py-4">{t('audit.table.date')}</th>
                  <th className="px-6 py-4 text-right">{t('audit.table.details')}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                 <tr>
                    <td colSpan={7} className="py-20 text-center">
                       <Loader2 size={32} className="text-blue-600 animate-spin mx-auto mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.loading')}</p>
                    </td>
                 </tr>
               ) : logs.map(log => (
                 <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors group ${log.status === 'failure' ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          {log.status === 'success' ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{log.action}</span>
                          {log.onu_sn && (
                            <span className="text-[10px] font-mono font-bold text-blue-600">ONU: {log.onu_sn}</span>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {log.olt ? (
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{log.olt.name}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{log.olt.manufacturer} Infrastructure</span>
                         </div>
                       ) : (
                         <span className="text-[9px] font-black text-slate-300 uppercase italic">System Core</span>
                       )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <User size={14} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-900">{log.user.username}</span>
                             <span className="text-[9px] font-black text-blue-500 uppercase">{log.user.role}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <Globe size={12} className="text-slate-300" />
                          {log.ip}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Calendar size={12} className="text-slate-300" />
                          {log.timestamp}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => setSelectedEntry(log)}
                         className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                       >
                          <ChevronRight size={16} />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
           <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{t('audit.modal.title')}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('audit.modal.txId')}: {selectedEntry.id}</p>
                 </div>
                 <button onClick={() => setSelectedEntry(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                    <XCircle size={24} className="text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                 <div className={`p-5 rounded-3xl border flex items-center gap-4 ${
                   selectedEntry.status === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                 }`}>
                    {selectedEntry.status === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    <div>
                       <p className="text-sm font-black uppercase tracking-tighter">{t('common.status')}: {selectedEntry.status.toUpperCase()}</p>
                       {selectedEntry.errorMessage && <p className="text-xs font-bold opacity-70 mt-1">{selectedEntry.errorMessage}</p>}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Cpu size={14} /> {t('audit.modal.stateTrace')}
                    </div>
                    {selectedEntry.changes && selectedEntry.changes.length > 0 ? (
                       <div className="space-y-3">
                          {selectedEntry.changes.map((c, i) => (
                             <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Field: {c.field}</p>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <span className="text-[8px] font-black text-red-400 uppercase">{t('audit.modal.prev')}</span>
                                      <div className="bg-white p-2 rounded-lg border border-red-100 text-xs font-mono text-red-600 line-through truncate">{String(c.oldValue)}</div>
                                   </div>
                                   <div className="space-y-1">
                                      <span className="text-[8px] font-black text-green-500 uppercase">{t('audit.modal.new')}</span>
                                      <div className="bg-white p-2 rounded-lg border border-green-100 text-xs font-mono text-green-700 font-bold truncate">{String(c.newValue)}</div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{t('audit.modal.noChanges')}</p>
                       </div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Monitor size={14} /> {t('audit.modal.infraContext')}
                    </div>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                       <table className="w-full text-xs">
                          <tbody className="divide-y divide-slate-100">
                             <ContextRow label="OLT Device" value={selectedEntry.olt?.name || 'Global'} />
                             <ContextRow label="Manufacturer" value={selectedEntry.olt?.manufacturer || 'N/A'} />
                             <ContextRow label="Hardware Serial" value={selectedEntry.onu_sn || 'N/A'} />
                             <ContextRow label="Auth User" value={selectedEntry.user.username} />
                             <ContextRow label="Session IP" value={selectedEntry.ip} />
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                 <button 
                   onClick={() => setSelectedEntry(null)}
                   className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all"
                 >
                    {t('audit.modal.close')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ContextRow = ({ label, value }: { label: string, value: string }) => (
  <tr>
     <td className="px-4 py-3 bg-slate-50 font-black text-slate-400 uppercase text-[9px] tracking-widest w-1/3">{label}</td>
     <td className="px-4 py-3 font-bold text-slate-700">{value}</td>
  </tr>
);

export default HistoryView;
