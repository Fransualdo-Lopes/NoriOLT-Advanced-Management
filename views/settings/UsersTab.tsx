
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Users, Shield, History, RefreshCw, 
  Trash2, Edit3, ShieldAlert, CheckCircle2, Globe, Cpu, MoreVertical
} from 'lucide-react';
import { Language, translations } from '../../translations';
import { User, UserGroup, RestrictionGroup, AuditLog } from '../../types';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../roles';
import PermissionGate from '../../components/PermissionGate';

interface UsersTabProps {
  language: Language;
}

type SubView = 'users' | 'groups' | 'restrictions' | 'logs';

const UsersTab: React.FC<UsersTabProps> = ({ language }) => {
  const t = translations[language];
  const { hasPermission } = useAuth();
  const [activeSubView, setActiveSubView] = useState<SubView>('users');
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState<{
    users: User[];
    groups: UserGroup[];
    restrictions: RestrictionGroup[];
    logs: AuditLog[];
  }>({ users: [], groups: [], restrictions: [], logs: [] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [users, groups, restrictions, logs] = await Promise.all([
        userService.getUsers(),
        userService.getGroups(),
        userService.getRestrictions(),
        userService.getAuditLogs()
      ]);
      setData({ users, groups, restrictions, logs });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isAdmin = hasPermission(Permission.MANAGE_USERS);

  return (
    <div className="bg-white rounded-3xl overflow-hidden min-h-[600px] flex flex-col">
      {/* Toolbar - Multi-line Flex for Mobile (No Horizontal Scroll) */}
      <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
           <ToolbarBtn active={activeSubView === 'users'} onClick={() => setActiveSubView('users')} icon={<Users size={12}/>} label={t.users} />
           <ToolbarBtn active={activeSubView === 'groups'} onClick={() => setActiveSubView('groups')} icon={<Shield size={12}/>} label="Groups" />
           <ToolbarBtn active={activeSubView === 'restrictions'} onClick={() => setActiveSubView('restrictions')} icon={<ShieldAlert size={12}/>} label="Limits" />
           <ToolbarBtn active={activeSubView === 'logs'} onClick={() => setActiveSubView('logs')} icon={<History size={12}/>} label="Logs" />
        </div>

        <div className="flex items-center justify-between gap-2">
           <PermissionGate permission={Permission.MANAGE_USERS}>
              <button className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10">
                <UserPlus size={14} /> {t.createUser}
              </button>
           </PermissionGate>
           <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Syncing Access...</span>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
             {activeSubView === 'users' && <UsersList users={data.users} isAdmin={isAdmin} language={language} />}
             {activeSubView === 'groups' && <GroupsList groups={data.groups} isAdmin={isAdmin} language={language} />}
             {activeSubView === 'restrictions' && <RestrictionsList restrictions={data.restrictions} isAdmin={isAdmin} language={language} />}
             {activeSubView === 'logs' && <AuditLogsList logs={data.logs} language={language} />}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon} <span className="hidden xs:inline">{label}</span>
  </button>
);

const UsersList = ({ users, isAdmin, language }: any) => {
  const t = translations[language as Language];
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
             <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-4">{t.name}</th>
                <th className="py-4 px-4">{t.email}</th>
                <th className="py-4 px-4">{t.status}</th>
                {isAdmin && <th className="py-4 px-4 text-right">{t.actions}</th>}
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {users.map((user: User) => (
               <tr key={user.id} className="hover:bg-blue-50/10 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-600 italic">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg ${user.status === 'active' ? 'text-green-600 bg-green-50 border border-green-100' : 'text-slate-400 bg-slate-50 border border-slate-200'}`}>
                      {user.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-4 px-4 text-right">
                       <div className="flex justify-end gap-1">
                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><Edit3 size={14}/></button>
                         <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"><Trash2 size={14}/></button>
                       </div>
                    </td>
                  )}
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GroupsList = ({ groups, isAdmin, language }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((group: UserGroup) => (
        <div key={group.id} className="p-5 border border-slate-200 rounded-2xl hover:border-blue-500 transition-all bg-white shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Shield size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">{group.name}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.userCount} users</span>
                </div>
             </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mb-4 line-clamp-2">{group.description}</p>
          <div className="flex flex-wrap gap-1">
             {group.permissions.map(p => (
               <span key={p} className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{p}</span>
             ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const RestrictionsList = ({ restrictions, isAdmin, language }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {restrictions.map((res: RestrictionGroup) => (
        <div key={res.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-red-500 transition-all shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20"><ShieldAlert size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">{res.name}</h4>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Scope Applied</span>
                </div>
             </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Globe size={12} className="text-slate-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase">OLTs:</span>
               <div className="flex gap-1 flex-wrap">{res.allowedOlts.map(o => <span key={o} className="text-[8px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded-lg border border-slate-200">{o}</span>)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AuditLogsList = ({ logs, language }: any) => {
  const t = translations[language as Language];
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left min-w-[600px]">
        <thead className="bg-slate-50 border-b border-slate-200">
           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-4 px-4">{t.users}</th>
              <th className="py-4 px-4">Action</th>
              <th className="py-4 px-4">{t.timestamp}</th>
              <th className="py-4 px-4">{t.result}</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
           {logs.map((log: AuditLog) => (
             <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-xs font-bold text-slate-900">{log.userName}</td>
                <td className="py-4 px-4"><span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-lg uppercase tracking-widest">{log.action}</span></td>
                <td className="py-4 px-4 text-[10px] font-bold text-slate-400 italic">{log.timestamp}</td>
                <td className="py-4 px-4">
                  {log.result === 'success' ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <ShieldAlert size={16} className="text-red-500" />
                  )}
                </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTab;
