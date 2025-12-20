
import React from 'react';
import { 
  Search, Globe, Layers, Hash, Monitor, 
  Settings2, Download, Upload, FileOutput, 
  Wifi, Signal, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, List, LayoutGrid
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    onFilterChange({ page: newPage });
  };

  const lastPage = Math.max(1, Math.ceil(totalFound / (filters.limit || 100)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-3 font-inter">
      {/* Row 1: Search and Main Hardware Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 min-w-[200px] flex-1">
          <label className="text-[11px] font-bold text-slate-500">Search</label>
          <input 
            type="text" 
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder} 
            className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" 
          />
        </div>

        <FilterSelect label="OLT" name="olt_id" value={filters.olt_id} onChange={handleInputChange} options={['Any', 'PGM - Jetz', 'ULI - Jetz']} />
        <FilterSelect label="Board" name="board" value={filters.board} onChange={handleInputChange} options={['Any', '0', '1']} />
        <FilterSelect label="Port" name="port" value={filters.port} onChange={handleInputChange} options={['Any', '1', '2', '3']} />
        <FilterSelect label="Zone" name="zone" value={filters.zone} onChange={handleInputChange} options={['Any', 'CEO-001', 'CEO-092']} />
        <FilterSelect label="ODB" name="odb" value={filters.odb} onChange={handleInputChange} options={['Any', 'None', 'ODB-01']} />
        <FilterSelect label="VLAN" name="vlan" value={filters.vlan} onChange={handleInputChange} options={['Any', '11', '100']} />
      </div>

      {/* Row 2: Logic and Status Icons */}
      <div className="flex flex-wrap items-center gap-4">
        <FilterSelect label="ONU type" name="onu_type" value={filters.onu_type} onChange={handleInputChange} options={['Any', 'EG8010H', 'EG8145X6']} />
        <FilterSelect label="Profile" name="profile" value={filters.profile} onChange={handleInputChange} options={['Any', '300M_PLAN', '600M_PLAN']} />
        <FilterSelect label="PON type" name="pon_type" value={filters.pon_type} onChange={handleInputChange} options={['Any', 'GPON', 'EPON']} />

        <div className="flex items-center gap-3">
          <label className="text-[11px] font-bold text-slate-500">Status</label>
          <div className="flex items-center gap-1.5">
            <StatusIcon color="text-green-500" active={filters.status === 'online'} onClick={() => onFilterChange({status: 'online'})} icon={<Globe size={14}/>} />
            <StatusIcon color="text-slate-500" active={filters.status === 'offline'} onClick={() => onFilterChange({status: 'offline'})} icon={<Settings2 size={14}/>} />
            <StatusIcon color="text-red-500" active={filters.status === 'los'} onClick={() => onFilterChange({status: 'los'})} icon={<Wifi size={14}/>} />
            <StatusIcon color="text-blue-500" active={filters.status === 'na'} onClick={() => onFilterChange({status: 'na'})} icon={<Globe size={14}/>} />
            <StatusIcon color="text-slate-800" active={filters.status === 'dying'} onClick={() => onFilterChange({status: 'dying'})} icon={<Settings2 size={14}/>} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[11px] font-bold text-slate-500">Signal</label>
          <div className="flex items-center gap-1">
             <SignalBtn color="text-green-500" level={3} active={filters.signal_level === 'good'} onClick={() => onFilterChange({signal_level: 'good'})} />
             <SignalBtn color="text-orange-500" level={2} active={filters.signal_level === 'warning'} onClick={() => onFilterChange({signal_level: 'warning'})} />
             <SignalBtn color="text-red-500" level={1} active={filters.signal_level === 'critical'} onClick={() => onFilterChange({signal_level: 'critical'})} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50">B</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50">R</button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-blue-600"><List size={14}/></button>
          <button className="p-1.5 bg-blue-600 border border-blue-700 rounded text-white shadow-sm"><LayoutGrid size={14}/></button>
          <button className="p-1.5 text-blue-600"><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Row 3: Management and Export */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <FilterSelect label="Mgmt IP" name="mgmt_ip" value={filters.mgmt_ip} onChange={handleInputChange} options={['Any']} />
        <FilterSelect label="TR-069" name="tr069" value={filters.tr069} onChange={handleInputChange} options={['Any']} />
        <FilterSelect label="VoIP" name="voip" value={filters.voip} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
        <FilterSelect label="CATV" name="catv" value={filters.catv} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
        <FilterSelect label="Download" name="download" value={filters.download} onChange={handleInputChange} options={['Any']} />
        <FilterSelect label="Upload" name="upload" value={filters.upload} onChange={handleInputChange} options={['Any']} />

        <button className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-4 py-1.5 rounded shadow-sm transition-all">
          <FileOutput size={14} /> {t.export}
        </button>
      </div>

      {/* Pagination Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map(p => (
            <button 
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium border ${filters.page === p ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {p}
            </button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"><ChevronRight size={14}/></button>
          <button className="w-10 h-7 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-bold">&gt;&gt;</button>
        </div>
        
        <div className="text-[11px] font-bold text-slate-700 uppercase">
          1-100 ONUs of {totalFound.toLocaleString()} displayed
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, name, value, onChange, options }: any) => (
  <div className="flex items-center gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{label}</label>
    <select 
      name={name}
      value={value || 'Any'}
      onChange={onChange}
      className="bg-white border border-slate-200 rounded px-1 py-1 text-xs text-slate-700 outline-none focus:border-blue-500 min-w-[80px]"
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
    className={`p-1 rounded border transition-all ${active ? 'bg-blue-600 border-blue-700 text-white' : `bg-white border-slate-200 ${color} hover:bg-slate-50`}`}
  >
    {icon}
  </button>
);

const SignalBtn = ({ color, level, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-1 rounded border flex items-end gap-0.5 transition-all ${active ? 'bg-blue-600 border-blue-700 text-white' : `bg-white border-slate-200 ${color} hover:bg-slate-50`}`}
  >
    {[1, 2, 3].map(i => (
      <div key={i} className={`w-1 rounded-sm ${i <= level ? 'bg-current' : 'bg-slate-200'} ${i === 1 ? 'h-1.5' : i === 2 ? 'h-2.5' : 'h-3.5'}`} />
    ))}
  </button>
);

export default OnuFiltersBar;
