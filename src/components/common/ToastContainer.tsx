import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'critical' | 'info';
  title: string;
  message?: string;
}

export type ToastItem = ToastMessage;

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />,
          critical: <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-green-500/30 bg-white dark:bg-[#151719]',
          warning: 'border-amber-500/30 bg-white dark:bg-[#151719]',
          error: 'border-red-500/30 bg-white dark:bg-[#151719]',
          critical: 'border-red-500/50 bg-white dark:bg-[#151719]',
          info: 'border-blue-500/30 bg-white dark:bg-[#151719]',
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg flex items-start gap-3 transition-all ${borders[toast.type]}`}
          >
            <div className="pt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6]">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] p-0.5 cursor-pointer transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
