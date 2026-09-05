import React from 'react';

export interface LiveSensorPoint {
  time: string;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  current: number;
  power: number;
}

interface SensorLiveStreamChartProps {
  data: LiveSensorPoint[];
  activeSensors: string[];
  height?: number;
}

const SENSOR_META: Record<
  string,
  { label: string; unit: string; color: string; min: number; max: number; envMin: number; envMax: number }
> = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    color: '#d97706',
    min: 40,
    max: 90,
    envMin: 50,
    envMax: 65,
  },
  vibration: {
    label: 'Vibration',
    unit: 'mm/s',
    color: '#e11d48',
    min: 1,
    max: 10,
    envMin: 2.5,
    envMax: 4.5,
  },
  pressure: {
    label: 'Pressure',
    unit: 'bar',
    color: '#059669',
    min: 4,
    max: 10,
    envMin: 5.5,
    envMax: 7.5,
  },
  rpm: {
    label: 'RPM',
    unit: 'rpm',
    color: '#0284c7',
    min: 1000,
    max: 2500,
    envMin: 1600,
    envMax: 2000,
  },
  current: {
    label: 'Current',
    unit: 'A',
    color: '#7c3aed',
    min: 10,
    max: 60,
    envMin: 25,
    envMax: 40,
  },
  power: {
    label: 'Power',
    unit: 'kW',
    color: '#475569',
    min: 10,
    max: 40,
    envMin: 18,
    envMax: 28,
  },
};

export const SensorLiveStreamChart: React.FC<SensorLiveStreamChartProps> = ({
  data,
  activeSensors,
  height = 260,
}) => {
  const width = 800;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 font-mono">
        Waiting for telemetry pipeline sync...
      </div>
    );
  }

  // Use primary active sensor for Y scale
  const primarySensor = activeSensors[0] || 'vibration';
  const meta = SENSOR_META[primarySensor] || SENSOR_META.vibration;

  const getY = (val: number, min: number, max: number) => {
    const norm = (val - min) / (max - min);
    return padTop + chartH - Math.max(0, Math.min(1, norm)) * chartH;
  };

  const getX = (index: number) => {
    return padLeft + (index / Math.max(1, data.length - 1)) * chartW;
  };

  // Envelope band for primary sensor
  const envTop = getY(meta.envMax, meta.min, meta.max);
  const envBottom = getY(meta.envMin, meta.min, meta.max);
  const envH = Math.abs(envBottom - envTop);

  return (
    <div id="sensor-livestream-chart" className="w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((step, idx) => {
          const y = padTop + chartH * step;
          const labelVal = meta.max - step * (meta.max - meta.min);
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
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-[#8A929B]"
              >
                {labelVal.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Primary Envelope Band */}
        <rect
          x={padLeft}
          y={Math.min(envTop, envBottom)}
          width={chartW}
          height={envH}
          className="fill-emerald-500/10 dark:fill-emerald-500/5"
        />
        <line
          x1={padLeft}
          y1={envTop}
          x2={width - padRight}
          y2={envTop}
          stroke="#10b981"
          strokeDasharray="2 2"
          strokeOpacity="0.4"
        />
        <line
          x1={padLeft}
          y1={envBottom}
          x2={width - padRight}
          y2={envBottom}
          stroke="#10b981"
          strokeDasharray="2 2"
          strokeOpacity="0.4"
        />

        {/* Sensor Lines */}
        {activeSensors.map((sKey) => {
          const sMeta = SENSOR_META[sKey];
          if (!sMeta) return null;

          const points = data.map((d, i) => {
            const raw = (d as any)[sKey] ?? sMeta.min;
            const cx = getX(i);
            const cy = getY(raw, sMeta.min, sMeta.max);
            return `${cx},${cy}`;
          });

          return (
            <g key={sKey}>
              <path
                d={`M ${points.join(' L ')}`}
                fill="none"
                stroke={sMeta.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pulsing latest point */}
              {data.length > 0 && (
                <circle
                  cx={getX(data.length - 1)}
                  cy={getY(
                    (data[data.length - 1] as any)[sKey],
                    sMeta.min,
                    sMeta.max
                  )}
                  r={4}
                  fill={sMeta.color}
                  className="stroke-[#0F1113] stroke-1"
                />
              )}
            </g>
          );
        })}

        {/* Time labels */}
        {data.map((d, i) => {
          if (i % 3 !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={i}
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] font-mono fill-[#8A929B]"
            >
              {d.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
