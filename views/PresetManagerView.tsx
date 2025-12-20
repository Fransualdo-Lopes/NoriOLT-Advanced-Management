
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, RefreshCcw, Loader2, Database, Activity, Cpu, Settings2, Globe, Wifi, Monitor } from 'lucide-react';
import { presetService } from '../services/presetService';
import { ProvisioningPreset } from '../types';
import { Language, translations } from '../translations';
import PresetForm from '../components/PresetForm';
import ConfirmationModal from '../components/ConfirmationModal';

interface PresetManagerViewProps {
  language: Language;
}

const PresetManagerView: React.FC<PresetManagerViewProps> = ({ language }) => {
  const t = translations[language];
  const [presets, setPresets] = useState<ProvisioningPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ProvisioningPreset | undefined>(undefined);
  
  // Modals
  const [isDeleting, setIsDeleting] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<ProvisioningPreset | null>(null);

  const fetchPresets = async () => {
    setLoading(true);
    try {
      const data = await presetService.getPresets();
      setPresets(data);
    } catch (err) {
      console.error('Failed to fetch presets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const handleCreate = () => {
    setSelectedPreset(undefined);
    setIsEditing(true);
  };

  const handleEdit = (preset: ProvisioningPreset) => {
    setSelectedPreset(preset);
    setIsEditing(true);
  };

  const handleSave = async (data: Omit<ProvisioningPreset, 'id' | 'created_at'>) => {
    try {
      if (selectedPreset) {
        await presetService.updatePreset(selectedPreset.id, data);
      } else {
        await presetService.createPreset(data);
      }
      setIsEditing(false);
      fetchPresets();
    } catch (err) {
      alert('Error saving preset');
    }
  };

  const handleDeleteClick = (preset: ProvisioningPreset) => {
    setPresetToDelete(preset);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!presetToDelete) return;
    try {
      await presetService.deletePreset(presetToDelete.id);
      setIsDeleting(false);
      fetchPresets();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (isEditing) {
    return (
      <PresetForm 
        language={language}
        preset={selectedPreset}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Provisioning <span className="text-indigo-600">Presets</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Authorization Templates</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchPresets}
             className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm uppercase tracking-widest"
           >
             <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> {t.refresh}
           </button>
           <button 
             onClick={handleCreate}
             className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
           >
             <PlusCircle size={16} /> {t.createPreset}
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200">
          <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing NoriCore Storage...</p>
        </div>
      ) : presets.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-20 text-center flex flex-col items-center">
           <Database size={48} className="text-slate-100 mb-4" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.noPresets}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map(preset => (
            <div key={preset.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/10">
                    {preset.mode === 'Router' ? <Globe size={20} /> : <Activity size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm tracking-tight leading-tight">{preset.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                      {t.compatibleWith}: <span className="text-indigo-600">{preset.onu_type}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-6 relative z-10">
                <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed line-clamp-2">
                  {preset.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Line Profile</span>
                    <span className="text-[10px] font-bold text-slate-700 truncate block">{preset.line_profile}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Service Profile</span>
                    <span className="text-[10px] font-bold text-slate-700 truncate block">{preset.service_profile}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <FeatureBadge label={`VLAN ${preset.vlan}`} active />
                  <FeatureBadge label={preset.mode} active />
                  {preset.pppoe_enabled && <FeatureBadge label="PPPoE" />}
                  {preset.voip_enabled && <FeatureBadge label="VoIP" />}
                  {preset.tv_enabled && <FeatureBadge label="TV" />}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-[9px] font-bold text-slate-400 uppercase">ID: {preset.id}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(preset)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(preset)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal 
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={confirmDelete}
        title="Delete Preset"
        description="Are you sure you want to remove this provisioning preset? This action cannot be undone."
        confirmText="Exterminate"
        variant="danger"
      >
        {presetToDelete && (
          <div className="text-sm font-bold text-slate-800 uppercase italic tracking-tighter">
            {presetToDelete.name}
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

const FeatureBadge = ({ label, active = false }: { label: string, active?: boolean }) => (
  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
    active ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-500 border-slate-200'
  }`}>
    {label}
  </span>
);

export default PresetManagerView;
