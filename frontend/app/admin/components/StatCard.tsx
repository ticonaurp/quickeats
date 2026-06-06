import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export function StatCard({ label, value, change, icon: Icon, bgColor, iconColor }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
          isPositive ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}