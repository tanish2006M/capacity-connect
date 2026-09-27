/**
 * Capacity Connect - Signup Page
 * Full registration flow with voluntary administrative location and real Firebase Authentication.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { ALL_STATES, getDistrictsForState } from '../data/locationData';
import {
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  Lock,
  MapPin,
  Building2,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface SignupPageProps {
  onNavigate: (path: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup, loginWithGoogle } = useAuth();
  const { showSuccess, showError } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'trainee' | 'trainer'>('trainee');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Hyderabad');
  const [city, setCity] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Available districts for chosen state
  const availableDistricts = getDistrictsForState(state);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = getDistrictsForState(newState);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    } else {
      setDistrict('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 2) {
      showError('Name Required', 'Please enter your full official name (minimum 2 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      showError('Invalid Email', 'Please provide a valid official email address.');
      return;
    }
    if (password.length < 6) {
      showError('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      showError('Password Mismatch', 'The passwords entered do not match.');
      return;
    }
    if (!state || !district) {
      showError('Location Required', 'Please select your official administrative State and District.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      fullName,
      email,
      password,
      confirmPassword,
      role,
      state,
      district,
      city,
      organization,
      department,
      designation,
    });
    setIsSubmitting(false);

    if (result.success) {
      showSuccess(
        'Registration Successful',
        `Account created with role: ${role.toUpperCase()}. Welcome to Capacity Connect!`
      );
      onNavigate(`/${role}`);
    } else {
      showError('Registration Failed', result.error || 'Unable to register account.');
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleSubmitting(true);
    const result = await loginWithGoogle();
    setIsGoogleSubmitting(false);

    if (result.success) {
      showSuccess('Google Authentication Successful', 'Signed in with your verified Google account.');
      onNavigate('/trainee');
    } else {
      showError('Google Authentication', result.error || 'Unable to sign in with Google.');
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

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/')}
            className="shrink-0 text-slate-700 hover:text-slate-900 font-medium"
          >
            Back to Portal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/login')}
            className="shrink-0 hidden sm:inline-flex"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Signup Card */}
      <div className="max-w-xl w-full mx-auto px-4 py-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create an Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Join the institutional capacity building & learning portal
            </p>
          </div>

          {/* Social Google Sign Up Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              <span>{isGoogleSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                Or with official email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection (Strictly Trainee or Trainer) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('trainee')}
                  className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    role === 'trainee'
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trainee Participant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('trainer')}
                  className={`py-2 px-2 text-xs font-medium rounded-md transition-all text-center ${
                    role === 'trainer'
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Course Trainer
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Administrator accounts cannot be self-registered and require central governance provisioning.</span>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Verma"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work / Official Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@cadre.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Voluntary Administrative Location */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Administrative / Organizational Location
                </span>
                <span className="text-[10px] text-slate-400">(Voluntary Profile Data)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  >
                    {ALL_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    required
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    City / Town (Optional)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Used for organizational cohort grouping and state-level capacity reporting. No live GPS or device tracking is performed.
              </p>
            </div>

            {/* Professional Department Information (Optional) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Cadre & Professional Details (Optional)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Organization / Ministry
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Municipal Corp"
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Department / Cell
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Public Works"
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Assistant Director"
                    className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full justify-center mt-3"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Register & Continue
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-400">
        CAPACITY CONNECT · Digital Capacity Building & Learning Management Portal
      </footer>
    </div>
  );
};
