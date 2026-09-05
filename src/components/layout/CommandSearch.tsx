import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Cpu, AlertTriangle, AlertOctagon, ClipboardList, FileText, ArrowRight, User, KeyRound } from 'lucide-react';
import { Machine, Alert, Anomaly, MaintenanceWorkOrder, NavView } from '../../types';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  machines: Machine[];
  alerts: Alert[];
  anomalies: Anomaly[];
  workOrders: MaintenanceWorkOrder[];
  onSelectMachine: (machine: Machine) => void;
  onNavigate: (view: NavView) => void;
  onSelectAnomaly: (anomaly: Anomaly) => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({
  isOpen,
  onClose,
  machines,
  alerts,
  anomalies,
  workOrders,
  onSelectMachine,
  onNavigate,
  onSelectAnomaly,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredMachines = machines.filter(
    (m) =>
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.area.toLowerCase().includes(q)
  );

  const filteredAlerts = alerts.filter(
    (a) =>
      a.machineId.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.metric.toLowerCase().includes(q)
  );

  const filteredAnomalies = anomalies.filter(
    (anom) =>
      anom.machineId.toLowerCase().includes(q) ||
      anom.sensor.toLowerCase().includes(q) ||
      anom.detectedPattern.toLowerCase().includes(q)
  );

  const filteredWorkOrders = workOrders.filter(
    (wo) =>
      wo.id.toLowerCase().includes(q) ||
      wo.machineId.toLowerCase().includes(q) ||
      wo.issue.toLowerCase().includes(q) ||
      wo.technician.toLowerCase().includes(q)
  );

  return (
    <div
      id="command-search-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-50 dark:bg-[#0B0C0D]/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-[#24272A]">
          <Search className="w-5 h-5 text-slate-500 dark:text-[#8A929B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a machine (e.g. M-102), alert, anomaly, or maintenance ID..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-[#E1E4E6] placeholder:text-slate-500 dark:text-[#8A929B] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Machines Section */}
          {filteredMachines.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259]">
                Assets & Machines ({filteredMachines.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredMachines.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMachine(m);
                      onNavigate('machine-detail');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#E1E4E6] font-mono">
                          {m.id} <span className="font-sans font-normal text-slate-500 dark:text-[#8A929B]">— {m.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                          {m.area} · Health: {m.healthScore}/100
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomalies Section */}
          {filteredAnomalies.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259]">
                Anomalies ({filteredAnomalies.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    onClick={() => {
                      onSelectAnomaly(anom);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#E1E4E6]">
                          <span className="font-mono text-xs">{anom.machineId}</span> — {anom.sensor}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                          {anom.detectedPattern} (Observed: {anom.observedValue})
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 font-semibold rounded bg-red-500/15 text-red-400 border border-red-500/25">
                      Investigate
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {filteredAlerts.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259]">
                Alerts ({filteredAlerts.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      onNavigate('alert-center');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-[#E1E4E6]">
                          {alert.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B] font-mono">
                          {alert.timestamp} · Status: {alert.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Work Orders */}
          {filteredWorkOrders.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259]">
                Maintenance Tasks ({filteredWorkOrders.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    onClick={() => {
                      onNavigate('maintenance-log');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#E1E4E6]">
                          <span className="font-mono">{wo.id}</span>: {wo.issue}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                          {wo.machineId} · Assigned to {wo.technician} · {wo.scheduledDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System & Personnel Pages */}
          {(q.includes('prof') || q.includes('user') || q.includes('akun') || q.includes('edit') || q.includes('log') || q.includes('masuk') || !q) && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259]">
                System & Account Pages
              </div>
              <div className="space-y-1 mt-1">
                {(q.includes('prof') || q.includes('user') || q.includes('akun') || q.includes('edit') || !q) && (
                  <div
                    onClick={() => {
                      onNavigate('profile');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#E1E4E6]">
                          Profil Pengguna & Edit Akun
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                          Nama, tanggal lahir, jabatan, foto profil & preferensi SCADA
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6] group-hover:translate-x-0.5 transition-all" />
                  </div>
                )}

                {(q.includes('log') || q.includes('masuk') || q.includes('akun') || !q) && (
                  <div
                    onClick={() => {
                      onNavigate('login');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#E1E4E6]">
                          Halaman Login (Otorisasi SCADA)
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                          Ganti operator, sesi kredensial & otentikasi industri
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6] group-hover:translate-x-0.5 transition-all" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredMachines.length === 0 &&
            filteredAlerts.length === 0 &&
            filteredAnomalies.length === 0 &&
            filteredWorkOrders.length === 0 && (
              <div className="py-8 text-center text-slate-500 dark:text-[#8A929B]">
                <p className="text-xs">No matching assets, alerts, or work orders found for "{query}"</p>
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#0F1113] border-t border-slate-200 dark:border-[#24272A] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8A929B] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div className="text-slate-400 dark:text-[#4B5259]">MIND-4 Fast Index</div>
        </div>
      </div>
    </div>
  );
};
