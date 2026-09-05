import React, { useState, useEffect } from 'react';
import {
  MOCK_MACHINES,
  MOCK_ANOMALIES,
  MOCK_ALERTS,
  MOCK_WORK_ORDERS,
  MOCK_TIMELINE_EVENTS,
  MOCK_PLANT_ANALYTICS,
} from './data/mockData';
import {
  Machine,
  Anomaly,
  Alert,
  MaintenanceWorkOrder,
  TimelineEvent,
  NavView,
} from './types';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandSearch } from './components/layout/CommandSearch';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AnomalyDrawer } from './components/views/AnomalyDrawer';
import { CreateMaintenanceModal } from './components/common/CreateMaintenanceModal';
import { ToastContainer, ToastItem } from './components/common/ToastContainer';

// View components
import { DashboardView } from './components/views/DashboardView';
import { MachineOverviewView } from './components/views/MachineOverviewView';
import { MachineDetailView } from './components/views/MachineDetailView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { AnomalyDetectionView } from './components/views/AnomalyDetectionView';
import { TrendAnalysisView } from './components/views/TrendAnalysisView';
import { MachineFingerprintView } from './components/views/MachineFingerprintView';
import { MaintenancePriorityView } from './components/views/MaintenancePriorityView';
import { MaintenanceLogView } from './components/views/MaintenanceLogView';
import { MachineHistoryView } from './components/views/MachineHistoryView';
import { AlertCenterView } from './components/views/AlertCenterView';
import { ReportAnalyticsView } from './components/views/ReportAnalyticsView';
import { ProfileView } from './components/views/ProfileView';
import { LoginView } from './components/views/LoginView';
import { UserProfile } from './types';
import {
  getSavedUserProfile,
  saveUserProfile,
  getSavedAuthState,
  saveAuthState,
} from './data/mockUser';
import { mqttService, MqttConfig } from './services/mqttService';
import { MqttSettingsModal } from './components/common/MqttSettingsModal';

export default function App() {
  // User Authentication & Profile state
  const [user, setUser] = useState<UserProfile>(getSavedUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getSavedAuthState);

  // MQTT Connection state
  const [isMqttModalOpen, setIsMqttModalOpen] = useState<boolean>(false);
  const [mqttConnected, setMqttConnected] = useState<boolean>(false);
  const [mqttConfig, setMqttConfig] = useState<MqttConfig>({
    url: 'wss://broker.emqx.io:8084/mqtt',
    topic: 'factory/machines/+/telemetry'
  });

  // Notifications / Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info' | 'critical', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle MQTT Connection & Subscription
  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeConnection: (() => void) | undefined;

    const connectMqtt = async () => {
      try {
        // Subscribe to connection state changes
        unsubscribeConnection = mqttService.onConnectionChange((connected) => {
          setMqttConnected(connected);
          if (connected) {
            addToast('success', 'MQTT Terhubung', `Koneksi aktif ke ${mqttConfig.url}`);
          } else {
            addToast('warning', 'MQTT Terputus', `Koneksi ke broker terputus.`);
          }
        });

        await mqttService.connect(mqttConfig);

        unsubscribeMessage = mqttService.subscribeToMessages((topic, payload) => {
          // Payload format: { machineId: "M-102", sensors: { temperature: 75.2, ... } }
          if (payload && payload.machineId && payload.sensors) {
            setMachines((prev) => {
              const existingMachine = prev.find(m => m.id === payload.machineId);
              
              if (existingMachine) {
                return prev.map((m) => {
                  if (m.id === payload.machineId) {
                    return {
                      ...m,
                      sensors: {
                        ...m.sensors,
                        ...payload.sensors
                      },
                      lastUpdate: new Date().toLocaleTimeString()
                    };
                  }
                  return m;
                });
              } else {
                // Dynamically create a new machine instance if it doesn't exist
                const newMachine: Machine = {
                  id: payload.machineId,
                  name: payload.name || `Asset ${payload.machineId}`,
                  type: payload.type || 'Unknown Type',
                  area: payload.area || 'Discovered Area',
                  status: payload.status || 'healthy',
                  healthScore: payload.healthScore || 100,
                  riskLevel: 'low',
                  riskScore: 10,
                  failureProbability: 2,
                  operationalImpact: 'medium',
                  primaryIssue: 'None',
                  lastUpdate: new Date().toLocaleTimeString(),
                  maintenanceSchedule: 'N/A',
                  manufacturer: 'Discovered Device',
                  model: 'Generic Sensor Node',
                  serialNumber: 'N/A',
                  installationDate: new Date().toISOString().split('T')[0],
                  location: 'N/A',
                  operatingHours: 0,
                  sensors: {
                    temperature: payload.sensors.temperature || 0,
                    vibration: payload.sensors.vibration || 0,
                    pressure: payload.sensors.pressure || 0,
                    rpm: payload.sensors.rpm || 0,
                    current: payload.sensors.current || 0,
                    voltage: payload.sensors.voltage || 0,
                    power: payload.sensors.power || 0,
                  },
                  healthContributors: []
                };
                return [...prev, newMachine];
              }
            });

            // Also update selectedMachine if it's currently focused
            setSelectedMachine((prev) => {
              if (prev && prev.id === payload.machineId) {
                return {
                  ...prev,
                  sensors: { ...prev.sensors, ...payload.sensors },
                  lastUpdate: new Date().toLocaleTimeString()
                };
              }
              // If no machine is selected yet, we auto-select the first one that comes in
              if (!prev) {
                 return {
                  id: payload.machineId,
                  name: payload.name || `Asset ${payload.machineId}`,
                  type: payload.type || 'Unknown Type',
                  area: payload.area || 'Discovered Area',
                  status: payload.status || 'healthy',
                  healthScore: payload.healthScore || 100,
                  riskLevel: 'low',
                  riskScore: 10,
                  failureProbability: 2,
                  operationalImpact: 'medium',
                  primaryIssue: 'None',
                  lastUpdate: new Date().toLocaleTimeString(),
                  maintenanceSchedule: 'N/A',
                  manufacturer: 'Discovered Device',
                  model: 'Generic Sensor Node',
                  serialNumber: 'N/A',
                  installationDate: new Date().toISOString().split('T')[0],
                  location: 'N/A',
                  operatingHours: 0,
                  sensors: {
                    temperature: payload.sensors.temperature || 0,
                    vibration: payload.sensors.vibration || 0,
                    pressure: payload.sensors.pressure || 0,
                    rpm: payload.sensors.rpm || 0,
                    current: payload.sensors.current || 0,
                    voltage: payload.sensors.voltage || 0,
                    power: payload.sensors.power || 0,
                  },
                  healthContributors: []
                } as Machine;
              }
              return prev;
            });
          }
        });
      } catch (error) {
        console.error('MQTT connection error:', error);
        setMqttConnected(false);
      }
    };

    if (isLoggedIn) {
      connectMqtt();
    }

    return () => {
      if (unsubscribeMessage) unsubscribeMessage();
      if (unsubscribeConnection) unsubscribeConnection();
      mqttService.disconnect();
      setMqttConnected(false);
    };
  }, [mqttConfig, isLoggedIn]);

  // Navigation and Selection state
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [analytics, setAnalytics] = useState({
    availability: 0,
    mtbf: 0,
    mttr: 0,
    downtime: 0,
    maintenanceCost: 0,
    totalAssets: 0,
    healthyAssets: 0,
    attentionAssets: 0,
    criticalAssets: 0,
    offlineAssets: 0,
  });

  // App Layout & Preferences
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [refreshRate, setRefreshRate] = useState<'1s' | '5s' | 'pause'>('1s');
  const [selectedPlant, setSelectedPlant] = useState('Plant A — Production Floor');

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [investigatingAnomaly, setInvestigatingAnomaly] = useState<Anomaly | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createModalMachineId, setCreateModalMachineId] = useState<string>('M-102');
  const [createModalIssue, setCreateModalIssue] = useState<string>('');
  const [overviewFilterStatus, setOverviewFilterStatus] = useState<string | undefined>();

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handler: Open Machine Detail
  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setCurrentView('machine-detail');
  };

  // Handler: Open Anomaly Drawer
  const handleInvestigateAnomaly = (anomalyOrId: Anomaly | string) => {
    const target =
      typeof anomalyOrId === 'string'
        ? anomalies.find((a) => a.id === anomalyOrId) || anomalies[0]
        : anomalyOrId;
    setInvestigatingAnomaly(target);
  };

  // Handler: Acknowledge Anomaly
  const handleAcknowledgeAnomaly = (anomalyId: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomalyId ? { ...a, acknowledged: true } : a))
    );
    addToast('info', 'Anomaly Acknowledged', `${anomalyId} telemetry deviation logged to supervisor audit.`);
  };

  // Handler: Resolve Anomaly
  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomalyId ? { ...a, resolved: true, acknowledged: true } : a))
    );
    setInvestigatingAnomaly(null);
    addToast('success', 'Anomaly Closed', `${anomalyId} marked resolved. System status updated.`);
  };

  // Handler: Create Maintenance Modal trigger
  const handleOpenCreateMaintenance = (machineId: string = 'M-102', issue: string = '') => {
    setCreateModalMachineId(machineId);
    setCreateModalIssue(issue);
    setCreateModalOpen(true);
  };

  // Handler: Submit Maintenance Work Order
  const handleSaveWorkOrder = (newOrder: MaintenanceWorkOrder) => {
    setWorkOrders((prev) => [newOrder, ...prev]);

    // Also add to timeline events
    const newEvent: TimelineEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: 'Just now',
      date: 'Today',
      time: new Date().toTimeString().slice(0, 5),
      machineId: newOrder.machineId,
      machineName: machines.find((m) => m.id === newOrder.machineId)?.name || 'Machine',
      eventType: 'maintenance',
      severity: newOrder.priority === 'critical' ? 'critical' : 'warning',
      description: `Work order ${newOrder.id} dispatched: ${newOrder.issue}`,
      technician: newOrder.technician,
    };
    setEvents((prev) => [newEvent, ...prev]);

    addToast(
      'success',
      'Work Order Created',
      `Order ${newOrder.id} successfully queued for ${newOrder.machineId} (${newOrder.technician}).`
    );
  };

  // Handler: Complete Maintenance Order
  const handleUpdateOrderStatus = (orderId: string, status: MaintenanceWorkOrder['status']) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === orderId ? { ...wo, status } : wo))
    );
    addToast('success', 'Order Updated', `Maintenance ${orderId} marked as ${status}.`);
  };

  // Handler: Acknowledge alerts
  const handleAcknowledgeAlerts = (alertIds: string[]) => {
    setAlerts((prev) =>
      prev.map((a) => (alertIds.includes(a.id) ? { ...a, status: 'acknowledged' } : a))
    );
    addToast('info', 'Alerts Acknowledged', `${alertIds.length} alert(s) acknowledged.`);
  };

  // Handler: Resolve alerts
  const handleResolveAlerts = (alertIds: string[]) => {
    setAlerts((prev) =>
      prev.map((a) => (alertIds.includes(a.id) ? { ...a, status: 'resolved' } : a))
    );
    addToast('success', 'Alerts Resolved', `${alertIds.length} alert condition(s) cleared.`);
  };

  // Handler: Manual sync
  const handleManualSync = () => {
    addToast('info', 'SCADA Sync Complete', 'Pulled latest high-frequency packets from gateway.');
  };

  // Handler: Generate Report
  const handleGenerateReport = (template: string, format: string) => {
    addToast('success', 'Report Generated', `Compiled "${template}" in ${format} format. Downloading...`);
  };

  // Handler: Update User Profile
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
    addToast('success', 'Profil Diperbarui', `Informasi profil atas nama ${updatedUser.name} berhasil disimpan.`);
  };

  // Handler: User Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    saveAuthState(false);
    setCurrentView('login');
    addToast('info', 'Sesi Berakhir', 'Anda telah keluar dari konsol SCADA.');
  };

  // Handler: User Login Success
  const handleLoginSuccess = (customProfile?: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    saveAuthState(true, customProfile?.email);
    if (customProfile) {
      setUser((prev) => {
        // Since we are mocking a local DB, we replace the user state completely for new login,
        // or just merge if we are keeping old properties.
        const merged = { ...prev, ...customProfile } as UserProfile;
        saveUserProfile(merged);
        return merged;
      });
    }
    setCurrentView('dashboard');
    addToast('success', 'Autentikasi Berhasil', `Selamat datang di MIND-4, ${customProfile?.name || customProfile?.email || user.name}.`);
  };

  const unacknowledgedAlertsCount = alerts.filter((a) => a.status === 'active').length;
  const unresolvedAnomaliesCount = anomalies.filter((a) => !a.resolved).length;

  // Render Login Page if not authenticated or viewing login
  if (!isLoggedIn || currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C0D] text-slate-900 dark:text-[#E1E4E6] font-sans antialiased">
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          currentUser={user}
          isAlreadyAuthenticated={isLoggedIn}
          onBackToDashboard={isLoggedIn ? () => setCurrentView('dashboard') : undefined}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C0D] text-slate-900 dark:text-[#E1E4E6] font-sans antialiased transition-colors">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Primary Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setOverviewFilterStatus(undefined);
          setCurrentView(view);
          setMobileMenuOpen(false); // Close mobile menu on navigation
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unacknowledgedAlertsCount={unacknowledgedAlertsCount}
        unresolvedAnomaliesCount={unresolvedAnomaliesCount}
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* TopBar (Fixed Top, 64px) */}
      <TopBar
        currentView={currentView}
        selectedMachine={selectedMachine}
        sidebarCollapsed={sidebarCollapsed}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unacknowledgedAlertsCount={unacknowledgedAlertsCount}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        refreshRate={refreshRate}
        onChangeRefreshRate={setRefreshRate}
        onManualSync={handleManualSync}
        selectedPlant={selectedPlant}
        onChangePlant={(p) => {
          setSelectedPlant(p);
          addToast('info', 'Plant Switch', `Switched telemetry context to ${p}`);
        }}
        user={user}
        onNavigate={(view) => {
          setOverviewFilterStatus(undefined);
          setCurrentView(view);
        }}
        onLogout={handleLogout}
        onOpenMqttSettings={() => setIsMqttModalOpen(true)}
        mqttConnected={mqttConnected}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Main Canvas Workspace */}
      <main
        className={`pt-20 pb-12 px-4 md:px-6 transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[240px]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Module 1: Dashboard */}
          {currentView === 'dashboard' && (
            <DashboardView
              analytics={analytics}
              machines={machines}
              recentEvents={events}
              onSelectMachine={handleSelectMachine}
              onInvestigateAnomaly={(anomalyId) => handleInvestigateAnomaly(anomalyId)}
              onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
              onViewAllMachines={(filterStatus) => {
                setOverviewFilterStatus(filterStatus);
                setCurrentView('machine-overview');
              }}
            />
          )}

          {/* Module 2: Machine Overview */}
          {currentView === 'machine-overview' && (
            <MachineOverviewView
              machines={machines}
              onSelectMachine={handleSelectMachine}
              onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
              initialFilterStatus={overviewFilterStatus}
            />
          )}

          {/* Module 3: Machine Detail */}
          {currentView === 'machine-detail' && selectedMachine && (
            <MachineDetailView
              machine={selectedMachine}
              anomalies={anomalies}
              workOrders={workOrders}
              historyEvents={events}
              onBack={() => setCurrentView('machine-overview')}
              onInvestigateAnomaly={(aId) => handleInvestigateAnomaly(aId)}
              onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
              initialTab="overview"
            />
          )}

          {/* Module 4: Live Monitoring */}
          {currentView === 'live-monitoring' && selectedMachine && (
            <LiveMonitoringView
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine as (m: Machine) => void}
            />
          )}

          {/* Module 5: Machine Health */}
          {currentView === 'machine-health' && selectedMachine && (
            <MachineDetailView
              machine={selectedMachine}
              anomalies={anomalies}
              workOrders={workOrders}
              historyEvents={events}
              onBack={() => setCurrentView('dashboard')}
              onInvestigateAnomaly={(aId) => handleInvestigateAnomaly(aId)}
              onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
              initialTab="health"
            />
          )}

          {/* Module 6: Anomaly Detection */}
          {currentView === 'anomaly-detection' && (
            <AnomalyDetectionView
              anomalies={anomalies}
              onInvestigateAnomaly={(anom) => handleInvestigateAnomaly(anom)}
              onAcknowledgeAnomaly={handleAcknowledgeAnomaly}
            />
          )}

          {/* Module 7: Trend Analysis */}
          {currentView === 'trend-analysis' && selectedMachine && (
            <TrendAnalysisView
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine as (m: Machine) => void}
              onExportCsv={() =>
                addToast('success', 'Export Complete', 'Downloaded high-precision telemetry time-series CSV.')
              }
            />
          )}

          {/* Module 8: Machine Fingerprint */}
          {currentView === 'machine-fingerprint' && selectedMachine && (
            <MachineFingerprintView
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine as (m: Machine) => void}
            />
          )}

          {/* Module 9: Maintenance Priority */}
          {currentView === 'maintenance-priority' && (
            <MaintenancePriorityView
              machines={machines}
              onSelectMachine={handleSelectMachine}
              onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
            />
          )}

          {/* Module 10: Maintenance Log */}
          {currentView === 'maintenance-log' && (
            <MaintenanceLogView
              workOrders={workOrders}
              onCreateMaintenance={() => handleOpenCreateMaintenance('M-102', '')}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {/* Module 11: Machine History */}
          {currentView === 'machine-history' && selectedMachine && (
            <MachineHistoryView
              events={events}
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine as (m: Machine) => void}
              onExportHistory={() =>
                addToast('success', 'Export Complete', 'Exported chronological engineering timeline audit.')
              }
            />
          )}

          {/* Module 12: Alert Center */}
          {currentView === 'alert-center' && (
            <AlertCenterView
              alerts={alerts}
              onAcknowledgeAlerts={handleAcknowledgeAlerts}
              onResolveAlerts={handleResolveAlerts}
            />
          )}

          {/* Module 13: Report & Analytics */}
          {currentView === 'report-analytics' && (
            <ReportAnalyticsView
              analytics={analytics}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {/* Module 14: User Profile & Account Management */}
          {currentView === 'profile' && (
            <ProfileView
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onNavigateToView={(view) => {
                setOverviewFilterStatus(undefined);
                setCurrentView(view);
              }}
            />
          )}
        </div>
      </main>

      {/* Global Command Search (⌘K) Modal */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        machines={machines}
        alerts={alerts}
        anomalies={anomalies}
        workOrders={workOrders}
        onSelectMachine={handleSelectMachine}
        onNavigate={(view) => {
          setOverviewFilterStatus(undefined);
          setCurrentView(view);
        }}
        onSelectAnomaly={(anom) => {
          handleInvestigateAnomaly(anom);
        }}
      />

      {/* Actionable Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        anomalies={anomalies}
        workOrders={workOrders}
        onInvestigateAnomaly={(anom) => handleInvestigateAnomaly(anom)}
        onViewWorkOrder={(wo) => {
          setCurrentView('maintenance-log');
        }}
      />

      {/* Anomaly Investigation Right-Side Drawer */}
      <AnomalyDrawer
        anomaly={investigatingAnomaly}
        isOpen={investigatingAnomaly !== null}
        onClose={() => setInvestigatingAnomaly(null)}
        onAcknowledge={handleAcknowledgeAnomaly}
        onCreateMaintenance={(mId, issue) => handleOpenCreateMaintenance(mId, issue)}
        onResolve={handleResolveAnomaly}
      />

      {/* Create Maintenance Modal */}
      <CreateMaintenanceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        machines={machines}
        initialMachineId={createModalMachineId}
        initialIssue={createModalIssue}
        onSave={handleSaveWorkOrder}
      />

      {/* MQTT Configuration Modal */}
      <MqttSettingsModal
        isOpen={isMqttModalOpen}
        onClose={() => setIsMqttModalOpen(false)}
        config={mqttConfig}
        isConnected={mqttConnected}
        onSave={(newConfig) => {
          setMqttConfig(newConfig);
          setIsMqttModalOpen(false);
        }}
      />
    </div>
  );
}
