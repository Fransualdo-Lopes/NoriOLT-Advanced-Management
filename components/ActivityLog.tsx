
import React, { useState, useEffect, useCallback } from 'react';
/* Added Activity to the imports from lucide-react */
import { Info, User, CheckCircle, Trash2, ChevronRight, AlertTriangle, ShieldAlert, RefreshCw, Loader2, Activity } from 'lucide-react';
import { ActivityEvent } from '../types';
import { alertService } from '../services/alertService';
import { Language, translations } from '../translations';

interface ActivityLogProps {
  language: Language;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ language }) => {
  const t = translations[language];
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllEvents = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [systemEvents, alarms, alerts] = await Promise.all([
        alertService.getEvents(),
        alertService.getAlarms(),
        alertService.getAlerts()
      ]);
      
      // Combine and sort by "priority" or "time" - for mock we just combine
      const combined = [...alerts, ...alarms, ...systemEvents];
      setEvents(combined);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
    
    // Auto-refresh events every 30 seconds
    const interval = setInterval(fetchAllEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchAllEvents]);

  const getIcon = (type: ActivityEvent['type'], message: string) => {
    if (type === 'error' || message.includes('deleted')) return < Trash2 size={16} className="text-red-500" />;
    if (type === 'warning') return <AlertTriangle size={16} className="text-orange-500" />;
    if (type === 'success' || message.includes('Imported')) return <CheckCircle size={16} className="text-green-500" />;
    if (type === 'info') return <ShieldAlert size={16} className="text-blue-500" />;
    return <User size={16} className="text-gray-500" />;
  };

  const getSeverityStyles = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'error': return 'bg-red-50/50 border-l-4 border-l-red-500';
      case 'warning': return 'bg-orange-50/50 border-l-4 border-l-orange-500';
      case 'success': return 'bg-green-50/50 border-l-4 border-l-green-500';
      case 'info': return 'bg-blue-50/50 border-l-4 border-l-blue-500';
      default: return 'bg-white border-l-4 border-l-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-800 rounded-lg text-blue-400">
            <Activity size={18} />
          </div>
          <h3 className="font-black text-[11px] text-white uppercase tracking-[0.2em]">{t.activityLog}</h3>
        </div>
        <button 
          onClick={fetchAllEvents}
          disabled={isRefreshing}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isRefreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-slate-50/30">
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="mx-auto text-blue-500 animate-spin" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Polling OLT Events...</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <div 
              key={`${event.id}-${idx}`} 
              className={`p-4 border-b border-slate-100 flex gap-4 transition-all hover:brightness-95 ${getSeverityStyles(event.type)}`}
            >
              <div className="mt-1 shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                {getIcon(event.type, event.message)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-[13px] text-slate-800 leading-snug font-bold tracking-tight">{event.message}</p>
                  <span className="text-[9px] font-black text-slate-400 uppercase whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-100">
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400 font-bold italic">{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="bg-white hover:bg-slate-50 text-blue-600 text-[10px] font-black py-4 border-t border-slate-100 uppercase tracking-widest flex items-center justify-center gap-2 transition-all group">
        {t.viewAllLogs} 
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ActivityLog;