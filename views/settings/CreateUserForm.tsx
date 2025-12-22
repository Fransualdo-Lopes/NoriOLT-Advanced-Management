
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, X, Shield, Lock, Globe, Mail, Phone, 
  User as UserIcon, ShieldAlert, CheckCircle2, 
  Eye, EyeOff, Save, Key, Network, AlertTriangle, Info
} from 'lucide-react';
import { Language, translations } from '../../translations';
import { UserCreationPayload, UserGroup, RestrictionGroup, UserPermissions } from '../../types';
import { userService } from '../../services/userService';

interface CreateUserFormProps {
  language: Language;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ language, onCancel, onSuccess }) => {
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Metadata
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [restrictions, setRestrictions] = useState<RestrictionGroup[]>([]);

  const [formData, setFormData] = useState<UserCreationPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    role: 'NOC',
    groups: [],
    restrictionGroupId: '',
    password: '',
    confirmPassword: '',
    language: language,
    forcePasswordChange: true,
    allowedIps: [],
    permissions: {
      viewDashboardStats: true,
      viewPaymentOptions: false,
      viewOnuCount: true,
      deleteOnus: false,
      batchOnuActions: false,
      receiveExpiringAlerts: true,
      receiveLoginIpAlerts: true
    }
  });

  const [allowedIpsInput, setAllowedIpsInput] = useState('');

  useEffect(() => {
    Promise.all([
      userService.getGroups(),
      userService.getRestrictions()
    ]).then(([gData, rData]) => {
      setGroups(gData);
      setRestrictions(rData);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('perm_')) {
        const permKey = name.replace('perm_', '') as keyof UserPermissions;
        setFormData(prev => ({
          ...prev,
          permissions: { ...prev.permissions!, [permKey]: checked }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => {
      const isSelected = prev.groups.includes(groupId);
      const newGroups = isSelected 
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId];
      
      // Auto-set role based on groups
      let role = prev.role;
      if (newGroups.includes('admins')) role = 'ADMIN';
      else if (newGroups.length > 0) role = 'NOC';
      
      return { ...prev, groups: newGroups, role };
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) return false;
    if (formData.password !== formData.confirmPassword) return false;
    if (formData.password && formData.password.length < 8) return false;
    if (formData.groups.length === 0) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        allowedIps: allowedIpsInput.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      await userService.createUser(payload);
      onSuccess();
    } catch (err) {
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const isValid = validateForm();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-8 pb-24 md:pb-0">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{t.createUser}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise RBAC Configuration</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* COLUMN 1: Basic Info & Security */}
          <div className="space-y-10">
            
            {/* Section: Basic Information */}
            <div className="space-y-4">
              <SectionHeader icon={<UserIcon size={14}/>} title="Basic Information" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label={t.firstName} name="firstName" value={formData.firstName} onChange={handleChange} required />
                <FormInput label={t.lastName} name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label={t.phone} name="phone" value={formData.phone} onChange={handleChange} />
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.language}</label>
                  <select 
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="en">English (US)</option>
                    <option value="pt">Português (BR)</option>
                  </select>
                </div>
              </div>
              <FormInput label={t.email} name="email" type="email" value={formData.email} onChange={handleChange} required helper="A confirmation link will be sent to this email address." />
              <FormInput label={t.username} name="username" value={formData.username} onChange={handleChange} required />
            </div>

            {/* Section: Authentication */}
            <div className="space-y-4">
              <SectionHeader icon={<Lock size={14}/>} title="Authentication & Network" />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FormInput label={t.password} name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-slate-400">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <FormInput label={t.confirmPassword} name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Security Policy</span>
                   <span className="text-[11px] font-bold text-slate-600">{t.forcePassChange}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="forcePasswordChange" checked={formData.forcePasswordChange} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.allowedIps}</label>
                <textarea 
                  value={allowedIpsInput}
                  onChange={(e) => setAllowedIpsInput(e.target.value)}
                  placeholder="e.g. 192.168.1.0/24, 10.0.0.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 outline-none focus:border-blue-500 transition-all min-h-[80px]"
                />
                <p className="text-[9px] font-bold text-slate-400 italic">Leave empty to allow access from anywhere.</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Group Membership & Restriction Scope */}
          <div className="space-y-10">
            
            {/* Section: Group Membership */}
            <div className="space-y-4">
              <SectionHeader icon={<Shield size={14}/>} title="Group Membership" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groups.map(group => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleGroupToggle(group.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all group relative ${
                      formData.groups.includes(group.id) 
                        ? 'bg-blue-600 border-blue-700 text-white shadow-lg' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${formData.groups.includes(group.id) ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                      <Shield size={14} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">{group.name}</h4>
                      <p className={`text-[9px] font-bold leading-tight mt-0.5 ${formData.groups.includes(group.id) ? 'text-blue-100' : 'text-slate-400'}`}>
                        {group.description}
                      </p>
                    </div>
                    {formData.groups.includes(group.id) && (
                      <CheckCircle2 size={12} className="absolute top-2 right-2 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Restriction Groups */}
            <div className="space-y-4">
              <SectionHeader icon={<ShieldAlert size={14}/>} title="Restriction Scope" />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Limit Scope To</label>
                <select 
                  name="restrictionGroupId"
                  value={formData.restrictionGroupId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500 transition-all italic"
                >
                  <option value="">{t.noRestrictions}</option>
                  {restrictions.map(res => (
                    <option key={res.id} value={res.id}>{res.name.toUpperCase()}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
                  <Info size={12} className="text-amber-600" />
                  <p className="text-[9px] font-bold text-amber-700 uppercase leading-tight">Restriction groups limit data scope (OLTs/Zones), not action rights.</p>
                </div>
              </div>
            </div>

            {/* Section: Fine-Grained Permissions */}
            <div className="space-y-4">
              <SectionHeader icon={<Network size={14}/>} title="Independent Permissions" />
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-50">
                <PermissionCheckbox name="perm_viewDashboardStats" label="Dashboard Statistics" description="Can view network health charts and real-time telemetry." checked={formData.permissions!.viewDashboardStats} onChange={handleChange} />
                <PermissionCheckbox name="perm_viewPaymentOptions" label="Payment & Billing" description="Access to billing history and subscription management." checked={formData.permissions!.viewPaymentOptions} onChange={handleChange} />
                <PermissionCheckbox name="perm_viewOnuCount" label="View ONU Totals" description="Can see high-level equipment counting across the cluster." checked={formData.permissions!.viewOnuCount} onChange={handleChange} />
                <PermissionCheckbox name="perm_deleteOnus" label="Delete Hardware" description="Authorized to decommission ONUs from the OLT." checked={formData.permissions!.deleteOnus} onChange={handleChange} />
                <PermissionCheckbox name="perm_batchOnuActions" label="Batch Operations" description="Execute actions on multiple ONUs simultaneously." checked={formData.permissions!.batchOnuActions} onChange={handleChange} />
                <PermissionCheckbox name="perm_receiveExpiringAlerts" label="Expiration Alerts" description="Notify via UI/Email when OLT licenses are near end." checked={formData.permissions!.receiveExpiringAlerts} onChange={handleChange} />
                <PermissionCheckbox name="perm_receiveLoginIpAlerts" label="Security Alerts" description="Alert when login occurs from an unrecognized IP address." checked={formData.permissions!.receiveLoginIpAlerts} onChange={handleChange} />
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons: Sticky on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex gap-3 md:relative md:bg-transparent md:border-none md:p-0 md:justify-end md:mt-12">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
          >
            {t.discardChanges}
          </button>
          <button 
            type="submit" 
            disabled={!isValid || loading}
            className="flex-1 md:flex-none px-12 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={16} /> {t.saveUser}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

// --- Helper Components ---

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
    <div className="text-blue-500">{icon}</div>
    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
  </div>
);

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, helper }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
      required={required}
    />
    {helper && <p className="text-[9px] font-bold text-slate-400 italic ml-1 leading-tight">{helper}</p>}
  </div>
);

const PermissionCheckbox = ({ name, label, description, checked, onChange }: any) => (
  <label className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="relative flex items-center pt-1">
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-5 h-5 bg-white border border-slate-200 rounded-lg transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
        {checked && <CheckCircle2 size={12} className="text-white" />}
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{label}</span>
      <p className="text-[9px] font-bold text-slate-400 leading-tight mt-0.5">{description}</p>
    </div>
  </label>
);

export default CreateUserForm;
