
import React from 'react';
import { Search, Filter, Signal, Globe, Hash, Layers, Wifi, Monitor } from 'lucide-react';
import { Language, translations } from '../translations';
import { OnuFilters } from '../services/onuService';

interface OnuFiltersProps {
  language: Language;
  filters: OnuFilters;
  onFilterChange: (newFilters: Partial<OnuFilters>) => void;
  onClear: () => void;
  totalFound: number;
}

const OnuFiltersBar: React.FC<OnuFiltersProps> = ({ language, filters, onFilterChange, onClear, totalFound }) => {
  const t = translations[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  const handleStatusToggle = (status: string) => {
    onFilterChange({ status: filters.status === status ? 'any' : status, page: 1 });
  };

  const handleModeToggle = (mode: string) => {
    onFilterChange({ mode: filters.mode === mode ? 'any' : mode, page: 1 });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      {/* Search and Primary Actions */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" 
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
          {/* Status Selectors */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => handleStatusToggle('online')}
              title="Online"
              className={`p-2 rounded-lg transition-all ${filters.status === 'online' ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`w-3 h-3 rounded-full ${filters.status === 'online' ? 'bg-white' : 'bg-green-500'}`}></div>
            </button>
            <button 
              onClick={() => handleStatusToggle('offline')}
              title="Offline"
              className={`p-2 rounded-lg transition-all ${filters.status === 'offline' ? 'bg-slate-500 text-white shadow-md shadow-slate-500/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`w-3 h-3 rounded-full ${filters.status === 'offline' ? 'bg-white' : 'bg-slate-400'}`}></div>
            </button>
            <button 
              onClick={() => handleStatusToggle('los')}
              title="Signal Loss (LOS)"
              className={`p-2 rounded-lg transition-all ${filters.status === 'los' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Wifi size={14} className={filters.status === 'los' ? 'text-white' : 'text-red-500'} />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          {/* Mode Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => handleModeToggle('Bridge')}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${filters.mode === 'Bridge' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              B
            </button>
            <button 
              onClick={() => handleModeToggle('Router')}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${filters.mode === 'Router' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              R
            </button>
          </div>

          <button 
            onClick={onClear}
            className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
            title="Reset Filters"
          >
            <Filter size={18} />
          </button>

          <div className="flex items-center gap-2 ml-2 whitespace-nowrap">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
               {totalFound.toLocaleString()} {language === 'en' ? 'DEVICES FOUND' : 'DISPOSITIVOS'}
             </span>
          </div>
        </div>
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
        <FilterDropdown label="OLT" name="olt_id" value={filters.olt_id} onChange={handleInputChange} icon={<Globe size={12}/>} />
        <FilterDropdown label="BOARD" name="board" value={filters.board} onChange={handleInputChange} icon={<Layers size={12}/>} />
        <FilterDropdown label="PORT" name="port" value={filters.port} onChange={handleInputChange} icon={<Hash size={12}/>} />
        <FilterDropdown label="ZONE" name="zone" value={filters.zone} onChange={handleInputChange} icon={<Layers size={12}/>} />
        <FilterDropdown label="ODB" name="odb" value={filters.odb} onChange={handleInputChange} icon={<Hash size={12}/>} />
        <FilterDropdown label="VLAN" name="vlan" value={filters.vlan} onChange={handleInputChange} icon={<Layers size={12}/>} />
        <FilterDropdown label="ONU TYPE" name="onu_type" value={filters.onu_type} onChange={handleInputChange} icon={<Monitor size={12}/>} />
        <FilterDropdown label="PROFILE" name="profile" value={filters.profile} onChange={handleInputChange} icon={<Signal size={12}/>} />
        <FilterDropdown label="SIGNAL" name="signal_level" value={filters.signal_level} onChange={handleInputChange} icon={<Signal size={12}/>} />
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, name, value, onChange, icon }: { label: string, name: string, value: string | undefined, onChange: any, icon: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1">
      {icon} {label}
    </label>
    <select 
      name={name}
      value={value || 'any'}
      onChange={onChange}
      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
    >
      <option value="any">Any</option>
      {/* Mocking dynamic data for the dropdowns */}
      {name === 'olt_id' && (
        <>
          <option value="1">PGM - Jetz</option>
          <option value="2">ULI - Jetz</option>
          <option value="3">DEU - Jetz</option>
        </>
      )}
      {name === 'signal_level' && (
        <>
          <option value="weak">Weak (&lt; -25 dBm)</option>
          <option value="medium">Medium (-25 to -20 dBm)</option>
          <option value="strong">Strong (&gt; -20 dBm)</option>
        </>
      )}
    </select>
  </div>
);

export default OnuFiltersBar;
