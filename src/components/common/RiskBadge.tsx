import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md' }) => {
  const configs: Record<
    RiskLevel,
    { label: string; bg: string; text: string; border: string }
  > = {
    low: {
      label: 'Low Risk',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/25',
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/25',
    },
    high: {
      label: 'High Risk',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/25',
    },
  };

  const config = configs[risk] || configs.low;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      id={`risk-badge-${risk}`}
      className={`inline-flex items-center font-medium rounded border ${config.bg} ${config.text} ${config.border} ${padding} whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
};
