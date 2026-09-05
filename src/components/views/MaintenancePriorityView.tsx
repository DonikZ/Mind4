import React from 'react';
import { ListOrdered, Wrench, AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';
import { Machine } from '../../types';
import { RiskMatrixChart } from '../charts/RiskMatrixChart';
import { HealthIndicator } from '../common/HealthIndicator';
import { RiskBadge } from '../common/RiskBadge';

interface MaintenancePriorityViewProps {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
  onCreateMaintenance: (machineId: string, issue: string) => void;
}

export const MaintenancePriorityView: React.FC<MaintenancePriorityViewProps> = ({
  machines,
  onSelectMachine,
  onCreateMaintenance,
}) => {
  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <ListOrdered className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Aset</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Belum ada mesin yang terdeteksi. Hubungkan MQTT untuk memulai pengurutan prioritas.
        </p>
      </div>
    );
  }

  // Sort machines by risk score descending
  const prioritizedMachines = [...machines].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div id="maintenance-priority-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Maintenance Priority Ranking
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
          Dynamic asset prioritization ordered by asset health degradation, operational criticality, and calculated failure probability
        </p>
      </div>

      {/* Top Priority Cards (Ranked List) */}
      <div className="space-y-3">
        {prioritizedMachines.slice(0, 4).map((m, index) => {
          const rank = String(index + 1).padStart(2, '0');
          const isHighest = index === 0;

          return (
            <div
              key={m.id}
              className={`p-5 rounded-lg border transition-all ${
                isHighest
                  ? 'border-red-500/40 bg-white dark:bg-[#151719] shadow-xs'
                  : 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left: Rank & Machine Info */}
                <div className="flex items-start gap-4 min-w-[260px]">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] shrink-0 font-mono font-bold text-slate-500 dark:text-[#8A929B]">
                    <span className="text-[10px] text-slate-400 dark:text-[#4B5259] font-sans uppercase">
                      PRIORITY
                    </span>
                    <span className="text-base leading-none text-slate-900 dark:text-[#E1E4E6]">
                      {rank}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => onSelectMachine(m)}
                        className="font-mono text-base font-bold text-slate-900 dark:text-[#E1E4E6] hover:text-blue-400 cursor-pointer transition-colors"
                      >
                        {m.id}
                      </span>
                      <span className="text-slate-400 dark:text-[#4B5259]">·</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-[#8A929B]">
                        {m.name}
                      </span>
                      <RiskBadge risk={m.riskLevel} size="sm" />
                    </div>

                    <div className="text-xs text-slate-900 dark:text-[#E1E4E6] font-medium mt-1">
                      Recommended: {m.recommendedAction}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
                      {m.area} · Primary symptom: {m.primaryIssue || 'Subsystem wear'}
                    </div>
                  </div>
                </div>

                {/* Center: Numeric Score Badges */}
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#8A929B] font-sans block uppercase">
                      Risk Score
                    </span>
                    <span className="text-base font-bold text-red-400">
                      {m.riskScore}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#8A929B] font-sans block uppercase">
                      Health
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-[#E1E4E6]">
                      {m.healthScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#8A929B] font-sans block uppercase">
                      Failure Prob.
                    </span>
                    <span className="text-base font-bold text-red-400">
                      {m.failureProbability}%
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMachine(m)}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
                  >
                    View Machine
                  </button>
                  <button
                    onClick={() =>
                      onCreateMaintenance(
                        m.id,
                        `Priority ${rank} action: ${m.recommendedAction}`
                      )
                    }
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Create Work Order
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Matrix Visualization */}
      <RiskMatrixChart
        machines={machines}
        onSelectMachine={onSelectMachine}
      />
    </div>
  );
};
