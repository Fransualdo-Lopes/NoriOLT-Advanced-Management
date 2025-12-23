
import React, { useState, useEffect } from 'react';
import { 
  Save, X, Edit3, History, Globe, 
  ShieldCheck, Clock, CheckCircle2, AlertTriangle, Loader2 
} from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { SystemSettings } from '../../types';
import { settingsService } from '../../services/settingsService';
import HistoryView from './HistoryView';

type Mode = 'view' | 'edit' | 'history';

const GeneralTab: React.FC = () => {
  const { t, language } = useTranslation();
  const [mode, setMode] = useState<Mode>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [formData, setFormData] = useState<SystemSettings | null>(null);
  const [showToast, setShowToast] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sData = await settingsService.getSettings();
      setSettings(sData);
      setFormData(sData);
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
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={32} className="text-blue-600 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {showToast && (
        <div className="fixed top-24 right-6 z-[200] bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <CheckCircle2 size={20} />
          <span className="text-[11px] font-black uppercase tracking-widest">{t('settings.general.applied')}</span>
        </div>
      )}

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
            {mode === 'edit' ? <><X size={16} /> {t('common.cancel')}</> : <><Edit3 size={16} /> {t('settings.general.editBtn')}</>}
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
          {mode === 'history' ? <><X size={16} /> {t('common.back')}</> : <><History size={16} /> {t('settings.general.historyBtn')}</>}
        </button>
      </div>

      {mode === 'history' ? (
        <HistoryView language={language} onBack={() => setMode('view')} />
      ) : mode === 'edit' ? (
        <form onSubmit={handleSave} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200 space-y-8 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings.general.fields.title')} <span className="text-red-500">*</span></label>
              <input 
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings.general.fields.timezone')}</label>
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings.general.fields.allowedIps')}</label>
              <input 
                name="allowedIps"
                value={formData?.allowedIps}
                onChange={handleInputChange}
                placeholder="e.g. 192.168.1.0/24, 10.0.0.5"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings.general.fields.installerLimit')}</label>
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings.general.fields.language')}</label>
              <select 
                name="defaultLanguage"
                value={formData?.defaultLanguage}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm appearance-none"
              >
                <option value="English">English</option>
                <option value="Portuguese">Português (BR)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
             <button 
               type="button" 
               onClick={() => setMode('view')}
               className="px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all"
             >
               {t('common.cancel')}
             </button>
             <button 
               type="submit" 
               disabled={saving}
               className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
             >
               {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> {t('settings.general.saveBtn')}</>}
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
                <td className="px-6 py-4 text-slate-600">{t('settings.general.fields.title')}</td>
                <td className="px-6 py-4 font-bold text-slate-900 uppercase italic tracking-tighter">{settings?.title}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">{t('settings.general.fields.timezone')}</td>
                <td className="px-6 py-4 text-slate-500">{settings?.timezone}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">{t('settings.general.fields.allowedIps')}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{settings?.allowedIps}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">{t('settings.general.fields.installerLimit')}</td>
                <td className="px-6 py-4 font-black text-blue-600">{settings?.installerTimeLimitDays}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">{t('settings.general.fields.language')}</td>
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
