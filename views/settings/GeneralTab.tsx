
import React, { useState, useEffect } from 'react';
import { 
  Save, X, Edit3, History, Globe, 
  ShieldCheck, Clock, CheckCircle2, AlertTriangle, Loader2 
} from 'lucide-react';
import { Language, translations } from '../../translations';
import { SystemSettings, ConfigHistoryEntry } from '../../types';
import { settingsService } from '../../services/settingsService';

interface GeneralTabProps {
  language: Language;
}

type Mode = 'view' | 'edit' | 'history';

const GeneralTab: React.FC<GeneralTabProps> = ({ language }) => {
  const t = translations[language];
  const [mode, setMode] = useState<Mode>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [history, setHistory] = useState<ConfigHistoryEntry[]>([]);
  const [formData, setFormData] = useState<SystemSettings | null>(null);
  const [showToast, setShowToast] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, hData] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getHistory()
      ]);
      setSettings(sData);
      setFormData(sData);
      setHistory(hData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: name === 'installerTimeLimitDays' ? parseInt(value) || 0 : value
    }) : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setSaving(true);
    try {
      await settingsService.updateSettings(formData);
      setSettings(formData);
      setMode('view');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={32} className="text-blue-600 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronizing Global Parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[200] bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <CheckCircle2 size={20} />
          <span className="text-[11px] font-black uppercase tracking-widest">Settings Persistent & Applied</span>
        </div>
      )}

      {/* Mode Switches */}
      <div className="flex gap-3">
        {mode !== 'history' && (
          <button 
            onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
              mode === 'edit' 
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {mode === 'edit' ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit general settings</>}
          </button>
        )}
        
        <button 
          onClick={() => setMode(mode === 'history' ? 'view' : 'history')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
            mode === 'history' 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {mode === 'history' ? <><X size={16} /> Back to settings</> : <><History size={16} /> See history</>}
        </button>
      </div>

      {/* CONTENT AREA */}
      {mode === 'history' ? (
        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-2">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Change Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {history.map(entry => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{entry.timestamp}</td>
                    <td className="px-6 py-4 font-bold uppercase text-[11px] text-blue-600">{entry.userName}</td>
                    <td className="px-6 py-4">
                      {entry.changes.map((c, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-bold text-slate-500 uppercase">{c.field}:</span>{' '}
                          <span className="text-red-400 line-through opacity-50">{c.oldValue}</span>{' '}
                          <span className="text-green-500 font-bold">{c.newValue}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      ) : mode === 'edit' ? (
        <form onSubmit={handleSave} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200 space-y-8 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title <span className="text-red-500">*</span></label>
              <input 
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
              <select 
                name="timezone"
                value={formData?.timezone}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm appearance-none"
              >
                <option value="America/Belem">UTC-03:00 America/Belem</option>
                <option value="America/Sao_Paulo">UTC-03:00 America/Sao_Paulo</option>
                <option value="UTC">UTC Universal Time</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IPs Allowed to Access JETZOLT</label>
              <input 
                name="allowedIps"
                value={formData?.allowedIps}
                onChange={handleInputChange}
                placeholder="e.g. 192.168.1.0/24, 10.0.0.5"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
              />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5 ml-1">Supports CIDR notation and comma separated values.</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time limit for installers to see ONUs (days)</label>
              <input 
                name="installerTimeLimitDays"
                type="number"
                min="1"
                value={formData?.installerTimeLimitDays}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Language</label>
              <select 
                name="defaultLanguage"
                value={formData?.defaultLanguage}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm appearance-none"
              >
                <option value="English">English</option>
                <option value="Portuguese">Português (BR)</option>
                <option value="Spanish">Español</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
             <button 
               type="button" 
               onClick={() => setMode('view')}
               className="px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               disabled={saving}
               className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
             >
               {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
             </button>
          </div>
        </form>
      ) : (
        <div className="overflow-hidden border border-slate-100 rounded-lg shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">SETTING</th>
                <th className="px-6 py-4">VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              <tr>
                <td className="px-6 py-4 text-slate-600">Title</td>
                <td className="px-6 py-4 font-bold text-slate-900 uppercase italic tracking-tighter">{settings?.title}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">Timezone</td>
                <td className="px-6 py-4 text-slate-500">{settings?.timezone}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">IPs allowed to access JETZOLT</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{settings?.allowedIps}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">Time limit for installers to see ONUs (days)</td>
                <td className="px-6 py-4 font-black text-blue-600">{settings?.installerTimeLimitDays}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">Language</td>
                <td className="px-6 py-4 text-slate-500 font-bold">{settings?.defaultLanguage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeneralTab;
