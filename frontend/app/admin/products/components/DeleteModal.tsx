'use client';

import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onCancel, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
        {/* Círculo suave con ícono rojo */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        
        {/* Mensajes Traducidos */}
        <h3 className="font-bold text-gray-900 text-xl mb-2">¿Eliminar producto?</h3>
        <p className="text-sm text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
        
        {/* Botones de acción alineados con el diseño */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}