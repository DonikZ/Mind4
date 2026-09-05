import React from 'react';
import { X, AlertOctagon, Calendar, Bell, Check, ArrowRight } from 'lucide-react';
import { Anomaly, MaintenanceWorkOrder } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anomalies: Anomaly[];
  workOrders: MaintenanceWorkOrder[];
  onInvestigateAnomaly: (anomaly: Anomaly) => void;
  onViewWorkOrder: (wo: MaintenanceWorkOrder) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  anomalies,
  workOrders,
  onInvestigateAnomaly,
  onViewWorkOrder,
}) => {
  if (!isOpen) return null;

  const criticalAnomalies = anomalies.filter((a) => a.severity === 'critical');
  const upcomingWorkOrders = workOrders.filter((w) => w.status === 'scheduled');

  return (
    <div
      id="notification-drawer-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-slate-50 dark:bg-[#0B0C0D]/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0F1113] h-full border-l border-slate-200 dark:border-[#24272A] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#24272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
              Operational Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Critical Anomalies */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259] mb-2">
              Critical Anomalies ({criticalAnomalies.length})
            </div>
            <div className="space-y-2">
              {criticalAnomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-3 rounded-lg border border-red-900/40 bg-red-950/20"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6]">
                        {anom.machineId} vibration increased 38%
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
                        {anom.sensor}: observed {anom.observedValue} (Confidence {anom.confidence}%)
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-red-900/30">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-[#8A929B]">
                          {anom.detectedTime}
                        </span>
                        <button
                          onClick={() => {
                            onInvestigateAnomaly(anom);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded transition-colors"
                        >
                          Investigate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Reminders */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259] mb-2">
              Scheduled Interventions ({upcomingWorkOrders.length})
            </div>
            <div className="space-y-2">
              {upcomingWorkOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]"
                >
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6]">
                        {wo.machineId} scheduled maintenance
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-0.5">
                        {wo.issue} · Tech: {wo.technician}
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-[#24272A]">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-[#8A929B]">
                          {wo.scheduledDate}
                        </span>
                        <button
                          onClick={() => {
                            onViewWorkOrder(wo);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-900 dark:text-[#E1E4E6] hover:bg-slate-200 dark:hover:bg-[#24272A] rounded transition-colors border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F]"
                        >
                          View schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-[#24272A] bg-slate-50 dark:bg-[#0B0C0D] text-center text-[11px] text-slate-500 dark:text-[#8A929B]">
          Telemetry notifications stream linked to SCADA Gateway
        </div>
      </div>
    </div>
  );
};
