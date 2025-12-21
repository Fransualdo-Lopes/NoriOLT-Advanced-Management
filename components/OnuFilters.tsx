
import React, { useState } from 'react';
import { 
  Search, Globe, FileOutput, 
  ChevronDown, ChevronUp, List, LayoutGrid, Plug, Zap 
} from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  return (
    <div className="transition-all duration-300 bg-white border border-slate-200 rounded-xl p-3 sm:p-4 space-y-4 font-inter shadow-sm">
      {/* Search and Main Selects - Multi-line Flex */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input 
            type="text" 
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" 
          />
        </div>

        <div className="grid grid-cols-2 lg:flex gap-2">
          <FilterSelect label="OLT" name="olt_id" value={filters.olt_id} onChange={handleInputChange} options={['Any', 'PGM - Jetz', 'ULI - Jetz', 'DEU - Jetz']} />
          <FilterSelect label="Zone" name="zone" value={filters.zone} onChange={handleInputChange} options={['Any', 'CEO 001', 'CEO 009', 'CEO 092']} />
        </div>
      </div>

      {/* Tools and Secondary Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <div className="flex items-center gap-1.5">
              <StatusIcon color="bg-green-500" active={filters.status === 'online'} onClick={() => onFilterChange({status: 'online'})} icon={<Globe size={10} className="text-white"/>} />
              <StatusIcon color="bg-slate-500" active={filters.status === 'offline'} onClick={() => onFilterChange({status: 'offline'})} icon={<Plug size={10} className="text-white"/>} />
              <StatusIcon color="bg-red-500" active={filters.status === 'los'} onClick={() => onFilterChange({status: 'los'})} icon={<Zap size={10} className="text-white"/>} />
            </div>
          </div>

          <div className="flex flex-col gap-1 hidden xs:flex">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">View</label>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"><List size={14}/></button>
              <button className="p-1.5 bg-white border border-slate-300 rounded-lg text-blue-600 shadow-sm"><LayoutGrid size={14}/></button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${isExpanded ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          {isExpanded ? 'Fewer' : 'Filters'}
          {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>
      </div>

      {/* Advanced Filters Grid */}
      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <FilterSelect label="ONU Type" name="onu_type" value={filters.onu_type} onChange={handleInputChange} options={['Any', 'EG8010H', 'EG8145X6']} />
          <FilterSelect label="VLAN" name="vlan" value={filters.vlan} onChange={handleInputChange} options={['Any', '11', '100', '200']} />
          <FilterSelect label="Mode" name="mode" value={filters.mode} onChange={handleInputChange} options={['Any', 'Router', 'Bridge']} />
          
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-4 py-3 rounded-xl shadow-lg shadow-blue-600/10 transition-all uppercase tracking-widest">
              <FileOutput size={12} /> {t.export}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, name, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1 min-w-[100px] flex-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>
    <select 
      name={name}
      value={value || 'Any'}
      onChange={onChange}
      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer shadow-inner uppercase"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt === 'Any' ? 'any' : opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const StatusIcon = ({ color, active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-xl shadow-sm border transition-all ${
      active ? 'ring-4 ring-blue-500/10 border-blue-600 scale-105 z-10 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
    } ${color}`}
  >
    {icon}
  </button>
);

export default OnuFiltersBar;
