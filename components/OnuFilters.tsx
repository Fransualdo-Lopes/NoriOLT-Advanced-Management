
import React from 'react';
import { 
  Search, Globe, Settings2, Download, Upload, FileOutput, 
  Wifi, ChevronRight, List, LayoutGrid, Plug, Eye, Zap, 
  ChevronsLeft, ChevronLeft, ChevronsRight
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

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-3 space-y-3 font-inter shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      {/* Row 1: Main Search and OLT Infrastructure */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 min-w-[240px] flex-1 max-w-sm">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Search</label>
          <div className="relative flex-1">
            <input 
              type="text" 
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder={t.searchPlaceholder} 
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] outline-none focus:border-blue-500 transition-colors" 
            />
          </div>
        </div>

        <FilterSelect label="OLT" name="olt_id" value={filters.olt_id} onChange={handleInputChange} options={['Any', 'PGM - Jetz', 'ULI - Jetz', 'DEU - Jetz']} />
        <FilterSelect label="Board" name="board" value={filters.board} onChange={handleInputChange} options={['Any', '0', '1', '2']} />
        <FilterSelect label="Port" name="port" value={filters.port} onChange={handleInputChange} options={['Any', '1', '2', '3', '4', '5', '6', '7', '8']} />
        <FilterSelect label="Zone" name="zone" value={filters.zone} onChange={handleInputChange} options={['Any', 'CEO 001', 'CEO 009', 'CEO 092']} />
        <FilterSelect label="ODB" name="odb" value={filters.odb} onChange={handleInputChange} options={['Any', 'None', 'ODB-01', 'ODB-02']} />
        <FilterSelect label="VLAN" name="vlan" value={filters.vlan} onChange={handleInputChange} options={['Any', '11', '100', '200', '1000']} />
      </div>

      {/* Row 2: Logic, Profiles, and Quick Status Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterSelect label="ONU type" name="onu_type" value={filters.onu_type} onChange={handleInputChange} options={['Any', 'EG8010H', 'EG8145X6', 'HG8245Q2']} />
          <FilterSelect label="Profile" name="profile" value={filters.profile} onChange={handleInputChange} options={['Any', '300M_PLAN', '600M_PLAN', '1G_DEDICATED']} />
          <FilterSelect label="PON type" name="pon_type" value={filters.pon_type} onChange={handleInputChange} options={['Any', 'GPON', 'EPON', 'XGS-PON']} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Status</label>
          <div className="flex items-center gap-1">
            <StatusIcon color="bg-green-500" active={filters.status === 'online'} onClick={() => onFilterChange({status: 'online'})} icon={<Globe size={12} className="text-white"/>} />
            <StatusIcon color="bg-slate-500" active={filters.status === 'offline'} onClick={() => onFilterChange({status: 'offline'})} icon={<Plug size={12} className="text-white"/>} />
            <StatusIcon color="bg-red-500" active={filters.status === 'los'} onClick={() => onFilterChange({status: 'los'})} icon={<Wifi size={12} className="text-white"/>} />
            <StatusIcon color="bg-blue-500" active={filters.status === 'maintenance'} onClick={() => onFilterChange({status: 'maintenance'})} icon={<Settings2 size={12} className="text-white"/>} />
            <StatusIcon color="bg-gray-800" active={filters.status === 'dying'} onClick={() => onFilterChange({status: 'dying'})} icon={<Zap size={12} className="text-white"/>} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Signal</label>
          <div className="flex items-center gap-1">
             <SignalBtn color="text-green-500" bars={3} active={filters.signal_level === 'good'} onClick={() => onFilterChange({signal_level: 'good'})} />
             <SignalBtn color="text-yellow-500" bars={2} active={filters.signal_level === 'warning'} onClick={() => onFilterChange({signal_level: 'warning'})} />
             <SignalBtn color="text-red-500" bars={1} active={filters.signal_level === 'critical'} onClick={() => onFilterChange({signal_level: 'critical'})} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 shadow-sm">B</button>
          <button className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 shadow-sm">R</button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button className="p-1.5 bg-white border border-slate-300 rounded text-slate-500 hover:bg-slate-50"><List size={14}/></button>
          <button className="p-1.5 bg-blue-600 border border-blue-700 rounded text-white shadow-sm"><LayoutGrid size={14}/></button>
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Row 3: Management IPs and Exports */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <FilterSelect label="Mgmt IP" name="mgmt_ip" value={filters.mgmt_ip} onChange={handleInputChange} options={['Any', '10.0.0.1', '172.16.0.1']} />
        <FilterSelect label="TR-069" name="tr069" value={filters.tr069} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
        <FilterSelect label="VoIP" name="voip" value={filters.voip} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
        <FilterSelect label="CATV" name="catv" value={filters.catv} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
        <FilterSelect label="Download" name="download" value={filters.download} onChange={handleInputChange} options={['Any', '100M', '300M', '600M', '1G']} />
        <FilterSelect label="Upload" name="upload" value={filters.upload} onChange={handleInputChange} options={['Any', '50M', '150M', '300M', '1G']} />

        <button className="ml-auto flex items-center gap-1.5 bg-[#1a73e8] hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm transition-all uppercase">
          <FileOutput size={12} /> {t.export}
        </button>
      </div>

      {/* Pagination Integration (bottom row of the filter area as per image) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map(p => (
            <button 
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded border text-[11px] font-bold transition-all ${
                filters.page === p 
                ? 'bg-slate-200 border-slate-400 text-slate-800' 
                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-300 text-slate-500 hover:bg-slate-50"><ChevronRight size={14}/></button>
          <button className="px-2 h-7 flex items-center justify-center rounded bg-white border border-slate-300 text-slate-500 hover:bg-slate-50 text-[10px] font-bold">{'>>'}</button>
        </div>
        
        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
          1-100 ONUs of <span className="text-slate-900">{totalFound.toLocaleString()}</span> displayed
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, name, value, onChange, options }: any) => (
  <div className="flex items-center gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-tighter">{label}</label>
    <select 
      name={name}
      value={value || 'Any'}
      onChange={onChange}
      className="bg-white border border-slate-300 rounded px-1 py-0.5 text-[11px] text-slate-800 outline-none focus:border-blue-500 min-w-[70px] cursor-pointer"
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
    className={`w-6 h-6 flex items-center justify-center rounded shadow-sm border transition-all ${
      active ? 'ring-2 ring-blue-400 border-blue-600 z-10' : 'border-slate-200 opacity-90'
    } ${color}`}
  >
    {icon}
  </button>
);

const SignalBtn = ({ color, bars, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-1 py-1 rounded border flex items-end gap-0.5 transition-all shadow-sm ${
      active ? 'bg-blue-600 border-blue-700' : 'bg-white border-slate-300 hover:bg-slate-50'
    }`}
  >
    {[1, 2, 3].map(i => (
      <div 
        key={i} 
        className={`w-1 rounded-sm ${i <= bars ? (active ? 'bg-white' : color.replace('text', 'bg')) : 'bg-slate-200'} ${
          i === 1 ? 'h-1.5' : i === 2 ? 'h-2.5' : 'h-3.5'
        }`} 
      />
    ))}
  </button>
);

export default OnuFiltersBar;
