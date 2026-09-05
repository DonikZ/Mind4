import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <div id="table-skeleton" className="w-full animate-pulse space-y-3">
      <div className="h-9 bg-slate-100 dark:bg-[#1A1D1F] rounded-md" />
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-[#24272A]"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={`h-4 bg-slate-100 dark:bg-[#1A1D1F] rounded ${
                c === 0 ? 'w-28' : c === 1 ? 'w-36' : 'w-20'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div
      id="chart-skeleton"
      className={`w-full ${height} bg-white dark:bg-[#151719] rounded-lg border border-slate-200 dark:border-[#24272A] p-6 flex flex-col justify-between animate-pulse`}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
        <div className="h-4 w-24 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-2 w-full bg-slate-100 dark:bg-[#1A1D1F]/70 rounded" />
        <div className="h-2 w-5/6 bg-slate-100 dark:bg-[#1A1D1F]/70 rounded" />
        <div className="h-2 w-4/6 bg-slate-100 dark:bg-[#1A1D1F]/70 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-12 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
        <div className="h-3 w-12 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
        <div className="h-3 w-12 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
        <div className="h-3 w-12 bg-slate-100 dark:bg-[#1A1D1F] rounded" />
      </div>
    </div>
  );
};
