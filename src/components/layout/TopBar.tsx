import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  RefreshCw,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  Shield,
  KeyRound,
  Network,
  Menu
} from 'lucide-react';
import { NavView, Machine, UserProfile } from '../../types';

interface TopBarProps {
  currentView: NavView;
  selectedMachine: Machine | null;
  sidebarCollapsed: boolean;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unacknowledgedAlertsCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  refreshRate: '1s' | '5s' | 'pause';
  onChangeRefreshRate: (rate: '1s' | '5s' | 'pause') => void;
  onManualSync: () => void;
  selectedPlant: string;
  onChangePlant: (plant: string) => void;
  user?: UserProfile;
  onNavigate?: (view: NavView) => void;
  onLogout?: () => void;
  onOpenMqttSettings?: () => void;
  mqttConnected?: boolean;
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  selectedMachine,
  sidebarCollapsed,
  onOpenSearch,
  onOpenNotifications,
  unacknowledgedAlertsCount,
  darkMode,
  onToggleDarkMode,
  refreshRate,
  onChangeRefreshRate,
  onManualSync,
  selectedPlant,
  onChangePlant,
  user,
  onNavigate,
  onLogout,
  onOpenMqttSettings,
  mqttConnected,
  onOpenMobileMenu
}) => {
  const [secondsAgo, setSecondsAgo] = useState(6);
  const [isPlantMenuOpen, setIsPlantMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev > 50 ? 2 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name ? user.name : (user?.email ? user.email.split('@')[0] : 'Teknisi Baru');
  const displayRole = user?.position ? user.position : 'Profil Belum Lengkap';
  
  const userInitials = displayName
    .split(/[._ ]/)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const plants = [
    'Plant A — Production Floor',
    'Plant B — Heavy Stamping & Press Bay',
    'Plant C — Milling & Tooling Cell',
  ];

  // Derive breadcrumbs based on view and selected machine
  const getBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard':
        return ['Operations', 'Dashboard'];
      case 'machine-overview':
        return ['Operations', 'Machine Overview'];
      case 'machine-detail':
        return ['Operations', 'Fleet Asset', selectedMachine ? selectedMachine.id : 'Pilih Aset'];
      case 'live-monitoring':
        return ['Operations', 'Live Monitoring'];
      case 'machine-health':
        return ['Intelligence', 'Machine Health', selectedMachine ? selectedMachine.id : 'Fleet Health'];
      case 'anomaly-detection':
        return ['Intelligence', 'Anomaly Detection'];
      case 'trend-analysis':
        return ['Intelligence', 'Trend Analysis'];
      case 'machine-fingerprint':
        return ['Intelligence', 'Machine Fingerprint', selectedMachine ? selectedMachine.id : 'Pilih Aset'];
      case 'maintenance-priority':
        return ['Maintenance', 'Maintenance Priority'];
      case 'maintenance-log':
        return ['Maintenance', 'Maintenance Log'];
      case 'machine-history':
        return ['Maintenance', 'Machine History'];
      case 'alert-center':
        return ['Insights', 'Alert Center'];
      case 'report-analytics':
        return ['Insights', 'Report & Analytics'];
      case 'profile':
        return ['Sistem', 'Profil Pengguna', displayName];
      case 'login':
        return ['Autentikasi', 'Masuk Sistem'];
      default:
        return ['Operations', 'Dashboard'];
    }
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header
      id="top-bar"
      className={`fixed top-0 right-0 left-0 md:left-auto z-30 h-16 bg-white dark:bg-[#0F1113]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#24272A] transition-all duration-300 px-4 md:px-6 flex items-center justify-between ${
        sidebarCollapsed ? 'md:left-[72px]' : 'md:left-[240px]'
      }`}
    >
      {/* Left: Hamburger (Mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-2">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 -ml-2 text-slate-500 dark:text-[#8A929B] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-400 dark:text-[#4B5259]">/</span>}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'font-medium text-slate-900 dark:text-[#E1E4E6]'
                  : 'text-slate-500 dark:text-[#8A929B]'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
        </div>
      </div>

      {/* Center: Contextual Plant Selector */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setIsPlantMenuOpen(!isPlantMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] hover:bg-slate-200 dark:hover:bg-[#24272A] text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] transition-colors"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{selectedPlant}</span>
          <ChevronDown className="w-3 h-3 text-slate-500 dark:text-[#8A929B]" />
        </button>

        {isPlantMenuOpen && (
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#151719] rounded-lg shadow-xl border border-slate-200 dark:border-[#24272A] py-1 z-50">
            {plants.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onChangePlant(p);
                  setIsPlantMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                  selectedPlant === p
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-[#8A929B] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                }`}
              >
                <span>{p}</span>
                {selectedPlant === p && <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Operational Status, Search, Telemetry controls, Theme & Notifications */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-[#151719] border border-slate-200 dark:border-[#24272A] text-[11px] font-medium text-slate-500 dark:text-[#8A929B]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-900 dark:text-[#E1E4E6]">All systems operational</span>
          <span className="text-slate-400 dark:text-[#4B5259]">·</span>
          <span className="font-mono text-[10px] text-slate-500 dark:text-[#8A929B]">
            Sync {secondsAgo}s ago
          </span>
          <button
            onClick={() => {
              setSecondsAgo(0);
              onManualSync();
            }}
            title="Manual sync with SCADA gateway"
            className="p-0.5 text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Global Command Search Shortcut (⌘K) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-[#24272A] bg-slate-100 dark:bg-[#1A1D1F] text-xs text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:border-slate-300 dark:hover:border-[#33383E] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-[#8A929B]" />
          <span className="hidden sm:inline">Search assets, alerts...</span>
          <kbd className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#0F1113] border border-slate-200 dark:border-[#24272A] font-semibold text-slate-500 dark:text-[#8A929B]">
            ⌘K
          </kbd>
        </button>

        {/* Live Refresh Speed selector */}
        <div className="hidden sm:flex items-center bg-white dark:bg-[#0F1113] p-0.5 rounded-md border border-slate-200 dark:border-[#24272A] text-[11px] font-mono">
          {(['1s', '5s', 'pause'] as const).map((rate) => (
            <button
              key={rate}
              onClick={() => onChangeRefreshRate(rate)}
              className={`px-2 py-0.5 rounded transition-colors ${
                refreshRate === rate
                  ? 'bg-slate-100 dark:bg-[#1A1D1F] text-slate-900 dark:text-[#E1E4E6] font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
              }`}
            >
              {rate === 'pause' ? 'Hold' : rate}
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-md text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] border border-transparent hover:border-slate-200 dark:hover:border-[#24272A] transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* MQTT Connection Settings */}
        <button
          onClick={onOpenMqttSettings}
          title="MQTT Connection Settings"
          className="relative p-1.5 rounded-md text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] border border-transparent hover:border-slate-200 dark:hover:border-[#24272A] transition-colors"
        >
          <Network className={`w-4 h-4 ${mqttConnected ? 'text-emerald-500' : 'text-red-500'}`} />
          {!mqttConnected && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-[#0F1113]" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-md text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] border border-transparent hover:border-slate-200 dark:hover:border-[#24272A] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0F1113]" />
          )}
        </button>

        {/* User Mini Avatar & Dropdown */}
        <div ref={userMenuRef} className="relative pl-2 border-l border-slate-200 dark:border-[#24272A]">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            title="Menu Akun & Profil"
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-[#24272A]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A] flex items-center justify-center font-mono font-bold text-[11px] text-blue-400">
                {userInitials}
              </div>
            )}
          </button>

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#151719] rounded-xl shadow-2xl border border-slate-200 dark:border-[#24272A] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header inside dropdown */}
              <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-[#24272A] flex items-center gap-3">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-blue-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A] flex items-center justify-center font-mono font-bold text-xs text-blue-400 shrink-0">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-[#E1E4E6] truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#8A929B] truncate">
                    {displayRole}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate?.('profile');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-900 dark:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Lihat & Edit Profil</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate?.('login');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-500 dark:text-[#8A929B]" />
                  <span>Halaman Login</span>
                </button>
              </div>

              {/* Logout */}
              <div className="pt-1 border-t border-slate-200 dark:border-[#24272A]">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
