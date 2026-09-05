import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PlantAnalytics } from '../../types';

interface ReportAnalyticsViewProps {
  analytics: PlantAnalytics;
  onGenerateReport: (template: string, format: string) => void;
}

export const ReportAnalyticsView: React.FC<ReportAnalyticsViewProps> = ({
  analytics,
  onGenerateReport,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('monthly-reliability');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);

  const failureModes = [
    { mode: 'Bearing Degradation & Spalling', pct: 41, color: '#e11d48' },
    { mode: 'Seal Failure & Fluid Leakage', pct: 22, color: '#d97706' },
    { mode: 'Electrical & Motor Winding Fault', pct: 18, color: '#0284c7' },
    { mode: 'Shaft Misalignment & Soft Foot', pct: 11, color: '#7c3aed' },
    { mode: 'Structural Resonance / Other', pct: 8, color: '#64748b' },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onGenerateReport(selectedTemplate, selectedFormat);
    }, 800);
  };

  return (
    <div id="report-analytics-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Executive Reports & Plant Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
          Asset reliability metrics, root-cause failure mode Pareto distributions, and compliance report compilation
        </p>
      </div>

      {/* Executive Reliability KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Plant Availability (OEE)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-green-400">
              {analytics.availability}%
            </span>
            <span className="text-[11px] text-green-400 font-mono">+0.8%</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Mean Time Between Failures
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {analytics.mtbfHours} h
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259] font-mono">Target: 180 h</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Mean Time To Repair (MTTR)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {analytics.mttrHours} h
            </span>
            <span className="text-[11px] text-green-400 font-mono">-0.4 h</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Unplanned Downtime
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {analytics.downtimeHours} h
            </span>
            <span className="text-[11px] text-slate-400 dark:text-[#4B5259] font-mono">This month</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Maintenance Expenditure
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              ${(analytics.maintenanceCost / 1000).toFixed(1)}k
            </span>
            <span className="text-[11px] text-green-400 font-mono">-12% vs bgt</span>
          </div>
        </div>
      </div>

      {/* Failure Mode Pareto Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pareto Chart */}
        <div className="lg:col-span-7 p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                Failure Mode Distribution (ISO 14224)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                Percentage breakdown of root cause failure mechanisms over 12-month trailing horizon
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {failureModes.map((item) => (
              <div key={item.mode} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-[#E1E4E6]">
                    {item.mode}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-[#E1E4E6]">
                    {item.pct}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#1A1D1F] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Generator Module */}
        <div className="lg:col-span-5 p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
              Automated Report Compiler
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8A929B]">
              Generate standardized reliability audits and shift sign-off packages
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] block">
              Report Template
            </span>
            <div className="space-y-1.5">
              {[
                { id: 'monthly-reliability', label: 'Monthly Reliability & OEE Audit' },
                { id: 'condition-summary', label: 'Plant Condition & Health Summary' },
                { id: 'shift-handover', label: 'Shift Handover & Anomaly Log' },
              ].map((tmpl) => (
                <label
                  key={tmpl.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                    selectedTemplate === tmpl.id
                      ? 'border-blue-500/80 bg-blue-500/10 text-slate-900 dark:text-[#E1E4E6] font-semibold'
                      : 'border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:border-slate-300 dark:hover:border-[#4B5259]'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    checked={selectedTemplate === tmpl.id}
                    onChange={() => setSelectedTemplate(tmpl.id)}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>{tmpl.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Radio */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A929B] block">
              Output Format
            </span>
            <div className="flex items-center gap-3 text-xs">
              {['PDF', 'CSV', 'XLSX'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 rounded-md font-mono font-bold transition-colors ${
                    selectedFormat === fmt
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <span>Compiling telemetry datasets...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Compile & Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
