"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Burgers', value: 32, color: '#22C55E' },
  { name: 'Pizza', value: 24, color: '#3b82f6' },
  { name: 'Asian', value: 18, color: '#f59e0b' },
  { name: 'Healthy', value: 12, color: '#8b5cf6' },
];

export function CategoryChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col justify-between">
      <h2 className="font-bold text-gray-900 tracking-tight mb-2">Pedidos por Categoría</h2>
      
      <div className="relative flex items-center justify-center h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* REPARADO: Distribución de filas limpias e idénticas al diseño original */}
      <div className="space-y-2.5 mt-4 px-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}