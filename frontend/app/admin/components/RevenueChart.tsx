"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Ene', revenue: 31000 },
  { month: 'Feb', revenue: 37000 },
  { month: 'Mar', revenue: 35000 },
  { month: 'Abr', revenue: 41000 },
  { month: 'May', revenue: 48000 },
  { month: 'Jun', revenue: 44000 },
];

export function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-900 tracking-tight">Vista General de Ingresos</h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Últimos 6 meses</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f9fafb" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
            formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Ingresos']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}