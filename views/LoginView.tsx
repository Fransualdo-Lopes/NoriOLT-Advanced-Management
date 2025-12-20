
import React, { useState, useEffect } from 'react';
import { Globe, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar credenciais salvas ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem('nori_remembered_user');
    const savedPass = localStorage.getItem('nori_remembered_pass');
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    } else {
      // Valores padrão para demonstração rápida
      setUsername('admin');
      setPassword('password');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Usar a função de login do contexto para atualizar o estado global do React
      await login({ username, password });
      
      // Lógica de "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem('nori_remembered_user', username);
        localStorage.setItem('nori_remembered_pass', password);
      } else {
        localStorage.removeItem('nori_remembered_user');
        localStorage.removeItem('nori_remembered_pass');
      }
      
      // Não é necessário chamar onLoginSuccess ou reload, o App.tsx vai re-renderizar automaticamente
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-inter">
      {/* Elementos de fundo abstratos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Globe className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Nori<span className="text-blue-400">OLT</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Advanced Management Platform</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Operator ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter operator username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-slate-950 border-slate-800 group-hover:border-slate-600'}`}>
                    {rememberMe && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remember Access</span>
              </label>
              
              <a href="#" className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
                Support
              </a>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
                <ShieldCheck size={14} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Establish Connection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Precision Engineering by Nori Platforms
          </p>
        </div>
      </div>
    </div>
  );
};

// Ícone interno para evitar erro de importação
const Check = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default LoginView;
