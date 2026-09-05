import React from 'react';

interface HealthIndicatorProps {
  score: number;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({
  score,
  showBar = true,
  size = 'md',
  className = '',
}) => {
  const getTheme = (val: number) => {
    if (val >= 85) {
      return {
        text: 'text-green-500',
        bar: 'bg-green-500',
        badge: 'bg-green-500/10 text-green-400 border-green-500/30',
        label: 'Healthy',
      };
    }
    if (val >= 70) {
      return {
        text: 'text-amber-500',
        bar: 'bg-amber-500',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        label: 'Attention',
      };
    }
    return {
      text: 'text-red-500',
      bar: 'bg-red-500',
      badge: 'bg-red-500/10 text-red-400 border-red-500/30',
      label: 'Critical',
    };
  };

  const theme = getTheme(score);

  if (size === 'lg') {
    return (
      <div id="health-indicator-lg" className={`flex flex-col gap-1.5 ${className}`}>
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-semibold tracking-tight font-mono ${theme.text}`}>
              {score}
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259] font-medium">/ 100</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${theme.badge}`}>
            {theme.label}
          </span>
        </div>
        {showBar && (
          <div className="h-1.5 w-full bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
              style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div id="health-indicator-sm" className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`font-mono text-xs font-semibold ${theme.text}`}>
          {score}
        </span>
        {showBar && (
          <div className="w-12 h-1 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${theme.bar}`}
              style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="health-indicator-md" className={`flex items-center gap-2.5 ${className}`}>
      <span className={`font-mono text-sm font-semibold tracking-tight ${theme.text}`}>
        {score}
      </span>
      {showBar && (
        <div className="w-16 h-1.5 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${theme.bar}`}
            style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
