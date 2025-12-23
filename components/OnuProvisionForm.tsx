
import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Info, Cpu } from 'lucide-react';
import { Language, translations } from '../translations';
import { oltService } from '../services/oltService';
import { provisioningService } from '../services/provisioningService';
import { presetService } from '../services/presetService';
import { OLT, OnuProvisionPayload, ProvisioningPreset, UnconfiguredONU } from '../types';

interface OnuProvisionFormProps {
  language: Language;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: UnconfiguredONU | null;
}

const OnuProvisionForm: React.FC<OnuProvisionFormProps> = ({ language, onCancel, onSuccess, initialData }) => {
  const t = translations[language];
  const [olts, setOlts] = useState<OLT[]>([]);
  const [presets, setPresets] = useState<ProvisioningPreset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    usePreset: false,
    presetId: '',
    olt_id: initialData?.olt_id || '',
    ponType: 'GPON',
    gponChannel: 'GPON',
    board: initialData?.board || 0,
    port: initialData?.port || 0,
    sn: initialData?.sn || '',
    onuType: initialData?.model || 'EG8010H',
    useCustomProfile: false,
    mode: 'Bridge',
    vlanId: '10',
    zone: 'CEO',
    odb: 'None',
    odbPort: 'None',
    downloadSpeed: '1G',
    uploadSpeed: '1G',
    name: '',
    addressComment: '',
    externalId: initialData?.sn || '',
    useGps: false
  });

  useEffect(() => {
    Promise.all([
      oltService.getOlts(),
      presetService.getPresets()
    ]).then(([oltData, presetData]) => {
      setOlts(oltData);
      setPresets(presetData);
      if (oltData.length > 0 && !formData.olt_id) {
        setFormData(prev => ({ ...prev, olt_id: oltData[0].id }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const payload: OnuProvisionPayload = {
        olt_id: formData.olt_id,
        board: Number(formData.board),
        port: Number(formData.port),
        sn: formData.sn,
        name: formData.name,
        mode: formData.mode as any,
        vlan: Number(formData.vlanId),
        profile: formData.downloadSpeed,
        preset_id: formData.usePreset ? formData.presetId : undefined
      };

      await provisioningService.provisionOnu(payload);
      setStatus('success');
      setTimeout(onSuccess, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-green-100 p-12 text-center w-full max-w-2xl mx-auto animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Save size={32} className="animate-bounce" />
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Authorization successful</h2>
        <p className="text-slate-500 text-sm mt-2">Hardware sync with OLT in progress.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl mx-auto overflow-hidden animate-in fade-in duration-500" style={{ colorScheme: 'light' }}>
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <Cpu size={20} />
          </div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{t.authorizeOnu}</h2>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-4">
        {/* Use Preset */}
        <FormRow label="Use Preset">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="usePreset" 
              checked={formData.usePreset} 
              onChange={handleChange} 
              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 accent-blue-600 transition-all cursor-pointer" 
            />
            <select 
              name="presetId" 
              value={formData.presetId} 
              onChange={handleChange} 
              disabled={!formData.usePreset}
              className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
            >
              <option value="">None</option>
              {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button type="button" className="p-1.5 bg-slate-400 text-white rounded hover:bg-slate-500 transition-all shadow-sm">
              <Plus size={16} />
            </button>
          </div>
        </FormRow>

        {/* OLT */}
        <FormRow label="OLT">
          <select 
            name="olt_id" 
            value={formData.olt_id} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            {olts.map(o => <option key={o.id} value={o.id}>{o.id} - {o.name}</option>)}
          </select>
        </FormRow>

        {/* PON type */}
        <FormRow label="PON type">
          <div className="flex items-center gap-6">
            <RadioOption label="GPON" name="ponType" value="GPON" current={formData.ponType} onChange={handleChange} />
            <RadioOption label="EPON" name="ponType" value="EPON" current={formData.ponType} onChange={handleChange} />
          </div>
        </FormRow>

        {/* GPON channel */}
        <FormRow label="GPON channel">
          <div className="flex items-center gap-6">
            <RadioOption label="GPON" name="gponChannel" value="GPON" current={formData.gponChannel} onChange={handleChange} />
            <RadioOption label="XG-PON" name="gponChannel" value="XG-PON" current={formData.gponChannel} onChange={handleChange} />
            <RadioOption label="XGS-PON" name="gponChannel" value="XGS-PON" current={formData.gponChannel} onChange={handleChange} />
          </div>
        </FormRow>

        {/* Board */}
        <FormRow label="Board">
          <input 
            type="number" 
            name="board" 
            value={formData.board} 
            onChange={handleChange} 
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all" 
          />
        </FormRow>

        {/* Port */}
        <FormRow label="Port">
          <input 
            type="number" 
            name="port" 
            value={formData.port} 
            onChange={handleChange} 
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all" 
          />
        </FormRow>

        {/* SN */}
        <FormRow label="SN">
          <input 
            type="text" 
            name="sn" 
            value={formData.sn} 
            onChange={handleChange} 
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm font-mono font-bold outline-none focus:border-blue-500 uppercase transition-all" 
          />
        </FormRow>

        {/* ONU type */}
        <FormRow label="ONU type">
          <select 
            name="onuType" 
            value={formData.onuType} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="EG8010H">EG8010H</option>
            <option value="EG8145X6">EG8145X6</option>
            <option value="HG8245Q2">HG8245Q2</option>
          </select>
        </FormRow>

        {/* Use custom profile */}
        <FormRow label="">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="useCustomProfile" 
              checked={formData.useCustomProfile} 
              onChange={handleChange} 
              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 accent-blue-600 transition-all cursor-pointer" 
            />
            <label className="text-[11px] font-medium text-slate-600 select-none">Use custom profile (For better compatibility with generic ONUs)</label>
          </div>
        </FormRow>

        {/* ONU mode */}
        <FormRow label="ONU mode">
          <div className="flex items-center gap-6">
            <RadioOption label="Bridging" name="mode" value="Bridge" current={formData.mode} onChange={handleChange} />
            <RadioOption label="Routing" name="mode" value="Router" current={formData.mode} onChange={handleChange} />
          </div>
        </FormRow>

        {/* User VLAN-ID */}
        <FormRow label="User VLAN-ID">
          <select 
            name="vlanId" 
            value={formData.vlanId} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="10">10 - ONUs Bridge Res</option>
            <option value="100">100 - Internet</option>
            <option value="200">200 - Management</option>
          </select>
        </FormRow>

        {/* Zone */}
        <FormRow label="Zone">
          <select 
            name="zone" 
            value={formData.zone} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="CEO">CEO</option>
            <option value="NORTH">North Zone</option>
            <option value="SOUTH">South Zone</option>
          </select>
        </FormRow>

        {/* ODB (Splitter) */}
        <FormRow label="ODB (Splitter)">
          <select 
            name="odb" 
            value={formData.odb} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="None">None</option>
            <option value="ODB-01">ODB-01</option>
            <option value="ODB-02">ODB-02</option>
          </select>
        </FormRow>

        {/* ODB port */}
        <FormRow label="ODB port">
          <select 
            name="odbPort" 
            value={formData.odbPort} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="None">None</option>
            <option value="1">Port 1</option>
            <option value="2">Port 2</option>
          </select>
        </FormRow>

        {/* Download speed */}
        <FormRow label="Download speed">
          <select 
            name="downloadSpeed" 
            value={formData.downloadSpeed} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="1G">1G</option>
            <option value="600M">600M</option>
            <option value="300M">300M</option>
          </select>
        </FormRow>

        {/* Upload speed */}
        <FormRow label="Upload speed">
          <select 
            name="uploadSpeed" 
            value={formData.uploadSpeed} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
          >
            <option value="1G">1G</option>
            <option value="600M">600M</option>
            <option value="300M">300M</option>
          </select>
        </FormRow>

        {/* Name */}
        <FormRow label="Name">
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all" 
          />
        </FormRow>

        {/* Address or comment */}
        <FormRow label="Address or comment">
          <input 
            type="text" 
            name="addressComment" 
            value={formData.addressComment} 
            onChange={handleChange} 
            placeholder="Address or comment (optional)" 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all" 
          />
        </FormRow>

        {/* ONU external ID */}
        <FormRow label="ONU external ID">
          <input 
            type="text" 
            name="externalId" 
            value={formData.externalId} 
            onChange={handleChange} 
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-500 transition-all" 
          />
        </FormRow>

        {/* Use GPS */}
        <FormRow label="">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="useGps" 
              checked={formData.useGps} 
              onChange={handleChange} 
              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 accent-blue-600 transition-all cursor-pointer" 
            />
            <label className="text-[11px] font-medium text-slate-600 select-none">Use GPS</label>
          </div>
        </FormRow>

        {/* Error Message */}
        {status === 'error' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
            <Info size={14} /> {errorMessage}
          </div>
        )}

        {/* Action Row */}
        <div className="pt-8 border-t border-slate-100 flex items-center gap-6 justify-start">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2 bg-[#22c55e] hover:bg-green-600 text-white rounded text-sm font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : <Save size={18} />}
            Save
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="text-blue-600 hover:underline text-sm font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center">
    <div className="w-full sm:w-1/3 mb-1 sm:mb-0">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight text-right block sm:pr-8">
        {label}
      </label>
    </div>
    <div className="w-full sm:w-2/3">
      {children}
    </div>
  </div>
);

const RadioOption = ({ label, name, value, current, onChange }: any) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <input 
      type="radio" 
      name={name} 
      value={value} 
      checked={current === value} 
      onChange={onChange}
      className="w-4 h-4 border-slate-300 bg-white text-blue-600 focus:ring-blue-500 accent-blue-600 transition-all cursor-pointer" 
    />
    <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight select-none">{label}</span>
  </label>
);

export default OnuProvisionForm;
