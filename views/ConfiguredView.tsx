
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, PlusCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ConfiguredOnuTable from '../components/ConfiguredOnuTable';
import OnuFiltersBar from '../components/OnuFilters';
import { Language, translations } from '../translations';
import { onuService, OnuFilters, OnuListResponse } from '../services/onuService';
import { ONU } from '../types';

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
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
       {/* Header Section */}
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              {t.configured} <span className="text-blue-600">Inventory</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized GPON Units Fleet</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
             <button 
               onClick={() => fetchData(true)}
               disabled={isRefreshing}
               className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest"
             >
               <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} /> {t.refresh}
             </button>
             <button 
               onClick={onAddOnu} 
               className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest"
             >
               <PlusCircle size={16} /> {t.addOnu}
             </button>
          </div>
       </div>

       {/* Advanced Filter Bar */}
       <OnuFiltersBar 
         language={language}
         filters={filters}
         onFilterChange={handleFilterChange}
         onClear={clearFilters}
         totalFound={data?.total || 0}
       />
       
       {/* Pagination Top */}
       <Pagination 
         language={language}
         current={filters.page}
         total={data?.total || 0}
         limit={filters.limit}
         onPageChange={handlePageChange}
       />

       {/* Main Table */}
       <ConfiguredOnuTable 
         onus={data?.data || []}
         loading={loading}
         language={language}
       />

       {/* Pagination Bottom */}
       <Pagination 
         language={language}
         current={filters.page}
         total={data?.total || 0}
         limit={filters.limit}
         onPageChange={handlePageChange}
       />
    </div>
  );
};

const Pagination = ({ language, current, total, limit, onPageChange }: any) => {
  const lastPage = Math.max(1, Math.ceil(total / limit));
  const startIdx = total === 0 ? 0 : (current - 1) * limit + 1;
  const endIdx = Math.min(total, current * limit);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-xl">
        Showing <span className="text-slate-900">{startIdx}-{endIdx}</span> of <span className="text-slate-900">{total}</span> ONUs
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(1)}
          disabled={current === 1}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronsLeft size={16} />
        </button>
        <button 
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex gap-1 px-2">
          {[...Array(Math.min(5, lastPage))].map((_, i) => {
             // Basic pagination window logic
             let pageNum = i + 1;
             if (lastPage > 5 && current > 3) {
               pageNum = current - 2 + i;
               if (pageNum > lastPage) pageNum = lastPage - (4 - i);
             }
             if (pageNum <= 0) return null;
             if (pageNum > lastPage) return null;

             return (
               <button 
                 key={pageNum}
                 onClick={() => onPageChange(pageNum)}
                 className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                   current === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                 }`}
               >
                 {pageNum}
               </button>
             );
          })}
        </div>

        <button 
          onClick={() => onPageChange(current + 1)}
          disabled={current === lastPage}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronRight size={16} />
        </button>
        <button 
          onClick={() => onPageChange(lastPage)}
          disabled={current === lastPage}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ConfiguredView;
