
import React, { useState } from 'react';
import { Save, X, PlusCircle, Server, Hash, Wifi, Settings2 } from 'lucide-react';
import { Language, translations } from '../translations';

interface ProvisioningFormProps {
  language: Language;
}

const ProvisioningForm: React.FC<ProvisioningFormProps> = ({ language }) => {
  const t = translations[language];
  const [formData, setFormData] = useState({
    olt: '',
    board: '',
    port: '',
    sn: '',
    name: '',
    mode: 'Router',
    vlan: '100',
    profile: '100M_PLAN'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('ONU Provisioned Successfully (Mock)');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlusCircle size={22} />
          <h2 className="text-lg font-bold">{t.newProvisioning}</h2>
        </div>
        <button className="text-white/80 hover:text-white"><X size={22} /></button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hardware Connection Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Server size={14} /> {t.hardwareLink}
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Select OLT</label>
              <select className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>PGM - Jetz Internet</option>
                <option>ULI - Jetz Internet</option>
                <option>DEU - Jetz Internet</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Board #</label>
                <input type="number" placeholder="0" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Port #</label>
                <input type="number" placeholder="1" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Serial Number (SN)</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="HWTCXXXXXXXX" 
                  className="w-full border border-gray-300 rounded pl-9 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Software Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Settings2 size={14} /> {t.logicServices}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Client Name / Description</label>
              <input type="text" placeholder="e.g. John Doe - Apt 402" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Network Mode</label>
                <select className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Router (PPPoE/DHCP)</option>
                  <option>Bridge (Transparent)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">VLAN ID</label>
                <input type="number" defaultValue="100" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Speed Profile</label>
              <select className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Residential_100M</option>
                <option>Residential_300M</option>
                <option>Residential_600M</option>
                <option>Business_Dedicated_1G</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded transition-colors">{t.cancel}</button>
          <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-md flex items-center gap-2 transition-transform active:scale-95">
            <Save size={18} /> {t.authorize}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProvisioningForm;
