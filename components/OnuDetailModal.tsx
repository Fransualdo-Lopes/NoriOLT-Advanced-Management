
import React from 'react';
import { X, Cpu, Globe, Hash, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { ONU } from '../types';
import { Language, translations } from '../translations';

interface OnuDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onu: ONU | null;
  language: Language;
}

const OnuDetailModal: React.FC<OnuDetailModalProps> = ({ isOpen, onClose, onu, language }) => {
  if (!isOpen || !onu) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              onu.status === 'online' ? 'bg-green-600 shadow-green-600/20' : 'bg-red-600 shadow-red-600/20'
            }`}>
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase italic">{onu.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.onuDetails}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label={t.ipAddress} 
              value={onu.mgmt_ip || 'N/A'} 
              icon={<Globe size={16} className="text-blue-500" />} 
            />
            <InfoItem 
              label={t.macAddress} 
              value={onu.mac || 'N/A'} 
              icon={<Hash size={16} className="text-indigo-500" />} 
            />
            <InfoItem 
              label={t.serialNumber} 
              value={onu.sn} 
              icon={<ShieldCheck size={16} className="text-emerald-500" />} 
              mono
            />
            <InfoItem 
              label={t.configProfile} 
              value={onu.profile || 'N/A'} 
              icon={<Activity size={16} className="text-amber-500" />} 
            />
            <InfoItem 
              label={t.authDate} 
              value={onu.authDate || 'N/A'} 
              icon={<Calendar size={16} className="text-slate-500" />} 
            />
            <InfoItem 
              label={t.lastSeen} 
              value={onu.lastSeen || 'N/A'} 
              icon={<Activity size={16} className="text-slate-500" />} 
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.status}</span>
                <span className={`text-sm font-black uppercase italic ${onu.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  {onu.status}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.signal}</span>
                <span className={`text-sm font-black italic ${onu.signal > -22 ? 'text-green-600' : 'text-orange-600'}`}>
                  {onu.signal} dBm
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-[10px] font-black text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon, mono = false }: { label: string, value: string, icon: React.ReactNode, mono?: boolean }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-sm font-bold text-slate-800 truncate ${mono ? 'font-mono' : ''}`}>
      {value}
    </p>
  </div>
);

export default OnuDetailModal;
