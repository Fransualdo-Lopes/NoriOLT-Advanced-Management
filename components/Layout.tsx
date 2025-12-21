
import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, LayoutGrid, Wand2, CheckCircle, BarChart2, Activity, 
  Bell, LogOut, Menu, X, ShieldCheck, User as UserIcon, Settings, ChevronDown
} from 'lucide-react';
import { ViewType } from '../types';
import { Language, translations } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../roles';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, language, setLanguage, onLogout }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { hasPermission, user } = useAuth();
  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutGrid, permission: null },
    { id: 'unconfigured', label: t.unconfigured, icon: Wand2, permission: Permission.VIEW_UNCONFIGURED },
    { id: 'configured', label: t.configured, icon: CheckCircle, permission: Permission.VIEW_CONFIGURED },
    { id: 'graphs', label: t.graphs, icon: BarChart2, permission: Permission.VIEW_OLT_STATS },
    { id: 'diagnostics', label: t.diagnostics, icon: Activity, permission: Permission.VIEW_OLT_STATS },
  ].filter(item => item.permission === null || hasPermission(item.permission as Permission));

  const settingsOptions = [
    { label: 'Zones', view: 'settings' },
    { label: 'ODBs', view: 'settings' },
    { label: 'ONU types', view: 'settings' },
    { label: 'Speed profiles', view: 'settings' },
    { label: 'OLTs', view: 'settings' },
    { label: 'VPN & TR069', view: 'settings' },
    { label: 'Authorization presets', view: 'presets' },
    { label: 'General', view: 'settings' },
    { label: 'Billing', view: 'settings' },
  ];

  const handleNavClick = (id: ViewType) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="bg-[#0f172a] text-white shadow-xl sticky top-0 z-50 overflow-hidden border-b border-blue-900/30">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => handleNavClick('dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                <Globe size={24} />
              </div>
              <h1 className="text-xl font-black tracking-tighter italic hidden sm:block">JETZ <span className="text-blue-400">INTERNET</span></h1>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewType)}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}

              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Settings size={16} /> {t.settings} <ChevronDown size={14} className={`transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSettingsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    {settingsOptions.map((opt, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleNavClick(opt.view as ViewType)}
                         className="w-full text-left px-5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                       >
                         {opt.label}
                       </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            <div className="flex items-center gap-0.5 bg-slate-800/50 rounded-md p-0.5 border border-slate-700">
               <button onClick={() => setLanguage('en')} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>EN</button>
               <button onClick={() => setLanguage('pt')} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${language === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>PT</button>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-white relative"><Bell size={20} /></button>
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400"><UserIcon size={18} /></div>
            <button onClick={onLogout} className="bg-slate-800 p-2 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
