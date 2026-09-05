import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Clock,
  Sliders,
} from 'lucide-react';
import { Machine } from '../../types';
import { FleetTrendChart } from '../charts/FleetTrendChart';

interface TrendAnalysisViewProps {
  machines: Machine[];
  selectedMachine: Machine;
  onSelectMachine: (machine: Machine) => void;
  onExportCsv: () => void;
}

export const TrendAnalysisView: React.FC<TrendAnalysisViewProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  onExportCsv,
}) => {
  const [selectedSensor, setSelectedSensor] = useState('vibration');
  const [comparisonMode, setComparisonMode] = useState<
    'baseline' | 'previous-period' | 'cohort'
  >('baseline');
  const [timeRange, setTimeRange] = useState('30D');

  if (machines.length === 0 || !selectedMachine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Data Tren</h2>
        <p className="text-sm text-slate-500 dark:text-[#8A929B] mt-2 max-w-md text-center">
          Tunggu mesin terdeteksi dari koneksi MQTT agar grafik tren data bisa dikonstruksi secara dinamis.
        </p>
      </div>
    );
  }

  return (
    <div id="trend-analysis-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Trend Analysis & Predictive Modeling
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            Statistical regression, multi-variate trajectory projections, and envelope forecasting
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B]" />
          Export Series (CSV)
        </button>
      </div>

      {/* Control Configuration Strip */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        {/* Machine Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">Machine:</span>
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

        {/* Sensor Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">Telemetry Channel:</span>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="vibration">Vibration (RMS mm/s)</option>
            <option value="temperature">Bearing Temperature (°C)</option>
            <option value="pressure">Hydraulic Pressure (bar)</option>
            <option value="power">Motor Power (kW)</option>
          </select>
        </div>

        {/* Comparison Reference */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">Compare against:</span>
          <select
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value as any)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="baseline">Nominal Commissioning Baseline</option>
            <option value="previous-period">Previous 30-Day Cycle</option>
            <option value="cohort">Fleet Sister Machines Cohort</option>
          </select>
        </div>
      </div>

      {/* Trajectory Insight Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Rate of Change
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-red-400">
              +12.4%
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259]">/ week (accelerating)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Deviation From Commissioning Baseline
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              +8.7%
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259]">above 95th percentile</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
          <span className="text-xs text-red-400 font-medium block">
            Projected Threshold Breach
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-red-400">
              ~14 Days
            </span>
            <span className="text-xs text-red-400/80 font-medium">
              ISO 10816-3 Limit
            </span>
          </div>
        </div>
      </div>

      {/* Main Trend Time-Series Graph */}
      <FleetTrendChart />

      {/* Condition Insight Diagnostics Box */}
      <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex items-start gap-4">
        <div className="p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
            Automated Condition Insight & Trend Model
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-1.5 leading-relaxed">
            Bearing vibration on <strong className="text-slate-900 dark:text-[#E1E4E6]">{selectedMachine.id}</strong> is trending upward at <strong className="text-slate-900 dark:text-[#E1E4E6]">0.4 mm/s per week</strong>. If the current trajectory continues, vibration will exceed the ISO 10816-3 critical operating threshold in approximately <strong className="text-red-400">14 days</strong>. Immediate non-destructive ultrasound examination and grease replenishment are recommended to avoid emergency shutdown.
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs font-mono text-slate-400 dark:text-[#4B5259]">
            <span>Model: Autoregressive Polynomial (R² = 0.94)</span>
            <span>·</span>
            <span>Training window: 90 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
