'use client';

interface FormCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function FormCard({ title, icon, children }: FormCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
        {icon && <span className="text-gray-400">{icon}</span>}
        {title}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}