/**
 * Capacity Connect - Shared Dashboard Layout
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Button } from '../ui/Button';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  requiredRole?: Role;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  requiredRole,
}) => {
  const { user, isAuthenticated, switchRole, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Automatic immediate redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      onNavigate('/login');
    }
  }, [isAuthenticated, user, onNavigate]);

  // If not authenticated, do NOT render any protected content; return null while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  // Role Protection check: If user role doesn't match required dashboard role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 shadow-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
          <p className="text-xs text-slate-500 uppercase font-mono tracking-wider mt-1">
            Role Authorization Required
          </p>
          <div className="my-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Your Current Role:</span>
              <span className="font-semibold text-slate-900 capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Required Role:</span>
              <span className="font-semibold text-blue-700 capitalize">{requiredRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account:</span>
              <span className="font-medium text-slate-700 truncate max-w-[180px]">{user.email}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            You do not have administrative clearance to access the <strong className="capitalize text-slate-900">{requiredRole}</strong> workspace. Please return to your designated dashboard or switch roles below.
          </p>
          <div className="space-y-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate(`/${user.role}`)}
              className="w-full justify-center"
            >
              Return to My {user.role.toUpperCase()} Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                switchRole(requiredRole);
                onNavigate(`/${requiredRole}`);
              }}
              className="w-full justify-center"
            >
              Switch Role to {requiredRole.toUpperCase()} (Demo Mode)
            </Button>
            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-rose-600 pt-2 transition-colors cursor-pointer"
            >
              Sign out and log in with another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop and Mobile Drawer) */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
