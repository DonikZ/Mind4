import React from 'react';

interface SensorValueDisplayProps {
  label: string;
  value: number | string;
  unit: string;
  expectedRange?: string;
  status?: 'normal' | 'warning' | 'critical' | 'abnormal';
  change?: string;
}

export const SensorValueDisplay: React.FC<SensorValueDisplayProps> = ({
  label,
  value,
  unit,
  expectedRange,
  status = 'normal',
  change,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'critical':
      case 'abnormal':
        return {
          border: 'border-red-500/30 bg-red-500/10',
          indicator: 'bg-red-500',
          text: 'text-red-400',
          pill: 'bg-red-500/15 text-red-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 bg-amber-500/10',
          indicator: 'bg-amber-500',
          text: 'text-amber-400',
          pill: 'bg-amber-500/15 text-amber-400',
        };
      default:
        return {
          border: 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]',
          indicator: 'bg-green-500',
          text: 'text-slate-900 dark:text-[#E1E4E6]',
          pill: 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B]',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      id={`sensor-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`p-3 rounded-lg border ${styles.border} flex flex-col justify-between transition-colors`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-[#8A929B]">
          {label}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${styles.indicator}`}
          title={status}
        />
      </div>

      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className={`text-xl font-semibold font-mono tracking-tight ${styles.text}`}>
          {value}
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-[#4B5259]">
          {unit}
        </span>
        {change && (
          <span className="ml-auto text-[11px] font-mono font-medium text-slate-500 dark:text-[#8A929B]">
            {change}
          </span>
        )}
      </div>

      {expectedRange && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#4B5259] mt-1 pt-1.5 border-t border-slate-200 dark:border-[#24272A]">
          <span>Envelope:</span>
          <span className="font-mono text-slate-500 dark:text-[#8A929B]">{expectedRange}</span>
        </div>
      )}
    </div>
  );
};
