export type MachineStatus = 'running' | 'idle' | 'warning' | 'critical' | 'offline' | 'maintenance';
export type RiskLevel = 'low' | 'medium' | 'high';
export type AnomalySeverity = 'critical' | 'warning' | 'info';
export type AnomalyStatus = 'investigating' | 'acknowledged' | 'resolved';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type MaintenancePriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'overdue' | 'completed';

export interface MachineSensors {
  temperature: number; // °C
  vibration: number;   // mm/s
  pressure: number;    // bar
  rpm: number;         // RPM
  current: number;     // A
  voltage: number;     // V
  power: number;       // kW
}

export interface SensorBaseline {
  min: number;
  max: number;
  nominal: number;
  unit: string;
}

export interface HealthContributor {
  name: string;
  current: string;
  baseline: string;
  deviation: string;
  deviationValue: number;
  status: 'normal' | 'warning' | 'abnormal';
}

export interface MachineFingerprintData {
  temperature: { baseline: number; current: number; minRef: number; maxRef: number };
  vibration: { baseline: number; current: number; minRef: number; maxRef: number };
  pressure: { baseline: number; current: number; minRef: number; maxRef: number };
  rpm: { baseline: number; current: number; minRef: number; maxRef: number };
  current: { baseline: number; current: number; minRef: number; maxRef: number };
  power: { baseline: number; current: number; minRef: number; maxRef: number };
}

export interface Machine {
  id: string; // e.g. 'M-102'
  name: string; // e.g. 'CNC Milling Machine'
  type: string; // 'CNC Milling', 'Hydraulic Press', 'Industrial Pump', etc.
  area: string; // 'Production Area 1', 'Assembly Bay', 'Machining Cell'
  status: MachineStatus;
  healthScore: number; // 0-100
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  failureProbability: number; // % e.g. 78
  operationalImpact: 'low' | 'medium' | 'high' | 'critical';
  primaryIssue?: string;
  lastUpdate: string;
  maintenanceSchedule: string; // e.g. 'Due in 2 days', 'Scheduled 12 Oct'
  
  // Specifications
  manufacturer: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  location: string;
  operatingHours: number;
  
  // Real-time sensor readings
  sensors: MachineSensors;
  
  // Health diagnostics
  healthContributors: HealthContributor[];
  conditionInsight: string;
  recommendedAction: string;
  insightConfidence: number;
  
  // Fingerprint data
  fingerprint: MachineFingerprintData;
  fingerprintDeviation: number; // % e.g. 18
}

export interface Anomaly {
  id: string;
  machineId: string;
  machineName: string;
  sensor: string;
  detectedPattern: string;
  severity: AnomalySeverity;
  confidence: number;
  status: AnomalyStatus;
  detectedTime: string;
  expectedRange: string;
  observedValue: string;
  possibleCause: string;
  recommendedInspection: string;
  timeSeriesData?: { time: string; actual: number; minExpected: number; maxExpected: number }[];
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  severity: AlertSeverity;
  timestamp: string;
  status: 'unacknowledged' | 'acknowledged' | 'resolved';
  thresholdValue: string;
  currentValue: string;
  metric: string;
  acknowledgedBy?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  machineId: string;
  machineName: string;
  eventType: 'maintenance' | 'failure' | 'anomaly' | 'inspection' | 'calibration' | 'part_replacement' | 'downtime' | 'operator_intervention';
  description: string;
  severity: 'critical' | 'warning' | 'resolved' | 'info';
  technician?: string;
  duration?: string;
}

export interface MaintenanceWorkOrder {
  id: string; // e.g. 'WO-8492'
  machineId: string;
  machineName: string;
  type: 'Corrective' | 'Preventive' | 'Predictive' | 'Inspection' | 'Overhaul';
  priority: MaintenancePriorityLevel;
  technician: string;
  scheduledDate: string;
  duration: string;
  status: MaintenanceStatus;
  cost: number;
  issue: string;
  rootCause?: string;
  actionTaken?: string;
  partsReplaced?: string;
  downtime?: string;
  notes?: string;
  beforeCondition?: string;
  afterCondition?: string;
}

export interface PlantAnalytics {
  availability: number; // 94.2%
  mtbf: number;         // 186 h
  mttr: number;         // 2.4 h
  downtime: number;     // 18.2 h
  maintenanceCost: number; // 24800
  totalAssets: number;
  healthyAssets: number;
  attentionAssets: number;
  criticalAssets: number;
  offlineAssets: number;
}

export interface UserProfile {
  id: string;
  name: string;             // Nama
  birthDate: string;        // Tanggal Lahir (YYYY-MM-DD)
  position: string;         // Jabatan
  photoUrl: string;         // Foto Profil
  email: string;
  employeeId: string;
  department: string;
  phoneNumber?: string;
  joinDate?: string;
  bio?: string;
}

export type NavView =
  | 'dashboard'
  | 'machine-overview'
  | 'live-monitoring'
  | 'machine-health'
  | 'anomaly-detection'
  | 'trend-analysis'
  | 'machine-fingerprint'
  | 'maintenance-priority'
  | 'maintenance-log'
  | 'machine-history'
  | 'alert-center'
  | 'report-analytics'
  | 'machine-detail'
  | 'profile'
  | 'login';

export type MachineDetailTab =
  | 'overview'
  | 'health'
  | 'live'
  | 'anomalies'
  | 'trends'
  | 'fingerprint'
  | 'history'
  | 'maintenance';
