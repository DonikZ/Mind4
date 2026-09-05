import React from 'react';
import { ArrowUpRight, AlertCircle } from 'lucide-react';

interface FleetHealthDistributionProps {
  healthyCount: number;
  attentionCount: number;
  criticalCount: number;
  offlineCount: number;
  totalAssets: number;
  onViewMachines: (filterStatus?: string) => void;
}

export const FleetHealthDistribution: React.FC<FleetHealthDistributionProps> = ({
  healthyCount,
  attentionCount,
  criticalCount,
  offlineCount,
  totalAssets,
  onViewMachines,
}) => {
  const healthyPct = Math.round((healthyCount / totalAssets) * 100);
  const attentionPct = Math.round((attentionCount / totalAssets) * 100);
  const criticalPct = Math.round((criticalCount / totalAssets) * 100);
  const offlinePct = Math.max(0, 100 - healthyPct - attentionPct - criticalPct);

  return (
    <div
      id="fleet-health-distribution"
      className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 dark:text-[#E1E4E6] tracking-tight">
            Fleet Health Distribution
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-[#8A929B]">
            Real-time condition stratification across all {totalAssets} monitored assets
          </p>
        </div>
        <button
          onClick={() => onViewMachines()}
          className="text-[12px] text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1 group"
        >
          View Machines
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Horizontal segmented health bar */}
      <div className="h-8 w-full flex rounded-md overflow-hidden bg-white dark:bg-[#0F1113]">
        <div
          title={`Healthy: ${healthyCount} assets (${healthyPct}%)`}
          style={{ width: `${healthyPct}%` }}
          onClick={() => onViewMachines('running')}
          className="h-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer border-r border-[#0B0C0D]"
        />
        <div
          title={`Attention: ${attentionCount} assets (${attentionPct}%)`}
          style={{ width: `${attentionPct}%` }}
          onClick={() => onViewMachines('warning')}
          className="h-full bg-amber-500 hover:bg-amber-400 transition-colors cursor-pointer border-r border-[#0B0C0D]"
        />
        <div
          title={`Critical: ${criticalCount} assets (${criticalPct}%)`}
          style={{ width: `${criticalPct}%` }}
          onClick={() => onViewMachines('critical')}
          className="h-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer border-r border-[#0B0C0D]"
        />
        <div
          title={`Offline: ${offlineCount} assets (${offlinePct}%)`}
          style={{ width: `${offlinePct}%` }}
          onClick={() => onViewMachines('offline')}
          className="h-full bg-[#24272A] hover:bg-[#33383E] transition-colors cursor-pointer"
        />
      </div>

      {/* Metric Breakdown Row */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-[#24272A]">
        <div
          onClick={() => onViewMachines('running')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-[11px] text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6]">
              Healthy
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-semibold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {healthyPct}%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">
              ({healthyCount})
            </span>
          </div>
        </div>

        <div
          onClick={() => onViewMachines('warning')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-[11px] text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6]">
              Attention
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-semibold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {attentionPct}%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">
              ({attentionCount})
            </span>
          </div>
        </div>

        <div
          onClick={() => onViewMachines('critical')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span className="text-[11px] text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6]">
              Critical
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-semibold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {criticalPct}%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">
              ({criticalCount})
            </span>
          </div>
        </div>

        <div
          onClick={() => onViewMachines('offline')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4B5259] shrink-0" />
            <span className="text-[11px] text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6]">
              Offline
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-semibold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {offlinePct}%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">
              ({offlineCount})
            </span>
          </div>
        </div>
      </div>

      {/* Immediate Attention Callout */}
      <div className="mt-4 p-3 rounded-md bg-red-950/20 border border-red-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-xs font-medium text-red-200">
            <strong>{criticalCount} machines</strong> require immediate diagnostic attention (M-102, M-205).
          </span>
        </div>
        <button
          onClick={() => onViewMachines('critical')}
          className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A] text-red-400 hover:bg-slate-200 dark:hover:bg-[#24272A] rounded transition-colors"
        >
          View machines
        </button>
      </div>
    </div>
  );
};
