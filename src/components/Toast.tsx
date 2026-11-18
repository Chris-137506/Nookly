'use client';

import React from 'react';
import { ToastMessage } from '@/types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-3">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200';
        let icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-white/95';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 bg-white/95';
          icon = <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200 bg-white/95';
          icon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-2.5 p-3 rounded-xl border ${borderClass} bg-white shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in-right`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h5>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.description}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
