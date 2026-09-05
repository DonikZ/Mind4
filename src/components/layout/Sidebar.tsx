import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Activity,
  HeartPulse,
  AlertOctagon,
  TrendingUp,
  Fingerprint,
  ListOrdered,
  ClipboardList,
  History,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { NavView, UserProfile } from '../../types';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unacknowledgedAlertsCount: number;
  unresolvedAnomaliesCount: number;
  user?: UserProfile;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  unacknowledgedAlertsCount,
  unresolvedAnomaliesCount,
  user,
  mobileMenuOpen = false,
  onCloseMobileMenu,
}) => {
  const displayName = user?.name ? user.name : (user?.email ? user.email.split('@')[0] : 'Teknisi Baru');
  const displayRole = user?.position ? user.position : 'Profil Belum Lengkap';
  
  const userInitials = displayName
    .split(/[._ ]/)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const groups: NavGroup[] = [
    {
      group: 'MONITOR',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'machine-overview', label: 'Machine Overview', icon: Cpu },
        { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'machine-health', label: 'Machine Health', icon: HeartPulse },
        {
          id: 'anomaly-detection',
          label: 'Anomaly Detection',
          icon: AlertOctagon,
          badge: unresolvedAnomaliesCount,
          badgeColor: 'bg-rose-600 text-white',
        },
        { id: 'trend-analysis', label: 'Trend Analysis', icon: TrendingUp },
        { id: 'machine-fingerprint', label: 'Machine Fingerprint', icon: Fingerprint },
      ],
    },
    {
      group: 'MAINTENANCE',
      items: [
        { id: 'maintenance-priority', label: 'Maintenance Priority', icon: ListOrdered },
        { id: 'maintenance-log', label: 'Maintenance Log', icon: ClipboardList },
        { id: 'machine-history', label: 'Machine History', icon: History },
      ],
    },
    {
      group: 'INSIGHTS',
      items: [
        {
          id: 'alert-center',
          label: 'Alert Center',
          icon: Bell,
          badge: unacknowledgedAlertsCount,
          badgeColor: 'bg-rose-600 text-white',
        },
        { id: 'report-analytics', label: 'Report & Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profil Pengguna', icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 z-50 bg-white dark:bg-[#0F1113] border-r border-slate-200 dark:border-[#24272A] transition-transform duration-300 flex flex-col justify-between select-none ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      {/* Top Header Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#24272A]">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            {/* Elegant Dark MIND-4 Logo Mark */}
            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white font-mono font-bold text-[10px] shrink-0">
              M
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#E1E4E6]">
                  MIND-4
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-[#8A929B] font-semibold mt-0.5">
                  Industrial Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded text-slate-500 dark:text-[#8A929B] hover:text-slate-900 dark:hover:text-[#E1E4E6] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="py-4 px-3 space-y-5 overflow-y-auto max-h-[calc(100vh-170px)]">
          {groups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <p className="px-2 mb-1.5 text-[11px] font-bold text-slate-400 dark:text-[#4B5259] uppercase tracking-wider">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors relative group ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 font-medium border-l-2 border-blue-500'
                        : 'text-slate-500 dark:text-[#8A929B] hover:bg-slate-100 dark:hover:bg-[#1A1D1F] hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-500 dark:text-[#8A929B] group-hover:text-slate-900 dark:hover:text-[#E1E4E6]'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate text-left flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.badgeColor || 'bg-red-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User & System Status */}
      <div className="p-3 border-t border-slate-200 dark:border-[#24272A] space-y-2">
        {!collapsed && (
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8A929B]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Node: plant-a.m4
            </span>
            <span className="font-mono text-[10px] text-slate-400 dark:text-[#4B5259]">v4.12.0</span>
          </div>
        )}

        <div
          onClick={() => onNavigate('profile')}
          title={collapsed ? `${user?.name || 'User'} (${user?.position || 'Profile'})` : undefined}
          className={`flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1D1F] transition-colors cursor-pointer ${
            currentView === 'profile' ? 'bg-blue-600/10 border border-blue-500/30' : ''
          }`}
        >
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-[#24272A] shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1A1D1F] border border-slate-200 dark:border-[#24272A] flex items-center justify-center text-[12px] font-bold text-blue-400 shrink-0">
              {userInitials}
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1 leading-tight overflow-hidden">
              <span className="text-[12px] font-semibold text-slate-900 dark:text-[#E1E4E6] truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8A929B] truncate">
                {displayRole}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
