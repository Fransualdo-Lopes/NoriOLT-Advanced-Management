
import React, { useState } from 'react';
import { 
  Globe, LayoutGrid, Wand2, CheckCircle, BarChart2, Activity, 
  Bell, LogOut, Menu, X, ShieldCheck 
} from 'lucide-react';
import { ViewType } from '../types';
import { Language, translations } from '../translations';

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
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutGrid },
    { id: 'unconfigured', label: t.unconfigured, icon: Wand2 },
    { id: 'configured', label: t.configured, icon: CheckCircle },
    { id: 'graphs', label: t.graphs, icon: BarChart2 },
    { id: 'diagnostics', label: t.diagnostics, icon: Activity },
  ];

  const handleNavClick = (id: ViewType) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="bg-[#0f172a] text-white shadow-xl sticky top-0 z-50 overflow-hidden border-b border-blue-900/30">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => handleNavClick('dashboard')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Globe className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-black tracking-tighter italic transition-colors">
                Nori<span className="text-blue-400">OLT</span>
              </h1>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewType)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    activeView === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 EN
               </button>
               <button 
                 onClick={() => setLanguage('pt')}
                 className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 PT
               </button>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              <ShieldCheck size={12} />
              {t.level}
            </div>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </button>
            <div className="h-8 w-px bg-slate-800 mx-1 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold leading-tight">{t.admin}</p>
                <p className="text-[10px] text-slate-500 font-medium">{t.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="bg-slate-800 p-2 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <LogOut size={18} className="text-slate-400" />
              </button>
            </div>
            <button className="lg:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0f172a] border-t border-slate-800 p-4 space-y-2 animate-in slide-in-from-top duration-300">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleNavClick(item.id as ViewType)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeView === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 pb-12">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <span className="text-slate-900 font-black">NORI-OS</span>
               <span className="text-slate-300">V3.51.0</span>
             </div>
             <div className="flex items-center gap-1.5 text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
               <Activity size={10} /> ENGINE: ACTIVE
             </div>
           </div>
           <div className="text-center hidden lg:block text-slate-300">
             © 2025 NORI-OLT ADVANCED PLATFORMS. PRECISE NETWORK ENGINEERING.
           </div>
           <div className="flex items-center gap-6">
             <a href="#" className="text-slate-500 hover:text-blue-500 transition-colors">Provisioning API</a>
             <a href="#" className="text-slate-500 hover:text-blue-500 transition-colors">Documentation</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
