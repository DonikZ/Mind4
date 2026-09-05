import React, { useState } from 'react';
import {
  AlertOctagon,
  Filter,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';
import { Anomaly } from '../../types';

interface AnomalyDetectionViewProps {
  anomalies: Anomaly[];
  onInvestigateAnomaly: (anomaly: Anomaly) => void;
  onAcknowledgeAnomaly: (anomalyId: string) => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  anomalies,
  onInvestigateAnomaly,
  onAcknowledgeAnomaly,
}) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('unresolved');
  const [searchQuery, setSearchQuery] = useState('');

  const unresolvedCount = anomalies.filter((a) => !a.resolved).length;
  const criticalCount = anomalies.filter(
    (a) => a.severity === 'critical' && !a.resolved
  ).length;

  const filteredAnomalies = anomalies.filter((anom) => {
    if (filterSeverity !== 'all' && anom.severity !== filterSeverity)
      return false;
    if (filterStatus === 'unresolved' && anom.resolved) return false;
    if (filterStatus === 'resolved' && !anom.resolved) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        anom.machineId.toLowerCase().includes(q) ||
        anom.machineName.toLowerCase().includes(q) ||
        anom.sensor.toLowerCase().includes(q) ||
        anom.detectedPattern.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="anomaly-detection-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Anomaly Detection
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
          Identified deviations from expected operating patterns across plant telemetry streams
        </p>
      </div>

      {/* Top Indicators Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">
            Total Anomalies Detected (30 Days)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {anomalies.length + 9}
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259] font-mono">SCADA Engine 4.2</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-amber-900/40 bg-white dark:bg-[#151719]">
          <span className="text-xs text-amber-400 font-medium">
            Unresolved Anomalies
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {unresolvedCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">
              Requires engineer review
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-red-900/40 bg-white dark:bg-[#151719]">
          <span className="text-xs text-red-400 font-medium">
            Critical Severity Anomalies
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-red-400">
              {criticalCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">
              Envelope breached &gt; 35%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 dark:text-[#8A929B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anomaly by machine, sensor, or symptom..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md focus:outline-none focus:border-blue-500 text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259] font-sans"
          />
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs py-1.5 px-3 rounded-md border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="unresolved">Unresolved Only</option>
          <option value="all">All Records</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-3">
        {filteredAnomalies.map((anom) => {
          const isCrit = anom.severity === 'critical';
          const isWarn = anom.severity === 'warning';

          return (
            <div
              key={anom.id}
              className={`p-5 rounded-lg border transition-all ${
                isCrit
                  ? 'border-red-900/50 bg-white dark:bg-[#151719]'
                  : 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCrit
                          ? 'bg-red-600 text-white'
                          : isWarn
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#24272A] text-slate-500 dark:text-[#8A929B]'
                      }`}
                    >
                      {anom.severity}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-[#E1E4E6]">
                      {anom.machineId}
                    </span>
                    <span className="text-slate-400 dark:text-[#4B5259]">·</span>
                    <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">
                      {anom.machineName}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                    {anom.sensor} — {anom.detectedPattern}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#8A929B] mt-2 font-mono">
                    <span>Detected: {anom.detectedTime}</span>
                    <span>·</span>
                    <span className="text-green-400 font-semibold">
                      Confidence: {anom.confidence}%
                    </span>
                    <span>·</span>
                    <span>Expected: {anom.expectedRange}</span>
                    <span>·</span>
                    <span className="text-red-400 font-bold">
                      Observed: {anom.observedValue}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-2 bg-white dark:bg-[#0F1113] p-2.5 rounded-md border border-slate-200 dark:border-[#24272A]">
                    <strong className="text-slate-900 dark:text-[#E1E4E6]">Probable Cause:</strong> {anom.possibleCause}
                  </p>
                </div>

                {/* Right: Mini Sparkline & Actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  {/* Mini Sparkline SVG */}
                  <div className="w-36 h-12 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded p-1 flex items-center justify-center">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <line x1="0" y1="18" x2="100" y2="18" stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" strokeOpacity="0.4" />
                      <line x1="0" y1="26" x2="100" y2="26" stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" strokeOpacity="0.4" />
                      <path
                        d="M 5,22 L 20,21 L 35,22 L 50,19 L 65,12 L 80,6 L 95,7"
                        fill="none"
                        stroke={isCrit ? '#ef4444' : '#f59e0b'}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="80" cy="6" r="3" fill={isCrit ? '#ef4444' : '#f59e0b'} />
                    </svg>
                  </div>

                  <div className="flex items-center gap-2">
                    {!anom.acknowledged && (
                      <button
                        onClick={() => onAcknowledgeAnomaly(anom.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onInvestigateAnomaly(anom)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
