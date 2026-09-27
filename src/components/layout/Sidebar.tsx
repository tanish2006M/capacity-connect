/**
 * Capacity Connect - Role-Aware Application Sidebar
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  GraduationCap,
  FileCheck,
  Award,
  Bell,
  Library,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  ShieldCheck,
  LogOut,
  Target,
  X,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const role: Role = user?.role || 'trainee';

  const getMenuItems = (userRole: Role): SidebarItem[] => {
    switch (userRole) {
      case 'trainee':
        return [
          { id: 'dashboard', label: 'Dashboard', path: '/trainee', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', path: '/trainee/profile', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'courses', label: 'Courses', path: '/trainee/courses', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'learning', label: 'My Learning', path: '/trainee/learning', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'assessments', label: 'Assessments', path: '/trainee/assessments', icon: <FileCheck className="w-4 h-4" />, badge: '2 Due' },
          { id: 'competencies', label: 'Competencies', path: '/trainee/competencies', icon: <Target className="w-4 h-4" /> },
          { id: 'certificates', label: 'Certificates', path: '/trainee/certificates', icon: <Award className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', path: '/trainee/notifications', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'trainer':
        return [
          { id: 'dashboard', label: 'Dashboard', path: '/trainer', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', path: '/trainer/profile', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'courses', label: 'Courses', path: '/trainer/courses', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'library', label: 'Content Library', path: '/trainer/library', icon: <Library className="w-4 h-4" /> },
          { id: 'assessments', label: 'Assessments', path: '/trainer/assessments', icon: <FileCheck className="w-4 h-4" /> },
          { id: 'trainees', label: 'Trainees', path: '/trainer/trainees', icon: <Users className="w-4 h-4" /> },
          { id: 'performance', label: 'Performance', path: '/trainer/performance', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', path: '/trainer/notifications', icon: <Bell className="w-4 h-4" /> },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'users', label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" />, badge: '5 New' },
          { id: 'courses', label: 'Courses', path: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'assessments', label: 'Assessments', path: '/admin/assessments', icon: <FileCheck className="w-4 h-4" /> },
          { id: 'certificates', label: 'Certificates', path: '/admin/certificates', icon: <Award className="w-4 h-4" /> },
          { id: 'competencies', label: 'Competencies', path: '/admin/competencies', icon: <Target className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'announcements', label: 'Announcements', path: '/admin/announcements', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(role);

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case 'admin':
        return 'Administrator';
      case 'trainer':
        return 'Faculty / Trainer';
      case 'trainee':
        return 'Trainee Officer';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b1329] text-slate-300 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">
              CAPACITY CONNECT
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              {getRoleLabel(role)}
            </span>
          </div>
        </button>

        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {menuItems.map((item) => {
          const pathname = currentPath.split('?')[0];
          const isActive =
            pathname === item.path ||
            (item.path !== `/${role}` && pathname.startsWith(item.path));
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.path);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-xs border-l-2 border-blue-500 pl-2.5'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive ? 'bg-blue-900/60 text-blue-200 border border-blue-700/50' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile & logout footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            onNavigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
