
import React, { useState, useEffect } from 'react';
import { Save, X, Server, Hash, Settings2, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { Language, translations } from '../translations';
import { oltService } from '../services/oltService';
import { provisioningService } from '../services/provisioningService';
import { presetService } from '../services/presetService';
import { OLT, OnuProvisionPayload, ProvisioningPreset } from '../types';

interface OnuProvisionFormProps {
  language: Language;
  onCancel: () => void;
  onSuccess: () => void;
  initialSn?: string; // For auto-fill from unconfigured view
}

const OnuProvisionForm: React.FC<OnuProvisionFormProps> = ({ language, onCancel, onSuccess, initialSn }) => {
  const t = translations[language];
  const [olts, setOlts] = useState<OLT[]>([]);
  const [presets, setPresets] = useState<ProvisioningPreset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<OnuProvisionPayload>({
    olt_id: '',
    board: 0,
    port: 0,
    sn: initialSn || '',
    name: '',
    mode: 'Router',
    vlan: 100,
    profile: 'Residential_100M'
  });

  useEffect(() => {
    Promise.all([
      oltService.getOlts(),
      presetService.getPresets()
    ]).then(([oltData, presetData]) => {
      setOlts(oltData);
      setPresets(presetData);
      if (oltData.length > 0) {
        setFormData(prev => ({ ...prev, olt_id: oltData[0].id }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'board' || name === 'port' || name === 'vlan' ? parseInt(value) || 0 : value
    }));
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      mode: preset.mode,
      vlan: preset.vlan,
      profile: preset.service_profile, // Mapping service profile to the profile field for simplicity in mock
      preset_id: presetId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.sn.match(/^[A-Z0-9]{12}$/)) {
      setErrorMessage('Invalid Serial Number. Must be 12 alphanumeric characters.');
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await provisioningService.provisionOnu(formData);
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'OLT Synchronization failed.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-12 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={40} className="animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">ONU Authorized Successfully</h2>
        <p className="text-slate-500">The hardware is now syncing with the OLT. Redirecting to inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl mx-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase italic">{t.newProvisioning}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nori-Engine v3.5 Secure Provisioning</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="bg-blue-50/50 p-4 border-b border-blue-100/30 flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest whitespace-nowrap">
          <Zap size={14} className="fill-current" /> {t.applyPreset}:
        </div>
        <select 
          onChange={(e) => applyPreset(e.target.value)}
          className="bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all flex-1 md:flex-none md:min-w-[200px]"
          defaultValue=""
        >
          <option value="" disabled>Choose a template...</option>
          {presets.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Hardware Connection Section */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <Server size={14} /> {t.hardwareLink}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select OLT Target</label>
                <select 
                  name="olt_id"
                  value={formData.olt_id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none"
                >
                  {olts.map(olt => (
                    <option key={olt.id} value={olt.id}>{olt.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Board Index</label>
                  <input 
                    name="board"
                    type="number" 
                    value={formData.board}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Port Index</label>
                  <input 
                    name="port"
                    type="number" 
                    value={formData.port}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Hardware Serial (SN)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    name="sn"
                    type="text" 
                    value={formData.sn}
                    onChange={handleChange}
                    placeholder="e.g. HWTC9D70C5B4" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-mono font-black text-blue-600 uppercase outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Software Configuration Section */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <Settings2 size={14} /> {t.logicServices}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subscriber Identity</label>
                <input 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Wick - Apt 402" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Operational Mode</label>
                  <select 
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="Router">Router (PPPoE)</option>
                    <option value="Bridge">Bridge (Transparent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">VLAN Tag</label>
                  <input 
                    name="vlan"
                    type="number" 
                    value={formData.vlan}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Traffic Profile</label>
                <select 
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="Residential_100M">Residential 100M</option>
                  <option value="Residential_300M">Residential 300M</option>
                  <option value="Residential_600M">Residential 600M</option>
                  <option value="Business_Dedicated_1G">Business Dedicated 1G</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div className="mt-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 text-red-600 animate-in slide-in-from-top-2">
            <AlertTriangle size={24} className="shrink-0" />
            <div className="text-xs font-bold uppercase tracking-tight">
              Provisioning Error: <span className="text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-8 py-3.5 text-[11px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-[0.2em]"
          >
            {t.cancel}
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-10 py-3.5 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Synchronizing...
              </>
            ) : (
              <>
                <Save size={18} /> {t.authorize}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnuProvisionForm;
