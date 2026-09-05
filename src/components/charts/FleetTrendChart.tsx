import React, { useState, useMemo } from 'react';
import {
  FLEET_TREND_DATA_24H,
  FLEET_TREND_DATA_7D,
  FLEET_TREND_DATA_30D,
  FLEET_TREND_DATA_90D,
  TrendPoint,
} from '../../data/mockData';

type MetricType = 'health' | 'temperature' | 'vibration' | 'pressure' | 'power';
type TimeRange = '24H' | '7D' | '30D' | '90D';

interface MetricConfig {
  label: string;
  unit: string;
  minExpected: number;
  maxExpected: number;
  color: string;
  nominal: number;
}

const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  health: {
    label: 'Health Score',
    unit: '/ 100',
    minExpected: 75,
    maxExpected: 100,
    color: '#0284c7', // Sky-600
    nominal: 90,
  },
  temperature: {
    label: 'Spindle/Fluid Temp',
    unit: '°C',
    minExpected: 45,
    maxExpected: 60,
    color: '#d97706', // Amber-600
    nominal: 52,
  },
  vibration: {
    label: 'RMS Vibration',
    unit: 'mm/s',
    minExpected: 1.5,
    maxExpected: 4.5,
    color: '#e11d48', // Rose-600
    nominal: 2.8,
  },
  pressure: {
    label: 'Main System Pressure',
    unit: 'bar',
    minExpected: 5.5,
    maxExpected: 7.2,
    color: '#059669', // Emerald-600
    nominal: 6.4,
  },
  power: {
    label: 'Active Plant Draw',
    unit: 'kW',
    minExpected: 100,
    maxExpected: 135,
    color: '#7c3aed', // Violet-600
    nominal: 120,
  },
};

export const FleetTrendChart: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('24H');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('vibration');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rawData: TrendPoint[] = useMemo(() => {
    switch (range) {
      case '24H':
        return FLEET_TREND_DATA_24H;
      case '7D':
        return FLEET_TREND_DATA_7D;
      case '30D':
        return FLEET_TREND_DATA_30D;
      case '90D':
        return FLEET_TREND_DATA_90D;
    }
  }, [range]);

  const config = METRIC_CONFIGS[selectedMetric];

  // Calculate SVG scales
  const width = 760;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const values = rawData.map((d) => d[selectedMetric]);
  const minVal = Math.min(...values, config.minExpected) * 0.85;
  const maxVal = Math.max(...values, config.maxExpected) * 1.15;

  const getX = (index: number) => {
    return padLeft + (index / (rawData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const norm = (val - minVal) / (maxVal - minVal);
    return padTop + chartHeight - norm * chartHeight;
  };

  // Generate path string
  const points = rawData.map((d, i) => `${getX(i)},${getY(d[selectedMetric])}`);
  const linePath = `M ${points.join(' L ')}`;

  // Area under line
  const areaPath = `M ${points[0]} L ${points.join(' L ')} L ${getX(
    rawData.length - 1
  )},${padTop + chartHeight} L ${getX(0)},${padTop + chartHeight} Z`;

  // Expected range band coordinates
  const expectedTopY = getY(config.maxExpected);
  const expectedBottomY = getY(config.minExpected);
  const expectedHeight = Math.abs(expectedBottomY - expectedTopY);

  // Anomaly regions (indices where isAnomaly is true)
  const anomalyPoints = rawData
    .map((d, i) => ({ ...d, index: i }))
    .filter((d) => d.isAnomaly);

  const hoveredPoint = hoveredIndex !== null ? rawData[hoveredIndex] : null;

  return (
    <div
      id="fleet-condition-trend-card"
      className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]"
    >
      {/* Header with Title and Range Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] tracking-tight">
            Fleet Condition Trend
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8A929B]">
            Time-series telemetry with automated dynamic envelope tracking
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#0F1113] p-0.5 rounded-md border border-slate-200 dark:border-[#24272A]">
          {(['24H', '7D', '30D', '90D'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setHoveredIndex(null);
              }}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                range === r
                  ? 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-900 dark:text-[#E1E4E6] shadow-xs'
                  : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 border-b border-slate-200 dark:border-[#24272A]">
        {(
          [
            'vibration',
            'temperature',
            'health',
            'pressure',
            'power',
          ] as MetricType[]
        ).map((metric) => {
          const isSelected = selectedMetric === metric;
          const mConf = METRIC_CONFIGS[metric];
          return (
            <button
              key={metric}
              onClick={() => {
                setSelectedMetric(metric);
                setHoveredIndex(null);
              }}
              className={`text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 dark:text-[#8A929B] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] hover:text-slate-900 dark:hover:text-[#E1E4E6] border border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: mConf.color }}
              />
              {mConf.label}
            </button>
          );
        })}
      </div>

      {/* Main SVG Visualization */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((step, idx) => {
            const y = padTop + chartHeight * step;
            const gridVal = maxVal - step * (maxVal - minVal);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#24272A"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-[#4B5259]"
                >
                  {gridVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Expected operating envelope band */}
          <rect
            x={padLeft}
            y={Math.min(expectedTopY, expectedBottomY)}
            width={chartWidth}
            height={expectedHeight}
            className="fill-green-500/10"
          />
          <line
            x1={padLeft}
            y1={expectedTopY}
            x2={width - padRight}
            y2={expectedTopY}
            stroke="#22c55e"
            strokeDasharray="2 2"
            strokeOpacity="0.4"
          />
          <line
            x1={padLeft}
            y1={expectedBottomY}
            x2={width - padRight}
            y2={expectedBottomY}
            stroke="#22c55e"
            strokeDasharray="2 2"
            strokeOpacity="0.4"
          />

          {/* Anomaly region vertical highlight band */}
          {anomalyPoints.length > 0 && (
            <rect
              x={getX(anomalyPoints[0].index) - 15}
              y={padTop}
              width={
                getX(anomalyPoints[anomalyPoints.length - 1].index) -
                getX(anomalyPoints[0].index) +
                30
              }
              height={chartHeight}
              className="fill-red-500/15"
            />
          )}

          {/* Shaded Area under Curve */}
          <path
            d={areaPath}
            className="fill-[#1A1D1F]/40"
          />

          {/* Main Telemetry Line */}
          <path
            d={linePath}
            fill="none"
            stroke={config.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {rawData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d[selectedMetric]);
            const isAbnormal = d.isAnomaly;
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : isAbnormal ? 3.5 : 2.5}
                  className={`transition-all duration-150 ${
                    isAbnormal
                      ? 'fill-red-500 stroke-[#0F1113] stroke-2'
                      : isHovered
                      ? 'fill-[#E1E4E6] stroke-blue-500 stroke-2'
                      : 'fill-[#8A929B]'
                  }`}
                />
                {/* Invisible hover zone */}
                <rect
                  x={cx - 15}
                  y={padTop}
                  width={30}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={padTop}
              x2={getX(hoveredIndex)}
              y2={padTop + chartHeight}
              stroke="#8A929B"
              strokeDasharray="2 2"
            />
          )}

          {/* X-Axis labels */}
          {rawData.map((d, i) => {
            if (rawData.length > 10 && i % 2 !== 0 && i !== rawData.length - 1)
              return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[#4B5259]"
              >
                {d.timeLabel}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="absolute z-10 pointer-events-none p-2.5 rounded-md bg-white dark:bg-[#151719] text-slate-900 dark:text-[#E1E4E6] text-xs shadow-xl border border-slate-200 dark:border-[#24272A] transition-transform"
            style={{
              left: `${Math.min(
                Math.max(15, (getX(hoveredIndex) / width) * 100 - 15),
                70
              )}%`,
              top: '15px',
            }}
          >
            <div className="flex items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-[#8A929B] mb-1">
              <span>Timestamp:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#E1E4E6]">
                {hoveredPoint.timestamp}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span className="text-slate-500 dark:text-[#8A929B]">Value:</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-[#E1E4E6]">
                {hoveredPoint[selectedMetric]} {config.unit}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-[#8A929B]">
              <span>Expected:</span>
              <span className="font-mono text-slate-900 dark:text-[#E1E4E6]">
                {config.minExpected} – {config.maxExpected} {config.unit}
              </span>
            </div>
            <div className="mt-1.5 pt-1 border-t border-slate-200 dark:border-[#24272A] flex items-center justify-between">
              <span className="text-[10px] uppercase font-medium tracking-wider text-slate-400 dark:text-[#4B5259]">
                Status:
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  hoveredPoint.isAnomaly
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {hoveredPoint.isAnomaly ? 'Anomaly Detected' : 'Normal Envelope'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend and Anomaly Notification Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-[#24272A] text-[11px] text-slate-500 dark:text-[#8A929B]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-sm bg-green-500/50" />
            <span>Expected Operating Envelope</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-sm bg-red-500/50" />
            <span>Anomaly Excursion Region</span>
          </div>
        </div>
        <div className="font-mono text-slate-500 dark:text-[#8A929B]">
          Last sampled: <strong className="text-slate-900 dark:text-[#E1E4E6]">10:42:18</strong> (1s telemetry pipeline active)
        </div>
      </div>
    </div>
  );
};
