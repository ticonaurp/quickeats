"use client";

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export function StatCard({ label, value, icon: Icon, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center justify-between">
        {/* Contenedor del ícono */}
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      
      {/* Textos principales */}
      <div className="mt-4">
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}