import React, { useState, useEffect } from 'react';
import { X, Wrench, Calendar, Clock, AlertTriangle, Check } from 'lucide-react';
import { Machine, MaintenanceWorkOrder, MaintenancePriorityLevel } from '../../types';

interface CreateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workOrder: MaintenanceWorkOrder) => void;
  preselectedMachineId?: string;
  preselectedIssue?: string;
  machines: Machine[];
}

export const CreateMaintenanceModal: React.FC<CreateMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedMachineId,
  preselectedIssue,
  machines,
}) => {
  const [machineId, setMachineId] = useState(preselectedMachineId || 'M-102');
  const [type, setType] = useState<'Corrective' | 'Preventive' | 'Predictive' | 'Inspection'>('Predictive');
  const [priority, setPriority] = useState<MaintenancePriorityLevel>('critical');
  const [technician, setTechnician] = useState('Marcus Vance');
  const [scheduledDate, setScheduledDate] = useState('2026-09-06');
  const [duration, setDuration] = useState('3.5 h');
  const [issue, setIssue] = useState(preselectedIssue || 'Drive-end bearing high vibration (6.8 mm/s)');
  const [partsReplaced, setPartsReplaced] = useState('SKF NN 3020 K/SP Cylindrical Roller Bearing + O-Ring Seals');
  const [notes, setNotes] = useState('Bearing temperature rising. Induction heater and dial runout gauge required.');

  useEffect(() => {
    if (preselectedMachineId) {
      setMachineId(preselectedMachineId);
      const m = machines.find((item) => item.id === preselectedMachineId);
      if (m?.primaryIssue && !preselectedIssue) {
        setIssue(m.primaryIssue);
      }
    }
    if (preselectedIssue) {
      setIssue(preselectedIssue);
    }
  }, [preselectedMachineId, preselectedIssue, machines]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMachine = machines.find((m) => m.id === machineId);
    const newOrder: MaintenanceWorkOrder = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      machineId,
      machineName: targetMachine ? targetMachine.name : 'Industrial Asset',
      type,
      priority,
      technician,
      scheduledDate,
      duration,
      status: 'scheduled',
      cost: priority === 'critical' ? 1450 : priority === 'high' ? 850 : 350,
      issue,
      partsReplaced,
      notes,
    };
    onSubmit(newOrder);
    onClose();
  };

  return (
    <div
      id="create-maintenance-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0B0C0D]/80 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/25">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                Create Maintenance Work Order
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#8A929B]">
                Condition-based intervention scheduling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
                Target Machine
              </label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.name} ({m.area.split('—')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
                Maintenance Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              >
                <option value="Predictive">Predictive (Condition-Based)</option>
                <option value="Corrective">Corrective (Immediate Repair)</option>
                <option value="Preventive">Preventive (Scheduled Service)</option>
                <option value="Inspection">Inspection & Calibration</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              >
                <option value="critical">Critical (P1 - Immediate)</option>
                <option value="high">High (P2 - 72 Hours)</option>
                <option value="medium">Medium (P3 - This Week)</option>
                <option value="low">Low (P4 - Routine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
                Technician
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              >
                <option value="Marcus Vance">Marcus Vance (Sr. Reliability)</option>
                <option value="Elena Rostova">Elena Rostova (Fluid & Pressure)</option>
                <option value="Robert Chen">Robert Chen (Mechanical Tech)</option>
                <option value="Karl Kowalski">Karl Kowalski (Pumps & Drives)</option>
                <option value="David Miller">David Miller (Compressor Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
              Issue Diagnosis & Anomaly Context
            </label>
            <input
              type="text"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Bearing vibration envelope breach 6.8 mm/s"
              className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
              Required Replacement Parts / Consumables
            </label>
            <input
              type="text"
              value={partsReplaced}
              onChange={(e) => setPartsReplaced(e.target.value)}
              placeholder="e.g. SKF Bearing kit, O-rings, Synthetic oil"
              className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#8A929B] mb-1">
              Technical Procedures & Operational Constraints
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] rounded-md text-slate-900 dark:text-[#E1E4E6] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#24272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Issue Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
