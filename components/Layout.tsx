
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
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] font-inter">
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-lg border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Globe size={20} />
            </div>
            <h1 className="text-lg font-black tracking-tighter italic whitespace-nowrap">
              JETZ <span className="text-blue-400">INTERNET</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`px-4 py-2 rounded text-sm font-bold transition-all ${
                  activeView === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all ${
                  isSettingsOpen || activeView === 'settings' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-200 rounded shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Infrastructure</div>
                  {settingsOptions.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveView(opt.view as ViewType); setIsSettingsOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:block p-2 text-slate-400 hover:text-white">
              <Bell size={18} />
            </button>

            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center border border-slate-700 text-slate-400">
              <UserIcon size={16} />
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <Menu size={24} />
            </button>

            <button 
              onClick={onLogout}
              className="hidden sm:flex p-2 bg-slate-800 rounded border border-slate-700 hover:bg-red-600/20 hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-in from RIGHT */}
      <aside className={`fixed inset-y-0 right-0 w-72 bg-[#0f172a] z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-black italic tracking-tighter uppercase">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${
                  activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}

            {/* Mobile Settings Section (New) */}
            <div className="pt-6 mt-4 border-t border-white/5">
              <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Settings size={14} /> {t.settings}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {settingsOptions.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleNavClick(opt.view as ViewType)}
                    className="w-full text-left px-8 py-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-400/10 rounded font-bold transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
