
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RefreshCw, Cpu, Globe, Hash, Activity, 
  ShieldCheck, Zap, Wifi, Signal, Network, Database, 
  Info, History, Clock, Thermometer, ZapOff, Trash2, Settings2, Loader2, CheckCircle2, AlertTriangle, Play
} from 'lucide-react';
import { OnuDetailed, AuditLogEntry } from '../types';
import { onuService } from '../services/onuService';
import { auditService } from '../services/auditService';
import { Language, translations } from '../translations';
import { Permission } from '../roles';
import PermissionGate from '../components/PermissionGate';
import ConfirmationModal from '../components/ConfirmationModal';

interface OnuDetailsViewProps {
  onuId: string;
  language: Language;
  onBack: () => void;
}

const OnuDetailsView: React.FC<OnuDetailsViewProps> = ({ onuId, language, onBack }) => {
  const t = translations[language];
  const [onu, setOnu] = useState<OnuDetailed | null>(null);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Action Modals
  const [activeModal, setActiveModal] = useState<'reboot' | 'resync' | 'factory' | 'disable' | 'delete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [details, auditLogs] = await Promise.all([
          onuService.getOnuById(onuId),
          auditService.getLogs({ search: onuId })
        ]);
        setOnu(details);
        setLogs(auditLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [onuId]);

  const handleLiveRefresh = async () => {
    setRefreshing(true);
    // Simulate OLT polling
    await new Promise(r => setTimeout(r, 2000));
    try {
      const details = await onuService.getOnuById(onuId);
      setOnu(details);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAction = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setActiveModal(null);
    handleLiveRefresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Querying OLT Cluster...</p>
      </div>
    );
  }

  if (!onu) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              onu.status === 'online' ? 'bg-green-600 shadow-green-600/20' : 'bg-red-600 shadow-red-600/20'
            }`}>
              <Cpu size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">{onu.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{onu.sn}</span>
                 <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                 <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${onu.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${onu.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {onu.status}
                 </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handleLiveRefresh}
             disabled={refreshing}
             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
           >
             {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
             {t.refresh}
           </button>
           <button className="hidden sm:flex p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-800 transition-all">
             <Settings2 size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: IDENTIFICATION & TOPOLOGY */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Card: Identity */}
          <SectionCard icon={<ShieldCheck size={18} className="text-emerald-500" />} title={t.identification}>
            <div className="grid grid-cols-1 gap-4">
               <InfoRow label={t.vendor} value={onu.vendor} />
               <InfoRow label={t.model} value={onu.model} />
               <InfoRow label={t.firmware} value={onu.firmware} />
               <InfoRow label={t.macAddress} value={onu.mac || 'N/A'} mono />
               <InfoRow label={t.authDate} value={onu.authDate || 'N/A'} />
               <InfoRow label={t.lastSeen} value={onu.lastSeen || 'N/A'} />
            </div>
          </SectionCard>

          {/* Card: Topology */}
          <SectionCard icon={<Network size={18} className="text-blue-500" />} title={t.networkTopology}>
            <div className="grid grid-cols-1 gap-4">
               <InfoRow label="OLT Device" value={onu.olt || 'N/A'} highlight />
               <InfoRow label="Interface" value={`${onu.frame}/${onu.slot}/${onu.port_id}`} highlight />
               <InfoRow label="ONU ID" value={String(onu.onu_index)} />
               <InfoRow label={t.zone} value={onu.zone || 'None'} />
               <InfoRow label={t.odb} value={onu.odb || 'None'} />
               <InfoRow label="IP MGMT" value={onu.mgmt_ip || 'N/A'} mono />
            </div>
          </SectionCard>

          {/* Card: Actions Tray - Updated to Light Theme */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
             <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-50 pb-2">
                <Zap size={14} className="fill-current" /> {t.onuActions}
             </h3>
             <div className="grid grid-cols-2 gap-3">
                <ActionBtn icon={<RefreshCw size={14}/>} label={t.reboot} color="bg-slate-50 border-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100" onClick={() => setActiveModal('reboot')} />
                <ActionBtn icon={<Database size={14}/>} label={t.resync} color="bg-slate-50 border-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100" onClick={() => setActiveModal('resync')} />
                <ActionBtn icon={<History size={14}/>} label={t.factoryReset} color="bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100" onClick={() => setActiveModal('factory')} />
                <ActionBtn 
                  icon={onu.status === 'offline' ? <Play size={14}/> : <ZapOff size={14}/>} 
                  label={onu.status === 'offline' ? t.enableOnu : t.disableOnu} 
                  color="bg-red-50 border-red-100 text-red-600 hover:bg-red-100" 
                  onClick={() => setActiveModal('disable')}
                />
             </div>
             <PermissionGate permission={Permission.DELETE_ONU}>
                <button 
                  onClick={() => setActiveModal('delete')}
                  className="w-full py-4 border-2 border-dashed border-red-200 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Decommission Hardware
                </button>
             </PermissionGate>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME METRICS & CONFIG */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Visual: Optical Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <SignalGauge label={t.rxPower} value={onu.rx_power} unit="dBm" />
             <SignalGauge label={t.txPower} value={onu.tx_power} unit="dBm" type="info" />
             <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <Clock size={12} /> {t.distance}
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter italic">
                   {(onu.distance / 1000).toFixed(2)} <span className="text-sm">km</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Thermometer size={12} className="text-orange-400" /> {onu.temperature}°C
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Zap size={12} className="text-blue-500" /> {onu.voltage}V
                   </div>
                </div>
             </div>
          </div>

          {/* Card: Service Config & Speed */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Activity size={18} className="text-blue-600" />
                   <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t.serviceConfig}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                  onu.mode === 'Router' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                }`}>
                  Mode: {onu.mode}
                </div>
             </div>
             <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="pb-3 px-2">ID</th>
                        <th className="pb-3 px-2">S-VLAN</th>
                        <th className="pb-3 px-2">C-VLAN</th>
                        <th className="pb-3 px-2">Download</th>
                        <th className="pb-3 px-2">Upload</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {onu.service_ports.map(port => (
                        <tr key={port.id} className="text-sm group">
                           <td className="py-4 px-2 font-mono text-[11px] text-blue-600 font-bold">{port.id}</td>
                           <td className="py-4 px-2 font-black text-slate-700">{port.svlan}</td>
                           <td className="py-4 px-2 font-black text-slate-700">{port.cvlan}</td>
                           <td className="py-4 px-2">
                             <div className="flex items-center gap-2">
                                <Activity size={12} className="text-green-500" />
                                <span className="font-bold text-slate-900">{port.download}</span>
                             </div>
                           </td>
                           <td className="py-4 px-2">
                             <div className="flex items-center gap-2">
                                <Activity size={12} className="text-blue-500" />
                                <span className="font-bold text-slate-900">{port.upload}</span>
                             </div>
                           </td>
                           <td className="py-4 px-2">
                             <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase border border-green-100">{port.status}</span>
                           </td>
                           <td className="py-4 px-2 text-right">
                              <button className="p-2 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100">
                                <Settings2 size={14} />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Card: Ethernet Ports */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                   <Network size={18} className="text-indigo-600" />
                   <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t.lanWifi}</h3>
                </div>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.ethernetPorts}</span>
                   <div className="grid grid-cols-1 gap-2">
                      {onu.ethernet_ports.map(port => (
                        <div key={port.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${port.status === 'Up' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-200 text-slate-400'}`}>
                                 <Network size={16} />
                              </div>
                              <div>
                                 <p className="text-[11px] font-black text-slate-900 uppercase">{port.label}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{port.speed}</p>
                              </div>
                           </div>
                           <span className={`text-[9px] font-black uppercase ${port.status === 'Up' ? 'text-green-600' : 'text-slate-400'}`}>
                              {port.status}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.wifiSsids}</span>
                   <div className="grid grid-cols-1 gap-2">
                      {onu.wifi_ssids.map(ssid => (
                        <div key={ssid.id} className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 space-y-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Wifi size={14} className="text-indigo-600" />
                                 <span className="text-xs font-black text-slate-800">{ssid.name}</span>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${ssid.status ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
                           </div>
                           <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                              <span className="bg-white px-2 py-0.5 rounded border border-indigo-100">{ssid.frequency}</span>
                              <span className="bg-white px-2 py-0.5 rounded border border-indigo-100">CH {ssid.channel}</span>
                              <span className="bg-white px-2 py-0.5 rounded border border-indigo-100">{ssid.security}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Operational Log Section */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center gap-3">
                <History size={18} className="text-slate-600" />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t.history}</h3>
             </div>
             <div className="max-h-60 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                   <tbody className="divide-y divide-slate-50">
                      {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {log.status === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-800 uppercase tracking-tighter">{log.action}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{log.user.username} • {log.ip}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 text-right">
                              <p className="text-[10px] font-bold text-slate-400">{log.timestamp}</p>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        onConfirm={handleAction}
        title={`Confirm ${activeModal}`}
        description={`Are you sure you want to proceed with this operation? The ONU might lose connectivity for a few moments.`}
        isLoading={isProcessing}
        variant={activeModal === 'delete' ? 'danger' : activeModal === 'factory' ? 'danger' : 'info'}
        confirmText={String(activeModal).toUpperCase()}
      />
    </div>
  );
};

const SectionCard = ({ icon, title, children }: any) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-50 pb-2">
        {icon} {title}
     </h3>
     {children}
  </div>
);

const InfoRow = ({ label, value, mono, highlight }: any) => (
  <div className="flex justify-between items-center group">
     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
     <span className={`text-[12px] font-bold truncate max-w-[200px] ${mono ? 'font-mono' : ''} ${highlight ? 'text-blue-600 font-black' : 'text-slate-800'}`}>
        {value}
     </span>
  </div>
);

const ActionBtn = ({ icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all shadow-sm active:scale-95 gap-2 border border-slate-200 ${color} hover:shadow-md`}
  >
    <div className="p-2 bg-white/40 rounded-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const SignalGauge = ({ label, value, unit, type = 'signal' }: any) => {
  const getStatusColor = () => {
    if (type === 'info') return 'text-blue-600 bg-blue-50 border-blue-100';
    if (value > -18) return 'text-green-600 bg-green-50 border-green-100';
    if (value > -24) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className={`rounded-3xl p-6 border shadow-sm flex flex-col gap-2 transition-all ${getStatusColor()}`}>
       <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-70">
          <Signal size={12} /> {label}
       </div>
       <div className="text-4xl font-black tracking-tighter italic">
          {value} <span className="text-sm font-bold uppercase">{unit}</span>
       </div>
    </div>
  );
};

export default OnuDetailsView;
