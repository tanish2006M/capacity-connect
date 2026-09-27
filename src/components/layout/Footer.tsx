/**
 * Capacity Connect - Public Footer
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAbout, onOpenContact }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CAPACITY CONNECT</span>
            </div>
            <p className="text-sm font-medium text-slate-300">
              Build Capability. Learn. Grow.
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Digital Capacity Building & Learning Management Portal. A centralized digital environment for trainees, trainers, and administrators to facilitate continuous institutional learning and competency development.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.querySelector('#how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.querySelector('#features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Learning Ecosystem
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.querySelector('#competencies');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Competency Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Access & About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Portal Access
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  Sign In to Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="hover:text-white transition-colors"
                >
                  Register Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAbout && onOpenAbout()}
                  className="hover:text-white transition-colors"
                >
                  About Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenContact && onOpenContact()}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CAPACITY CONNECT. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Digital Capacity Building & Learning Management Portal.
          </p>
        </div>
      </div>
    </footer>
  );
};
