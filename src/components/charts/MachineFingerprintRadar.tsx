import React, { useMemo } from 'react';
import { Machine } from '../../types';

interface MachineFingerprintRadarProps {
  machine: Machine;
  size?: number;
  showDetails?: boolean;
}

interface MetricAxis {
  key: keyof Machine['fingerprint'];
  label: string;
  unit: string;
}

const AXES: MetricAxis[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'vibration', label: 'Vibration', unit: 'mm/s' },
  { key: 'pressure', label: 'Pressure', unit: 'bar' },
  { key: 'rpm', label: 'RPM', unit: 'rpm' },
  { key: 'current', label: 'Current', unit: 'A' },
  { key: 'power', label: 'Power', unit: 'kW' },
];

export const MachineFingerprintRadar: React.FC<MachineFingerprintRadarProps> = ({
  machine,
  size = 320,
  showDetails = true,
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const numAxes = AXES.length;

  const polarToCartesian = (angleDeg: number, dist: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + dist * Math.cos(angleRad),
      y: center + dist * Math.sin(angleRad),
    };
  };

  // Coordinates for Reference Range Outer / Inner Bands, Baseline, and Current
  const {
    baselinePoints,
    currentPoints,
    refMaxPoints,
    refMinPoints,
    refPolygonPath,
  } = useMemo(() => {
    const bPts: { x: number; y: number }[] = [];
    const cPts: { x: number; y: number }[] = [];
    const rMaxPts: { x: number; y: number }[] = [];
    const rMinPts: { x: number; y: number }[] = [];

    AXES.forEach((axis, i) => {
      const angle = (360 / numAxes) * i;
      const data = machine.fingerprint[axis.key];

      // Normalized 0 to 100
      const bDist = (data.baseline / 100) * radius;
      const cDist = (Math.min(data.current, 100) / 100) * radius;
      const rMaxDist = (data.maxRef / 100) * radius;
      const rMinDist = (data.minRef / 100) * radius;

      bPts.push(polarToCartesian(angle, bDist));
      cPts.push(polarToCartesian(angle, cDist));
      rMaxPts.push(polarToCartesian(angle, rMaxDist));
      rMinPts.push(polarToCartesian(angle, rMinDist));
    });

    // Outer polygon going forward, inner polygon going backward to make ribbon
    const forwardMax = rMaxPts.map((p) => `${p.x},${p.y}`).join(' L ');
    const backwardMin = [...rMinPts]
      .reverse()
      .map((p) => `${p.x},${p.y}`)
      .join(' L ');
    const refPath = `M ${forwardMax} L ${backwardMin} Z`;

    return {
      baselinePoints: bPts.map((p) => `${p.x},${p.y}`).join(' '),
      currentPoints: cPts.map((p) => `${p.x},${p.y}`).join(' '),
      refMaxPoints: rMaxPts,
      refMinPoints: rMinPts,
      refPolygonPath: refPath,
    };
  }, [machine, radius, numAxes]);

  const isSignificant = machine.fingerprintDeviation >= 10;

  return (
    <div
      id="machine-fingerprint-radar"
      className="flex flex-col md:flex-row items-center gap-6"
    >
      {/* SVG Radar Chart */}
      <div className="relative shrink-0 select-none">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Concentric Reference Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius * level}
              className="fill-none stroke-[#24272A]"
              strokeDasharray={level === 1.0 ? 'none' : '2 2'}
              strokeWidth="1"
            />
          ))}

          {/* Radial Axis Lines */}
          {AXES.map((axis, i) => {
            const angle = (360 / numAxes) * i;
            const end = polarToCartesian(angle, radius);
            const labelPos = polarToCartesian(angle, radius + 20);

            return (
              <g key={axis.key}>
                <line
                  x1={center}
                  y1={center}
                  x2={end.x}
                  y2={end.y}
                  className="stroke-[#24272A]"
                  strokeWidth="1"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-medium fill-[#8A929B]"
                >
                  {axis.label}
                </text>
              </g>
            );
          })}

          {/* Layer 3: Reference Range Corridor Band */}
          <path
            d={refPolygonPath}
            className="fill-green-500/10 stroke-green-500/30"
            strokeWidth="0.5"
          />

          {/* Layer 1: Historical Baseline (clean dashed outline) */}
          <polygon
            points={baselinePoints}
            className="fill-[#151719]/40 stroke-[#4B5259]"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Layer 2: Current Operating Condition (colored polygon) */}
          <polygon
            points={currentPoints}
            className={`${
              isSignificant
                ? 'fill-red-500/15 stroke-red-500'
                : 'fill-blue-500/15 stroke-blue-500'
            }`}
            strokeWidth="2"
          />

          {/* Current Condition Vertex Dots */}
          {AXES.map((axis, i) => {
            const angle = (360 / numAxes) * i;
            const data = machine.fingerprint[axis.key];
            const dist = (Math.min(data.current, 100) / 100) * radius;
            const pt = polarToCartesian(angle, dist);
            const isAbnormal =
              data.current > data.maxRef || data.current < data.minRef;

            return (
              <circle
                key={`dot-${axis.key}`}
                cx={pt.x}
                cy={pt.y}
                r={isAbnormal ? 4 : 3}
                className={
                  isAbnormal
                    ? 'fill-red-500 stroke-[#0B0C0D] stroke-1'
                    : 'fill-blue-500 stroke-[#0B0C0D] stroke-1'
                }
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-slate-500 dark:text-[#8A929B]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-300 dark:border-[#4B5259]" />
            <span>Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-500/20 border border-green-500/40" />
            <span>Envelope</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3 h-1 rounded-sm ${
                isSignificant ? 'bg-red-500' : 'bg-blue-500'
              }`}
            />
            <span>Current</span>
          </div>
        </div>
      </div>

      {/* Analytical Detail Column */}
      {showDetails && (
        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-lg bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A]">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium">
                Fingerprint Envelope Deviation
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  isSignificant
                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                    : 'bg-green-500/10 text-green-400 border-green-500/25'
                }`}
              >
                {isSignificant ? 'Significant Deviation' : 'Nominal Match'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold font-mono ${
                  isSignificant
                    ? 'text-red-400'
                    : 'text-slate-900 dark:text-[#E1E4E6]'
                }`}
              >
                +{machine.fingerprintDeviation}%
              </span>
              <span className="text-xs text-slate-400 dark:text-[#4B5259]">
                vs historical steady-state signature
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#24272A] text-xs">
              <div className="text-slate-500 dark:text-[#8A929B] mb-1">
                Primary Spectral Contributors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/25 font-medium font-mono text-[11px]">
                  Vibration (+74%)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 font-medium font-mono text-[11px]">
                  Temperature (+34%)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A] font-medium font-mono text-[11px]">
                  Power (+6%)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] uppercase tracking-wider mb-1">
              Engineering Diagnosis
            </h4>
            <p className="text-xs text-slate-500 dark:text-[#8A929B] leading-relaxed">
              {machine.conditionInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
