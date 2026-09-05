import React, { useState } from 'react';
import {
  History,
  Download,
  Calendar,
  Filter,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
} from 'lucide-react';
import { TimelineEvent, Machine } from '../../types';

interface MachineHistoryViewProps {
  events: TimelineEvent[];
  machines: Machine[];
  selectedMachine: Machine;
  onSelectMachine: (machine: Machine) => void;
  onExportHistory: () => void;
}

export const MachineHistoryView: React.FC<MachineHistoryViewProps> = ({
  events,
  machines,
  selectedMachine,
  onSelectMachine,
  onExportHistory,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  if (machines.length === 0 || !selectedMachine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <History className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Aset</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Belum ada mesin yang terdeteksi dari koneksi MQTT untuk melihat riwayat aktivitas.
        </p>
      </div>
    );
  }

  const filteredEvents = events.filter((e) => {
    if (e.machineId !== selectedMachine.id) return false;
    if (selectedType !== 'all' && e.eventType !== selectedType) return false;
    return true;
  });

  return (
    <div id="machine-history-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Machine Lifecycle & Engineering History
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            Immutable chronological timeline of work orders, failures, anomalies, calibrations, and sensor excursions
          </p>
        </div>

        <button
          onClick={onExportHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B]" />
          Export Timeline Audit
        </button>
      </div>

      {/* Selector & Filter Bar */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">Machine Asset:</span>
          <select
            value={selectedMachine.id}
            onChange={(e) => {
              const m = machines.find((item) => item.id === e.target.value);
              if (m) onSelectMachine(m);
            }}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-mono font-semibold focus:outline-none focus:border-blue-500"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">Event Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Event Types</option>
            <option value="maintenance">Maintenance</option>
            <option value="failure">Failure / Breach</option>
            <option value="anomaly">Anomaly</option>
            <option value="inspection">Inspection</option>
            <option value="calibration">Sensor Calibration</option>
            <option value="replacement">Part Replacement</option>
            <option value="downtime">Downtime</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="p-6 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-[#24272A]">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] font-mono">
            {selectedMachine.id} Lifecycle Log ({filteredEvents.length} records)
          </h3>
          <span className="text-xs text-slate-500 dark:text-[#8A929B]">
            Commissioned: {selectedMachine.commissionDate}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#24272A]">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#151719] ${
                  evt.severity === 'critical'
                    ? 'bg-red-500'
                    : evt.severity === 'warning'
                    ? 'bg-amber-500'
                    : evt.severity === 'resolved'
                    ? 'bg-green-500'
                    : 'bg-[#4B5259]'
                }`}
              />

              <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] group-hover:border-slate-300 dark:hover:border-[#4B5259] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold capitalize text-slate-900 dark:text-[#E1E4E6]">
                      {evt.eventType.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded ${
                        evt.severity === 'critical'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                          : evt.severity === 'warning'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                          : evt.severity === 'resolved'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/25'
                          : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-[#8A929B]">
                    {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-[#8A929B] leading-relaxed font-medium">
                  {evt.description}
                </p>

                {(evt.technician || evt.duration) && (
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-200 dark:border-[#24272A] text-[11px] text-slate-400 dark:text-[#4B5259] font-mono">
                    {evt.technician && <span>Lead: {evt.technician}</span>}
                    {evt.duration && <span>Intervention Duration: {evt.duration}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
