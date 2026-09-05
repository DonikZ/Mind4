import React, { useState } from 'react';
import { Fingerprint, SlidersHorizontal, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Machine } from '../../types';
import { MachineFingerprintRadar } from '../charts/MachineFingerprintRadar';

interface MachineFingerprintViewProps {
  machines: Machine[];
  selectedMachine: Machine;
  onSelectMachine: (machine: Machine) => void;
}

export const MachineFingerprintView: React.FC<MachineFingerprintViewProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
}) => {
  if (machines.length === 0 || !selectedMachine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <Fingerprint className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Menunggu Aset</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Belum ada mesin yang terdeteksi dari koneksi MQTT untuk melihat profil sidik jari mesin.
        </p>
      </div>
    );
  }

  return (
    <div id="machine-fingerprint-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Machine Fingerprint
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
          Compare multi-dimensional operating behavior against the machine's historical baseline
        </p>
      </div>

      {/* Machine Selector Bar */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
          Select Fleet Asset:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {machines.map((m) => {
            const isSelected = m.id === selectedMachine.id;
            const isSignificant = m.fingerprintDeviation >= 10;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMachine(m)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium font-mono flex items-center gap-2 transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:border-slate-300 dark:hover:border-[#4B5259]'
                }`}
              >
                <span>{m.id}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                    isSignificant
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  +{m.fingerprintDeviation}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Radar Card */}
      <div className="p-6 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-[#24272A]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#E1E4E6] font-mono">
              {selectedMachine.id} — {selectedMachine.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A929B]">
              Operating Profile Signature · 6 Normalized Telemetry Axes
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 dark:text-[#4B5259]">
            Baseline calibration: 90-day steady state
          </div>
        </div>

        <MachineFingerprintRadar machine={selectedMachine} size={360} showDetails={true} />
      </div>

      {/* Fleet Comparison Overview Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] mb-3">
          Fleet Fingerprint Deviation Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {machines.map((m) => {
            const isSignificant = m.fingerprintDeviation >= 10;
            return (
              <div
                key={m.id}
                onClick={() => onSelectMachine(m)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  m.id === selectedMachine.id
                    ? 'border-blue-500/80 ring-1 ring-blue-500/80 bg-white dark:bg-[#151719]'
                    : 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] hover:border-slate-300 dark:hover:border-[#4B5259]'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-[#E1E4E6]">
                    {m.id}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSignificant
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}
                  >
                    +{m.fingerprintDeviation}%
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8A929B] mb-3 truncate">{m.name}</div>
                <div className="flex justify-center py-2">
                  <MachineFingerprintRadar machine={m} size={150} showDetails={false} />
                </div>
                <div className="text-[11px] text-slate-400 dark:text-[#4B5259] text-center font-mono mt-1">
                  {isSignificant ? 'Significant Drift' : 'Nominal Match'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
