import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { MaintenanceWorkOrder } from '../../types';

interface MaintenanceLogViewProps {
  workOrders: MaintenanceWorkOrder[];
  onCreateMaintenance: () => void;
  onUpdateStatus: (orderId: string, status: MaintenanceWorkOrder['status']) => void;
}

export const MaintenanceLogView: React.FC<MaintenanceLogViewProps> = ({
  workOrders,
  onCreateMaintenance,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const overdueCount = workOrders.filter((w) => w.status === 'overdue').length;
  const inProgressCount = workOrders.filter((w) => w.status === 'in_progress').length;
  const scheduledCount = workOrders.filter((w) => w.status === 'scheduled').length;
  const completedCount = workOrders.filter((w) => w.status === 'completed').length;

  const filteredOrders = workOrders.filter((wo) => {
    if (filterStatus !== 'all' && wo.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        wo.id.toLowerCase().includes(q) ||
        wo.machineId.toLowerCase().includes(q) ||
        wo.issue.toLowerCase().includes(q) ||
        wo.technician.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="maintenance-log-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#24272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
            Maintenance Work Orders
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-0.5">
            Operational maintenance dispatch, planned interventions, and work order audit log
          </p>
        </div>

        <button
          onClick={onCreateMaintenance}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Wrench className="w-3.5 h-3.5" />
          Create Work Order
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-red-900/40 bg-white dark:bg-[#151719]">
          <span className="text-xs text-red-400 font-medium block">
            Overdue Interventions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-red-400">
              {overdueCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8A929B]">Immediate action</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-amber-900/40 bg-white dark:bg-[#151719]">
          <span className="text-xs text-amber-400 font-medium block">
            In Progress Today
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8A929B]">Active bays</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Scheduled (Next 7 Days)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-[#E1E4E6]">
              {scheduledCount}
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259]">Preventive cycle</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <span className="text-xs text-slate-500 dark:text-[#8A929B] font-medium block">
            Completed This Month
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-green-400">
              {completedCount + 78}
            </span>
            <span className="text-xs text-slate-400 dark:text-[#4B5259] font-mono">98.2% on-time</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 dark:text-[#8A929B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, machine, technician, or issue..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md focus:outline-none focus:border-blue-500 font-sans text-slate-900 dark:text-[#E1E4E6] placeholder-slate-400 dark:placeholder-[#4B5259]"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0F1113] p-1 rounded-md border border-slate-200 dark:border-[#24272A] text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterStatus === tab.id
                  ? 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-900 dark:text-[#E1E4E6] border border-slate-200 dark:border-[#24272A] shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113] text-slate-500 dark:text-[#8A929B] font-semibold">
              <th className="py-3 pl-4">Order ID</th>
              <th className="py-3">Machine</th>
              <th className="py-3">Maintenance Task / Issue</th>
              <th className="py-3">Priority</th>
              <th className="py-3">Scheduled Date</th>
              <th className="py-3">Technician</th>
              <th className="py-3">Status</th>
              <th className="py-3 pr-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24272A]">
            {filteredOrders.map((wo) => (
              <tr key={wo.id} className="hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors">
                <td className="py-3 pl-4 font-mono font-bold text-slate-900 dark:text-[#E1E4E6]">
                  {wo.id}
                </td>
                <td className="py-3 font-mono font-semibold text-slate-500 dark:text-[#8A929B]">
                  {wo.machineId}
                </td>
                <td className="py-3 font-medium text-slate-900 dark:text-[#E1E4E6] max-w-xs truncate">
                  {wo.issue}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      wo.priority === 'urgent'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                        : wo.priority === 'high'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                        : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                    }`}
                  >
                    {wo.priority}
                  </span>
                </td>
                <td className="py-3 font-mono text-slate-500 dark:text-[#8A929B]">
                  {wo.scheduledDate}
                </td>
                <td className="py-3 text-slate-500 dark:text-[#8A929B]">
                  {wo.technician}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      wo.status === 'overdue'
                        ? 'text-red-400 bg-red-500/15 border border-red-500/25 font-bold'
                        : wo.status === 'in_progress'
                        ? 'text-amber-400 bg-amber-500/15 border border-amber-500/25 font-semibold'
                        : wo.status === 'completed'
                        ? 'text-green-400 bg-green-500/10 border border-green-500/25'
                        : 'text-slate-500 dark:text-[#8A929B] bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A]'
                    }`}
                  >
                    {wo.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right">
                  {wo.status !== 'completed' ? (
                    <button
                      onClick={() => onUpdateStatus(wo.id, 'completed')}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-[#1A1D1F] hover:bg-green-500/15 text-slate-500 dark:text-[#8A929B] hover:text-green-400 border border-slate-200 dark:border-[#24272A] font-medium transition-colors"
                    >
                      Complete
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-[#4B5259] font-mono">
                      Signed Off
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
