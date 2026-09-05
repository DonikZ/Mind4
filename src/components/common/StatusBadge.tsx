import React from 'react';
import { MachineStatus } from '../../types';

interface StatusBadgeProps {
  status: MachineStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  const configs: Record<
    MachineStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    running: {
      label: 'Running',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/25',
      dot: 'bg-green-500',
    },
    idle: {
      label: 'Idle',
      bg: 'bg-slate-100 dark:bg-[#1A1D1F]',
      text: 'text-slate-500 dark:text-[#8A929B]',
      border: 'border-slate-200 dark:border-[#24272A]',
      dot: 'bg-[#8A929B]',
    },
    warning: {
      label: 'Warning',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/25',
      dot: 'bg-amber-500',
    },
    critical: {
      label: 'Critical',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/25',
      dot: 'bg-red-500',
    },
    offline: {
      label: 'Offline',
      bg: 'bg-white dark:bg-[#151719]',
      text: 'text-slate-400 dark:text-[#4B5259]',
      border: 'border-slate-200 dark:border-[#24272A]',
      dot: 'bg-[#4B5259]',
    },
    maintenance: {
      label: 'Maintenance',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/25',
      dot: 'bg-blue-500',
    },
  };

  const config = configs[status] || configs.idle;
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      id={`status-badge-${status}`}
      className={`inline-flex items-center font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} whitespace-nowrap`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
};
