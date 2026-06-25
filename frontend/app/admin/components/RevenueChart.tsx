"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueDatum {
  month: string;
  revenue: number;
}

export function RevenueChart({ data, loading }: { data: RevenueDatum[]; loading?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-900 tracking-tight">Ingresos por mes</h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          Últimos 6 meses
        </span>
      </div>

      {loading ? (
        <div className="h-[240px] rounded-xl bg-gray-50 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f9fafb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => `S/ ${v}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
              formatter={(v: any) => [`S/ ${Number(v).toFixed(2)}`, 'Ingresos']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
