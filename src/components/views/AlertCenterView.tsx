import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Check,
  UserCheck,
  CheckCheck,
} from 'lucide-react';
import { Alert } from '../../types';

interface AlertCenterViewProps {
  alerts: Alert[];
  onAcknowledgeAlerts: (alertIds: string[]) => void;
  onResolveAlerts: (alertIds: string[]) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onAcknowledgeAlerts,
  onResolveAlerts,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const ackCount = alerts.filter((a) => a.status === 'acknowledged').length;
  const resCount = alerts.filter((a) => a.status === 'resolved').length;

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'critical') return a.severity === 'critical';
    if (activeTab === 'high') return a.severity === 'high';
    if (activeTab === 'acknowledged') return a.status === 'acknowledged';
    if (activeTab === 'resolved') return a.status === 'resolved';
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlertIds.length === filteredAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map((a) => a.id));
    }
  };

  return (
    <div id="alert-center-view" className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
          Alert Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
          Real-time threshold triggers, SCADA safety interlocks, and engineering escalations
        </p>
      </div>

      {/* Tabs and Bulk Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${alerts.length})` },
            { id: 'critical', label: `Critical (${criticalCount})` },
            { id: 'high', label: `High (${highCount})` },
            { id: 'acknowledged', label: `Acknowledged (${ackCount})` },
            { id: 'resolved', label: `Resolved (${resCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedAlertIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-500 dark:text-[#8A929B] text-[11px]">
              {selectedAlertIds.length} selected
            </span>
            <button
              onClick={() => {
                onAcknowledgeAlerts(selectedAlertIds);
                setSelectedAlertIds([]);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] border border-slate-200 dark:border-[#24272A] font-semibold text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
            >
              Acknowledge Selected
            </button>
            <button
              onClick={() => {
                onResolveAlerts(selectedAlertIds);
                setSelectedAlertIds([]);
              }}
              className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
            >
              Mark Resolved
            </button>
          </div>
        )}
      </div>

      {/* Alerts Table & Cards */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-500 dark:text-[#8A929B] font-semibold">
                <th className="py-3 pl-4 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedAlertIds.length > 0 &&
                      selectedAlertIds.length === filteredAlerts.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3">Severity</th>
                <th className="py-3">Asset</th>
                <th className="py-3">Alert Message</th>
                <th className="py-3">Observed</th>
                <th className="py-3">Threshold</th>
                <th className="py-3">Timestamp</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24272A] font-mono">
              {filteredAlerts.map((alert) => {
                const isCrit = alert.severity === 'critical';
                const isHigh = alert.severity === 'high';
                const isSelected = selectedAlertIds.includes(alert.id);
                return (
                  <tr
                    key={alert.id}
                    className={`hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors ${
                      isCrit ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(alert.id)}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isCrit
                            ? 'bg-red-600 text-white animate-pulse'
                            : isHigh
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-[#E1E4E6]">
                      {alert.machineId}
                    </td>
                    <td className="py-3 font-sans font-medium text-slate-900 dark:text-[#E1E4E6]">
                      {alert.title}
                    </td>
                    <td className="py-3 text-red-400 font-bold">
                      {alert.value}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-[#8A929B]">
                      {alert.threshold}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-[#8A929B] text-[11px]">
                      {alert.timestamp}
                    </td>
                    <td className="py-3 font-sans capitalize">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          alert.status === 'active'
                            ? 'text-red-400 bg-red-500/15 border border-red-500/25'
                            : alert.status === 'acknowledged'
                            ? 'text-amber-400 bg-amber-500/15 border border-amber-500/25'
                            : 'text-green-400 bg-green-500/10 border border-green-500/25'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-sans">
                      {alert.status === 'active' ? (
                        <button
                          onClick={() => onAcknowledgeAlerts([alert.id])}
                          className="px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] font-medium transition-colors"
                        >
                          Acknowledge
                        </button>
                      ) : alert.status === 'acknowledged' ? (
                        <button
                          onClick={() => onResolveAlerts([alert.id])}
                          className="px-2.5 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-500 font-medium transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">Closed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';
            const isSelected = selectedAlertIds.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`bg-white dark:bg-[#151719] rounded-lg border p-4 shadow-sm space-y-3 transition-colors ${
                  isCrit ? 'border-red-500/30 dark:border-red-500/20 bg-red-50/30 dark:bg-red-950/10' : 'border-slate-200 dark:border-[#24272A]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(alert.id)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="font-mono font-bold text-slate-900 dark:text-[#E1E4E6]">{alert.machineId}</div>
                      <div className="text-[10px] text-slate-500 dark:text-[#8A929B] mt-0.5">{alert.timestamp}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isCrit
                        ? 'bg-red-600 text-white'
                        : isHigh
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#8A929B]">Alert Message</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-[#E1E4E6] mt-0.5">{alert.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#0F1113] p-2.5 rounded border border-slate-100 dark:border-[#24272A]">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#8A929B]">Observed</div>
                    <div className="font-mono text-red-400 font-bold mt-0.5">{alert.value}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#8A929B]">Threshold</div>
                    <div className="font-mono text-slate-600 dark:text-[#C1C8CD] mt-0.5">{alert.threshold}</div>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-slate-100 dark:border-[#24272A]">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                        alert.status === 'active'
                          ? 'text-red-400 bg-red-500/15 border border-red-500/25'
                          : alert.status === 'acknowledged'
                          ? 'text-amber-400 bg-amber-500/15 border border-amber-500/25'
                          : 'text-green-400 bg-green-500/10 border border-green-500/25'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <div>
                    {alert.status === 'active' ? (
                      <button
                        onClick={() => onAcknowledgeAlerts([alert.id])}
                        className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-slate-700 dark:text-[#E1E4E6] font-medium transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : alert.status === 'acknowledged' ? (
                      <button
                        onClick={() => onResolveAlerts([alert.id])}
                        className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-500 font-medium transition-colors shadow-sm"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-[#4B5259]">Closed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
