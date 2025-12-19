
import React from 'react';

interface DashboardCardProps {
  title: string;
  count: number;
  subInfo: React.ReactNode;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, subInfo, icon, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded shadow-md flex flex-col overflow-hidden`}>
      <div className="p-4 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm font-semibold opacity-90 uppercase tracking-wider">{title}</span>
          <span className="text-4xl font-bold mt-1">{count.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="bg-black/5 p-3 text-xs font-medium flex justify-between items-center border-t border-black/5">
        {subInfo}
      </div>
    </div>
  );
};

export default DashboardCard;
