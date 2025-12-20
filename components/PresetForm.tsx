
import React, { useState } from 'react';
import { Save, X, Settings, Database, Activity, Globe, Wifi, Monitor, Phone, Tv } from 'lucide-react';
import { ProvisioningPreset, OnuMode } from '../types';
import { Language, translations } from '../translations';

interface PresetFormProps {
  language: Language;
  preset?: ProvisioningPreset;
  onSave: (data: Omit<ProvisioningPreset, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PresetForm: React.FC<PresetFormProps> = ({ language, preset, onSave, onCancel, isLoading }) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: preset?.name || '',
    onu_type: preset?.onu_type || 'ANY',
    line_profile: preset?.line_profile || '',
    service_profile: preset?.service_profile || '',
    vlan: preset?.vlan || 100,
    mode: preset?.mode || 'Bridge' as OnuMode,
    pppoe_enabled: preset?.pppoe_enabled || false,
    voip_enabled: preset?.voip_enabled || false,
    tv_enabled: preset?.tv_enabled || false,
    description: preset?.description || '',
    wifi_ssid_suffix: preset?.wifi_ssid_suffix || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'vlan' ? parseInt(value) || 0 : value)
    }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name as keyof typeof prev]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase italic">
              {preset ? t.editPreset : t.createPreset}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Provisioning Template</p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Base Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
              <Database size={16} className="text-indigo-500" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Base Identity</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Preset Display Name</label>
                <input 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. 600M HGU - Standard" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Compatibility (ONU Model)</label>
                <div className="relative">
                  <Monitor size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="onu_type"
                    type="text" 
                    value={formData.onu_type}
                    onChange={handleChange}
                    placeholder="e.g. EG8145X6 or ANY" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-black text-slate-700 uppercase outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Internal Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Notes about this configuration..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Logic & Services */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
              <Activity size={16} className="text-blue-500" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Network Logic</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">VLAN Tag</label>
                <input 
                  name="vlan"
                  type="number" 
                  value={formData.vlan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">L2/L3 Mode</label>
                <select 
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="Router">Router (L3)</option>
                  <option value="Bridge">Bridge (L2)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.lineProfile}</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="line_profile"
                    type="text" 
                    value={formData.line_profile}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.serviceProfile}</label>
                <div className="relative">
                  <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="service_profile"
                    type="text" 
                    value={formData.service_profile}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entitlements / Services</label>
              <div className="grid grid-cols-3 gap-3">
                <ServiceToggle 
                  active={formData.pppoe_enabled} 
                  onClick={() => handleToggle('pppoe_enabled')} 
                  label="PPPoE" 
                  icon={<Wifi size={14} />} 
                />
                <ServiceToggle 
                  active={formData.voip_enabled} 
                  onClick={() => handleToggle('voip_enabled')} 
                  label="VoIP" 
                  icon={<Phone size={14} />} 
                />
                <ServiceToggle 
                  active={formData.tv_enabled} 
                  onClick={() => handleToggle('tv_enabled')} 
                  label="TV/IPTV" 
                  icon={<Tv size={14} />} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-8 py-3.5 text-[11px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest"
        >
          {t.cancel}
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 uppercase tracking-widest disabled:opacity-50"
        >
          <Save size={18} /> {t.authorize}
        </button>
      </div>
    </form>
  );
};

const ServiceToggle = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black transition-all ${
      active ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
    }`}
  >
    {icon} {label}
  </button>
);

export default PresetForm;
