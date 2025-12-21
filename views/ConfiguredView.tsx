
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ConfiguredOnuTable from '../components/ConfiguredOnuTable';
import OnuFiltersBar from '../components/OnuFilters';
import { Language, translations } from '../translations';
import { onuService, OnuFilters, OnuListResponse } from '../services/onuService';

interface ConfiguredViewProps {
  onAddOnu: () => void;
  language: Language;
}

const INITIAL_FILTERS: OnuFilters = {
  search: '',
  olt_id: 'any',
  status: 'any',
  mode: 'any',
  page: 1,
  limit: 100
};

const ConfiguredView: React.FC<ConfiguredViewProps> = ({ language }) => {
  const [filters, setFilters] = useState<OnuFilters>(INITIAL_FILTERS);
  const [data, setData] = useState<OnuListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await onuService.getOnus(filters);
      setData(response);
    } catch (err) {
      console.error('Inventory sync error', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters: Partial<OnuFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
       <OnuFiltersBar 
         language={language}
         filters={filters}
         onFilterChange={handleFilterChange}
         onClear={() => setFilters(INITIAL_FILTERS)}
         totalFound={data?.total || 0}
       />
       
       {/* Compact Pagination Integrated */}
       <div className="flex items-center justify-between px-2 py-2 bg-white border border-slate-200 rounded-sm shadow-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map(p => (
              <button 
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                  filters.page === p ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-600 border border-slate-200"><ChevronRight size={14} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-600 border border-slate-200"><ChevronsRight size={14} /></button>
          </div>
          
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
            <span className="text-slate-900">{(filters.page - 1) * filters.limit + 1}-{Math.min(data?.total || 0, filters.page * filters.limit)}</span> ONUs of <span className="text-slate-900">{data?.total || 0}</span> displayed
          </div>
       </div>

       <ConfiguredOnuTable 
         onus={data?.data || []}
         loading={loading}
         language={language}
       />
    </div>
  );
};

export default ConfiguredView;
