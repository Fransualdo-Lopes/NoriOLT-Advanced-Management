
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { networkStatusData, authorizationsData } from '../data/mockData';

export const NetworkStatusChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span className="w-1 h-4 bg-green-500 rounded"></span> Daily Network Status
        </h3>
        <span className="text-[11px] text-gray-400">Real-time sampling</span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={networkStatusData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="online" stroke="#22c55e" fillOpacity={1} fill="url(#colorOnline)" strokeWidth={2} name="Online ONUs" />
            <Area type="monotone" dataKey="pwrFail" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} name="Power Fail" />
            <Area type="monotone" dataKey="los" stroke="#ef4444" fillOpacity={0} strokeWidth={2} name="Signal Loss" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Online ONUs: 6763</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Power Fail: 321</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Signal Loss: 13</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-400 rounded-sm"></div> N/A: 87</div>
      </div>
    </div>
  );
};

export const AuthorizationsChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded"></span> ONU Authorizations per Day
        </h3>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={authorizationsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
               cursor={{fill: '#f8fafc'}}
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Authorized ONUs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
