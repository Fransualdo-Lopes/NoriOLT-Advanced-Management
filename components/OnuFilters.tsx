
import React, { useState } from 'react';
import { 
  Search, Globe, FileOutput, 
  ChevronDown, ChevronUp, Zap, SlidersHorizontal, Settings2, Monitor, Wifi, Filter, Signal
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
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-3 sm:p-4 space-y-3 shadow-sm font-inter">
      {/* ROW 1: CORE FILTERS (Always Visible) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search</label>
          <div className="relative group">
            <input 
              type="text" 
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder="SN, IP, name, address, ph..." 
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-300" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex items-end gap-3">
          <FilterSelect label="OLT" name="olt_id" value={filters.olt_id} onChange={handleInputChange} options={['Any', 'PGM - Jetz', 'ULI - Jetz', 'DEU - Jetz']} />
          
          {/* Detailed Row 1 Extension (Only Advanced) */}
          {isAdvanced && (
            <>
              <FilterSelect label="Board" name="board" value={filters.board} onChange={handleInputChange} options={['Any', '0', '1', '2']} />
              <FilterSelect label="Port" name="port" value={filters.port} onChange={handleInputChange} options={['Any', '1', '2', '3', '4', '5']} />
            </>
          )}

          <FilterSelect label="Zone" name="zone" value={filters.zone} onChange={handleInputChange} options={['Any', 'CEO 001', 'CEO 009', 'CEO 092']} />
          
          {isAdvanced && (
            <>
              <FilterSelect label="ODB" name="odb" value={filters.odb} onChange={handleInputChange} options={['Any', 'None', 'ODB-01', 'ODB-02']} />
              <FilterSelect label="VLAN" name="vlan" value={filters.vlan} onChange={handleInputChange} options={['Any', '11', '100', '200']} />
            </>
          )}
        </div>
      </div>

      {/* ROW 2: MODES, STATUS & VIEW (Always Visible Part) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-end gap-3 flex-1">
          {isAdvanced && (
            <>
              <FilterSelect label="Onu Type" name="onu_type" value={filters.onu_type} onChange={handleInputChange} options={['Any', 'EG8010H', 'EG8145X6']} />
              <FilterSelect label="Profile" name="profile" value={filters.profile} onChange={handleInputChange} options={['Any', '100M', '300M', '600M']} />
              <FilterSelect label="Pon Type" name="pon_type" value={filters.pon_type} onChange={handleInputChange} options={['Any', 'GPON', 'EPON']} />
            </>
          )}

          {/* Status Pips - From Image */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <div className="flex items-center gap-1 bg-[#f8fafc] border border-slate-200 p-1 rounded-sm">
              <StatusPip color="bg-green-500" active={filters.status === 'online'} onClick={() => onFilterChange({status: 'online'})} icon={<Globe size={11} className="text-white"/>} />
              <StatusPip color="bg-slate-500" active={filters.status === 'offline'} onClick={() => onFilterChange({status: 'offline'})} icon={<Plug size={11} className="text-white"/>} />
              <StatusPip color="bg-red-400" active={filters.status === 'los'} onClick={() => onFilterChange({status: 'los'})} icon={<Zap size={11} className="text-white"/>} />
              <StatusPip color="bg-blue-500" active={false} icon={<Wifi size={11} className="text-white"/>} />
              <StatusPip color="bg-slate-800" active={false} icon={<Zap size={11} className="text-white"/>} />
            </div>
          </div>

          {/* Signal Level (Advanced Only) */}
          {isAdvanced && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Signal</label>
              <div className="flex items-center gap-1 bg-[#f8fafc] border border-slate-200 p-1 rounded-sm">
                 <button className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-sm"><Signal size={10} className="text-white" /></button>
                 <button className="w-6 h-6 flex items-center justify-center bg-yellow-500 rounded-sm opacity-50"><Signal size={10} className="text-white" /></button>
                 <button className="w-6 h-6 flex items-center justify-center bg-red-500 rounded-sm opacity-50"><Signal size={10} className="text-white" /></button>
              </div>
            </div>
          )}

          {/* B/R Toggle (Advanced Only) */}
          {isAdvanced && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">B / R</label>
              <div className="flex items-center gap-1 bg-[#f8fafc] border border-slate-200 p-1 rounded-sm">
                 <button className={`w-6 h-6 text-[10px] font-black rounded-sm ${filters.mode === 'Bridge' ? 'bg-slate-900 text-white' : 'text-slate-400'}`} onClick={() => onFilterChange({mode: 'Bridge'})}>B</button>
                 <button className={`w-6 h-6 text-[10px] font-black rounded-sm ${filters.mode === 'Router' ? 'bg-slate-900 text-white' : 'text-slate-400'}`} onClick={() => onFilterChange({mode: 'Router'})}>R</button>
              </div>
            </div>
          )}
        </div>

        {/* Action Toggles */}
        <div className="flex items-end gap-2">
          {/* View Toggles from Image */}
          <div className="flex items-center bg-[#f8fafc] border border-slate-200 p-1 rounded-sm">
             <button className="w-6 h-6 flex items-center justify-center text-slate-400"><Monitor size={12} /></button>
             <button className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-sm"><Monitor size={12} /></button>
          </div>

          <button 
            onClick={() => setIsAdvanced(!isAdvanced)}
            className={`h-[34px] flex items-center gap-2 px-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${isAdvanced ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {isAdvanced ? <ChevronUp size={14}/> : <Settings2 size={14}/>}
            {isAdvanced ? 'Collapse' : 'Detailed Filters'}
          </button>
        </div>
      </div>

      {/* ROW 3: DETAILED SERVICES (Only Advanced) */}
      {isAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
          <FilterSelect label="Mgmt IP" name="mgmt_ip" value={filters.mgmt_ip} onChange={handleInputChange} options={['Any', 'Static', 'DHCP']} />
          <FilterSelect label="TR-069" name="tr069" value={filters.tr069} onChange={handleInputChange} options={['Any', 'Enabled', 'Disabled']} />
          <FilterSelect label="VoIP" name="voip" value={filters.voip} onChange={handleInputChange} options={['Any', 'Active', 'Inactive']} />
          <FilterSelect label="CATV" name="catv" value={filters.catv} onChange={handleInputChange} options={['Any', 'Active', 'Inactive']} />
          <FilterSelect label="Download" name="download" value={filters.download} onChange={handleInputChange} options={['Any', 'Full', 'Limited']} />
          <FilterSelect label="Upload" name="upload" value={filters.upload} onChange={handleInputChange} options={['Any', 'Full', 'Limited']} />
          
          <div className="flex items-end">
            <button className="w-full h-[32px] flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-blue-700 text-white text-[10px] font-black rounded-sm shadow-sm uppercase tracking-widest transition-all">
              <FileOutput size={12} /> {t.export}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, name, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1 flex-1 min-w-[80px]">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>
    <select 
      name={name}
      value={value || 'any'}
      onChange={onChange}
      className="w-full bg-[#f8fafc] border border-slate-200 rounded-sm px-2 py-1.5 text-[11px] font-black text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer uppercase italic"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt === 'Any' ? 'any' : opt}>{opt.toUpperCase()}</option>
      ))}
    </select>
  </div>
);

const StatusPip = ({ color, active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-6 h-6 flex items-center justify-center rounded-sm transition-all border ${
      active ? 'ring-2 ring-blue-500/10 border-blue-600 ' + color : 'bg-slate-400 border-transparent opacity-100 hover:opacity-80'
    } ${active ? color : ''}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { className: 'text-white' })}
  </button>
);

// Local definition of Plug component
const Plug = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v8"></path>
    <path d="M18 8V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v4"></path>
    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
    <path d="M10 22v-2"></path>
    <path d="M14 22v-2"></path>
  </svg>
);

export default OnuFiltersBar;
