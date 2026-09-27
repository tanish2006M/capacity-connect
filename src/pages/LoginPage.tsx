/**
 * Capacity Connect - Login Page
 * Integrated with real Firebase Authentication, Password Reset, Google Sign-In,
 * and clearly designated administrative demo identities.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Role } from '../types';
import { DEMO_USERS } from '../data/seedData';
import {
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  UserCheck,
  Lock,
  Mail,
  Sparkles,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  redirectNotice?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, redirectNotice }) => {
  const { login, demoLogin, resetPassword, loginWithGoogle } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [role, setRole] = useState<Role>('trainee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Forgot Password Modal State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Demo user picker tab
  const [activeDemoRoleTab, setActiveDemoRoleTab] = useState<'trainee' | 'trainer' | 'admin'>('trainee');

  const handleRoleTabClick = (newRole: Role) => {
    setRole(newRole);
    setActiveDemoRoleTab(newRole);
    const demo = DEMO_USERS[newRole];
    if (demo) {
      setEmail(demo.email);
      setPassword('demo123456');
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError('Email is required', 'Please enter your account email address.');
      return;
    }
    if (!password) {
      showError('Password is required', 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, role);
    setIsSubmitting(false);

    if (result.success) {
      showSuccess(`Welcome to Capacity Connect`, `Signed in as ${role.toUpperCase()}`);
      onNavigate(`/${role}`);
    } else {
      showError('Authentication Failed', result.error || 'Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    const result = await loginWithGoogle();
    setIsGoogleSubmitting(false);

    if (result.success) {
      showSuccess('Google Authentication', 'Signed in with your verified Google account.');
      onNavigate('/trainee');
    } else {
      showError('Google Authentication', result.error || 'Unable to sign in with Google.');
    }
  };

  const handleQuickDemoAccess = (userKey: string) => {
    const demoUser = DEMO_USERS[userKey];
    if (!demoUser) return;
    demoLogin(demoUser.role, userKey);
    showSuccess(`Demo Access Granted`, `Logged in as ${demoUser.fullName} (${demoUser.role.toUpperCase()})`);
    onNavigate(`/${demoUser.role}`);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetErrorMessage('Please enter a valid official email address.');
      return;
    }

    setIsResetSubmitting(true);
    setResetErrorMessage(null);
    setResetSuccessMessage(null);

    const result = await resetPassword(resetEmail);
    setIsResetSubmitting(false);

    if (result.success) {
      setResetSuccessMessage(
        `A password reset link has been dispatched to ${resetEmail}. Check your inbox and follow the instructions to set your new password.`
      );
    } else {
      setResetErrorMessage(result.error || 'Failed to dispatch password reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-blue-800 transition-colors shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
            CAPACITY CONNECT
          </span>
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('/')}
          className="shrink-0 text-slate-700 hover:text-slate-900 font-medium"
        >
          Back to Portal
        </Button>
      </header>

      {/* Main Login Card */}
      <div className="max-w-lg w-full mx-auto px-4 py-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          {redirectNotice && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Access Restricted</p>
                <p className="text-amber-700 text-[11px] mt-0.5">{redirectNotice}</p>
              </div>
            </div>
          )}

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign In</h1>
            <p className="text-xs text-slate-500 mt-1">
              Access your personalized learning and capacity building workspace
            </p>
          </div>

          {/* Google Sign In */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleSubmitting ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                Or with registered email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          {/* Role selector tabs */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Portal Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleRoleTabClick('trainee')}
                className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                  role === 'trainee'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trainee
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('trainer')}
                className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                  role === 'trainer'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trainer
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('admin')}
                className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                  role === 'admin'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@capacityconnect.demo or user@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetSuccessMessage(null);
                    setResetErrorMessage(null);
                    setForgotPasswordOpen(true);
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full justify-center mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Sign In as {role.toUpperCase()}
            </Button>
          </form>

          {/* Quick Demo Access Identities */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>One-Click Demo Access</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                Seeded Data
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Explore pre-populated trainee progress, courses, assessments, and admin analytics:
            </p>

            {/* Sub-tabs for demo categories */}
            <div className="flex items-center gap-1 mb-2.5 bg-slate-100 p-1 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setActiveDemoRoleTab('trainee')}
                className={`flex-1 py-1 px-2 rounded-md font-medium transition-all text-center ${
                  activeDemoRoleTab === 'trainee'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trainees (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoRoleTab('trainer')}
                className={`flex-1 py-1 px-2 rounded-md font-medium transition-all text-center ${
                  activeDemoRoleTab === 'trainer'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trainers (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoRoleTab('admin')}
                className={`flex-1 py-1 px-2 rounded-md font-medium transition-all text-center ${
                  activeDemoRoleTab === 'admin'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin (1)
              </button>
            </div>

            {/* Trainee Demo Accounts */}
            {activeDemoRoleTab === 'trainee' && (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainee')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Aarav Sharma</div>
                      <div className="text-[10px] text-slate-500">Telangana · Hyderabad (Asst. Officer)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainee_meera')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Meera Nair</div>
                      <div className="text-[10px] text-slate-500">Karnataka · Bengaluru Urban (Sr. Analyst)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainee_rohan')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Rohan Verma</div>
                      <div className="text-[10px] text-slate-500">Maharashtra · Pune (Land Records Officer)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainee_ananya')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Ananya Singh</div>
                      <div className="text-[10px] text-slate-500">Jharkhand · Ranchi (Disaster Coordinator)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainee_kabir')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Kabir Rao</div>
                      <div className="text-[10px] text-slate-500">Delhi (NCT) · New Delhi (Technical Analyst)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>
              </div>
            )}

            {/* Trainer Demo Accounts */}
            {activeDemoRoleTab === 'trainer' && (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainer')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-800 hover:text-indigo-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Dr. Kavya Menon</div>
                      <div className="text-[10px] text-slate-500">Karnataka · AI & Public Systems Faculty</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainer_arjun')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-800 hover:text-indigo-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Dr. Arjun Mehta</div>
                      <div className="text-[10px] text-slate-500">Telangana · Lead Geospatial Architect</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainer_rahul')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-800 hover:text-indigo-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Prof. Rahul Iyer</div>
                      <div className="text-[10px] text-slate-500">Delhi (NCT) · Cybersecurity & SRE Professor</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('trainer_neha')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-800 hover:text-indigo-700 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Dr. Neha Rao</div>
                      <div className="text-[10px] text-slate-500">Maharashtra · Climate & Sustainability Faculty</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Login →</span>
                </button>
              </div>
            )}

            {/* Admin Demo Account */}
            {activeDemoRoleTab === 'admin' && (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess('admin')}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-800 hover:text-slate-900 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-800 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Capacity Connect Administrator</div>
                      <div className="text-[10px] text-slate-500">Chief Portal Directorate · National Governance</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">Admin Panel →</span>
                </button>
              </div>
            )}
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        title="Reset Account Password"
        subtitle="Dispatches a verified password reset email via Firebase Authentication"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForgotPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isResetSubmitting}
              onClick={handleForgotPasswordSubmit}
              icon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Send Reset Link
            </Button>
          </div>
        }
      >
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 text-xs">
          {resetSuccessMessage ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">Email Dispatched</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">{resetSuccessMessage}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-600 text-xs leading-relaxed">
                Enter your registered official email address below. We will send a secure password reset link to your inbox.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@organization.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {resetErrorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{resetErrorMessage}</span>
                </div>
              )}
            </>
          )}
        </form>
      </Modal>

      {/* Footer disclaimer */}
      <footer className="max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-400">
        CAPACITY CONNECT · Digital Capacity Building & Learning Management Portal
      </footer>
    </div>
  );
};
