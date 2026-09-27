/**
 * Capacity Connect - Public Landing Page Navbar
 * Adheres to strict Top Bar Contract: 3 Zones, single wordmark, clean text links, working CTA actions
 */

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  activePath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePath = '/' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero', path: '/' },
    { label: 'How It Works', href: '#how-it-works', path: '/#how-it-works' },
    { label: 'Learning', href: '#features', path: '/#features' },
    { label: 'Competencies', href: '#competencies', path: '/#competencies' },
    { label: 'About', href: '#about', path: '/#about' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (activePath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with clean supporting mark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold tracking-tight shadow-xs group-hover:bg-blue-800 transition-colors">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              CAPACITY CONNECT
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with hover underlines */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="hover:text-blue-700 hover:underline underline-offset-8 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/login')}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/login')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/login')}
            className="sm:hidden text-xs py-1 px-2.5 h-8"
          >
            Sign In
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
              className="w-full justify-center"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
