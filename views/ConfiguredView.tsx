
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

const ConfiguredView: React.FC<ConfiguredViewProps> = ({ onAddOnu, language }) => {
  const t = translations[language];
  
  const [filters, setFilters] = useState<OnuFilters>(INITIAL_FILTERS);
  const [data, setData] = useState<OnuListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    setLoading(true);
    
    try {
      const response = await onuService.getOnus(filters);
      setData(response);
    } catch (err) {
      console.error('Failed to sync configured inventory', err);
    } finally {
      setLoading(false);
      setIsRefreshing(manual ? false : loading);
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

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
       {/* Advanced Filter Bar (Collapsible) */}
       <OnuFiltersBar 
         language={language}
         filters={filters}
         onFilterChange={handleFilterChange}
         onClear={clearFilters}
         totalFound={data?.total || 0}
       />
       
       {/* Consolidated Pagination Row - Positioned ABOVE table */}
       <div className="flex items-center justify-between px-1 bg-white border border-slate-200 rounded-sm p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
            SHOWING <span className="text-slate-900">{(filters.page - 1) * filters.limit + 1}-{Math.min(data?.total || 0, filters.page * filters.limit)}</span> OF <span className="text-slate-900">{data?.total || 0}</span> ONUS
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={filters.page === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronsLeft size={14} />
            </button>
            <button 
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-[11px] font-bold shadow-sm">
              {filters.page}
            </button>

            <button 
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= Math.ceil((data?.total || 0) / filters.limit)}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => handlePageChange(Math.ceil((data?.total || 0) / filters.limit))}
              disabled={filters.page >= Math.ceil((data?.total || 0) / filters.limit)}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
       </div>

       {/* Main Inventory Table */}
       <ConfiguredOnuTable 
         onus={data?.data || []}
         loading={loading}
         language={language}
       />
    </div>
  );
};

export default ConfiguredView;
