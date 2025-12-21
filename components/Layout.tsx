
import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, LayoutGrid, Wand2, CheckCircle, BarChart2, Activity, 
  Bell, LogOut, Menu, X, Settings, ChevronDown, User as UserIcon
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { hasPermission } = useAuth();
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

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-inter">
      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 border-b border-blue-900/20 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand (Left) */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Globe size={18} />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tighter italic whitespace-nowrap">
              JETZ <span className="text-blue-400">INTERNET</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isSettingsOpen || activeView === 'settings' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Infrastructure</div>
                  {settingsOptions.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveView(opt.view as ViewType); setIsSettingsOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Top Actions (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:block p-1.5 text-slate-400 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400 shadow-inner">
                <UserIcon size={16} />
              </div>
              
              {/* Hamburger Menu - Now on the right after user icon */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <Menu size={24} />
              </button>

              <button 
                onClick={onLogout}
                className="hidden sm:flex p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-red-600/20 hover:text-red-400 transition-all group"
              >
                <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu (From Right) */}
      <aside className={`fixed inset-y-0 right-0 w-72 bg-[#0f172a] z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-black italic tracking-tighter">NAVIGATION</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SYSTEM CONFIG</h3>
              <div className="grid grid-cols-1 gap-1">
                {settingsOptions.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleNavClick(opt.view as ViewType)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all rounded-xl ${
                      activeView === 'settings' ? 'text-blue-400' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="pt-6 border-t border-slate-800/50 space-y-4">
            <div className="flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Language</span>
              <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded text-[10px] font-bold ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>EN</button>
                <button onClick={() => setLanguage('pt')} className={`px-3 py-1 rounded text-[10px] font-bold ${language === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>PT</button>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl text-sm font-bold transition-all"
            >
              <LogOut size={18} />
              Logout System
            </button>
          </div>
        </div>
      </aside>

      {/* Content Container */}
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
