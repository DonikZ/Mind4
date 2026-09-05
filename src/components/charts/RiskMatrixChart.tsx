import React, { useState } from 'react';
import { Machine } from '../../types';

interface RiskMatrixChartProps {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
  selectedMachineId?: string;
}

export const RiskMatrixChart: React.FC<RiskMatrixChartProps> = ({
  machines,
  onSelectMachine,
  selectedMachineId,
}) => {
  const [hoveredMachine, setHoveredMachine] = useState<Machine | null>(null);

  // Matrix dimensions
  const width = 640;
  const height = 300;
  const padLeft = 60;
  const padBottom = 40;
  const padTop = 20;
  const padRight = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const impactOrder: Record<string, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };

  const getX = (failureProb: number) => {
    return padLeft + (failureProb / 100) * chartW;
  };

  const getY = (impact: 'low' | 'medium' | 'high' | 'critical') => {
    const row = impactOrder[impact];
    // Y runs from 0 (bottom) to 3 (top)
    return padTop + chartH - ((row + 0.5) / 4) * chartH;
  };

  return (
    <div
      id="risk-matrix-card"
      className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] tracking-tight">
            Failure Probability vs. Operational Impact Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8A929B]">
            Interactive condition-prioritization plot. Select a node to trigger immediate work order or deep investigation.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 dark:text-[#4B5259]">
          ISO 14224 / RCM Standard
        </span>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* 4 Impact Horizontal bands */}
          {['low', 'medium', 'high', 'critical'].map((imp, idx) => {
            const y = padTop + chartH - ((idx + 1) / 4) * chartH;
            const h = chartH / 4;
            const colors = [
              'fill-green-500/5',
              'fill-blue-500/5',
              'fill-amber-500/5',
              'fill-red-500/10',
            ];

            return (
              <g key={imp}>
                <rect
                  x={padLeft}
                  y={y}
                  width={chartW}
                  height={h}
                  className={colors[idx]}
                />
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#24272A"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Vertical Probability Grids: 25%, 50%, 75% */}
          {[25, 50, 75].map((pct) => (
            <line
              key={pct}
              x1={getX(pct)}
              y1={padTop}
              x2={getX(pct)}
              y2={padTop + chartH}
              stroke="#24272A"
              strokeDasharray="2 2"
            />
          ))}

          {/* Y Axis Impact Labels */}
          {['Low', 'Medium', 'High', 'Critical'].map((label, idx) => {
            const y = padTop + chartH - ((idx + 0.5) / 4) * chartH;
            return (
              <text
                key={label}
                x={padLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] font-mono font-medium fill-[#8A929B]"
              >
                {label}
              </text>
            );
          })}

          {/* X Axis Probability Labels */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <text
              key={pct}
              x={getX(pct)}
              y={padTop + chartH + 20}
              textAnchor="middle"
              className="text-[10px] font-mono fill-[#4B5259]"
            >
              {pct}%
            </text>
          ))}

          {/* X Axis Title */}
          <text
            x={padLeft + chartW / 2}
            y={height - 2}
            textAnchor="middle"
            className="text-[11px] font-medium fill-[#8A929B]"
          >
            Estimated Failure Probability (90-Day Horizon) →
          </text>

          {/* Critical Risk Zone corner marker in top right */}
          <rect
            x={getX(60)}
            y={padTop}
            width={chartW - (getX(60) - padLeft)}
            height={chartH / 2}
            className="fill-red-500/10 stroke-red-500/30"
            strokeDasharray="3 3"
          />
          <text
            x={width - padRight - 8}
            y={padTop + 16}
            textAnchor="end"
            className="text-[10px] font-semibold uppercase tracking-wider fill-red-400"
          >
            Immediate Intervention Zone
          </text>

          {/* Machine Nodes */}
          {machines.map((machine) => {
            const cx = getX(machine.failureProbability);
            const cy = getY(machine.operationalImpact);
            const isCritical = machine.riskLevel === 'high';
            const isSelected = selectedMachineId === machine.id;

            return (
              <g
                key={machine.id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectMachine(machine)}
                onMouseEnter={() => setHoveredMachine(machine)}
                onMouseLeave={() => setHoveredMachine(null)}
              >
                {/* Ping ring for critical machines */}
                {isCritical && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 16 : 12}
                    className="fill-red-500/20 stroke-red-500/50 animate-pulse"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 9 : 7}
                  className={`${
                    machine.riskLevel === 'high'
                      ? 'fill-red-500 stroke-[#0B0C0D]'
                      : machine.riskLevel === 'medium'
                      ? 'fill-amber-500 stroke-[#0B0C0D]'
                      : 'fill-green-500 stroke-[#0B0C0D]'
                  } stroke-2 transition-all`}
                />
                <text
                  x={cx}
                  y={cy - 11}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'fill-blue-400 underline'
                      : 'fill-[#E1E4E6]'
                  }`}
                >
                  {machine.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover inspection tooltip */}
        {hoveredMachine && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-md bg-white dark:bg-[#0F1113] text-slate-900 dark:text-[#E1E4E6] text-xs shadow-lg border border-slate-200 dark:border-[#24272A]"
            style={{
              left: `${Math.min(
                Math.max(10, (getX(hoveredMachine.failureProbability) / width) * 100 - 15),
                70
              )}%`,
              top: '10px',
            }}
          >
            <div className="font-bold font-mono text-sm text-slate-900 dark:text-[#E1E4E6]">
              {hoveredMachine.id} — {hoveredMachine.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
              Impact: <strong className="capitalize text-slate-900 dark:text-[#E1E4E6]">{hoveredMachine.operationalImpact}</strong> · Failure Prob: <strong className="font-mono text-red-400">{hoveredMachine.failureProbability}%</strong>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
              Health: <strong className="font-mono text-slate-900 dark:text-[#E1E4E6]">{hoveredMachine.healthScore}</strong> · Issue: {hoveredMachine.primaryIssue}
            </div>
            <div className="mt-1 text-[10px] text-blue-400 font-semibold">
              Click to view machine detail & schedule work order
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
