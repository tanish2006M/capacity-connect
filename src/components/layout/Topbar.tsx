/**
 * Capacity Connect - Shared Dashboard Topbar
 * Provides breadcrumb navigation, quick role switching for judges, and user actions
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Role } from '../../types';
import {
  Menu,
  Bell,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  LogOut,
  User as UserIcon,
  MapPin,
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  onNavigate: (path: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const { user, switchRole, logout } = useAuth();
  const { showInfo } = useToast();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRole = user?.role || 'trainee';

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    showInfo('Signed Out', 'You have been safely signed out.');
    onNavigate('/login');
  };

  const roles: { id: Role; label: string; dashboardPath: string }[] = [
    { id: 'trainee', label: 'Trainee Experience', dashboardPath: '/trainee' },
    { id: 'trainer', label: 'Trainer Workspace', dashboardPath: '/trainer' },
    { id: 'admin', label: 'Administrator Portal', dashboardPath: '/admin' },
  ];

  const handleRoleChange = (roleId: Role, path: string) => {
    switchRole(roleId);
    setRoleDropdownOpen(false);
    onNavigate(path);
    showInfo(`Switched Experience to ${roleId.toUpperCase()}`, 'Dashboard updated for demo evaluation');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showInfo('Search Query Received', `Filtering records for "${searchQuery}"`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left zone: Hamburger for mobile + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm sm:max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, skills, competencies..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
        </form>
      </div>

      {/* Right zone: Role Switcher + Notification Bell + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100/70 transition-colors"
            title="Switch between Trainee, Trainer, and Admin roles"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline text-blue-700 font-normal">Role:</span>
            <span className="font-semibold capitalize">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Experience
              </div>
              <div className="py-1 space-y-0.5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id, r.dashboardPath)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                      currentRole === r.id
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentRole === r.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs max-h-60 overflow-y-auto">
                <div className="py-2.5">
                  <p className="font-semibold text-slate-900">National Competency Assessment</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Q4 evaluation period starts October 15.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-slate-900">Course Verification Completed</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Your certificate for Project Management is ready.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Log Out */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="User account menu"
            title="User Profile & Sign Out"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px] capitalize">{currentRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Popover */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">
                    Role: {currentRole}
                  </span>
                  {user?.state && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate max-w-[150px]">{user.state}{user.district ? ` · ${user.district}` : ''}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
