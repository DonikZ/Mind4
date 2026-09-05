import React from 'react';
import { X, AlertOctagon, CheckCircle2, Wrench, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { Anomaly } from '../../types';

interface AnomalyDrawerProps {
  anomaly: Anomaly | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (anomalyId: string) => void;
  onCreateMaintenance: (machineId: string, issue: string) => void;
  onResolve: (anomalyId: string) => void;
}

export const AnomalyDrawer: React.FC<AnomalyDrawerProps> = ({
  anomaly,
  isOpen,
  onClose,
  onAcknowledge,
  onCreateMaintenance,
  onResolve,
}) => {
  if (!isOpen || !anomaly) return null;

  // Render SVG graph for anomaly with envelope and anomaly period highlight
  const graphWidth = 460;
  const graphHeight = 160;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const chartW = graphWidth - padLeft - padRight;
  const chartH = graphHeight - padTop - padBottom;

  const data = anomaly.timeSeriesData || [
    { time: '10:00', actual: 4.1, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:10', actual: 4.2, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:20', actual: 4.6, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:25', actual: 5.3, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:30', actual: 6.1, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:34', actual: 6.8, minExpected: 3.5, maxExpected: 4.5 },
    { time: '10:40', actual: 6.7, minExpected: 3.5, maxExpected: 4.5 },
  ];

  const minVal = 2.0;
  const maxVal = 8.0;

  const getY = (v: number) => {
    const norm = (v - minVal) / (maxVal - minVal);
    return padTop + chartH - norm * chartH;
  };

  const getX = (idx: number) => {
    return padLeft + (idx / (data.length - 1)) * chartW;
  };

  const envTop = getY(4.5);
  const envBottom = getY(3.5);
  const envH = Math.abs(envBottom - envTop);

  const points = data.map((d, i) => `${getX(i)},${getY(d.actual)}`).join(' L ');

  return (
    <div
      id="anomaly-investigation-drawer-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-slate-50 dark:bg-[#0B0C0D]/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#151719] h-full border-l border-slate-200 dark:border-[#24272A] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-[#24272A] flex items-start justify-between bg-white dark:bg-[#0F1113]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/25">
                {anomaly.severity}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-[#8A929B]">
                {anomaly.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#E1E4E6]">
              {anomaly.sensor}
            </h2>
            <div className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
              Machine: <strong className="text-slate-900 dark:text-[#E1E4E6] font-mono">{anomaly.machineId}</strong> ({anomaly.machineName})
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Metric Facts Table */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-xs">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8A929B] font-medium block">
                Detected Timestamp
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#E1E4E6] mt-0.5 block">
                {anomaly.detectedTime}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8A929B] font-medium block">
                Confidence Level
              </span>
              <span className="font-mono font-semibold text-green-400 mt-0.5 block">
                {anomaly.confidence}% Confidence
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8A929B] font-medium block">
                Expected Envelope
              </span>
              <span className="font-mono text-slate-900 dark:text-[#E1E4E6] mt-0.5 block">
                {anomaly.expectedRange}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8A929B] font-medium block">
                Observed Peak
              </span>
              <span className="font-mono font-bold text-red-400 mt-0.5 block">
                {anomaly.observedValue}
              </span>
            </div>
          </div>

          {/* Sensor Signal Anomaly Graph */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6]">
                Operating Envelope vs. Actual Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#8A929B]">
                Sampling Rate: 1s
              </span>
            </div>

            <div className="w-full overflow-hidden select-none">
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto">
                {/* Horizontal grid lines */}
                {[0, 0.5, 1].map((st, i) => {
                  const y = padTop + chartH * st;
                  const v = maxVal - st * (maxVal - minVal);
                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={graphWidth - padRight}
                        y2={y}
                        stroke="#24272A"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={padLeft - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-[#8A929B]"
                      >
                        {v.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Expected Operating Envelope */}
                <rect
                  x={padLeft}
                  y={envTop}
                  width={chartW}
                  height={envH}
                  className="fill-emerald-500/10"
                />
                <line
                  x1={padLeft}
                  y1={envTop}
                  x2={graphWidth - padRight}
                  y2={envTop}
                  stroke="#10b981"
                  strokeDasharray="2 2"
                  strokeOpacity="0.5"
                />
                <line
                  x1={padLeft}
                  y1={envBottom}
                  x2={graphWidth - padRight}
                  y2={envBottom}
                  stroke="#10b981"
                  strokeDasharray="2 2"
                  strokeOpacity="0.5"
                />

                {/* Anomaly Period Highlight Band (from idx 3 onward) */}
                <rect
                  x={getX(3)}
                  y={padTop}
                  width={chartW - (getX(3) - padLeft)}
                  height={chartH}
                  className="fill-rose-500/15"
                />

                {/* Actual Signal Line */}
                <path
                  d={`M ${points}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d.actual);
                  const isBreach = d.actual > 4.5;
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={isBreach ? 3.5 : 2.5}
                      className={
                        isBreach
                          ? 'fill-red-500 stroke-[#0F1113] stroke-1'
                          : 'fill-[#8A929B]'
                      }
                    />
                  );
                })}

                {/* X labels */}
                {data.map((d, i) => (
                  <text
                    key={i}
                    x={getX(i)}
                    y={graphHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-[#8A929B]"
                  >
                    {d.time}
                  </text>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8A929B] mt-2 pt-2 border-t border-slate-200 dark:border-[#24272A]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-emerald-500/30 rounded-xs" /> Expected envelope (3.5–4.5 mm/s)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-rose-500/30 rounded-xs" /> Anomaly period
                </span>
              </div>
            </div>
          </div>

          {/* Possible Cause */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-amber-900/40">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Probable Root Cause
            </span>
            <p className="text-xs text-slate-900 dark:text-[#E1E4E6] leading-relaxed font-medium">
              {anomaly.possibleCause}
            </p>
          </div>

          {/* Recommended Inspection */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-blue-900/40">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
              Recommended Engineering Action
            </span>
            <p className="text-xs text-slate-900 dark:text-[#E1E4E6] leading-relaxed">
              {anomaly.recommendedInspection}
            </p>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] flex items-center justify-between gap-2">
          <button
            onClick={() => onAcknowledge(anomaly.id)}
            className="px-3 py-2 text-xs font-medium rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
          >
            Acknowledge Anomaly
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onResolve(anomaly.id)}
              className="px-3 py-2 text-xs font-medium rounded-md text-green-400 border border-green-800/60 bg-green-500/10 hover:bg-green-500/20 transition-colors"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => {
                onCreateMaintenance(anomaly.machineId, `${anomaly.sensor}: ${anomaly.observedValue} observed. ${anomaly.possibleCause}`);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              Create Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
