import React, { useState } from 'react';
import {
  Wrench,
  AlertOctagon,
  ArrowLeft,
  Clock,
  Activity,
  Layers,
  TrendingUp,
  History,
  ClipboardList,
  Fingerprint,
  HeartPulse,
  Sliders,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Machine, Anomaly, MaintenanceWorkOrder, TimelineEvent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { HealthIndicator } from '../common/HealthIndicator';
import { SensorValueDisplay } from '../common/SensorValueDisplay';
import { MachineFingerprintRadar } from '../charts/MachineFingerprintRadar';
import { SensorLiveStreamChart, LiveSensorPoint } from '../charts/SensorLiveStreamChart';

interface MachineDetailViewProps {
  machine: Machine;
  anomalies: Anomaly[];
  workOrders: MaintenanceWorkOrder[];
  historyEvents: TimelineEvent[];
  onBack: () => void;
  onInvestigateAnomaly: (anomalyId: string) => void;
  onCreateMaintenance: (machineId: string, issue: string) => void;
  initialTab?: string;
}

export const MachineDetailView: React.FC<MachineDetailViewProps> = ({
  machine,
  anomalies,
  workOrders,
  historyEvents,
  onBack,
  onInvestigateAnomaly,
  onCreateMaintenance,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedLiveSensors, setSelectedLiveSensors] = useState<string[]>([
    'vibration',
    'temperature',
  ]);

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-[#1A1D1F] flex items-center justify-center">
          <Clock className="w-8 h-8 text-slate-400 dark:text-[#4B5259]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-[#E1E4E6]">Tidak Ada Aset yang Dipilih</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const machineAnomalies = anomalies.filter((a) => a.machineId === machine.id);
  const machineOrders = workOrders.filter((w) => w.machineId === machine.id);
  const machineHistory = historyEvents.filter((e) => e.machineId === machine.id);

  // Live stream fake feed data for the Live Data tab
  const liveStreamData: LiveSensorPoint[] = [
    { time: '10:41:00', temperature: 71.8, vibration: 6.4, pressure: 6.2, rpm: 1850, current: 36.2, power: 22.4 },
    { time: '10:41:15', temperature: 72.0, vibration: 6.5, pressure: 6.1, rpm: 1852, current: 36.4, power: 22.5 },
    { time: '10:41:30', temperature: 72.1, vibration: 6.7, pressure: 6.2, rpm: 1849, current: 36.8, power: 22.8 },
    { time: '10:41:45', temperature: 72.3, vibration: 6.8, pressure: 6.2, rpm: 1850, current: 37.1, power: 23.0 },
    { time: '10:42:00', temperature: 72.4, vibration: 6.8, pressure: 6.2, rpm: 1851, current: 37.0, power: 22.9 },
    { time: '10:42:15', temperature: 72.6, vibration: 6.9, pressure: 6.3, rpm: 1854, current: 37.2, power: 23.1 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'health', label: 'Health Breakdown', icon: HeartPulse },
    { id: 'live', label: 'Live Telemetry', icon: Activity },
    { id: 'anomalies', label: `Anomalies (${machineAnomalies.length})`, icon: AlertOctagon },
    { id: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
    { id: 'maintenance', label: `Maintenance (${machineOrders.length})`, icon: ClipboardList },
    { id: 'history', label: 'History Log', icon: History },
  ];

  return (
    <div id="machine-detail-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Back to Overview Nav */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Machine Overview
      </button>

      {/* SECTION 14: Header Bar */}
      <div className="p-6 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719] shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-[#E1E4E6]">
                {machine.id}
              </span>
              <span className="text-slate-400 dark:text-[#4B5259]">·</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                {machine.name}
              </span>
              <StatusBadge status={machine.status} size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[#8A929B] font-mono">
              <span>{machine.type}</span>
              <span>·</span>
              <span>{machine.area}</span>
              <span>·</span>
              <span>Asset Serial: {machine.serialNumber}</span>
              <span>·</span>
              <span>Last update: {machine.lastUpdate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {machineAnomalies.length > 0 && (
              <button
                onClick={() => onInvestigateAnomaly(machineAnomalies[0].id)}
                className="px-3.5 py-2 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Investigate Anomaly
              </button>
            )}
            <button
              onClick={() =>
                onCreateMaintenance(
                  machine.id,
                  `Condition-based check for ${machine.primaryIssue || 'vibration and bearing check'}`
                )
              }
              className="px-3.5 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              Create Maintenance
            </button>
          </div>
        </div>

        {/* Header Key KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-200 dark:border-[#24272A]">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-[#8A929B] uppercase tracking-wider font-bold">
              Health Score
            </span>
            <div className="mt-1">
              <HealthIndicator score={machine.healthScore} size="md" />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-[#8A929B] uppercase tracking-wider font-bold">
              Risk Level
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <RiskBadge risk={machine.riskLevel} size="md" />
              <span className="text-xs font-mono text-slate-500 dark:text-[#8A929B]">
                Score: {machine.riskScore}
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-[#8A929B] uppercase tracking-wider font-bold">
              Failure Probability
            </span>
            <div className="mt-1 text-base font-bold font-mono text-red-400">
              {machine.failureProbability}% (90-Day)
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-[#8A929B] uppercase tracking-wider font-bold">
              Operational Impact
            </span>
            <div className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-[#E1E4E6]">
              {machine.operationalImpact} Impact
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-[#24272A] overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-white dark:bg-[#151719] rounded-t-md'
                  : 'border-transparent text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:border-slate-200 dark:hover:border-[#24272A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Telemetry Sensor Gauges Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#4B5259] mb-3">
              Current Operating State (Live Telemetry)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <SensorValueDisplay
                label="Temperature"
                value={machine.sensors.temperature}
                unit="°C"
                expectedRange="45–65 °C"
                status={machine.sensors.temperature > 70 ? 'critical' : machine.sensors.temperature > 62 ? 'warning' : 'normal'}
              />
              <SensorValueDisplay
                label="Vibration"
                value={machine.sensors.vibration}
                unit="mm/s"
                expectedRange="1.5–4.5 mm/s"
                status={machine.sensors.vibration > 6.0 ? 'critical' : machine.sensors.vibration > 4.5 ? 'warning' : 'normal'}
              />
              <SensorValueDisplay
                label="Pressure"
                value={machine.sensors.pressure}
                unit="bar"
                expectedRange="5.5–7.2 bar"
                status={machine.sensors.pressure < 5.0 || machine.sensors.pressure > 7.5 ? 'warning' : 'normal'}
              />
              <SensorValueDisplay
                label="Shaft RPM"
                value={machine.sensors.rpm.toLocaleString()}
                unit="RPM"
                expectedRange="1,600–2,000"
                status="normal"
              />
              <SensorValueDisplay
                label="Current"
                value={machine.sensors.current}
                unit="A"
                expectedRange="28–38 A"
                status={machine.sensors.current > 38 ? 'warning' : 'normal'}
              />
              <SensorValueDisplay
                label="Active Power"
                value={machine.sensors.power}
                unit="kW"
                expectedRange="18–26 kW"
                status={machine.sensors.power > 26 ? 'warning' : 'normal'}
              />
            </div>
          </div>

          {/* Condition Insight Alert Banner */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 border border-blue-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#E1E4E6]">
                Condition Insight & Diagnostic Inference
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#8A929B] mt-1 leading-relaxed">
                {machine.conditionInsight}
              </p>
              <div className="mt-2 text-xs font-semibold text-blue-400 flex items-center gap-1">
                <span>Recommended Action: {machine.recommendedAction}</span>
              </div>
            </div>
          </div>

          {/* Machine Fingerprint Radar Summary */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] mb-4">
              Operational Fingerprint Signature
            </h3>
            <MachineFingerprintRadar machine={machine} />
          </div>
        </div>
      )}

      {/* TAB CONTENT: HEALTH BREAKDOWN */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                  Health Score Contributors Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                  Quantitative subsystem impact contributing to current score of {machine.healthScore}/100
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] font-semibold">
                    <th className="pb-2.5">Subsystem Contributor</th>
                    <th className="pb-2.5">Observed Value</th>
                    <th className="pb-2.5">Nominal Baseline</th>
                    <th className="pb-2.5">Deviation</th>
                    <th className="pb-2.5">Subsystem Health</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24272A] font-mono">
                  {machine.healthContributors.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-100 dark:hover:bg-[#1A1D1F]">
                      <td className="py-3 font-sans font-semibold text-slate-900 dark:text-[#E1E4E6]">
                        {c.name}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-[#E1E4E6]">
                        {c.current}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-[#8A929B]">
                        {c.baseline}
                      </td>
                      <td className="py-3">
                        <span
                          className={
                            c.status === 'critical'
                              ? 'text-red-400 font-bold'
                              : c.status === 'warning'
                              ? 'text-amber-400 font-bold'
                              : 'text-green-400'
                          }
                        >
                          {c.deviation}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                c.score < 70
                                  ? 'bg-red-500'
                                  : c.score < 85
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${c.score}%` }}
                            />
                          </div>
                          <span className="text-slate-900 dark:text-[#E1E4E6]">{c.score}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LIVE TELEMETRY */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                    High-Frequency Sensor Stream (1s Sampling)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                  Active connection: Gateway node gw-line1.prod (Latency: 14ms)
                </p>
              </div>

              {/* Sensor selector chips */}
              <div className="flex items-center gap-2">
                {['vibration', 'temperature', 'pressure', 'rpm', 'current', 'power'].map((sensor) => {
                  const isChecked = selectedLiveSensors.includes(sensor);
                  return (
                    <button
                      key={sensor}
                      onClick={() => {
                        if (isChecked) {
                          if (selectedLiveSensors.length > 1) {
                            setSelectedLiveSensors(selectedLiveSensors.filter((s) => s !== sensor));
                          }
                        } else {
                          setSelectedLiveSensors([...selectedLiveSensors, sensor]);
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                        isChecked
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                      }`}
                    >
                      {sensor}
                    </button>
                  );
                })}
              </div>
            </div>

            <SensorLiveStreamChart
              data={liveStreamData}
              activeSensors={selectedLiveSensors}
              height={280}
            />
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANOMALIES */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] mb-3">
              Detected Anomalies on {machine.id}
            </h3>

            {machineAnomalies.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-[#8A929B] py-6 text-center">
                No active anomalies detected on this asset. Operating within nominal baseline envelope.
              </p>
            ) : (
              <div className="space-y-3">
                {machineAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    className="p-4 rounded-lg border border-red-900/40 bg-red-950/20 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                          {anom.severity}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#E1E4E6]">
                          {anom.sensor}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A929B]">
                          {anom.detectedTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-[#E1E4E6]">
                        {anom.detectedPattern} (Observed: {anom.observedValue} vs expected {anom.expectedRange})
                      </p>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A929B] mt-1 font-mono">
                        Confidence: {anom.confidence}% · Probable root cause: {anom.possibleCause}
                      </div>
                    </div>

                    <button
                      onClick={() => onInvestigateAnomaly(anom.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors"
                    >
                      Investigate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINGERPRINT */}
      {activeTab === 'fingerprint' && (
        <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <MachineFingerprintRadar machine={machine} />
        </div>
      )}

      {/* TAB CONTENT: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6]">
                  Maintenance Records & Planned Work Orders
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                  Scheduled maintenance cycles and active interventions for {machine.id}
                </p>
              </div>
              <button
                onClick={() => onCreateMaintenance(machine.id, 'Routine scheduled check')}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white"
              >
                + New Work Order
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B] font-semibold">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Issue / Task</th>
                    <th className="pb-2">Priority</th>
                    <th className="pb-2">Scheduled</th>
                    <th className="pb-2">Technician</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24272A]">
                  {machineOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-slate-100 dark:hover:bg-[#1A1D1F]">
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-[#E1E4E6]">{wo.id}</td>
                      <td className="py-3 text-slate-900 dark:text-[#E1E4E6] font-medium">{wo.issue}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            wo.priority === 'critical' || wo.priority === 'urgent'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                              : 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-500 dark:text-[#8A929B] border border-slate-200 dark:border-[#24272A]'
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-500 dark:text-[#8A929B]">{wo.scheduledDate}</td>
                      <td className="py-3 text-slate-500 dark:text-[#8A929B]">{wo.technician}</td>
                      <td className="py-3 text-right">
                        <span className="capitalize font-medium text-slate-500 dark:text-[#8A929B]">
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="p-5 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#151719]">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E1E4E6] mb-4">
            Asset Timeline & Engineering Log
          </h3>

          <div className="space-y-4">
            {machineHistory.map((evt) => (
              <div key={evt.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200 dark:border-[#24272A] bg-white dark:bg-[#0F1113]">
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-[#8A929B] w-24 shrink-0">
                  {evt.timestamp}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold capitalize text-slate-900 dark:text-[#E1E4E6]">
                      {evt.type}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A] text-slate-500 dark:text-[#8A929B]">
                      {evt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#8A929B]">
                    {evt.description}
                  </p>
                  {evt.technician && (
                    <div className="text-[11px] text-slate-400 dark:text-[#4B5259] mt-1">
                      Assigned: {evt.technician} {evt.duration ? `· Duration: ${evt.duration}` : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
