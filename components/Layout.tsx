
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-inter">
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 border-b border-blue-900/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Brand & Nav */}
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setActiveView('dashboard')}
            >
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h1 className="text-lg font-black tracking-tighter italic whitespace-nowrap">
                JETZ <span className="text-blue-400">INTERNET</span>
              </h1>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Tools, Settings, Lang, User */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  isSettingsOpen || activeView === 'settings' ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {settingsOptions.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveView(opt.view as ViewType); setIsSettingsOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Pill (Identical to reference) */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${language === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                PT
              </button>
            </div>

            <button className="p-1.5 text-slate-400 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400">
                <UserIcon size={16} />
              </div>
              <button 
                onClick={onLogout}
                className="p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-red-600/20 hover:text-red-400 transition-all group"
              >
                <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
              </button>
            </div>
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
