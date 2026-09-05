import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Wrench,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Machine } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { HealthIndicator } from '../common/HealthIndicator';

interface MachineOverviewViewProps {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
  onCreateMaintenance: (machineId: string, issue: string) => void;
  initialFilterStatus?: string;
}

export const MachineOverviewView: React.FC<MachineOverviewViewProps> = ({
  machines,
  onSelectMachine,
  onCreateMaintenance,
  initialFilterStatus,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialFilterStatus || 'all'
  );
  const [selectedHealthTier, setSelectedHealthTier] = useState('all');
  const [sortBy, setSortBy] = useState<'health-asc' | 'risk-desc' | 'id' | 'update'>('risk-desc');

  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <LayoutGrid className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Aset</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Belum ada mesin yang terdeteksi dari koneksi MQTT.
        </p>
      </div>
    );
  }

  // Filter & Sort Logic
  const filteredMachines = useMemo(() => {
    let list = machines.filter((m) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          m.id.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.type.toLowerCase().includes(q) ||
          m.area.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Area
      if (selectedArea !== 'all' && m.area !== selectedArea) return false;

      // Type
      if (selectedType !== 'all' && m.type !== selectedType) return false;

      // Status
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'running' && m.status !== 'running') return false;
        if (selectedStatus === 'warning' && m.status !== 'warning') return false;
        if (selectedStatus === 'critical' && m.status !== 'critical') return false;
        if (selectedStatus === 'maintenance' && m.status !== 'maintenance') return false;
      }

      // Health Tier
      if (selectedHealthTier === '<70' && m.healthScore >= 70) return false;
      if (
        selectedHealthTier === '70-85' &&
        (m.healthScore < 70 || m.healthScore > 85)
      )
        return false;
      if (selectedHealthTier === '>85' && m.healthScore <= 85) return false;

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'health-asc') return a.healthScore - b.healthScore;
      if (sortBy === 'risk-desc') {
        const riskWeights = { high: 3, medium: 2, low: 1 };
        return (
          riskWeights[b.riskLevel] * 100 +
          b.failureProbability -
          (riskWeights[a.riskLevel] * 100 + a.failureProbability)
        );
      }
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      return 0;
    });

    return list;
  }, [
    machines,
    searchQuery,
    selectedArea,
    selectedType,
    selectedStatus,
    selectedHealthTier,
    sortBy,
  ]);

  return (
    <div id="machine-overview-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Machine Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            42 connected industrial assets across 3 production areas · Real-time SCADA link active
          </p>
        </div>

        {/* View Switcher: Table / Cards */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#0F1113] p-1 rounded-md border border-slate-200 dark:border-[#24272A]">
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-900 dark:text-[#E1E4E6] border border-slate-200 dark:border-[#24272A] shadow-xs'
                : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            title="Compact Cards View"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'cards'
                ? 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-900 dark:text-[#E1E4E6] border border-slate-200 dark:border-[#24272A] shadow-xs'
                : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 dark:text-[#8A929B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (e.g. M-102), name, model, area..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md focus:outline-none focus:border-blue-500 font-sans text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259]"
          />
        </div>

        {/* Area Filter */}
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="text-xs py-1.5 px-2.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Areas</option>
          <option value="Line 1 — Machining">Line 1 — Machining</option>
          <option value="Line 2 — Fabrication">Line 2 — Fabrication</option>
          <option value="Line 3 — Assembly">Line 3 — Assembly</option>
          <option value="Utility Bay 1">Utility Bay 1</option>
          <option value="Utility Bay 2">Utility Bay 2</option>
        </select>

        {/* Machine Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-xs py-1.5 px-2.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Machine Types</option>
          <option value="CNC Milling Machine">CNC Milling Machine</option>
          <option value="Hydraulic Press">Hydraulic Press</option>
          <option value="Centrifugal Pump">Centrifugal Pump</option>
          <option value="Rotary Screw Compressor">Rotary Screw Compressor</option>
          <option value="Conveyor Drive Unit">Conveyor Drive Unit</option>
          <option value="Robotic Welder">Robotic Welder</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs py-1.5 px-2.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="running">Running</option>
          <option value="warning">Warning / Attention</option>
          <option value="critical">Critical</option>
          <option value="maintenance">Maintenance</option>
        </select>

        {/* Health Tier Filter */}
        <select
          value={selectedHealthTier}
          onChange={(e) => setSelectedHealthTier(e.target.value)}
          className="text-xs py-1.5 px-2.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Health Scores</option>
          <option value="<70">Critical (&lt; 70)</option>
          <option value="70-85">Degraded (70–85)</option>
          <option value=">85">Nominal (&gt; 85)</option>
        </select>

        {/* Sort by */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8A929B] pl-2 border-l border-slate-200 dark:border-[#24272A]">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-1 px-2 rounded border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none"
          >
            <option value="risk-desc">Risk (Highest First)</option>
            <option value="health-asc">Health (Lowest First)</option>
            <option value="id">Machine ID</option>
          </select>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8A929B] px-1 font-mono">
        <span>
          Showing {filteredMachines.length} of {machines.length} assets
        </span>
        {(searchQuery ||
          selectedArea !== 'all' ||
          selectedType !== 'all' ||
          selectedStatus !== 'all' ||
          selectedHealthTier !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArea('all');
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedHealthTier('all');
            }}
            className="text-blue-400 hover:underline font-sans font-medium"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* View Mode: TABLE */}
      {viewMode === 'table' && (
        <div className="rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-500 dark:text-[#8A929B] font-semibold">
                <th className="py-3 pl-4">Machine</th>
                <th className="py-3">Type</th>
                <th className="py-3">Area</th>
                <th className="py-3">Status</th>
                <th className="py-3">Health Score</th>
                <th className="py-3">Risk Level</th>
                <th className="py-3">Last Telemetry</th>
                <th className="py-3">Maintenance Schedule</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24272A]">
              {filteredMachines.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelectMachine(m)}
                  className="hover:bg-slate-100 dark:hover:bg-[#1A1D1F] cursor-pointer transition-colors group"
                >
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-[#E1E4E6] group-hover:text-blue-400 transition-colors">
                        {m.id}
                      </span>
                      <span className="text-slate-500 dark:text-[#8A929B] font-medium">
                        {m.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-[#8A929B]">
                    {m.type}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-[#8A929B]">
                    {m.area}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={m.status} size="sm" />
                  </td>
                  <td className="py-3">
                    <HealthIndicator score={m.healthScore} size="sm" />
                  </td>
                  <td className="py-3">
                    <RiskBadge risk={m.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-[#8A929B]">
                    {m.lastUpdate}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-[#8A929B]">
                    {m.maintenanceSchedule}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateMaintenance(m.id, `Preventive check: ${m.name}`);
                        }}
                        title="Schedule Work Order"
                        className="p-1 rounded text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-200 dark:hover:bg-[#24272A]"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[#4B5259] group-hover:text-slate-500 dark:hover:text-[#8A929B] transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode: COMPACT CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMachine(m)}
              className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-[#1A1D1F]/50 cursor-pointer transition-all shadow-xs group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-[#E1E4E6] group-hover:text-blue-400">
                    {m.id} — {m.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                    {m.type} · {m.area}
                  </div>
                </div>
                <StatusBadge status={m.status} size="sm" />
              </div>

              {/* Sensor Quick Stats */}
              <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-slate-200 dark:border-[#24272A] text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block">Health</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
                    {m.healthScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block">Vibration</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-[#E1E4E6]">
                    {m.sensors.vibration.value} {m.sensors.vibration.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#4B5259] block">Temp</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-[#E1E4E6]">
                    {m.sensors.temperature.value} {m.sensors.temperature.unit}
                  </span>
                </div>
              </div>

              {/* Primary Issue or Nominal Indicator */}
              <div className="text-[11px] text-slate-500 dark:text-[#8A929B] truncate">
                {m.primaryIssue ? (
                  <span className="text-amber-400 font-medium">
                    ⚠ {m.primaryIssue}
                  </span>
                ) : (
                  <span className="text-green-400">
                    ✓ All telemetry within envelope
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 text-[10px] text-slate-500 dark:text-[#8A929B] border-t border-slate-200 dark:border-[#24272A] font-mono">
                <span>Updated {m.lastUpdate}</span>
                <span className="text-blue-400 font-sans font-medium group-hover:underline">
                  Inspect Asset →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
