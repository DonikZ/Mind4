import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  Eye,
} from 'lucide-react';
import {
  Machine,
  Anomaly,
  Alert,
  TimelineEvent,
  PlantAnalytics,
} from '../../types';
import { FleetHealthDistribution } from '../charts/FleetHealthDistribution';
import { FleetTrendChart } from '../charts/FleetTrendChart';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { HealthIndicator } from '../common/HealthIndicator';

interface DashboardViewProps {
  analytics: PlantAnalytics;
  machines: Machine[];
  recentEvents: TimelineEvent[];
  onSelectMachine: (machine: Machine) => void;
  onInvestigateAnomaly: (anomalyId: string) => void;
  onCreateMaintenance: (machineId: string, issue: string) => void;
  onViewAllMachines: (filterStatus?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  machines,
  recentEvents,
  onSelectMachine,
  onInvestigateAnomaly,
  onCreateMaintenance,
  onViewAllMachines,
}) => {
  const [dateRange, setDateRange] = useState('Last 24 Hours');

  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Menunggu Data Telemetri</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Sistem sedang mendengarkan koneksi MQTT. Mesin akan otomatis muncul di sini setelah sensor mengirimkan paket data pertamanya ke broker.
        </p>
      </div>
    );
  }

  // Find priority critical machine
  const priorityMachine = machines.find((m) => m.status === 'critical') || machines[0];
  const attentionMachines = machines.filter(
    (m) => m.status === 'critical' || m.status === 'warning'
  );

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Operations Overview
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-[#8A929B] mt-1">
            Real-time condition monitoring across 42 assets
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-[#24272A]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 dark:text-[#4B5259] font-bold uppercase tracking-wider">
                Availability
              </span>
              <span className="text-lg font-bold text-green-500 font-mono">
                94.2%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-[#24272A]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 dark:text-[#4B5259] font-bold uppercase tracking-wider">
                Last Sync
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-[#E1E4E6] font-mono">
                2m ago
              </span>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] text-xs text-slate-900 dark:text-[#E1E4E6]">
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer text-slate-900 dark:text-[#E1E4E6]"
            >
              <option value="Last 24 Hours" className="bg-white dark:bg-[#151719] text-slate-900 dark:text-[#E1E4E6]">Last 24 Hours</option>
              <option value="Last 7 Days" className="bg-white dark:bg-[#151719] text-slate-900 dark:text-[#E1E4E6]">Last 7 Days</option>
              <option value="Last 30 Days" className="bg-white dark:bg-[#151719] text-slate-900 dark:text-[#E1E4E6]">Last 30 Days</option>
              <option value="Current Shift" className="bg-white dark:bg-[#151719] text-slate-900 dark:text-[#E1E4E6]">Current Shift (Shift 1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TOP SUMMARY: Compact Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div
          onClick={() => onViewAllMachines()}
          className="h-[76px] bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-lg p-3.5 flex items-center justify-between hover:border-slate-300 dark:hover:border-[#33383E] transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
              Total Assets
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {analytics.totalAssets}
            </span>
          </div>
          <div className="px-2 py-1 bg-blue-500/10 rounded flex items-center justify-center text-blue-400 text-[11px] font-bold">
            +2 New
          </div>
        </div>

        <div
          onClick={() => onViewAllMachines('running')}
          className="h-[76px] bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-lg p-3.5 flex items-center justify-between hover:border-green-500/40 transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
              Healthy
            </span>
            <span className="text-2xl font-bold font-mono text-green-500">
              {analytics.healthyAssets}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#4B5259] font-mono">
            74% Fleet
          </div>
        </div>

        <div
          onClick={() => onViewAllMachines('warning')}
          className="h-[76px] bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-lg p-3.5 flex items-center justify-between hover:border-amber-500/40 transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
              Attention
            </span>
            <span className="text-2xl font-bold font-mono text-amber-500">
              {analytics.attentionAssets}
            </span>
          </div>
          <div className="text-[10px] text-amber-500 font-mono">
            +1 Incident
          </div>
        </div>

        <div
          onClick={() => onViewAllMachines('critical')}
          className="h-[76px] bg-red-950/20 border border-red-900/30 rounded-lg p-3.5 flex items-center justify-between hover:border-red-500/50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              Critical
            </span>
            <span className="text-2xl font-bold font-mono text-red-500">
              {analytics.criticalAssets}
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        </div>

        <div
          onClick={() => onViewAllMachines('offline')}
          className="h-[76px] bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-lg p-3.5 flex items-center justify-between hover:border-slate-300 dark:hover:border-[#33383E] transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
              Offline
            </span>
            <span className="text-2xl font-bold font-mono text-slate-500 dark:text-[#8A929B]">
              {analytics.offlineAssets}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#4B5259] font-mono">
            Planned
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD COMPOSITION (Asymmetric layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT — FLEET HEALTH (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <FleetHealthDistribution
            healthyCount={analytics.healthyAssets}
            attentionCount={analytics.attentionAssets}
            criticalCount={analytics.criticalAssets}
            offlineCount={analytics.offlineAssets}
            totalAssets={analytics.totalAssets}
            onViewMachines={onViewAllMachines}
          />

          {/* Condition Trend Chart */}
          <FleetTrendChart />
        </div>

        {/* RIGHT — PRIORITY ALERT & RECENT EVENTS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Focal Point Priority Alert */}
          <div
            id="priority-alert-panel"
            className="rounded-lg border border-red-500/30 bg-red-500/5 p-5 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Tag & Status */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-tighter rounded">
                Critical
              </span>
              <span className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Detected 8m ago
              </span>
            </div>

            {/* Asset Identity */}
            <div className="mt-2">
              <h4
                onClick={() => onSelectMachine(priorityMachine)}
                className="text-lg font-bold text-slate-900 dark:text-[#E1E4E6] hover:text-blue-400 cursor-pointer"
              >
                {priorityMachine.id} — {priorityMachine.name}
              </h4>
              <p className="text-[12px] text-slate-500 dark:text-[#8A929B] mt-1 leading-relaxed">
                Bearing vibration exceeded operating envelope at 6.8 mm/s. Spectral harmonic matches outer raceway degradation.
              </p>
            </div>

            {/* Health & Risk Stats */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-200 dark:border-[#24272A]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-400 dark:text-[#4B5259] font-bold">
                  Health
                </span>
                <span className="text-xl font-bold font-mono text-red-500">
                  61
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-400 dark:text-[#4B5259] font-bold">
                  Risk
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-[#E1E4E6]">
                  High
                </span>
              </div>
              <div className="flex-1 flex justify-end gap-2">
                <button
                  onClick={() => onInvestigateAnomaly('ANOM-102-01')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[12px] font-bold rounded transition-colors"
                >
                  Investigate
                </button>
                <button
                  onClick={() =>
                    onCreateMaintenance(
                      priorityMachine.id,
                      'Drive-end bearing vibration 6.8 mm/s (Envelope breached)'
                    )
                  }
                  className="px-3 py-1.5 bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-slate-900 dark:text-[#E1E4E6] border border-slate-200 dark:border-[#24272A] text-[12px] font-semibold rounded transition-colors"
                >
                  Work Order
                </button>
              </div>
            </div>
          </div>

          {/* Recent Events Stream (Console timeline) */}
          <div
            id="recent-events-panel"
            className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                  Recent Events Stream
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                  Chronological telemetry & maintenance activity log
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              {recentEvents.map((evt) => {
                const isCritical = evt.severity === 'critical';
                const isWarning = evt.severity === 'warning';
                const isResolved = evt.severity === 'resolved';

                return (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 p-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#24272A]"
                  >
                    <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A929B] shrink-0 pt-0.5 w-11">
                      {evt.timestamp}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#E1E4E6]">
                          {evt.machineId}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                            isCritical
                              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                              : isWarning
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              : isResolved
                              ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                              : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                          }`}
                        >
                          {evt.severity}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5 truncate">
                        {evt.description}
                      </div>
                      {evt.technician && (
                        <div className="text-[10px] text-slate-400 dark:text-[#4B5259] mt-0.5">
                          Tech: {evt.technician} {evt.duration ? `(${evt.duration})` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MACHINE RISK TABLE ("Machines requiring attention") */}
      <div
        id="machine-risk-table-section"
        className="flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-[#E1E4E6]">
              Machines requiring attention
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8A929B]">
              Ranked list of fleet assets showing threshold excursions or elevated risk scores
            </p>
          </div>
          <button
            onClick={() => onViewAllMachines()}
            className="text-[12px] text-blue-400 font-medium hover:text-blue-300"
          >
            View all {machines.length} assets →
          </button>
        </div>

        <div className="bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-[#1A1D1F] border-b border-slate-200 dark:border-[#24272A]">
              <tr className="text-[11px] font-bold text-slate-500 dark:text-[#8A929B] uppercase tracking-wider">
                <th className="px-6 py-3">Machine</th>
                <th className="px-6 py-3">Health</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Primary Issue</th>
                <th className="px-6 py-3">Last Seen</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {attentionMachines.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelectMachine(m)}
                  className="border-b border-slate-200 dark:border-[#24272A] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 font-semibold text-slate-900 dark:text-[#E1E4E6]">
                    {m.id} {m.name}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`font-bold ${m.healthScore < 70 ? 'text-red-500' : 'text-amber-500'}`}>
                      {m.healthScore}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded border ${
                        m.riskLevel === 'high'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {m.riskLevel === 'high' ? 'High' : 'Medium'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-900 dark:text-[#E1E4E6]">
                    {m.primaryIssue || 'Vibration Deviation'}
                  </td>
                  <td className="px-6 py-3 text-slate-500 dark:text-[#8A929B]">
                    {m.lastUpdate}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMachine(m);
                      }}
                      className="text-blue-400 font-medium hover:text-blue-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
