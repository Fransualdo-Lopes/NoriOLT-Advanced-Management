
import React, { useState } from 'react';
import { 
  Shield, X, Save, CheckCircle2, ChevronRight, 
  Settings, Server, Cpu, Activity, Layout, 
  Terminal, Globe, ShieldAlert, ListChecks, Zap
} from 'lucide-react';
import { Language, translations } from '../../translations';
import { UserGroup, GroupType } from '../../types';
import { userService } from '../../services/userService';

interface CreateGroupFormProps {
  language: Language;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: UserGroup;
}

const PERMISSION_STRUCTURE = [
  {
    category: "Main Menu Permissions",
    icon: <Layout size={16} />,
    permissions: [
      { id: "menu.unconfigured", label: "View Unconfigured ONUs" },
      { id: "menu.configured", label: "View Configured ONUs" },
      { id: "menu.graphs", label: "View Graphs" },
      { id: "menu.diagnostics", label: "View Diagnostics" },
      { id: "menu.auth_reports", label: "View Reports – Authorizations" },
      { id: "menu.export_reports", label: "View Reports – Export" },
      { id: "menu.save_config", label: "Save Config" }
    ]
  },
  {
    category: "OLT Permissions",
    icon: <Server size={16} />,
    permissions: [
      { id: "olt.view", label: "View OLTs" },
      { id: "olt.manage", label: "Manage OLTs (add / edit / delete)" },
      { id: "olt.cli", label: "OLT CLI access" },
      { id: "olt.history", label: "View OLT history" },
      { id: "olt.backups", label: "OLT config backups" },
      { id: "olt.detect_cards", label: "Detect new OLT cards" },
      { id: "olt.reboot_card", label: "Reboot OLT card" },
      { id: "olt.enable_pon", label: "Enable all PON ports" },
      { id: "olt.autofind", label: "Enable Autofind PON ports" },
      { id: "olt.reboot_pon_onus", label: "Reboot ONUs from PON port" },
      { id: "olt.resync_pon_onus", label: "Resync ONUs from PON port" },
      { id: "olt.config_pon", label: "Configure PON port" },
      { id: "olt.config_uplink", label: "Configure Uplink port" },
      { id: "olt.view_vlans", label: "View VLANs" },
      { id: "olt.manage_vlans", label: "Manage VLANs" },
      { id: "olt.view_mgmt_ips", label: "View ONU Management IPs" }
    ]
  },
  {
    category: "ONU Management Permissions",
    icon: <Cpu size={16} />,
    permissions: [
      { id: "onu.update_ips", label: "Update ONU Management and VoIP IP" },
      { id: "onu.config_speed", label: "Configure ONU speed profiles" },
      { id: "onu.config_eth", label: "Configure ONU ethernet ports" },
      { id: "onu.config_wifi", label: "Configure ONU Wi-Fi ports" },
      { id: "onu.config_iptv", label: "Configure ONU IPTV" },
      { id: "onu.config_services", label: "Configure ONU extra services" },
      { id: "onu.config_catv", label: "Configure ONU CATV" },
      { id: "onu.update_pass", label: "Change ONU web user password" },
      { id: "onu.reboot", label: "Reboot ONU" },
      { id: "onu.resync", label: "Resync ONU configuration" },
      { id: "onu.factory_default", label: "Restore ONU to factory defaults" },
      { id: "onu.enable_disable", label: "Enable / Disable ONU" },
      { id: "onu.view_presets", label: "View ONU Authorization Presets" },
      { id: "onu.manage_presets", label: "Manage ONU Authorization Presets" }
    ]
  },
  {
    category: "Settings Permissions",
    icon: <Settings size={16} />,
    permissions: [
      { id: "settings.view_zones", label: "View Zones" },
      { id: "settings.manage_zones", label: "Manage Zones" },
      { id: "settings.view_odbs", label: "View ODBs" },
      { id: "settings.manage_odbs", label: "Manage ODBs" },
      { id: "settings.view_onu_types", label: "View ONU Types" },
      { id: "settings.manage_onu_types", label: "Manage ONU Types" },
      { id: "settings.view_profiles", label: "View Speed Profiles" },
      { id: "settings.manage_profiles", label: "Manage Speed Profiles" },
      { id: "settings.view_general", label: "View General Settings" },
      { id: "settings.view_users", label: "View Users" },
      { id: "settings.view_api_keys", label: "View API Keys" },
      { id: "settings.view_billing", label: "View Billing" }
    ]
  },
  {
    category: "Tasks Permissions",
    icon: <Zap size={16} />,
    permissions: [
      { id: "tasks.auto_actions", label: "Auto actions" }
    ]
  }
];

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ language, onCancel, onSuccess, initialData }) => {
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    groupType: initialData?.groupType || 'tech_users' as GroupType,
    permissions: initialData?.permissions || [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const toggleAll = (select: boolean) => {
    if (select) {
      const allIds = PERMISSION_STRUCTURE.flatMap(cat => cat.permissions.map(p => p.id));
      setFormData(prev => ({ ...prev, permissions: allIds }));
    } else {
      setFormData(prev => ({ ...prev, permissions: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      await userService.createGroup(formData);
      onSuccess();
    } catch (err) {
      alert('Error creating group');
    } finally {
      setLoading(false);
    }
  };

  const allSelected = formData.permissions.length === PERMISSION_STRUCTURE.flatMap(cat => cat.permissions.map(p => p.id)).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                {initialData ? 'Edit User Group' : t.createGroup}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISP Permission Profile & RBAC Policy</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.groupName} <span className="text-red-500">*</span></label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. NOC Level 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.groupType}</label>
                  <select 
                    name="groupType"
                    value={formData.groupType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="admin">Admin</option>
                    <option value="tech_users">Tech Users</option>
                    <option value="support">Support</option>
                    <option value="read_only">Read Only</option>
                  </select>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.description}</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none"
                  placeholder="Optional context for this group..."
                />
             </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={20} className="text-indigo-600" />
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Privilege Summary</h4>
             </div>
             <p className="text-[11px] font-medium text-indigo-700 leading-relaxed">
               This profile will grant access to <span className="font-black underline">{formData.permissions.length}</span> specific hardware and software functions across the OLT network.
             </p>
             <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 bg-white rounded-full overflow-hidden border border-indigo-200">
                   <div 
                     className="h-full bg-indigo-600 transition-all duration-500" 
                     style={{ width: `${(formData.permissions.length / PERMISSION_STRUCTURE.flatMap(c => c.permissions).length) * 100}%` }}
                   ></div>
                </div>
                <span className="text-[10px] font-black text-indigo-600">{Math.round((formData.permissions.length / PERMISSION_STRUCTURE.flatMap(c => c.permissions).length) * 100)}%</span>
             </div>
          </div>
        </div>

        {/* Permissions Gating */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-900/10">
            <div className="flex items-center gap-3">
               <ListChecks size={20} className="text-blue-400" />
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Granular Rights Management</h3>
            </div>
            <button 
              type="button"
              onClick={() => toggleAll(!allSelected)}
              className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
            >
              {allSelected ? 'Deselect All' : t.selectAll}
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}>
                {allSelected && <CheckCircle2 size={12} className="text-white" />}
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PERMISSION_STRUCTURE.map((section, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
                   <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
                     {section.icon}
                   </div>
                   <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{section.category}</h4>
                </div>
                <div className="p-4 grid grid-cols-1 gap-1">
                   {section.permissions.map(perm => (
                     <label 
                       key={perm.id} 
                       className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                         formData.permissions.includes(perm.id) ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-500'
                       }`}
                     >
                       <input 
                         type="checkbox" 
                         className="sr-only"
                         checked={formData.permissions.includes(perm.id)}
                         onChange={() => togglePermission(perm.id)}
                       />
                       <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${
                         formData.permissions.includes(perm.id) ? 'bg-indigo-600 border-indigo-700' : 'bg-white border-slate-200'
                       }`}>
                         {formData.permissions.includes(perm.id) && <CheckCircle2 size={14} className="text-white" />}
                       </div>
                       <span className="text-[11px] font-bold tracking-tight">{perm.label}</span>
                     </label>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex gap-3 md:relative md:bg-transparent md:border-none md:p-0 md:justify-end md:mt-12">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
          >
            {t.cancel}
          </button>
          <button 
            type="submit" 
            disabled={!formData.name || loading}
            className="flex-1 md:flex-none px-12 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={16} /> {t.saveGroup}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;
