
import React, { useState, useEffect } from 'react';
import { Wand2, Database, WifiOff, SignalLow, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { statsService, DashboardStatsResponse, OnuStatsResponse } from '../services/statsService';
import { Language, translations } from '../translations';

interface DashboardStatsProps {
  language: Language;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ language }) => {
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashData, setDashData] = useState<DashboardStatsResponse | null>(null);
  const [onuData, setOnuData] = useState<OnuStatsResponse | null>(null);

  const fetchTelemetry = async () => {
    try {
      setError(null);
      // Fetch concurrent data streams from SmartOLT endpoints
      const [dash, onus] = await Promise.all([
        statsService.getDashboardStats(),
        statsService.getOnuStats()
      ]);
      setDashData(dash);
      setOnuData(onus);
    } catch (err) {
      setError('Telemetria indisponível. Verifique a conexão com a OLT.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    
    // Auto-refresh every 60 seconds as per requirements
    const interval = setInterval(fetchTelemetry, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 animate-pulse rounded shadow-sm"></div>
        ))}
      </div>
    );
  }

  if (error && !dashData) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-xl text-center flex flex-col items-center gap-3">
        <AlertCircle className="text-red-500" size={32} />
        <p className="text-red-700 font-bold">{error}</p>
        <button 
          onClick={fetchTelemetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-600/20"
        >
          <RefreshCw size={14} /> Tent Reestabelecer
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {/* Background refresh indicator */}
      {loading && (
        <div className="absolute -top-6 right-0 flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase animate-pulse">
          <RefreshCw size={10} className="animate-spin" /> Atualizando...
        </div>
      )}

      <DashboardCard 
        title={t.waitingAuth} 
        count={dashData?.waiting_auth || 0}
        bgColor="bg-[#00a6fb]"
        textColor="text-white"
        icon={<Wand2 size={24} />}
        subInfo={
          <>
            <span>Provisioning Engine: <span className="font-bold">READY</span></span>
          </>
        }
      />
      <DashboardCard 
        title={t.online} 
        count={dashData?.online_onus || 0}
        bgColor="bg-[#22c55e]"
        textColor="text-white"
        icon={<Database size={24} />}
        subInfo={<span>{t.totalAuthorized}: {dashData?.total_onus.toLocaleString()}</span>}
      />
      <DashboardCard 
        title={t.totalOffline} 
        count={dashData?.offline_onus || 0}
        bgColor="bg-[#334155]"
        textColor="text-white"
        icon={<WifiOff size={24} />}
        subInfo={
          <span>
            {t.pwrFail}: {onuData?.power_fail} {t.los}: {onuData?.los} N/A: {onuData?.na}
          </span>
        }
      />
      <DashboardCard 
        title={t.lowSignals} 
        count={(onuData?.low_signal_warning || 0) + (onuData?.low_signal_critical || 0)}
        bgColor="bg-[#f59e0b]"
        textColor="text-white"
        icon={<SignalLow size={24} />}
        subInfo={
          <span>
            {t.warning}: {onuData?.low_signal_warning} 
            <span className="ml-2">{t.critical}: {onuData?.low_signal_critical}</span>
          </span>
        }
      />
    </div>
  );
};

export default DashboardStats;
