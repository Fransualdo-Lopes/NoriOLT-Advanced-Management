
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Users, Shield, History, RefreshCw, 
  Trash2, Edit3, ShieldAlert, CheckCircle2, Globe, Cpu, MoreVertical,
  ChevronDown, LayoutGrid, ListFilter, ArrowLeft, ShieldPlus
} from 'lucide-react';
import { Language, translations } from '../../translations';
import { User, UserGroup, RestrictionGroup, AuditLog } from '../../types';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../roles';
import PermissionGate from '../../components/PermissionGate';
import CreateUserForm from './CreateUserForm';
import CreateGroupForm from './CreateGroupForm';

interface UsersTabProps {
  language: Language;
}

type SubView = 'users' | 'groups' | 'restrictions' | 'logs' | 'create' | 'create_group';

const UsersTab: React.FC<UsersTabProps> = ({ language }) => {
  const t = translations[language];
  const { hasPermission } = useAuth();
  const [activeSubView, setActiveSubView] = useState<SubView>('users');
  const [loading, setLoading] = useState(true);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
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

  const handleSubViewChange = (view: SubView) => {
    setActiveSubView(view);
    setIsNavExpanded(false);
  };

  if (activeSubView === 'create') {
    return (
      <CreateUserForm 
        language={language} 
        onCancel={() => setActiveSubView('users')}
        onSuccess={() => {
          setActiveSubView('users');
          fetchData();
        }}
      />
    );
  }

  if (activeSubView === 'create_group') {
    return (
      <CreateGroupForm 
        language={language} 
        onCancel={() => setActiveSubView('groups')}
        onSuccess={() => {
          setActiveSubView('groups');
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
      {/* Users Toolbar - Smart Mobile Navigation */}
      <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-col gap-2 flex-1">
          {isNavExpanded && (
            <span className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select View Mode</span>
          )}
          
          <div className="flex items-start gap-2">
            <div className={`flex items-center bg-white p-1 rounded-xl border border-slate-200 flex-1 transition-all duration-300 ${
              isNavExpanded ? 'flex-wrap gap-2' : 'overflow-x-auto scrollbar-hide'
            }`}>
               <ToolbarBtn active={activeSubView === 'users'} onClick={() => handleSubViewChange('users')} icon={<Users size={14}/>} label={t.users} fullWidth={isNavExpanded} />
               <ToolbarBtn active={activeSubView === 'groups'} onClick={() => handleSubViewChange('groups')} icon={<Shield size={14}/>} label={t.viewGroups} fullWidth={isNavExpanded} />
               <ToolbarBtn active={activeSubView === 'restrictions'} onClick={() => handleSubViewChange('restrictions')} icon={<ShieldAlert size={14}/>} label={t.viewRestrictions} fullWidth={isNavExpanded} />
               <ToolbarBtn active={activeSubView === 'logs'} onClick={() => handleSubViewChange('logs')} icon={<History size={14}/>} label={t.viewLogs} fullWidth={isNavExpanded} />
            </div>

            <button 
              onClick={() => setIsNavExpanded(!isNavExpanded)}
              className={`md:hidden p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center shrink-0 ${
                isNavExpanded ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {isNavExpanded ? <LayoutGrid size={18} /> : <ListFilter size={18} />}
            </button>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
           <PermissionGate permission={Permission.MANAGE_USERS}>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setActiveSubView(activeSubView === 'groups' ? 'create_group' : 'create')}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-transform active:scale-95"
                >
                  {activeSubView === 'groups' ? <ShieldPlus size={16} /> : <UserPlus size={16} />}
                  <span className="whitespace-nowrap">{activeSubView === 'groups' ? t.createGroup : t.createUser}</span>
                </button>
              </div>
           </PermissionGate>
           
           <div className="flex items-center gap-2">
             <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
             <button 
               onClick={fetchData} 
               className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:bg-slate-50"
               title={t.refresh}
             >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
           </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Authenticating Secure Access...</span>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
             {activeSubView === 'users' && <UsersList users={data.users} isAdmin={isAdmin} language={language} />}
             {activeSubView === 'groups' && <GroupsList groups={data.groups} isAdmin={isAdmin} language={language} onEditGroup={(g: UserGroup) => { console.log('Edit group', g); }} />}
             {activeSubView === 'restrictions' && <RestrictionsList restrictions={data.restrictions} isAdmin={isAdmin} language={language} />}
             {activeSubView === 'logs' && <AuditLogsList logs={data.logs} language={language} />}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarBtn = ({ active, onClick, icon, label, fullWidth }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
      fullWidth ? 'w-full justify-start border border-slate-100 mb-1' : 'shrink-0'
    } ${
      active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    <span className={active ? 'text-blue-400' : 'text-slate-400'}>{icon}</span>
    {label}
    {fullWidth && active && <CheckCircle2 size={12} className="ml-auto text-blue-400" />}
  </button>
);

const UsersList = ({ users, isAdmin, language }: any) => {
  const t = translations[language as Language];
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="border-b border-slate-100">
             <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-4 px-2">{t.name}</th>
                <th className="pb-4 px-2">{t.email}</th>
                <th className="pb-4 px-2">{t.assignedGroups}</th>
                <th className="pb-4 px-2">{t.status}</th>
                <th className="pb-4 px-2">Last Login</th>
                {isAdmin && <th className="pb-4 px-2 text-right">{t.actions}</th>}
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {users.map((user: User) => (
               <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-xs font-medium text-slate-600">{user.email}</td>
                  <td className="py-4 px-2">
                    <div className="flex gap-1 flex-wrap">
                      {user.groups.map(g => (
                        <span key={g} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded border border-slate-200">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${user.status === 'active' ? 'text-green-600 bg-green-50 border border-green-100' : 'text-slate-400 bg-slate-50 border border-slate-200'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">{user.lastLogin}</td>
                  {isAdmin && (
                    <td className="py-4 px-2 text-right">
                       <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 bg-white text-blue-600 rounded-lg border border-slate-200 shadow-sm active:scale-95"><Edit3 size={14}/></button>
                         <button className="p-2 bg-white text-red-600 rounded-lg border border-slate-200 shadow-sm active:scale-95"><Trash2 size={14}/></button>
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

const GroupsList = ({ groups, isAdmin, language, onEditGroup }: any) => {
  const t = translations[language as Language];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map((group: UserGroup) => (
        <div key={group.id} className="p-6 border border-slate-200 rounded-3xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group bg-white shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-indigo-50/50 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  group.groupType === 'admin' ? 'bg-slate-900 shadow-slate-900/10' : 
                  group.groupType === 'tech_users' ? 'bg-indigo-600 shadow-indigo-600/10' : 
                  group.groupType === 'support' ? 'bg-blue-500 shadow-blue-500/10' : 'bg-slate-500 shadow-slate-500/10'
                }`}>
                   <Shield size={22}/>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{group.name}</h4>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{group.userCount} Users Assigned</span>
                </div>
             </div>
             {isAdmin && (
               <button 
                 onClick={() => onEditGroup(group)}
                 className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
               >
                 <MoreVertical size={18}/>
               </button>
             )}
          </div>
          
          <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed relative z-10">{group.description}</p>
          
          <div className="mt-auto flex flex-wrap gap-1.5 relative z-10">
             {group.permissions.map(p => (
               <span key={p} className="text-[8px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                 {p.replace('.', ' • ')}
               </span>
             ))}
             {group.permissions.includes('*') && (
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                 Full Access Cluster
               </span>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

const RestrictionsList = ({ restrictions, isAdmin, language }: any) => {
  const t = translations[language as Language];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {restrictions.map((res: RestrictionGroup) => (
        <div key={res.id} className="p-5 border border-slate-200 rounded-2xl hover:border-red-300 transition-all group bg-slate-50/30">
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white"><ShieldAlert size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase italic tracking-tighter">{res.name}</h4>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Scope Limit Applied</span>
                </div>
             </div>
             {isAdmin && <button className="p-2 text-slate-300 hover:text-slate-600"><Edit3 size={16}/></button>}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
               <Globe size={12} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-500 uppercase">Allowed OLTs:</span>
               <div className="flex gap-1 overflow-x-auto scrollbar-hide">{res.allowedOlts.map(o => <span key={o} className="whitespace-nowrap text-[9px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">{o}</span>)}</div>
            </div>
            <div className="flex items-center gap-2">
               <Cpu size={12} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-500 uppercase">Allowed Actions:</span>
               <div className="flex gap-1">{res.allowedActions.map(a => <span key={a} className="text-[9px] font-black text-red-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 uppercase">{a}</span>)}</div>
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
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="border-b border-slate-100">
           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="pb-4 px-2">{t.users}</th>
              <th className="pb-4 px-2">Action</th>
              <th className="pb-4 px-2">{t.targetResource}</th>
              <th className="pb-4 px-2">{t.timestamp}</th>
              <th className="pb-4 px-2">{t.ipAddress}</th>
              <th className="pb-4 px-2">{t.result}</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
           {logs.map((log: AuditLog) => (
             <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-2 text-xs font-bold text-slate-900">{log.userName}</td>
                <td className="py-4 px-2"><span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-tighter">{log.action}</span></td>
                <td className="py-4 px-2 text-xs font-mono text-blue-600 truncate max-w-[200px]">{log.resource}</td>
                <td className="py-4 px-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-4 px-2 text-[10px] font-mono text-slate-500 whitespace-nowrap">{log.ip}</td>
                <td className="py-4 px-2">
                  {log.result === 'success' ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : (
                    <ShieldAlert size={14} className="text-red-500" />
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
