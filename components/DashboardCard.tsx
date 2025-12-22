
import React from 'react';

interface DashboardCardProps {
  title: string;
  count: number;
  subInfo: React.ReactNode;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, subInfo, icon, bgColor, textColor, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${bgColor} ${textColor} rounded shadow-sm flex flex-col overflow-hidden h-full border border-black/5 transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-95' : ''}`}
    >
      <div className="p-5 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[11px] font-black opacity-80 uppercase tracking-widest">{title}</span>
          <span className="text-5xl font-black mt-1 tracking-tighter">{count.toLocaleString()}</span>
        </div>
        <div className="w-12 h-12 bg-black/10 rounded flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="bg-black/10 px-5 py-3 text-[11px] font-bold flex justify-between items-center mt-auto">
        {subInfo}
      </div>
    </div>
  );
};

export default DashboardCard;
