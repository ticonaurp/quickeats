"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryDatum {
  name: string;
  value: number; // número de pedidos en esa categoría
  color: string;
}

export function CategoryChart({ data, loading }: { data: CategoryDatum[]; loading?: boolean }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col justify-between">
      <h2 className="font-bold text-gray-900 tracking-tight mb-2">Pedidos por Categoría</h2>

      {loading ? (
        <div className="h-[260px] rounded-xl bg-gray-50 animate-pulse" />
      ) : total === 0 ? (
        <div className="flex-1 flex items-center justify-center h-[260px] text-sm text-gray-400 text-center px-4">
          Aún no hay pedidos para categorizar.
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any, n: any) => [`${v} pedido${Number(v) === 1 ? '' : 's'}`, n]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda con porcentaje real calculado sobre el total de pedidos */}
          <div className="space-y-2.5 mt-4 px-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-medium text-gray-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{Math.round((item.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
